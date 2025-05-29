/**
 * @file User controller handling authentication and user-related functions.
 * @module controllers/userController
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { logger } from '../config/winston.js'
import { auth } from '../config/firebase-config.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseErrors } from '../utils/firebase-errors.js'
/**
 * Renders the login/registration page.
 *
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const showLoginPage = (req, res, next) => {
  try {
    res.render('pages/login', {
      title: 'ToneTeam - Log in or register',
      error: null
    })
  } catch (error) {
    logger.error('Error rendering login page:', error)
    next(error)
  }
}

/**
 * Handles user login. This route assumes that Firebase token verification has already occurred.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response indicating success/failure.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const userCredentials = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredentials.user

    req.session.user = {
      uid: user.uid,
      email: user.email
    }

    return res.status(200).json({
      success: true,
      redirectUrl: '/music-room'
    })
  } catch (error) {
    logger.error('Login error:', error)

    const { field, message } = firebaseErrors(error.code)

    return res.status(400).json({
      success: false,
      field,
      message
    })
  }
}

/**
 * Handles user registration.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response indicating success/failure.
 */
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    logger.info(`New user registered: ${user.email}`)

    return res.status(201).json({
      success: true,
      redirectUrl: '/?registration_success=true'
    })
  } catch (error) {
    logger.error('Registration error:', error)

    const { field, message } = firebaseErrors(error.code)

    return res.status(400).json({
      success: false,
      field,
      message
    })
  }
}

/**
 * Handles user logout.
 *
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends JSON response indicating logout result.
 */
export const logout = (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) {
        logger.error('Session destruction error:', err)
        return res.status(500).json({
          success: false,
          message: 'Logout failed: Could not destroy session'
        })
      }

      return res.status(200).json({
        success: true,
        redirectUrl: '/',
        message: 'Logout successful'
      })
    })
  } catch (error) {
    logger.error('Logout error:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout'
    })
  }
}
