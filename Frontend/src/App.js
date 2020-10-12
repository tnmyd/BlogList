import React, { useState, useEffect, useRef } from 'react'
import AddBlog from './components/AddBlog'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import './App.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const addBlogRef = useRef();


  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)

      setBlogs(sortedBlogs)
    })
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


  return (
    <div>
      {errorMessage && <Notification message={errorMessage} type="failure" />}
      {message && <Notification message={message} type="success" />}
      
      <LoginForm user={user} setUser={setUser} setErrorMessage={setErrorMessage}/>
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