const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
    // Blog
    //   .find({})
    //   .then(blogs => {
    //     response.json(blogs)
    //   })
  })
  
blogsRouter.post('/', async (request, response) => {

    const data = request.body

    if(!data.title || !data.url) {
      return response
            .status(400)
            .json({error: "Url or Title missing"})
    }

    const blog = new Blog(data)
    
    const result = blog.save()
    response.status(201).json(result)

    // blog
    //   .save()
    //   .then(result => {
    //     response.status(201).json(result)
    //   })
  })

blogsRouter.delete('/:id', async ( request, response) => {
  const id = request.params.id

  try{
    const deletedEntry = await Blog.findOneAndDelete({_id:id})
    response.status(204).end()
  }
  catch{
    response.status(403).json({error: error})
  }
  // Blog.findOneAndDelete({_id: id})
  //   .then(deletedEntry => {
  //     response.status(204).end()
  //   })
  //   .catch((error) => {
  //     response.status(403).json({error: error})
  //   } )

})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const data = request.body

  const updatedBlogObject = {
    title:data.title,
    author:data.author,
    url:data.url,
    likes:data.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogObject, {new: true})
    response.json(updatedBlog)
  }
  catch {
    response.status(403).end()
  }
  
})


module.exports = blogsRouter;