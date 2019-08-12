import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch
} from 'react-native'

import GLOBALS from './Globals'

export default class Game extends Component {

    constructor() {
        super();
        GLOBALS.storeData('isInGame', true);
    }

    componentDidMount() {
        GLOBALS.storeData('isInGame', true);
    }

    componentWillUnmount(){
        GLOBALS.storeData('isInGame', false);
    }

    render() {
        return (
            <View>
                <Text>Game works! {this.props.gameMode}</Text>
            </View>
        );
    };

}