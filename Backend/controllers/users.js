const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');



usersRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.username){
        return response.status(400).json({
            error: 'Username is missing'
        })
    }

    if(body.username.length < 3){
        return response.status(400).json({
            error: 'Username is too short'
        })
    }

    if(!body.password){
        return response.status(400).json({
            error: 'Password is missing'
        })
    }

    if(body.password.length < 3){
        return response.status(400).json({
            error: 'Password is too short'
        })
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user= new User({
        username: body.username,
        name:body.name,        
        passwordHash
    })
    let savedUser = {a:4}
    try{
        savedUser = await user.save();
        response.json(savedUser);
    }
    catch(errors)
    {
        response.status(400).json({
            error:errors.message
        })
    }  
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.status(200).json(users)
})
module.exports =  usersRouter;
