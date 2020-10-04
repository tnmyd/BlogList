const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
    // Blog
    //   .find({})
    //   .then(blogs => {
    //     response.json(blogs)
    //   })
  })
  
blogsRouter.post('/', async (request, response) => {

    const data = request.body;
    const token = request.token;
    if(!token) {
      return response
              .status(401)
              .json({
                error:'token missing'
              })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    
    if (!decodedToken.id) {
        return response
          .status(401)
          .json({ 
            error: 'token invalid' 
          })  
        }  
    const user = await User.findById(decodedToken.id);


    if(!data.title || !data.url) {
      return response
            .status(400)
            .json({error: "Url or Title missing"})
    }

    if(!user) {
      return response
              .status(400)
              .json({error: "User is missing"})
    }

  

    const blog = new Blog({
      title:data.title,
      author: data.author,
      user: user._id,
      url: data.url,
      likes: data.likes
    })
    
    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result)

    
    

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