import { combineReducers } from 'redux';
import { WEATHER_INFOS } from '../constants/Actions-types'

const myWeatherReducer = (state = {}, action) => {
    switch (action.type) {
      case WEATHER_INFOS:
        return action.payload;
      default:
        return state;
    }
  };

const rootReducer = combineReducers({
    myWeatherInfos: myWeatherReducer
});

export default rootReducer;