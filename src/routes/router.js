/**
 * @file Main router for routing all incoming requests to appropriate controllers.
 * @module routes/router
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import express from 'express'
import * as homeController from '../controllers/homeController.js'
import { checkAuthStatus, requireAuth } from '../middleware/auth-middleware.js'
import { router as userRouter } from './userRouter.js'
import { router as lyricsRouter } from './lyricsRouter.js'

export const router = express.Router()

// Home page
router.get('/', homeController.index)

// User routes
router.use('/users', userRouter)

// Authentification
router.get('/auth/check', checkAuthStatus)

// Piano page
router.get('/music-room', requireAuth, homeController.toPiano)

// Lyrics API routes
router.use('/api/lyrics', lyricsRouter)
