import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import store from './store'
import { authConfig } from './config';
import App from './components/App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      redirectUri={authConfig.callbackUrl}>  
      <App />
    </Auth0Provider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
