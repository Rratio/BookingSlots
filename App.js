import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Router, Scene} from 'react-native-router-flux';
import DetailScreen from './src/Components/DetailScreen';
import HomeScreen from './src/Components/HomeScreen';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allDataReducer from './src/Components/Reducers/index';
import ReduxPromise from 'redux-promise';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

export default class App extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(allDataReducer)}>
        <Router>
          <Scene key="root">
            <Scene
              key="Home"
              component={HomeScreen}
              title="Home"
              hideNavBar
              initial
            />
            <Scene
              key="Detail"
              component={DetailScreen}
              title="Detail"
              hideNavBar
            />
          </Scene>
        </Router>
      </Provider>
    );
  }
}
