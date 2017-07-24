/**
 Entry Point of the Android App.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './App/app';


export default class FloatButton extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('FloatButton', () => FloatButton);
