const express = require('express');
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')

const {
    login,
    register,
    getMe
} = require('../controller/auth.controller')

router.get('/', login)
router.get('/register', register)
router.get('/me', verifyToken, getMe)

module.exports = router
