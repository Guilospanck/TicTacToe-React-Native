import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native'

import GLOBALS from './Globals'

export default class Home extends Component {
    constructor(){
        super();
        this.state = {
            isDarkMode: true
        }
        console.log(GLOBALS.STYLES.versusAiAndPerson);        
    }

    render() {
        return (
            <View style={this.state.isDarkMode ? stylesDarkMode.container : stylesLightMode.container}>
                <TouchableOpacity style={this.state.isDarkMode ? stylesDarkMode.versusAi : stylesLightMode.versusAi}>
                    <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>AI</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.isDarkMode ? stylesDarkMode.versusPerson : stylesLightMode.versusPerson}>
                    <Text style={this.state.isDarkMode ? stylesDarkMode.Text : stylesLightMode.Text}>Person</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const stylesLightMode = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    versusAi: {
        ...GLOBALS.STYLES.versusAiAndPerson,...{   
        marginBottom: 10,
        backgroundColor: 'white'   
    }},
    versusPerson: {
        ...GLOBALS.STYLES.versusAiAndPerson,...{
        backgroundColor: 'white'
    }},
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
        backgroundColor: '#515052'
    },
    versusAi: {
        ...GLOBALS.STYLES.versusAiAndPerson,...{
        backgroundColor: GLOBALS.DARK_MODE.primaryLighter,
        marginBottom: 10
    }},
    versusPerson: {
        ...GLOBALS.STYLES.versusAiAndPerson,...{
        backgroundColor: GLOBALS.DARK_MODE.primaryLighter
    }},
    Text: {
        fontSize: 20,
        color: GLOBALS.DARK_MODE.textColor
    }
})