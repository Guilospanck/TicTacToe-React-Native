import React, { Fragment, Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import { Actions } from "react-native-router-flux";

import GLOBALS from './Globals'
import Header from "./Header";
import NearbyConnections from './NearbyConnections';

export default class DevicesList extends Component {
    constructor() {
        super();
        this.state = {
            isDarkMode: false,
            endpointList: []
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
    }

    onSwitchChange = () => {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });
    }

    requestConnection = (key) => {
        Alert.alert(key);
    }


    render() {
        return (
            <Fragment>
                <Header onSwitchChange={() => this.onSwitchChange()} />

                <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                    <Text>A list of devices that are advertising...</Text>
                    <ul>
                        {this.state.endpointList.map(item => (
                            <li onClick={(key) => this.requestConnection(key)} key={item}>{item}</li>
                        ))}
                    </ul>
                </View>

            </Fragment>
        )
    }
}

const stylesLightMode = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    Text: {
        fontSize: 20,
        color: GLOBALS.LIGHT_MODE.textColor
    }
});

const stylesDarkMode = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: GLOBALS.DARK_MODE.primaryLight
    },
    Text: {
        fontSize: 20,
        color: GLOBALS.DARK_MODE.textColor
    }
})