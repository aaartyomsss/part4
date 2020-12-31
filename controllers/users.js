const bcrypt = require('bcrypt')
const { response } = require('../app')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users.map(user => user.toJSON()))
})

userRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('blogs')
    res.json(user)
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password length is less than 3'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)

})

module.exports = userRouter