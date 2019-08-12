/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Router,
  Scene
} from 'react-native-router-flux';

import Header from "./components/Header";
import Home from "./components/Home"
import Game from "./components/Game"

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <StatusBar backgroundColor="#3700B3" />
        <View style={styles.container}>
          <Router>
            <Scene key="root" headerMode="screen" navBar={Header}>
              <Scene key="home" component={Home} />
              <Scene key="game" component={Game} />
            </Scene>
          </Router>
        </View>
      </Fragment >
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
