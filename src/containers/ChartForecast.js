import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as axios from 'axios';
import { getDataForecast } from '../../actions/apiActions';
import { BarChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Text } from 'react-native-svg'



export default class ChartForcast extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            forecast: []
        };
    }

    async componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            await this._getLocationAsync();
            this.DisplayDataForecast();
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

    DisplayDataForecast = async () => {
        const headers = {
            'lat': this.state.location.latitude,
            'long': this.state.location.longitude
        };
        let list = await getDataForecast(headers);
        // console.log(list.data);
        let data_stock= [];
        for(var i = 0; i<list.data.length; i++){
            data_stock.push(list.data[i].temp);
        }
        this.setState({
            forecast: data_stock
        })
    }

    render() {
        const fill = 'rgba(134, 65, 244, 0.5)'
        const data = this.state.forecast;
        const CUT_OFF = 0
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                    fontSize={ 14 }
                    fill={ value >= CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                >
                    {value}°
                </Text>
            ))
        )
        return (
          <View style={{alignItems: 'center',}}>
            <BarChart
                style={{ height: 200, width: 250 }}
                data={ data }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}
                spacing={0.5}
                gridMin={0}
            >
                <Grid direction={Grid.Direction.HORIZONTAL}/>
                <Labels/>
            </BarChart>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
        alignItems: 'center'
    },
    text: {
        margin: 24,
        color: 'rgb(134, 65, 244)',
        fontSize: 18,
        textAlign: 'center',
    },
});