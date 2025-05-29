/**
 * @file This module provides middleware and handlers for Firebase Authentication.
 * @module middleware/auth-middleware
 * @author Filip Lönnqvist
 * @version 2.1.3
 */

import { logger } from '../config/winston.js'

/**
 * Middleware that validates authentication input length to prevent malicious requests.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password length constraints
  if (!email || email.length > 254 || !password || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input'
    })
  }

  next()
}

/**
 * Middleware that protects routes by verifying if the user is authenticated via session.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    logger.info(`Authenticated access: ${req.session.user.email} accessing ${req.originalUrl}`)
    req.user = req.session.user
    res.locals.user = req.session.user
    return next()
  }
  res.redirect('/')
}

/**
 * Route handler that checks if a user is authenticated based on session.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
export const checkAuthStatus = (req, res) => {
  try {
    if (req.session && req.session.user) {
      return res.json({
        authenticated: true,
        user: {
          uid: req.session.user.uid,
          email: req.session.user.email
        }
      })
    }

    return res.json({ authenticated: false })
  } catch (error) {
    logger.error('Auth status check failed:', error)
    return res.json({ authenticated: false })
  }
}
