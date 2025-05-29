/**
 * @file Main server application file for ToneTeam.
 * @module server
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import session from 'express-session'
import 'dotenv/config'
import { connectToDatabase } from './config/mongoose.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from './config/winston.js'
import { router } from './routes/router.js'
import { sessionOptions } from './config/sessionOptions.js'

try {
  await connectToDatabase(process.env.DB_CONNECTION_STRING)
  const app = express()

  app.use(helmet())

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://www.gstatic.com',
          'https://*.firebaseio.com',
          'https://cdn.tailwindcss.com',
          'https://www.googleapis.com',
          'https://identitytoolkit.googleapis.com',
          'https://securetoken.googleapis.com'
        ],
        styleSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          "'unsafe-inline'",
          'https://cdn.tailwindcss.com',
          'https://fonts.googleapis.com'
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com'
        ],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://www.googleusercontent.com'
        ],
        connectSrc: [
          "'self'",
          'wss:',
          'https://*.firebaseio.com',
          'https://firebaseinstallations.googleapis.com',
          'https://identitytoolkit.googleapis.com',
          'https://securetoken.googleapis.com',
          'https://www.googleapis.com',
          'https://apis.google.com',
          'https://cdn.tailwindcss.com',
          'https://raw.githubusercontent.com'
        ],
        frameSrc: [
          'https://accounts.google.com',
          'https://apis.google.com',
          'https://toneteam-lnu.firebaseapp.com',
          'https://toneteam-components.firebaseapp.com',
          'https://*.firebaseapp.com',
          'http://localhost'],
        formAction: ["'self'"],
        objectSrc: ["'none'"]
      }
    })
  )

  // Get the directory name of this module's path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'main'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  // Handle JSON data.
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(session(sessionOptions))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    if (req.session.user) {
      res.locals.user = req.session.user
    }
    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    next()
  })

  // Register routes.
  app.use('/', router)

  // Catch 404 and send to the error handler
  app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
  })

  // Error handler.
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    // 404 Not Found.
    if (err.status === 404) {
      res
        .status(404)
        .render('errors/error', { error: { status: 404, message: 'Sidan kunde inte hittas' } })
      return
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
      res
        .status(500)
        .render('pages/error', { error: { status: 500, message: 'Serverfel' } })
      return
    }

    // Development error handler - visar detaljerad felinformation
    res
      .status(err.status || 500)
      .render('pages/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
