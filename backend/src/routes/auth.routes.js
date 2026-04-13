const express = require('express')
const {
  register,
  login,
  me,
  listUsers,
  updateUserStatus,
  updateUserApproval,
  deleteUser,
} = require('../controllers/auth.controller')
const { authMiddleware } = require('../config/auth')

const router = express.Router()

router.post('/signup', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)
router.get('/users', authMiddleware, listUsers)
router.patch('/users/:userId/status', authMiddleware, updateUserStatus)
router.patch('/users/:userId/approval', authMiddleware, updateUserApproval)
router.delete('/users/:userId', authMiddleware, deleteUser)

module.exports = router
