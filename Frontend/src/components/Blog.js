import React, { useState } from 'react'
import blogs from '../services/blogs';
const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleLikes = blog => {
    blogs.updateBlog({
      user:blog.user.id,
      likes:blog.likes + 1,
      author:blog.author,
      title:blog.title,
      url:blog.url
    },blog.id)
  }

  const details = () => (
    <div>
      <h2>{blog.title}<button onClick={()=> setDetailsVisible(!detailsVisible)}>hide</button></h2>
      <a href={blog.url}>{blog.url}</a>
      <p>likes {blog.likes}<button onClick={() => handleLikes(blog)}>like</button></p>
      <p>{blog.author}</p>
    </div>
  )


  return (
    <div>
      {
        detailsVisible
          ? details()
          : <>
          {blog.title} &nbsp;
          {blog.author}
          <button onClick={()=> setDetailsVisible(!detailsVisible)}>view</button>
        </>
   }

    </div>
  )
}

export default Blog
