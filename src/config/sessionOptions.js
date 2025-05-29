/**
 * @file Configuration options for Express session middleware.
 * @module config/sessionOptions
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

export const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Do not save session if unmodified
  saveUninitialized: false, // Do not save uninitialized sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // One week
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'strict', // Strict same-site policy to prevent CSRF attacks
    secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
  }
}
