/**
 * @file Validation functions for user authentication.
 * @module utils/auth-validators
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Validates an email format.
 *
 * @param {string} email - The email to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
export function isValidEmail (email) {
  if (!email) return false
  if (email.length > 254) return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates that passwords match.
 *
 * @param {string} password - The password.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {boolean} True if passwords match, false otherwise.
 */
export function doPasswordsMatch (password, confirmPassword) {
  return password === confirmPassword
}

/**
 * Validates password strength according to Firebase requirements.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password meets strength requirements.
 */
export function isStrongPassword (password) {
  if (!password) return false
  if (password.length < 6 || password.length > 128) return false
  return true
}

/**
 * Complete validation for login data.
 *
 * @param {object} data - Login data.
 * @param {string} data.email - User email.
 * @param {string} data.password - User password.
 * @returns {object} Validation result with success flag and any error messages.
 */
export function validateLogin (data) {
  const { email, password } = data

  if (!isValidEmail(email)) {
    return {
      valid: false,
      field: 'email',
      message: 'Invalid email format.'
    }
  }

  if (!password || password.trim() === '') {
    return {
      valid: false,
      field: 'password',
      message: 'Password is required.'
    }
  }

  return { valid: true }
}

/**
 * Complete validation for registration data.
 *
 * @param {object} data - Registration data.
 * @param {string} data.email - User email.
 * @param {string} data.password - User password.
 * @param {string} data.confirmPassword - Password confirmation.
 * @returns {object} Validation result with success flag and any error messages.
 */
export function validateRegistration (data) {
  const { email, password, confirmPassword } = data

  if (!isValidEmail(email)) {
    return {
      valid: false,
      field: 'email',
      message: 'Invalid email format.'
    }
  }

  if (!isStrongPassword(password)) {
    return {
      valid: false,
      field: 'password',
      message: 'Password must be at least 6 characters.'
    }
  }

  if (!doPasswordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      field: 'confirmPassword',
      message: 'Passwords do not match.'
    }
  }

  return { valid: true }
}
