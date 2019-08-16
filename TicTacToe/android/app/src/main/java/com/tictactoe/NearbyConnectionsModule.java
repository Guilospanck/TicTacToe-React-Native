package com.tictactoe;

import static java.nio.charset.StandardCharsets.UTF_8;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.CallSuper;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
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

import java.lang.reflect.Array;
import java.util.ArrayList;

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

    private ArrayList<String> endpointsList;

    public NearbyConnectionsModule(ReactApplicationContext reactContext) {
        super(reactContext);

        context = reactContext;

        connectionsClients = Nearby.getConnectionsClient(context);

        endpointsList = new ArrayList<String>();
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
    public void getEndpointsList(Callback list){
        try {
            list.invoke(endpointsList);
        } catch (Exception e ) {
            Toast.makeText(context, "GetEndpointList: something went wrong! " + e, Toast.LENGTH_LONG).show();
        }
    }

    @ReactMethod
    public void requestConnection(String endpointId){
        connectionsClients
                .requestConnection(codeName, endpointId, connectionLifecycleCallback)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We successfully requested a connection. Now both sides must
                            // accept before the connection is established.
                            Toast.makeText(context, "Both sides need to accept the connection...", Toast.LENGTH_LONG).show();
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // Nearby connections failed to request the connection.
                            Toast.makeText(context, "Nearby connections failed to request the connection.", Toast.LENGTH_LONG).show();
                        });
    }

    // payload callback
    private final PayloadCallback payloadCallback = new PayloadCallback() {
        @Override
        public void onPayloadReceived(@NonNull String endpointId, @NonNull Payload payload) {
            String[] result = new String(payload.asBytes(), UTF_8).split(":", 3);

            coordinatesRow = Integer.parseInt(result[0]);
            coordinatesCol = Integer.parseInt(result[1]);
            choice = result[2];
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
            endpointsList.add(endpointId);
            // request connection ...
        }

        @Override
        public void onEndpointLost(@NonNull String endpointId) {

        }
    };

    // Callback to connection with other devices (from this point forward the API is symmetric
    private final ConnectionLifecycleCallback connectionLifecycleCallback = new ConnectionLifecycleCallback() {
        @Override
        public void onConnectionInitiated(@NonNull String endpointId, @NonNull ConnectionInfo connectionInfo) {
            new AlertDialog.Builder(context)
                    .setTitle("Accept connection to " + connectionInfo.getEndpointName())
                    .setMessage("Confirm the code matches on both devices: " + connectionInfo.getAuthenticationToken())
                    .setPositiveButton(
                            "Accept",
                            (DialogInterface dialog, int which) ->
                                    // The user confirmed, so we can accept the connection
                                    connectionsClients.acceptConnection(endpointId, payloadCallback))
                    .setNegativeButton(
                            android.R.string.cancel,
                            (DialogInterface dialog, int which) ->
                                    // The user canceled, so we should reject the connection.
                                    connectionsClients.rejectConnection(endpointId))
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
        }

        @Override
        public void onConnectionResult(@NonNull String endpointId, @NonNull ConnectionResolution result) {
            switch (result.getStatus().getStatusCode()){
                case ConnectionsStatusCodes.STATUS_OK:
                    // We're connected! Can now start sending and receiving data.
                    // We don't need to advertise and discovery anymore
                    connectionsClients.stopAdvertising();
                    connectionsClients.stopDiscovery();
                    opponentEndpointId = endpointId;
                    break;
                case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                    // The connections was rejected by one or both sides.
                    break;
                case ConnectionsStatusCodes.STATUS_ERROR:
                    // The connection broke before it was able to be accepted.
                    break;
                default:
                     // Unknown status code
            }
        }

        @Override
        public void onDisconnected(@NonNull String endpointId) {
            // We've been disconnected from this endpoint. No more data can be
            // sent or received.
        }
    };

    // Broadcast our presence using Nearby Connections so other players can find us
    /*
    * .startAdvertising(userNickname, serviceId, connectionCallback, advertisingOptions);
    *   - serviceId: must be uniquely to identify the app (usually it is used the app package name)
    *   - connectionCallback: function that will be call when some device request to connect with the advertiser.
    *   - advertisinOptions: informs the strategy of the communication
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