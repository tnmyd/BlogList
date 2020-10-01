const app = require('../app');
const supertest = require('supertest')
const mongoose = require('mongoose');
const blog = require('../models/blog')
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

beforeEach(async () => {
    await blog.deleteMany({})

    let blogObject = new blog(blogs[0]);
    await blogObject.save()

    blogObject = new blog(blogs[1]);
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
            .expect(201)

        
        const blogListAfterPost = await api.get('/api/blogs')
        expect(blogListAfterPost.body).toHaveLength(3)

    })

    test('saves data correctly', async() => {
        await api.post('/api/blogs')
            .send(newBlogObject)
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
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogListAfterPost = await api.get('/api/blogs')
        const likes = blogListAfterPost.body[2].likes
        expect(likes).toBe(0)
        
    })

    test('without title sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutTitle)
            .expect(400)
    })

    test('without url sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutUrl)
            .expect(400)
    })

    test('without title and url sends status code 400', async() => {
        await api.post('/api/blogs')
            .send(BlogObjectWithoutTitleAndUrl)
            .expect(400)
    })

})

afterAll(() => {
    mongoose.connection.close();
}
)
