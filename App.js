import React, {Component} from 'react';
import MyWeatherApp from './src/MyWeatherApp';
import store from './src/store';
import {provider} from 'react-redux';

export default class App extends Component {
  render(){
    return (
      <MyWeatherApp/>
    );
  }
}
