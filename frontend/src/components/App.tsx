import { Provider} from 'react-redux'
import { Route, Router } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import MenuBar from './MenuBar'
import history from '../history'
import TodoList from './TodoList'
import store from '../store'

const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <MenuBar />
        <Route path="/todos" component={TodoList} />
      </Router>
    </Provider>
  )
}

export default App
