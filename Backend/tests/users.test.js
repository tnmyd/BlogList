const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const helper = require('./test_helper');


beforeEach(async() => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret',10);
    const user = new User({
        username: "root",
        name: "root",
        passwordHash
    });

    await user.save();
})

describe('GET request to /api/users/', () => {
    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

    const userWithoutUsername = {
        name: 'Tanmoy Das',
        password: 'skret'
    }

    const userWithoutPassword = {
        name: 'Tanmoy Das',
        username: 'tanmoydas'
    }

    test('adds an user', async () => {
        const usersAtStart = await helper.usersInDb();
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test("doesn't add user when username is missing", async () => {
        const usersAtStart = await helper.usersInDb();
    
        await api
          .post('/api/users')
          .send(userWithoutUsername)
          .expect(400)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("doesn't add user when password is missing", async () => {
        const usersAtStart = await helper.usersInDb();
    
        await api
          .post('/api/users')
          .send(userWithoutPassword)
          .expect(400)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('does not add user if username already taken with proper statuscode and message ', async () => {
        const usersAtStart = await helper.usersInDb();
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('`username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
})



afterAll(() => {
    mongoose.connection.close();
})
