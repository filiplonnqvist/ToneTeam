/**
 * @file UI helper functions for user authentication and error handling.
 * @module utils/auth-feedback
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Highlights an input field to indicate an error.
 * Adds red border and automatically removes it when user starts typing.
 *
 * @param {string} fieldName - Name of the field to highlight (e.g. 'email', 'password').
 * @param {string} [prefix='login'] - Prefix for the field ID (e.g. 'login' or 'register').
 */
export function highlightField (fieldName, prefix = 'login') {
  if (fieldName === 'general') return

  const field = document.getElementById(`${prefix}-${fieldName}`)
  if (field) {
    field.classList.add('border-red-500')
    field.addEventListener('input', function onInput () {
      field.classList.remove('border-red-500')
      field.removeEventListener('input', onInput)
    })
  }
}

/**
 * Shows an error message in the specified element.
 * Also hides any success messages that might be visible.
 *
 * @param {HTMLElement} element - Error element to show message in.
 * @param {string} message - Error message to display.
 */
export function showError (element, message) {
  if (!element) return
  element.textContent = message
  element.classList.remove('hidden')

  const loginSuccess = document.getElementById('login-success')
  if (loginSuccess) {
    loginSuccess.classList.add('hidden')
  }
}

/**
 * Shows a success message in the specified element.
 *
 * @param {HTMLElement} element - Success element to show message in.
 * @param {string} message - Success message to display.
 */
export function showSuccess (element, message) {
  if (!element) return
  element.textContent = message
  element.classList.remove('hidden')
}
