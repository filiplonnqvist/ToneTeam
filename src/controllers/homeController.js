/**
 * @file Home controller handling homepage and related functions.
 * @module controllers/homeController
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { logger } from '../config/winston.js'

/**
 * Display the home page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const index = (req, res, next) => {
  try {
    const user = req.user || null

    if (user) {
      logger.info(`User ${user.email} accessed home page`)
    } else {
      logger.info(`Anonymous user accessed home page from ${req.ip}`)
    }

    res.render('pages/home', {
      title: 'ToneTeam - Create Music Together',
      user: user || null
    })
  } catch (error) {
    logger.error('Error rendering home page:', error)
    next(error)
  }
}

/**
 * Redirect to piano page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const toPiano = (req, res, next) => {
  try {
    logger.info(`User ${req.user.email} accessed piano page`)
    res.render('pages/room', {
      title: 'ToneTeam - Piano',
      user: req.session.user
    })
  } catch (error) {
    logger.error('Error redirecting to piano:', error)
    next(error)
  }
}
