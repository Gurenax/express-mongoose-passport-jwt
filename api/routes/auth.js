const express = require('express')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Register
router.post(
  '/auth/register',
  // middleware that handles the registration process
  authMiddleware.register,
  // json handler
  authMiddleware.signJWTForUser
)

// Sign in
router.post(
  '/auth',
  // middleware that handles the sign in process
  authMiddleware.signIn,
  // json handler
  authMiddleware.signJWTForUser
)

module.exports = router
