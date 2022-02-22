import { createStore } from 'redux';
import darkmodeReducer from '../Reducer/darkmode';

const store = createStore(darkmodeReducer);

export default store;