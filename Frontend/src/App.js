import React, { useState, useEffect } from 'react'
import AddBlog from './components/AddBlog'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import Togglable from './components/Togglable'
import { useRef } from 'react'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const addBlogRef = useRef();


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [blogs])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      blogService.setToken(user.token)

    }

  }, [])

  const hideAddBlog = () => {
    addBlogRef.current.toggleVisibility();
  }

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
    <div>
      {errorMessage && <Notification message={errorMessage} type="failure" />}
      {message && <Notification message={message} type="success" />}

      {user === null
        ? loginForm()
        : showUser()
      }
      {user

        &&
        <>
          <h2>blogs</h2>
          <Togglable buttonLabel="new note" ref={addBlogRef}>
            <AddBlog message={message} setMessage={setMessage} hideBlogOnCreate = {hideAddBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}

        </>
      }

    </div>
  )
}

export default App