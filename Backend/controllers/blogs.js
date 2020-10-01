const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {

    const data = request.body

    if(!data.title || !data.url) {
      return response
            .status(400)
            .json({error: "Url or Title missing"})
    }

    const blog = new Blog(data)

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

module.exports = blogsRouter;