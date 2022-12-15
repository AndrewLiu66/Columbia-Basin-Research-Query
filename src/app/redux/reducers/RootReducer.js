import { combineReducers } from 'redux'

const RootReducer = combineReducers({
    graph: function (state = {}, action) {
        return { "temp": 1 }
    }
})

export default RootReducer
