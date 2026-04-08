const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const { signToken } = require('../config/auth')

const normalizeRole = (role) => {
  const value = String(role || 'partner').toLowerCase().trim()
  if (value === 'owner') return 'owner'
  if (value === 'admin') return 'admin'
  return 'partner'
}

const getRole = (user) => normalizeRole(user?.role)

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  mobile: user.mobile,
  company: user.company,
  role: getRole(user),
  createdAt: user.createdAt,
})

const register = async (req, res) => {
  try {
    const { fullName, mobile, password, company, email, role } = req.body

    if (!fullName || !mobile || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const existing = await User.findOne({ mobile })
    if (existing) {
      return res.status(409).json({ message: 'Mobile already registered' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashed,
      company,
      role: normalizeRole(role),
    })

    const token = signToken({ sub: user._id, mobile: user.mobile, role: getRole(user) })

    return res.status(201).json({
      user: sanitizeUser(user),
      token,
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Missing mobile or password' })
    }

    const user = await User.findOne({ mobile })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken({ sub: user._id, mobile: user.mobile, role: getRole(user) })

    return res.json({
      user: sanitizeUser(user),
      token,
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ user: sanitizeUser(user) })
  } catch (err) {
    console.error('Profile error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login, me }
