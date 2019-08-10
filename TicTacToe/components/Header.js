import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'

export default class Header extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Tic Tac Toe
                </Text>
                <View>
                    <Button title="☀" />
                    <ToggleSwitch
                        isOn={false}
                        onColor='green'
                        offColor='red'
                        label='Example label'
                        labelStyle={{ color: 'black', fontWeight: '900' }}
                        size='large'
                        onToggle={(isOn) => console.log('changed to : ', isOn)}
                    />;
                    <Button title="☾" />
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
    }
})