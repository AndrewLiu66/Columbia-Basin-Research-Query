import { combineReducers } from 'redux'
import GraphReducer from './GraphReducer'

const RootReducer = combineReducers({
    graph: GraphReducer
})

export default RootReducer
