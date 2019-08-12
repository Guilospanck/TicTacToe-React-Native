import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';

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

                <View style={{ flex: 2, flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start' }}>
                    <Input
                        containerStyle={{ flex: 1, justifyContent: 'flex-start' }}
                        inputContainerStyle={{ borderWidth: 1, borderRadius: 50, width: 150 }}
                        leftIcon={
                            <Icon
                                name='times'
                                size={24}
                                color='red'
                            />
                        }
                    // inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                    // value={this.state.player1}
                    // onChangeText={(player1) => this.setState({ player1: player1 })}
                    />

                    <Input
                        containerStyle={{ flex: 1, alignItems: 'flex-end' }}
                        inputContainerStyle={{ borderWidth: 1, borderRadius: 50, width: 150 }}
                        leftIcon={
                            <Icon
                                name='circle'
                                size={24}
                                color='green'
                            />
                        }
                    // inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                    // value={this.state.player2}
                    // onChangeText={(player2) => this.setState({ player2: player2 })}
                    />
                </View>
                {/*  */}
                <View style={{ flex: 4 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0, borderTopWidth: 0 }]}>
                            <Icon
                                name='times'
                                size={60}
                                color='red'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderTopWidth: 0 }]}>
                            <Icon
                                name='circle'
                                size={60}
                                color='green'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderRightWidth: 0, borderTopWidth: 0 }]}></TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0 }]}></TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {}]}></TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderRightWidth: 0 }]}></TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0, borderBottomWidth: 0 }]}></TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderBottomWidth: 0 }]}></TouchableOpacity>
                        <TouchableOpacity style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderBottomWidth: 0, borderRightWidth: 0 }]}></TouchableOpacity>
                    </View>
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