import {combineReducers} from 'redux';
import AllDataReducer from './reducer_allData';

const appReducer = combineReducers({
  AllData: AllDataReducer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
