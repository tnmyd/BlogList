const blogsRouter = require('express').Router()
const { request } = require('../app')
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

blogsRouter.delete('/:id', ( request, response) => {
  const id = request.params.id
  Blog.findOneAndDelete({_id: id})
    .then(deletedEntry => {
      response.status(204).end()
    })
    .catch((error) => {
      response.status(403).json({error: error})
    } )

})


module.exports = blogsRouter;