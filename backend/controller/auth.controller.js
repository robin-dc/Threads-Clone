const asyncHandler = require('express-async-handler')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

const register = asyncHandler(async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            avatar,
            bio,
            location,
            links
        } = req.body

        if(!firstName || !lastName || !email || !password || !avatar || !location) {
            res.status(400)
            throw new Error('Insufficient credentials')
        }

        const isEmailExist = await User.find({email: email})

        if(isEmailExist){
            res.status(400)
            throw new Error('Email already in used')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            avatar,
            bio,
            friends: [],
            profileViews: 0,
            location,
            links
        })

        await newUser.save()

        res.status(201).json({
            firstName,
            lastName,
            email,
            avatar,
            bio,
            location,
            links
        })

    } catch (error) {
       res.status(500)
       throw new Error(error.message)
    }
})

const login = asyncHandler(async (req,res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            res.status(400)
            throw new Error('Insufficient credentials')
        }

        const user = await User.find({email})

        if(!user) {
            res.status(404)
            throw new Error('User not found')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            res.status(400)
            throw new Error('Invalid credentials')
        }

        res.status(200).json({
            firstName: [user.firstName],
            lastName: [user.lastName],
            email: [user.email],
            token: generateToken(user.id)
        })
    } catch (error) {
       res.status(500)
       throw new Error(error.message)
    }
})

const getMe = asyncHandler(async (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})



const generateToken = (id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d'
    })

    return token
}

module.exports = {
    register,
    login,
    getMe
}
