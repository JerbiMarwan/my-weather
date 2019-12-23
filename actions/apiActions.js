// import { IP } from '../constants/config';

import axios from 'axios';

import store from '../store/index';


export function getData(coords){
    return axios.get("https://api.weatherbit.io/v2.0/current?lat="+coords.lat+"&lon="+coords.long+"&lang=fr&key=02070202f3c248b994af9f58c0fad719")
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err); 
    })
}

export function getDataForecast(coords){
    return axios.get("https://api.weatherbit.io/v2.0/forecast/daily?lat="+coords.lat+"&lon="+coords.long+"&days=5&lang=fr&key=02070202f3c248b994af9f58c0fad719")
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err); 
    })
}

export function getDataByCity(city){
    return axios.get("https://api.weatherbit.io/v2.0/current?city="+city+"&lang=fr&key=02070202f3c248b994af9f58c0fad719")
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err); 
    })
}

export function getDataForecastByCity(city){
    return axios.get("https://api.weatherbit.io/v2.0/forecast/daily?city="+city+"&days=5&lang=fr&key=02070202f3c248b994af9f58c0fad719")
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err); 
    })
}
