import React, { Fragment, Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Alert,
    FlatList,
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
            refreshing: false
        }

        NearbyConnections.getEndpointsList((endpointList) => {
            let list = endpointList;
            this.setState({
                endpointList: list
            });
        });
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });

        NearbyConnections.getEndpointsList((endpointList) => {
            let list = endpointList;
            this.setState({
                endpointList: list
            });
        });
    }

    onSwitchChange = () => {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });
    }

    requestConnection = (key) => {
        Alert.alert(JSON.stringify(key));
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => {

            NearbyConnections.getEndpointsList((endpointList) => {
                this.setState({
                    endpointList: endpointList,
                    refreshing: false
                });
            });
        });
    }

    onDeviceClick = (item) => {
        this.requestConnection(item);
    }


    render() {
        return (
            <Fragment>
                <ArrowHeader onSwitchChange={() => this.onSwitchChange()} />

                <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                    <Text style={[this.state.isDarkMode? stylesDarkMode.Text : stylesLightMode.Text, { marginBottom: 10 }]}>A list of devices that are advertising...</Text>
                    <FlatList
                        data={this.state.endpointList}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                title={item}
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
                                titleStyle={this.state.isDarkMode? stylesDarkMode.Text : stylesLightMode.Text}
                                subtitleStyle={this.state.isDarkMode? stylesDarkMode.Text : stylesLightMode.Text}
                                bottomDivider={true}
                                topDivider={true}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                    />
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