import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as axios from 'axios';
import { getData } from '../../actions/apiActions';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';


export default class Details extends Component{

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            wind:null,
            app_temp: null,
            uv_index: null,
            pressure: null,
            wind_dir: null
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
        this.setState({
            wind : list.data[0].wind_spd,
            app_temp: list.data[0].app_temp,
            uv_index: list.data[0].uv,
            pressure: list.data[0].pres,
            wind_dir: list.data[0].wind_cdir_full
        })
    }

    render() {
        return (
            <View style={styles.details}>
                <Text style={{borderBottomColor:"rgba(255,255,255,0.3)", borderBottomWidth:1, padding: 15, color:"#fff"}}>DETAILS</Text>
                <View style={{flexDirection:"row", alignContent:"center", borderBottomColor: "rgba(255,255,255,0.3)", borderBottomWidth:1}}>
                    <View style={{flexDirection:"row", textAlign: "center", borderRightColor: "rgba(255,255,255,0.3)", borderRightWidth:1, width:"50%", padding:12}}>
                        <MaterialCommunityIcons name="weather-windy" size={20} color="rgb(255,255,255)" style={{paddingRight: 2}} />
                        <Text style={{color: "rgba(255,255,255,0.6)"}}>{this.state.wind_dir}</Text>
                        <Text style={{marginLeft: 'auto', color: "#fff"}}>{this.state.wind} km/h</Text>
                    </View>
                    <View style={{flexDirection:"row", textAlign: "center", width:"50%", padding:12}}>
                        <FontAwesome name="thermometer-3" size={20} color="rgb(255,255,255)" style={{paddingRight: 2}} />
                        <Text style={{color: "rgba(255,255,255,0.6)"}}>Ressenti</Text>
                        <Text style={{marginLeft: 'auto', color: "#fff"}}>{this.state.app_temp}°C</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row", alignContent:"center"}}>
                    <View style={{flexDirection:"row", textAlign: "center", borderRightColor: "rgba(255,255,255,0.3)", borderRightWidth:1, width:"50%", padding:12}}>
                        <Feather name="sun" size={20} color="rgb(255,255,255)" style={{paddingRight: 2}} />
                        <Text style={{color: "rgba(255,255,255,0.6)"}}>Indice UV</Text>
                        <Text style={{marginLeft: 'auto', color: "#fff"}}>{this.state.uv_index}</Text>
                    </View>
                    <View style={{flexDirection:"row", textAlign: "center", width:"50%", padding:12}}>
                        <MaterialCommunityIcons name="gauge" size={20} color="rgb(255,255,255)" style={{paddingRight: 2}}/>
                        <Text style={{color: "rgba(255,255,255,0.6)"}}>Préssion</Text>
                        <Text style={{marginLeft: 'auto', color: "#fff"}}>{this.state.pressure} mb</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dataContainer: {
        marginTop: 20,
        marginBottom:20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 15,
        width: '90%',
        alignContent: "center"
    },
    details:{
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: "#ffffff",
        marginBottom:20,
        marginTop: 20,
        width: "90%"
    }
});
