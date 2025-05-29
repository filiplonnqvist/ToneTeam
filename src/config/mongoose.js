/**
 * @file This module contains the configuration for the Mongoose ODM.
 * @module config/mongoose
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import mongoose from 'mongoose'

/**
 * Establishes a connection to a MongoDB database using Mongoose.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<mongoose.Mongoose>} Resolves to a Mongoose instance if connection succeeded.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  // Enable strict mode, causing errors to be thrown instead of allowing bad data.
  mongoose.set('strict', 'throw')

  // Enable strict mode for query filters to enforce schema rules.
  mongoose.set('strictQuery', true)

  // Bind event listeners to monitor connection status.
  connection.on('connected', () => console.log('Mongoose connected to MongoDB.'))
  connection.on('error', (err) => console.error(`Mongoose connection error: ${err}`))
  connection.on('disconnected', () => console.log('Mongoose disconnected from MongoDB.'))

  // Ensure the connection is closed when the Node.js process exits.
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close()
        console.log(`Mongoose disconnected from MongoDB through ${signalEvent}.`)
        process.exit(0)
      })()
    })
  }

  // Attempt to connect to the MongoDB server.
  console.log('Mongoose connecting to MongoDB.')
  return mongoose.connect(connectionString)
}
