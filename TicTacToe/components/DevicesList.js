import React, { Fragment, Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Alert,
    FlatList,
    DeviceEventEmitter
} from 'react-native'

import { ListItem } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from "react-native-router-flux";

import GLOBALS from './Globals'
import ArrowHeader from "./ArrowHeader";
import NearbyConnections from './NearbyConnections';

export default class DevicesList extends Component {
    constructor() {
        super();
        this.state = {
            isDarkMode: false,
            endpointList: [],
            infoEndpointName: [],
            refreshing: false,
            deviceSelected: false
        }
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });

        this.getEndpointListSubscription = DeviceEventEmitter.addListener('onEndpointFoundPopulateList', (e) => {
            let list = Object.keys(e); // get the endpointsId
            let info = Object.values(e); // getTheDiscoveryEndpointInfo(name)
            this.setState({
                endpointList: list,
                infoEndpointName: info
            });
        });

        this.subscription = DeviceEventEmitter.addListener('onConnectionResult', (e) => {
            this.setState({deviceSelected: false});
            if (e.event === "Connected")
                Actions.reset('game', {
                    gameMode: 'versus',
                    player2: this.props.player2,
                    discovering: true,
                    advertising: false
                });
        });

        this.connectionRejectedSubscription = DeviceEventEmitter.addListener('onConnectionRejected', (e) => {
            this.setState({deviceSelected: false});
        });

        this.connectionErrorSubscription = DeviceEventEmitter.addListener('onConnectionError', (e) => {
            this.setState({deviceSelected: false});
        });

        this.connectionWrongSubscription = DeviceEventEmitter.addListener('onConnectionSomethingWrong', (e) => {
            this.setState({deviceSelected: false});
        });
    }

    componentWillUnmount() {
        this.getEndpointListSubscription.remove();
        this.subscription.remove();
        this.connectionRejectedSubscription.remove();
        this.connectionErrorSubscription.remove();
        this.connectionWrongSubscription.remove();
    }

    onSwitchChange = () => {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });
    }

    requestConnection = (key) => {
        NearbyConnections.requestConnection(key);
    }

    handleRefresh = () => {
        if(this.state.deviceSelected === true) return;

        this.setState({ refreshing: true }, () => {

            NearbyConnections.getEndpointsList((endpointList) => {
                let list = Object.keys(endpointList); // get the endpointsId
                let info = Object.values(endpointList); // getTheDiscoveryEndpointInfo(name)
                this.setState({
                    endpointList: list,
                    infoEndpointName: info,
                    refreshing: false
                });
            });
        });
    }

    onDeviceClick = (item) => {
        if(this.state.deviceSelected === true) return;

        this.requestConnection(item);
        this.setState({deviceSelected: true});
    }


    render() {
        return (
            <Fragment>
                <ArrowHeader onSwitchChange={() => this.onSwitchChange()} />

                <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                    <Text style={[this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text, { marginBottom: 10 }]}>A list of devices that are advertising...</Text>
                    <FlatList
                        data={this.state.endpointList}
                        renderItem={({ item, index }) => (
                            <ListItem
                                roundAvatar
                                title={this.state.infoEndpointName[index]}
                                subtitle={item}
                                chevron={true}
                                leftIcon={
                                    <Icon
                                        name='mobile'
                                        size={36}
                                        color={this.state.isDarkMode ? 'white' : 'black'}
                                    />
                                }
                                onPress={() => this.onDeviceClick(item)}
                                containerStyle={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}
                                titleStyle={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}
                                subtitleStyle={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}
                                bottomDivider={true}
                                topDivider={true}
                                disabled={this.state.deviceSelected}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        ListEmptyComponent={<View><Text>No nearby devices...</Text></View>}
                    />
                    <Fragment>
                        {this.state.deviceSelected ? (
                            <View><Text>Connecting...</Text></View>
                        ) : (
                            <Fragment></Fragment>
                        )}
                    </Fragment>
                </View>
            </Fragment>
        )
    }
}

const stylesLightMode = StyleSheet.create({
    container: {
        flex: 1
    },
    Text: {
        fontSize: 14,
        color: GLOBALS.LIGHT_MODE.textColor
    }
});

const stylesDarkMode = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GLOBALS.DARK_MODE.primaryLight
    },
    Text: {
        fontSize: 14,
        color: GLOBALS.DARK_MODE.textColor
    }
})