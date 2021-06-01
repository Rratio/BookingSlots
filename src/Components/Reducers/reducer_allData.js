import {GET_ALL_DATA} from '../Actions/index';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_ALL_DATA:
      return action.payload;
  }
  return state;
}
