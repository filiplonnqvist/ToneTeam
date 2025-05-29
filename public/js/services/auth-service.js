/**
 * @file Auth service handling UI interactions for authentication
 * @module services/auth-service
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { onAuthStateChanged } from '../firebase/firebase.js'
import { validateLogin, validateRegistration } from '../utils/auth-validators.js'
import { showError, showSuccess, highlightField } from '../utils/auth-feedback.js'

/**
 * Initializes authentication service and UI.
 *
 * @param {object} options - Configuration options.
 * @param {Function} options.onAuthenticated - Callback when user is authenticated.
 * @param {Function} options.onAuthFailed - Callback when authentication fails.
 */
export function initAuthService (options = {}) {
  onAuthStateChanged(user => {
    if (user) {
      if (typeof options.onAuthenticated === 'function') {
        options.onAuthenticated(user)
      }
    } else {
      if (typeof options.onAuthFailed === 'function') {
        options.onAuthFailed()
      }
      setupAuthUI()
    }
  })
}

/**
 * Sets up authentication UI elements and event listeners.
 *
 * @private
 */
function setupAuthUI () {
  const loginTab = document.getElementById('login-tab')
  const loginContainer = document.getElementById('login-container')
  const loginForm = document.getElementById('login-form')
  const loginError = document.getElementById('login-error')
  const loginSuccess = document.getElementById('login-success')

  const registerTab = document.getElementById('register-tab')
  const registerContainer = document.getElementById('register-container')
  const registerForm = document.getElementById('register-form')
  const registerError = document.getElementById('register-error')

  if (!loginTab || !registerTab) return

  // Configure tab switching
  loginTab.addEventListener('click', () => {
    loginContainer.classList.remove('hidden')
    loginTab.classList.add('text-gray-800', 'border-blue-500')
    loginTab.classList.remove('text-gray-500', 'border-transparent')

    registerContainer.classList.add('hidden')
    registerTab.classList.add('text-gray-500', 'border-transparent')
    registerTab.classList.remove('text-gray-800', 'border-blue-500')
  })

  registerTab.addEventListener('click', () => {
    loginContainer.classList.add('hidden')
    loginTab.classList.add('text-gray-500', 'border-transparent')
    loginTab.classList.remove('text-gray-800', 'border-blue-500')

    registerContainer.classList.remove('hidden')
    registerTab.classList.add('text-gray-800', 'border-blue-500')
    registerTab.classList.remove('text-gray-500', 'border-transparent')
  })

  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('registration_success')) {
    showSuccess(loginSuccess, 'Account successfully created. Please log in.')
    // Remove the parameter from the URL without reloading the page
    const newUrl = window.location.pathname + window.location.hash
    window.history.replaceState({}, document.title, newUrl)
  }

  setupLoginForm(loginForm, loginError, loginSuccess)
  setupRegisterForm(registerForm, registerError)

  const serverRegisterError = document.querySelector('[data-server-register-error]')
  if (serverRegisterError && serverRegisterError.textContent.trim()) {
    showError(registerError, serverRegisterError.textContent)
    registerTab.click()
  }
}

/**
 * Sets up login form handling.
 *
 * @param {HTMLFormElement} form - The login form element.
 * @param {HTMLElement} errorElement - Element to display error messages.
 * @private
 */
function setupLoginForm (form, errorElement) {
  if (!form) return

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const submitButton = document.getElementById('login-submit')

    try {
      // Disable button to prevent multiple submissions
      submitButton.disabled = true
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed')

      const email = document.getElementById('login-email').value
      const password = document.getElementById('login-password').value

      const validation = validateLogin({ email, password })
      if (!validation.valid) {
        showError(errorElement, validation.message)
        highlightField(validation.field)
        return
      }

      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = data.redirectUrl
      } else {
        showError(errorElement, data.message)
        if (data.field) highlightField(data.field)
      }
    } catch (error) {
      console.error('Login error:', error)
      showError(errorElement, 'A connection error occurred')
    } finally {
      submitButton.disabled = false
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed')
    }
  })
}

/**
 * Sets up register form handling.
 *
 * @param {HTMLFormElement} form - The register form element.
 * @param {HTMLElement} errorElement - Element to display error messages.
 * @private
 */
function setupRegisterForm (form, errorElement) {
  if (!form) return

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const submitButton = document.getElementById('register-submit')

    try {
      // Disable button to prevent multiple submissions
      submitButton.disabled = true
      submitButton.classList.add('opacity-70', 'cursor-not-allowed')

      const email = document.getElementById('register-email').value
      const password = document.getElementById('register-password').value
      const confirmPassword = document.getElementById('register-password-confirm').value

      const validation = validateRegistration({ email, password, confirmPassword })
      if (!validation.valid) {
        showError(errorElement, validation.message)
        highlightField(validation.field, 'register')
        return
      }

      const response = await fetch('/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email, password, confirmPassword })
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = data.redirectUrl
      } else {
        showError(errorElement, data.message)
        if (data.field) highlightField(data.field, 'register')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showError(errorElement, 'A connection error occurred')
    } finally {
      submitButton.disabled = false
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed')
    }
  })
}
