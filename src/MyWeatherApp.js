import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as axios from 'axios';
import ChartForcast from './containers/ChartForecast';
import Details from './containers/Details';
import { getData } from '../actions/apiActions';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default class MyWeatherApp extends Component{

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            temp: null,
            app_temp: null,
            city: null,
            desc: null,
            last_update: null,
            icon: null
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
        await this._storeData(this.state.location);
    };

    _storeData = async (loc) => {
        try {
          await AsyncStorage.setItem('@MySuperStore:key', loc);
        } catch (error) {
          // Error saving data
        }
      };
    

    DisplayData = async () => {
        const headers = {
            'lat': this.state.location.latitude,
            'long': this.state.location.longitude
        };
        let list = await getData(headers);
        console.log(list);
        this.setState({
            temp : list.data[0].temp,
            app_temp: list.data[0].app_temp,
            city: list.data[0].city_name +' - '+ list.data[0].country_code,
            desc: list.data[0].weather.description,
            last_update: list.data[0].ob_time.slice(11),
            icon: list.data[0].weather.icon
        })
        // console.log(list);
    }

    render() {
        // this.DisplayData();
        return (
          <View style={styles.container}>
            <LinearGradient
                colors={["#2b2b86", "#40399c", "#5547b2", "#6a55c8", "#7f64df", "#8f6ee9", "#9f78f3", "#af82fd", "#bc89fc", "#c790fc", "#d297fc", "#dc9ffc"]}
                style={{ padding: 15, alignItems: 'center', height: "100%", width: "100%"}}>
                <View style={styles.dataContainer}>
                    <Text style={styles.paragraph}><MaterialIcons name="location-on" size={20} color="rgb(255,255,255)" />{this.state.city}</Text>
                    <View style={{flexDirection:"row", alignContent:"center"}}>
                        <Image
                            style={{width: 75, height: 75}}
                            source={{uri: 'https://www.weatherbit.io/static/img/icons/'+ this.state.icon +'.png'}}
                        />
                        <Text style={styles.paragraph, {fontSize:50, color:'rgb(255,255,255)', marginRight: -10}}>{this.state.temp}°</Text>
                        <Text style={styles.paragraph, {fontSize:10, color:'rgb(255,255,255)', marginTop:35}}> à {this.state.last_update}</Text>
                    </View>
                    
                    {/* <Text style={styles.paragraph}>ressenti : {this.state.app_temp}°</Text> */}
                    
                </View>
                <Details></Details>
                <View style={styles.dataContainer}>
                    <Text style={styles.paragraph}>Prévisions sur 5 jours : </Text>
                    <ChartForcast></ChartForcast>
                </View>
                {/* <View style={styles.dataContainer}>
                    <Text style={styles.paragraph}>Prévisions sur 5 jours : </Text>
                    <ChartForcast></ChartForcast>
                </View> */}
            </LinearGradient>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#2b2b86',
    },
    paragraph: {
        margin: 24,
        color: 'rgb(255,255,255)',
        fontSize: 18,
        textAlign: 'center',
    },
    dataContainer: {
        marginTop: 20,
        marginBottom:20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        // shadowColor: '#000',
        // shadowOffset: { width: 2, height: 5 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 5,
        marginBottom: 15,
        width: '90%',
        alignContent: "center"
    },
    details:{
        color: "#ffffff",
        marginBottom:20,
        marginTop: 20,
        padding: 10,
        width: "80%"
    }
});
