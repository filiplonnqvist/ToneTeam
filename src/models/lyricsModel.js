/**
 * @file Mongoose model for Lyrics documents stored in MongoDB.
 * @module models/lyricsModel
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

/**
 * Schema for a Lyrics document.
 * Represents a lyric sheet stored in the database.
 */
const schema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40
  },

  content: {
    type: String,
    required: false,
    default: '',
    trim: true,
    maxlength: 30000 // Approximately 5-7 pages.
  },

  // Ownership defined by Express session ID.
  owner: {
    type: String,
    required: true,
    ref: 'User' // Adds index for faster searches.
  }
})

// Extend the schema with base properties.
schema.add(BASE_SCHEMA)

// Mongoose model for Lyrics.
export const LyricsModel = mongoose.model('Lyrics', schema)
