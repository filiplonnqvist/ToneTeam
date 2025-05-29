// __tests__/auth-validators.test.js
import { isValidEmail, validateLogin } from '../public/js/utils/auth-validators.js'

// This function checks if the email format is valid
describe('isValidEmail', () => {
  test('should return true for valid email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.com')).toBe(true)
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true)
  })

  test('should return false for invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('test')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('test@example')).toBe(false)
    expect(isValidEmail('test@.com')).toBe(false)
  })
})

// This function checks if the email is valid and if the password is provided
describe('validateLogin', () => {
  test('should validate correct login data', () => {
    const validData = {
      email: 'user@example.com',
      password: 'password123'
    }
    expect(validateLogin(validData).valid).toBe(true)
  })

  test('should fail with invalid email', () => {
    const invalidEmail = {
      email: 'invalid-email',
      password: 'password123'
    }
    const result = validateLogin(invalidEmail)
    expect(result.valid).toBe(false)
    expect(result.field).toBe('email')
  })

  test('should fail with empty password', () => {
    const emptyPassword = {
      email: 'user@example.com',
      password: ''
    }
    const result = validateLogin(emptyPassword)
    expect(result.valid).toBe(false)
    expect(result.field).toBe('password')
  })
})
