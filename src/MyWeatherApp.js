import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as axios from 'axios';
import WeatherGen from './containers/WeatherGen'

export default class MyWeatherApp extends Component{
    state = {
        location: null,
        errorMessage: null,
        long: null,
        lat: null,
        temp: null,
        app_temp: null
    };
    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
        if (this.state.errorMessage) {
            console.log(this.state.errorMessage);
        } else if (this.state.location) {
            const axios = require('axios');
            console.log('test');
            this.state.long = JSON.stringify(this.state.location.coords.longitude);
            this.state.lat = JSON.stringify(this.state.location.coords.latitude);
            axios.get("https://api.weatherbit.io/v2.0/current?lat="+this.state.lat+"&lon="+this.state.long+"&lang=fr&key=02070202f3c248b994af9f58c0fad719")
                .then(function(response){
                this.state.temp = JSON.stringify(response.data.data[0].temp);
                this.state.app_temp = JSON.stringify(response.data.data[0].app_temp);
                console.log(this.state.temp);
                console.log(this.state.app_temp);
                });
        }
    }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
    
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };
    
    render() {
        const axios = require('axios');
        let text = 'Waiting..';
        let long = '';
        let lat = '';
        let temp = '';
        let app_temp = '';
        if (this.state.errorMessage) {
          text = this.state.errorMessage;
        } else if (this.state.location) {
            long = JSON.stringify(this.state.location.coords.longitude);
            lat = JSON.stringify(this.state.location.coords.latitude);
            axios.get("https://api.weatherbit.io/v2.0/current?lat="+lat+"&lon="+long+"&lang=fr&key=02070202f3c248b994af9f58c0fad719")
                .then(function(response){
                temp = JSON.stringify(response.data.data[0].temp);
                app_temp = JSON.stringify(response.data.data[0].app_temp);
                console.log(temp);
                console.log(app_temp);
            });
          
        }
        return (
          <View>
            <Text style={styles.paragraph}>longitude : {long}</Text>
            <Text style={styles.paragraph}>latitude : {lat}</Text>
            <Text style={styles.paragraph}>température : {temp}°</Text>
            <Text style={styles.paragraph}>ressenti : {app_temp}°</Text>
            <WeatherGen></WeatherGen>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
    },
});