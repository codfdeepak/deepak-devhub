const express = require('express')
const { register, login, me } = require('../controllers/auth.controller')
const { authMiddleware } = require('../config/auth')

const router = express.Router()

router.post('/signup', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)

module.exports = router
