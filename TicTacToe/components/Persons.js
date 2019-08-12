import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';

import GLOBALS from './Globals'
import { Actions } from "react-native-router-flux";

export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            isDarkMode: false,
            player1: '',
            player2: ''
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


    onPlayPress = () => {
        Actions.game({
            player1: this.state.player1 !== '' ? this.state.player1 : "Jogador 1",
            player2: this.state.player2 !== '' ? this.state.player2 : "Jogador 2",
            gameMode: 'versus'
        });
    }

    render() {

        return (
            <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                <Input
                    inputContainerStyle={{ borderWidth: 1, borderRadius: 50 }}
                    placeholder="Insira o nome do Jogador 1"
                    leftIcon={
                        <Icon
                            name='user'
                            size={24}
                            color={this.state.isDarkMode ? '#fff' : '#6200EE'}
                        />
                    }
                    inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                    value={this.state.player1}
                    onChangeText={(player1) => this.setState({ player1: player1 })}
                />

                <Input
                    containerStyle={{ paddingTop: 10 }}
                    inputContainerStyle={{ borderWidth: 1, borderRadius: 50 }}
                    placeholder="Insira o nome do Jogador 2"
                    leftIcon={
                        <Icon
                            name='user'
                            size={24}
                            color={this.state.isDarkMode ? '#fff' : '#6200EE'}
                        />
                    }
                    inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                    value={this.state.player2}
                    onChangeText={(player2) => this.setState({ player2: player2 })}
                />
                <Button                    
                    type="outline"
                    title="PLAY"
                    containerStyle={{paddingTop: 10}}
                    buttonStyle={{width: 200}}
                    onPress={() => this.onPlayPress()}
                />
            </View>
        );
    };

}

const stylesLightMode = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
        padding: 15
    },
    textInputs: {
        color: '#000',
    }
});

const stylesDarkMode = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: GLOBALS.DARK_MODE.primaryLight,
        padding: 15
    },
    textInputs: {
        color: '#fff',
    }
});