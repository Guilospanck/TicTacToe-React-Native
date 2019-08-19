package com.tictactoe;

import static java.nio.charset.StandardCharsets.UTF_8;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.telecom.Call;
import android.widget.Toast;

import androidx.annotation.CallSuper;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.Connections;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate.Status;
import com.google.android.gms.nearby.connection.Strategy;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class NearbyConnectionsModule extends ReactContextBaseJavaModule {

    private static final Strategy STRATEGY = Strategy.P2P_POINT_TO_POINT; // 1 - 1 TicTacToe only enables the game for max of 2 players


    // our handle to Nearby Connections
    private ConnectionsClient connectionsClients;

    private String codeName = "Player 1";
    private String opponentEndpointId;

    private Context context;

    private int coordinatesRow;
    private int coordinatesCol;
    private String choice;
    private String winner;
    private String restart;

    ArrayList<String> endpointsList;
    Map<String, String> endpointsAndDeviceNames;


    public NearbyConnectionsModule(ReactApplicationContext reactContext) {
        super(reactContext);

        context = reactContext;

        connectionsClients = Nearby.getConnectionsClient(context);

        endpointsList = new ArrayList<>();
        endpointsAndDeviceNames = new HashMap<>();
    }

    @Override
    public String getName() {
        return "NearbyConnections";
    }

    // Function to use as ServiceId in the StartDiscovery and StartAdvertising functions
    private String getPackage(){
        return "com.package.tictactoe";
    }

    @ReactMethod
    public void sendByteMessage(String choice){
        connectionsClients.sendPayload(opponentEndpointId, Payload.fromBytes(choice.getBytes(UTF_8)));
    }

    @ReactMethod
    public void disconnect(){
        opponentEndpointId = null;
        connectionsClients.stopDiscovery();
        connectionsClients.stopAdvertising();
        connectionsClients.stopAllEndpoints();
    }

    @ReactMethod
    public void getPositionsAndChoices(Callback successCallback) {
        try {
            successCallback.invoke(coordinatesRow, coordinatesCol, choice);
        } catch (Exception e) {
            Toast.makeText(context, "getPositionsAndChoices: something went wrong! " + e, Toast.LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void getEndpointsList(Callback successCallback){
        try {
            WritableMap map = new WritableNativeMap();

            for(Map.Entry<String, String> entry : endpointsAndDeviceNames.entrySet()){
                map.putString(entry.getKey(), entry.getValue());
            }

            successCallback.invoke(map);

        } catch (Exception e) {
            Toast.makeText(context, "GetEndpointList: " + e, Toast.LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void requestConnection(String endpointId){
        connectionsClients
                .requestConnection(codeName, endpointId, connectionLifecycleCallback)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We successfully requested a connection. Now both sides must
                            // accept before the connection is established
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // Nearby connections failed to request the connection.
                            Toast.makeText(context, "Nearby connections failed to request the connection. " + e, Toast.LENGTH_LONG).show();
                        });
    }

    // payload callback
    private final PayloadCallback payloadCallback = new PayloadCallback() {
        @Override
        public void onPayloadReceived(@NonNull String endpointId, @NonNull Payload payload) {
            String[] result = new String(payload.asBytes(), UTF_8).split(":", 4);

            coordinatesRow = Integer.parseInt(result[0]);
            coordinatesCol = Integer.parseInt(result[1]);
            choice = result[2];
            restart = result[3];
//            winner = result[4];

            // send an event to the react native app
            WritableMap params = Arguments.createMap();
            params.putString("event", "PayloadReceived");
            params.putString("choice", choice);
            params.putInt("row", coordinatesRow);
            params.putInt("col", coordinatesCol);
            params.putString("restart", restart);
//            params.putString("winner", winner);
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onPayloadReceived", params);
        }

        @Override
        public void onPayloadTransferUpdate(@NonNull String endpointId, @NonNull PayloadTransferUpdate payloadTransferUpdate) {

        }
    };

    // Callback to finding other devices
    private final EndpointDiscoveryCallback endpointDiscoveryCallback = new EndpointDiscoveryCallback() {
        @Override
        public void onEndpointFound(@NonNull String endpointId, @NonNull DiscoveredEndpointInfo info) {
            // And endpoint was found. We request a connection to it.
            Toast.makeText(context, "Endpoint found! " + endpointId, Toast.LENGTH_LONG).show();

            // send an event to the react native app
            WritableMap params = Arguments.createMap();
            params.putString("event", "EndpointFound");
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onEndpointFound", params);

            endpointsList.add(endpointId);
            endpointsAndDeviceNames.put(endpointId, info.getEndpointName());
        }

        @Override
        public void onEndpointLost(@NonNull String endpointId) {

        }
    };



    // Callback to connection with other devices (from this point forward the API is symmetric
    private final ConnectionLifecycleCallback connectionLifecycleCallback = new ConnectionLifecycleCallback() {
        @Override
        public void onConnectionInitiated(@NonNull String endpointId, @NonNull ConnectionInfo connectionInfo) {
            // Automatically accepts the connection in both sides
            connectionsClients.acceptConnection(endpointId, payloadCallback);
        }

        @Override
        public void onConnectionResult(@NonNull String endpointId, @NonNull ConnectionResolution result) {
            switch (result.getStatus().getStatusCode()){
                case ConnectionsStatusCodes.STATUS_OK:
                    // We're connected! Can now start sending and receiving data.
                    Toast.makeText(context, "We're connected! STATUS_OK", Toast.LENGTH_SHORT).show();
                    // We don't need to advertise and discovery anymore
                    connectionsClients.stopAdvertising();
                    connectionsClients.stopDiscovery();
                    opponentEndpointId = endpointId;

                    // send an event to the react native app
                    WritableMap params = Arguments.createMap();
                    params.putString("event", "Connected");
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onConnectionResult", params);

                    break;
                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                    // The connections was rejected by one or both sides.
                    Toast.makeText(context, "Connection Rejected!", Toast.LENGTH_LONG).show();
                    break;
                case ConnectionsStatusCodes.STATUS_ERROR:
                    // The connection broke before it was able to be accepted.
                    Toast.makeText(context, "Connection Error!", Toast.LENGTH_LONG).show();
                    break;
                default:
                     // Unknown status code
                    Toast.makeText(context, "Something went wrong in the ConnectionResult.", Toast.LENGTH_LONG).show();
            }
        }

        @Override
        public void onDisconnected(@NonNull String endpointId) {
            // We've been disconnected from this endpoint. No more data can be
            // sent or received.
            Toast.makeText(context, "Disconnected!", Toast.LENGTH_LONG).show();
        }
    };

    // Broadcast our presence using Nearby Connections so other players can find us
    /*
    * .startAdvertising(userNickname, serviceId, connectionCallback, advertisingOptions);
    *   - serviceId: must be uniquely to identify the app (usually it is used the app package name)
    *   - connectionCallback: function that will be call when some device request to connect with the advertiser.
    *   - advertisingOptions: informs the strategy of the communication
    * */
    @ReactMethod
    public void startAdvertising(String user, Callback successCallback){
        codeName = user;
        AdvertisingOptions advertisingOptions = new AdvertisingOptions.Builder().setStrategy(STRATEGY).build();
        connectionsClients
                .startAdvertising(codeName, getPackage(), connectionLifecycleCallback, advertisingOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We are advertising!
                            Toast.makeText(context, "We are Advertising!", Toast.LENGTH_LONG).show();
                            successCallback.invoke("Success");
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // We are unable to advertising.
                            Toast.makeText(context, "We are unable to Advertising!", Toast.LENGTH_LONG).show();
                        });
    }

    // Starts looking for other players using Nearby Connections
    /*
    * .startDiscovery(serviceId, endpointCallback, discoveryOptions);
    *   - serviceId: usually the same as the startAdvertising (app package name)
    *   - endpointCallback: function that will be called when you find some advertiser.
    *   - discoveryOptions: options of the discovery Strategy used.
    * */
    @ReactMethod
    public void startDiscovery(Callback successCallback) {
        DiscoveryOptions discoveryOptions = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
        connectionsClients
                .startDiscovery(getPackage(), endpointDiscoveryCallback, discoveryOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                          // We are discovering!
                            Toast.makeText(context, "We are Discovering!", Toast.LENGTH_LONG).show();
                            successCallback.invoke("success");
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // We're unable to discovering.
                            Toast.makeText(context, "We are unable to Discovering!", Toast.LENGTH_LONG).show();
                        });
    }
}