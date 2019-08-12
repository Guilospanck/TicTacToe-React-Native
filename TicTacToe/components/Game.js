import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import GLOBALS from './Globals'

export default class Game extends Component {

    constructor() {
        super();
        this.state = {
            isDarkMode: false
        }
        GLOBALS.storeData('isInGame', true);
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });

        GLOBALS.storeData('isInGame', true);
    }

    componentWillUnmount() {
        GLOBALS.storeData('isInGame', false);
    }

    render() {
        return (
            <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderLeftWidth: 0, borderTopWidth: 0}]}>
                    <Icon name="md-close" style={stylesLightMode.tileX}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderTopWidth: 0}]}>
                    <Icon name="md-radio-button-off" style={stylesLightMode.tileO}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderRightWidth: 0, borderTopWidth: 0}]}></TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderLeftWidth: 0}]}></TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {}]}></TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderRightWidth: 0}]}></TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderLeftWidth: 0, borderBottomWidth: 0}]}></TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderBottomWidth: 0}]}></TouchableOpacity>
                    <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {borderBottomWidth: 0, borderRightWidth: 0}]}></TouchableOpacity>
                </View>
            </View>
        );
    };

}

const stylesLightMode = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center"
    },
    tile: {
        borderWidth: 2,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    tileX: {
        color: 'red',
        fontSize: 60
    },
    tileO: {
        color: 'green',
        fontSize: 60
    }
});

const stylesDarkMode = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: GLOBALS.DARK_MODE.primaryLight
    },
    tile: {
        borderWidth: 2,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#6200EE'
    }
});