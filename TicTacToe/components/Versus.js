import React, { Fragment, Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    DeviceEventEmitter
} from 'react-native'

import { Actions } from "react-native-router-flux";

import GLOBALS from './Globals'
import ArrowHeader from "./ArrowHeader";
import NearbyConnections from './NearbyConnections';


export default class Versus extends Component {
    constructor() {
        super();
        this.state = {
            isDarkMode: false,
            advertising: false,
            discovering: false

        }
        NearbyConnections.disconnect();
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value,
                advertising: false,
                discovering: false
            });
        });

        NearbyConnections.disconnect();

        this.subscription = DeviceEventEmitter.addListener('onEndpointFound', function (e) {
            if (e.event === "EndpointFound")
                Actions.devices();
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    onSwitchChange = () => {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });
    }

    startDiscovery = () => {
        NearbyConnections.disconnect();
        NearbyConnections.startDiscovery((success) => {

            if (success === 'success')
                this.setState({ discovering: true, advertising: false });
        });
    }

    startAdvertising = () => {
        NearbyConnections.disconnect();
        NearbyConnections.startAdvertising("Player 1", (success) => {

            if (success === "Success")
                this.setState({ advertising: true, discovering: false });
        });
    }

    render() {
        return (
            <Fragment>
                <ArrowHeader onSwitchChange={() => this.onSwitchChange()} />

                <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>

                    {this.state.discovering ? (
                        <TouchableOpacity
                            style={this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson}
                            >
                            <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Descobrindo...</Text>
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity
                                style={this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson}
                                onPress={() => this.startDiscovery()}>
                                <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Encontrar jogos ativos</Text>
                            </TouchableOpacity>
                        )}

                    {this.state.advertising ? (
                        <TouchableOpacity
                            style={[this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson, { marginTop: 10 }]}
                        >
                            <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Esperando...</Text>
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity
                                style={[this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson, { marginTop: 10 }]}
                                onPress={() => this.startAdvertising()}>
                                <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Esperar jogadores</Text>
                            </TouchableOpacity>
                        )}

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
    versusPerson: {
        ...GLOBALS.STYLES.versusAiAndPerson, ...{
            backgroundColor: 'white'
        }
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
    versusPerson: {
        ...GLOBALS.STYLES.versusAiAndPerson, ...{
            backgroundColor: GLOBALS.DARK_MODE.primaryLighter
        }
    },
    Text: {
        fontSize: 20,
        color: GLOBALS.DARK_MODE.textColor
    }
})