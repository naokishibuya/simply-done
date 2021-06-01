import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { todosReducer } from './reducers'
import { AppState } from './common'

const storeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  combineReducers<AppState>({
    todos: todosReducer
  }),
  storeEnhancers(applyMiddleware(thunk))
)
