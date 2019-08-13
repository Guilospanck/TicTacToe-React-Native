import React, { Fragment, Component } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';

import GLOBALS from './Globals'
import ArrowHeader from "./ArrowHeader";

export default class Game extends Component {

    constructor() {
        super();
        this.state = {
            initialPlayer: 1,
            gameIsEnded: false,
            isDarkMode: false,
            gameState: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        }
    }

    componentDidMount() {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });

        this.initializeGame();
    }

    initializeGame() {
        this.setState({
            initialPlayer: 1,
            gameIsEnded: false,
            gameState:
                [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ]
        });
    }

    renderIcon = (row, col) => {
        let value = this.state.gameState[row][col];
        switch (value) {
            case 1: return <Icon name='times' size={60} color='red' />;
            case -1: return <Icon name='circle' size={60} color='green' />;
            default: return <View />
        }
    }

    verifyTie = () => {
        let gameState = this.state.gameState.slice();
        let totalDirtyCount = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameState[i][j] !== 0)
                    totalDirtyCount++;
            }
        }

        if (totalDirtyCount === 9) {
            return true;
        }

        return false;
    }

    verifyWinner = () => {
        let rowsSum = 0;
        let colsSum = 0;
        let gameState = this.state.gameState.slice();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rowsSum = gameState[i][j] + rowsSum;
                colsSum = gameState[j][i] + colsSum;
            }
            if (rowsSum === -3 || colsSum === -3) return -1;
            if (rowsSum === 3 || colsSum === 3) return 1;
            rowsSum = 0;
            colsSum = 0;
        }

        let diag1Sum = gameState[0][0] + gameState[1][1] + gameState[2][2];
        if (diag1Sum === 3) return 1;
        if (diag1Sum === -3) return -1;

        let diag2Sum = gameState[0][2] + gameState[1][1] + gameState[2][0];
        if (diag2Sum === 3) return 1;
        if (diag2Sum === -3) return -1;

        if (this.verifyTie() === true)
            return 2;
        return 0;
    }

    isThereAWinner = () => {
        let winner = this.verifyWinner();
        if (winner === 1) {
            this.setState({
                gameIsEnded: true
            });
            Alert.alert(this.props.player1 + ' venceu!');
        }
        else if (winner === -1) {
            this.setState({
                gameIsEnded: true
            });

            if (this.props.gameMode === 'versus')
                Alert.alert(this.props.player2 + ' venceu!');
            else
                Alert.alert("A Máquina venceu!");
        } else if (winner === 2) {
            this.setState({
                gameIsEnded: true
            });
            Alert.alert('Empate!');
        }
        return winner;
    }


    onPressTile = (row, col) => {
        if (this.state.gameIsEnded === true) return;

        let value = this.state.initialPlayer;

        let gameStateClone = this.state.gameState.slice();
        if (gameStateClone[row][col] !== 0) return;

        gameStateClone[row][col] = value;

        value = value * -1;

        if (this.props.gameMode === 'AI') {
            this.setState({
                gameState: gameStateClone,
                initialPlayer: value
            }, () => {
                let win = this.isThereAWinner(); // Verify if the user won, lost or there is a tie
                if (win === 1 || win === -1 || win === 2) return;

                if (win === 0) {
                    setTimeout(() => {
                        this.letAIPlay();
                        this.isThereAWinner(); // Verify if the machine has won the game...
                    }, 1500);
                }


            });
        } else {
            this.setState({
                gameState: gameStateClone,
                initialPlayer: value
            });

            this.isThereAWinner();
            if (this.state.gameIsEnded === true) return;
        }

    }

    getRandomNumber = (value) => {
        return Math.floor(Math.random() * Math.floor(value));
    }

    getRandomRowAndCol = () => {
        let randomRow = this.getRandomNumber(3);
        let randomCol = this.getRandomNumber(3);
        return [randomRow, randomCol];
    }

    randomAI = () => {
        let gameStateClone = this.state.gameState.slice();
        [row, col] = this.getRandomRowAndCol();

        if (gameStateClone[row][col] === 0) { // the cell is empty?
            gameStateClone[row][col] = -1;
            let anotherValue = this.state.initialPlayer;
            anotherValue = anotherValue * -1;

            this.setState({
                gameState: gameStateClone,
                initialPlayer: anotherValue
            }, () => {
                return;
            });
        } else this.randomAI();
    }

    verififyTicTacToeMatrix = () => {
        let rowsSum = 0;
        let colsSum = 0;
        let gameState = this.state.gameState.slice();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rowsSum = gameState[i][j] + rowsSum;
                colsSum = gameState[j][i] + colsSum;
            }
            if (rowsSum === -2) {
                return [gameState, 'row', i];
            } else if (colsSum === -2) {
                return [gameState, 'col', i];
            } else if (rowsSum === 2) {
                return [gameState, 'row', i];
            } else if (colsSum === 2) {
                return [gameState, 'col', i];
            }

            rowsSum = 0;
            colsSum = 0;
        }

        let diag1Sum = gameState[0][0] + gameState[1][1] + gameState[2][2];
        let diag2Sum = gameState[0][2] + gameState[1][1] + gameState[2][0];

        if (diag1Sum === -2) {
            return [gameState, 'primaryDiag', null];
        } else if (diag2Sum === -2) {
            return [gameState, 'secondaryDiag', null];
        } else if (diag1Sum === 2) {
            return [gameState, 'primaryDiag', null];
        } else if (diag2Sum === 2) {
            return [gameState, 'secondaryDiag', null];
        } else {
            return [gameState, 'none', null];
        }
    }


    notRandomAI = (row, col) => {
        let gameState = this.state.gameState.slice();

        gameState[row][col] = -1;
        let anotherValue = this.state.initialPlayer;
        anotherValue = anotherValue * -1;

        this.setState({
            gameState: gameState,
            initialPlayer: anotherValue
        }, () => {
            return;
        });
    }

    letAIPlay() {
        [gameState, result, rowOrCol] = this.verififyTicTacToeMatrix();

        if (result === 'none') { // there is no way that the other can win now
            this.randomAI();
        } else {
            if (result === 'row' || result === 'col') {
                for (let i = 0; i < 3; i++) {
                    if (result === 'row') { // some row has sum of 2
                        if (gameState[rowOrCol][i] === 0) return this.notRandomAI(rowOrCol, i);
                    } else if (result === 'col') { // some col has sum of 2
                        if (gameState[i][rowOrCol] === 0) return this.notRandomAI(i, rowOrCol);
                    }
                }
            } else if (result === 'primaryDiag') { // primary diagonal has sum of 2
                if (gameState[0][0] === 0) return this.notRandomAI(0, 0);
                else if (gameState[1][1] === 0) return this.notRandomAI(1, 1);
                else if (gameState[2][2] === 0) return this.notRandomAI(2, 2);
            } else if (result === 'secondaryDiag') { // secondary diagonal has sum of 2
                if (gameState[0][2] === 0) return this.notRandomAI(0, 2);
                else if (gameState[1][1] === 0) return this.notRandomAI(1, 1);
                else if (gameState[2][0] === 0) return this.notRandomAI(2, 0);
            }
        }


    }

    onSwitchChange = () => {
        GLOBALS.getStoreData('darkMode').then((value) => {
            this.setState({
                isDarkMode: value
            });
        });
    }

    render() {
        return (
            <Fragment>
                <ArrowHeader onSwitchChange={() => this.onSwitchChange()} />


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
                            inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                            value={this.props.player1}
                            editable={false}
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
                            inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                            value={this.props.gameMode === 'versus' ? this.props.player2 : 'Máquina'}
                            editable={false}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 70 }}>
                        <Input
                            containerStyle={{ flex: 1, alignItems: 'flex-end' }}
                            inputContainerStyle={{ borderWidth: 1, borderRadius: 50, width: 150 }}
                            rightIcon={
                                this.state.initialPlayer === 1 ?
                                    (
                                        <Icon
                                            name='times'
                                            size={24}
                                            color='red'
                                        />
                                    ) : (
                                        <Icon
                                            name='circle'
                                            size={24}
                                            color='green'
                                        />
                                    )
                            }
                            rightIconContainerStyle={{ marginRight: 10 }}
                            inputStyle={this.state.isDarkMode ? stylesDarkMode.textInputs : stylesLightMode.textInputs}
                            value="  Rodada: "
                            editable={false}
                        />
                    </View>
                    {/*  */}
                    <View style={{ flex: 9 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.onPressTile(0, 0)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0, borderTopWidth: 0 }]}>
                                {this.renderIcon(0, 0)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(0, 1)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderTopWidth: 0 }]}>
                                {this.renderIcon(0, 1)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(0, 2)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderRightWidth: 0, borderTopWidth: 0 }]}>
                                {this.renderIcon(0, 2)}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.onPressTile(1, 0)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0 }]}>
                                {this.renderIcon(1, 0)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(1, 1)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), {}]}>
                                {this.renderIcon(1, 1)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(1, 2)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderRightWidth: 0 }]}>
                                {this.renderIcon(1, 2)}
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.onPressTile(2, 0)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderLeftWidth: 0, borderBottomWidth: 0 }]}>
                                {this.renderIcon(2, 0)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(2, 1)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderBottomWidth: 0 }]}>
                                {this.renderIcon(2, 1)}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onPressTile(2, 2)} style={[(this.state.isDarkMode ? stylesDarkMode.tile : stylesLightMode.tile), { borderBottomWidth: 0, borderRightWidth: 0 }]}>
                                {this.renderIcon(2, 2)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Fragment>
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
    textInputs: {
        color: '#000',
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
    },
    textInputs: {
        color: '#FFF',
    }
});