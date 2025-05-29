/**
 * @file Router for lyrics-related routes.
 * @module routes/lyricsRouter
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import express from 'express'
import * as lyricsController from '../controllers/lyricsController.js'
import { requireAuth } from '../middleware/auth-middleware.js'
import { validateLyricsInput, lyricsRateLimiter } from '../middleware/lyrics-middleware.js'

export const router = express.Router()

// Alla routes skyddas med requireAuth middleware i produktion
router.use(requireAuth, lyricsRateLimiter)

// CRUD Routes
router.post('/', validateLyricsInput, (req, res, next) => lyricsController.createLyrics(req, res, next))
router.get('/', (req, res, next) => lyricsController.getUserLyrics(req, res, next))
router.get('/:id', (req, res, next) => lyricsController.getLyricsById(req, res, next))
router.put('/:id', validateLyricsInput, (req, res, next) => lyricsController.updateLyrics(req, res, next))
router.delete('/:id', (req, res, next) => lyricsController.deleteLyrics(req, res, next))
