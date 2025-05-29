/**
 * @file Firebase error mapping utility.
 * @module utils/firebase-errors
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Maps Firebase authentication error codes to user-friendly messages.
 *
 * @param {string} errorCode - Firebase error code.
 * @returns {object} Object containing field and message properties.
 */
export function firebaseErrors (errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return {
        field: 'email',
        message: 'An account with this email address already exists.'
      }
    case 'auth/invalid-email':
      return {
        field: 'email',
        message: 'Invalid email format.'
      }
    case 'auth/weak-password':
      return {
        field: 'password',
        message: 'Password must be at least 6 characters.'
      }
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        field: 'password',
        message: 'Invalid email or password.'
      }
    case 'auth/too-many-requests':
      return {
        field: 'general',
        message: 'Too many unsuccessful login attempts. Please try again later.'
      }
    default:
      return {
        field: 'general',
        message: 'An unexpected error occurred.'
      }
  }
}
