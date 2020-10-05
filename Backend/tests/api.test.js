const app = require('../app');
const supertest = require('supertest')
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const api = supertest(app)

const blogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]
let token = null;

beforeEach(async () => {
    // Deleted All blogs and Users
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret',10);
    const user = new User({
        username: "root",
        name: "root",
        passwordHash
    });
    // Created One User
    const createdUser = await user.save();    
    const {username, _id, ...discardedData} = createdUser;
    const truncatedCreatedUser = {
        username,
        id:_id
    }
    token = jwt.sign(truncatedCreatedUser, process.env.SECRET);


    let blogObject = new Blog({...blogs[0], user:_id});
    await blogObject.save()

    blogObject = new Blog({...blogs[1], user:_id});
    await blogObject.save()

})

test('Blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('There are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)

})

test('id is defined', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
    })

})

describe('POST request to /api/blogs', () => {

    const newBlogObject = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    }

    const BlogObjectWithoutLikes = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
    }

    const BlogObjectWithoutTitle = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    }

    const BlogObjectWithoutUrl = {
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 10
    }

    const BlogObjectWithoutTitleAndUrl = {
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 10
    }

    

    

    test('adds blog to database', async () => {
        await api.post('/api/blogs')
            .send(newBlogObject)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
        
        const blogListAfterPost = await api.get('/api/blogs')
        expect(blogListAfterPost.body).toHaveLength(3)

    })

    test('saves data correctly', async() => {
        await api.post('/api/blogs')
            .send(newBlogObject)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogListAfterPost = await api.get('/api/blogs')
        const blogCorrectFormat = blogListAfterPost.body.map(blog => {
            return{
                title:blog.title,
                author:blog.author,
                url:blog.url,
                likes:blog.likes
            }
        })
        expect(blogCorrectFormat).toContainEqual(newBlogObject)
        
    })

    test('makes likes 0 if it is not provided', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutLikes)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogListAfterPost = await api.get('/api/blogs')
        const likes = blogListAfterPost.body[2].likes
        expect(likes).toBe(0)
        
    })

    test('without title sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutTitle)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })

    test('without url sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutUrl)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })

    test('without title and url sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutTitleAndUrl)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })

    test('without token sends 401 unauthorized', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutTitleAndUrl)
            .expect(401)
    })

})

test('DELETE request to /api/blogs/:id deleted the resource with given id', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    const blogToDelete = response.body[0]

    await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)
    
    const responseAfterDelete = await api.get('/api/blogs')
    expect(responseAfterDelete).not.toContainEqual(blogToDelete)  
})

test('PUT request to /api/blogs/:id updates the Blog', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    const blogToUpdate = response.body[0]

    let updatedBlogObject = {
        ...blogToUpdate,
        likes:50
    } 

    await api.put(`/api/blogs/${id}`)
        .send(updatedBlogObject)

    
    const blogListAfterPost = await api.get('/api/blogs')
    expect(blogListAfterPost.body[0].likes).toBe(50)

})



afterAll(() => {
    mongoose.connection.close();
}
)
