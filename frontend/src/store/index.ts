import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { todosReducer, errorReducer } from './reducers'
import { AppState } from './common'

const storeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  combineReducers<AppState>({
    todos: todosReducer,
    error: errorReducer
  }),
  storeEnhancers(applyMiddleware(thunk))
)
