/**
 * @file This module provides middleware for validating lyrics input length.
 * @module middleware/lyrics-middleware
 * @author Filip Lönnqvist
 * @version 2.1.3
 */

import rateLimit from 'express-rate-limit'

/**
 * Rate limiter middleware for lyrics API endpoints.
 * Prevents abuse by limiting the number of requests per user within a time window.
 */
export const lyricsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  /**
   * Generates a unique key for rate limiting based on user session or IP.
   *
   * @param {object} req - Express request object
   * @returns {string} The user's UID from session or IP address as fallback
   */
  keyGenerator: (req) => req.session?.user?.uid || req.ip
})

/**
 * Middleware that validates lyrics input length to prevent malicious requests.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validateLyricsInput = (req, res, next) => {
  const { title, content } = req.body

  if (!title || typeof title !== 'string' || title.length > 40) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input'
    })
  }

  if (content !== undefined && (typeof content !== 'string' || content.length > 30000)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input'
    })
  }

  next()
}
