import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch
} from 'react-native'

import GLOBALS from './Globals'


export default class Header extends Component {
    constructor() {
        super();
        this.state = {
            switchValue: false
        }
        GLOBALS.getDarkModeData().then((value) => {
            this.setState({
                switchValue: value
            });
        });        
    }

    toggleSwitch = (value) => {
        this.setState({
            switchValue: value
        });
        GLOBALS.storeDarkModeData(value);
    }    

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Tic Tac Toe
                </Text>
                <View style={styles.toggle}>
                    <View>
                        <TouchableOpacity onPress={() => this.toggleSwitch(false)}>
                            <Text style={styles.day}>☀</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Switch
                            onValueChange={(value) => this.toggleSwitch(value)}
                            value={this.state.switchValue}
                            trackColor={{ true: GLOBALS.DARK_MODE.primaryLighter, false: 'white' }}
                            thumbColor={GLOBALS.DARK_MODE.primaryLight}
                            style={this.state.switchValue ? styles.switchEnableBorder : styles.switchDisableBorder} />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.toggleSwitch(true)}>
                            <Text style={styles.night}>☾</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        backgroundColor: '#6200EE',
        flexDirection: 'row'
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        fontSize: 23,
        textAlign: 'center',
        margin: 10,
    },
    switchEnableBorder: {
        borderColor: '#6fa6d3',
        borderWidth: 1
    },
    switchDisableBorder: {
        borderColor: '#f2f2f2',
        borderWidth: 1,
    },
    toggle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        marginRight: 10
    },
    night: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        color: GLOBALS.DARK_MODE.primaryDark
    },
    day: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: GLOBALS.DARK_MODE.primaryDark
    }
})