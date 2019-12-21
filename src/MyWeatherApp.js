import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as axios from 'axios';
import WeatherGen from './containers/WeatherGen';
import { getData } from '../actions/apiActions';


export default class MyWeatherApp extends Component{

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            temp: null,
            app_temp: null,
            city: null,
            desc: null
        };
    }
    
    async componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            await this._getLocationAsync();
            this.DisplayData();
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
        this.setState({ location : location.coords });
    };
    

    DisplayData = async () => {
        const headers = {
            'lat': this.state.location.latitude,
            'long': this.state.location.longitude
        };
        let list = await getData(headers);
        this.setState({
            temp : list.data[0].temp,
            app_temp: list.data[0].app_temp,
            city: list.data[0].city_name +' '+ list.data[0].country_code,
            desc: list.data[0].weather.description
        })
        // console.log(list);
    }

    render() {
        // this.DisplayData();
        return (
          <View>
            <Text style={styles.paragraph}>Localisation : {this.state.city}</Text>
            <Text style={styles.paragraph}>température : {this.state.temp}°</Text>
            <Text style={styles.paragraph}>ressenti : {this.state.app_temp}°</Text>
            <Text style={styles.paragraph}>{this.state.desc}</Text>
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
