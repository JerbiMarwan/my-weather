// import { IP } from '../constants/config';

import axios from 'axios';

import store from '../store/index';


export function getData(test){

        return axios.get("https://api.weatherbit.io/v2.0/current?lat="+test.lat+"&lon="+test.long+"&lang=fr&key=02070202f3c248b994af9f58c0fad719")
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.log(err); 
        })
}
