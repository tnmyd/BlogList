import React, { useState } from 'react'
import blogs from '../services/blogs';
const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);


  const details = () => (
    <div>
      <h2>{blog.title}<button onClick={()=> setDetailsVisible(!detailsVisible)}>hide</button></h2>
      <a href={blog.url}>{blog.url}</a>
      <p>likes {blog.likes}<button>like</button></p>
      <p>{blog.author}</p>
    </div>
  )

  const showDetails = (event) => {

  }


  return (
    <div>
      {
        detailsVisible
          ? details()
          : <>
          {blog.title}
          {blog.author}
          <button onClick={()=> setDetailsVisible(!detailsVisible)}>view</button>
        </>
   }

    </div>
  )
}

export default Blog
