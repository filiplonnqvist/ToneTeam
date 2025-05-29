/**
 * @file Router for user-related routes.
 * @module routes/userRouter
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import express from 'express'
import * as userController from '../controllers/userController.js'
import { requireAuth, validateAuthInput } from '../middleware/auth-middleware.js'

export const router = express.Router()

// Auth pages
router.get('/login', userController.showLoginPage)

// Auth API endpoints
router.post('/login', validateAuthInput, (req, res, next) => userController.login(req, res, next))
router.post('/register', validateAuthInput, (req, res, next) => userController.register(req, res, next))
router.post('/logout', userController.logout)

// Route-based auth check example - redirect to login if not authenticated
router.get('/profile', requireAuth, (req, res) => {
  res.redirect('/music-room')
})
