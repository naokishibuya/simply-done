import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from 'semantic-ui-react';
import Loading from './Loading'

const MenuBar = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout,
  } = useAuth0()

  if (error) {
    return (
      <div>
        Oops... {error.message}
      </div>
    )
  }

  const HomeMenuItem = () => {
    return (
      <Menu.Item name="home">
        <Link to="/">Home</Link>
      </Menu.Item>  
    )
  }
  
  const LoginMenuItem = () => {
    return (
      <Menu.Item color="blue" onClick={() => loginWithRedirect()}>
        Login
      </Menu.Item>
    )
  }
  
  const LogoutMenuItem = () => {
    return (
      <Menu.Item color="blue" onClick={() => logout()}>
        Logout
      </Menu.Item>
    )
  }
  
  return (
    <Menu>
      <HomeMenuItem />
      {isLoading ? <Loading /> : isAuthenticated ? <LogoutMenuItem /> : <LoginMenuItem />}
    </Menu>
  )
}

export default MenuBar