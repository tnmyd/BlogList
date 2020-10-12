import React,{useState} from 'react';
import PropTypes from 'prop-types';
import loginService from '../services/login';
import blogService from '../services/blogs';

const LoginForm = ({user, setUser, setErrorMessage}) => {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user);
      setPassword('');
      setUsername('');
      blogService.setToken(user.token);
    }
    catch (exception) {
      setErrorMessage('Invalid Credentials')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const showUser = () => (
    <>
      <p>
        {user.name} logged in
    </p>
      <button onClick={handleLogout}>
        Logout
    </button>
    </>
  )

  const loginForm = () => (
    <>
      <h2>Log in to Application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
                <input
            type="text"
            value={username}
            name="Username"
            onChange={(event) => setUsername(event.target.value)}
          />

        </div>
        <div>
          password
                <input
            type="password"
            value={password}
            name="Password"
            onChange={(event) => setPassword(event.target.value)}
          />

        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

    return (
        <>
        {user === null
        ? loginForm()
        : showUser()
      }
        </>

    )
}

LoginForm.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired
}

export default LoginForm;