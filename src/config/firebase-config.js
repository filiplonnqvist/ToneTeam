/**
 * @file This module initializes Firebase in the browser
 * @module config/firebase
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

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

export { auth }
