/**
 Entry Point of the iOS App.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './App/app';
// import App from './App/pulse';


export default class FloatButton extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('FloatButton', () => FloatButton);
