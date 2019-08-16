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


export default class Versus extends Component {
    constructor() {
        super();
        this.state = {
            isDarkMode: false,
            showWaitingButton: false
        }
        NearbyConnections.disconnect();
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value,
                showWaitingButton: false
            });
        });

        NearbyConnections.disconnect();
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
            if(success === "Success"){
                Actions.devices();
            }
        });     
    }

    startAdvertising = () => {
        NearbyConnections.disconnect();
        NearbyConnections.startAdvertising("Player 1", (success) => {
            
            if(success === "Success")
                this.setState({showWaitingButton: true});
        });
    }

    render() {
        return (
            <Fragment>
                <Header onSwitchChange={() => this.onSwitchChange()} />

                <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                    <TouchableOpacity
                        style={this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson}
                        onPress={() => this.startDiscovery()}>
                        <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Encontrar jogos ativos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson, {marginTop: 10}]}
                        onPress={() => this.startAdvertising()}>
                        <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Esperar jogadores</Text>
                    </TouchableOpacity>
                    {this.state.showWaitingButton ? (
                        <Text style={{marginTop: 25}}>Waiting for players...</Text>
                    ) : (
                        <Fragment></Fragment>
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