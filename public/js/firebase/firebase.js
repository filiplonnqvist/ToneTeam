/**
 * @file This module initializes Firebase in the browser
 * @module firebase/firebase
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'
import {
  getAuth,
  onAuthStateChanged as firebaseAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAAtyEOiaPuogdK6z7ZmyiVQj9NCFAwJno',
  authDomain: 'toneteam-production.firebaseapp.com',
  projectId: 'toneteam-production',
  storageBucket: 'toneteam-production.firebasestorage.app',
  messagingSenderId: '649703168465',
  appId: '1:649703168465:web:917a0a22ace715bbe7e8f0'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

/**
 * Registers a callback to run when the user's authentication state changes.
 *
 * @param {(user: import('firebase/auth').User | null) => void} callback - Callback function to handle auth state changes.
 * @returns {() => void} Unsubscribe function to stop listening.
 */
function onAuthStateChanged (callback) {
  return firebaseAuthStateChanged(auth, callback)
}

/**
 * Signs the user out of Firebase Authentication.
 * Removes stored token and notifies the backend, then redirects to homepage.
 *
 * @returns {Promise<{success: boolean, error?: string}>} An object with `success: true` if logout completed, or `success: false` and an `error` message if failed.
 */
async function signOut () {
  try {
    await auth.signOut()
    localStorage.removeItem('firebaseToken')

    await fetch('/auth/logout', {
      method: 'POST'
    })

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: error.message || 'An error occurred when logging out'
    }
  }
}

/**
 * Get the current authentication token from localStorage.
 *
 * @returns {string|null} The ID token or null if not available
 */
function getAuthToken () {
  return localStorage.getItem('firebaseToken')
}

export {
  auth,
  onAuthStateChanged,
  signOut,
  getAuthToken
}
