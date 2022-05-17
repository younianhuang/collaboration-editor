import { createStore, combineReducers } from 'redux';
import reducer1 from './reducer-temp-1';
import reducer2 from './reducer-temp-2';
import reduceNode from './reducer-node';

const rootReducers = combineReducers({
  reducer1,
  reducer2,
  reduceNode,
});
// 建立保管資料的store
const Store = createStore(reduceNode);

export default Store;
