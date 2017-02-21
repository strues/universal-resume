import { combineReducers } from 'redux';
import client from './apolloClient';

const reducers = combineReducers({
  apollo: client.reducer(),
});

export default reducers;
