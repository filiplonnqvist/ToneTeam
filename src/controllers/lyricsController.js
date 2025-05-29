/**
 * @file Lyrics controller handling functions related to lyrics creation and management.
 * @module controllers/lyricsController
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { LyricsModel } from '../models/lyricsModel.js'
import { logger } from '../config/winston.js'
import mongoose from 'mongoose'

/**
 * Creates a new lyrics document.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response with created lyrics.
 */
export const createLyrics = async (req, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      })
    }

    // Check if user has reached maximum lyrics limit
    const userLyricsCount = await LyricsModel.countDocuments({
      owner: req.session.user.uid
    })

    const MAX_LYRICS_PER_USER = 50

    if (userLyricsCount >= MAX_LYRICS_PER_USER) {
      logger.warn(`User ${req.session.user.email} tried to exceed lyrics limit`)
      return res.status(400).json({
        success: false,
        message: `Maximum number of lyrics reached (${MAX_LYRICS_PER_USER}). Please delete some lyrics to create new ones.`
      })
    }

    // Create new lyrics document
    const newLyrics = new LyricsModel({
      title: req.body.title,
      content: req.body.content || '',
      owner: req.session.user.uid // Store Firebase UID from session
    })

    // Save to database
    const savedLyrics = await newLyrics.save()
    logger.info(`New lyrics created: ${savedLyrics.title} by user ${req.session.user.email}`)

    // Return success with the created document
    return res.status(201).json({
      success: true,
      data: savedLyrics
    })
  } catch (error) {
    logger.error('Error creating lyrics:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating lyrics'
    })
  }
}

/**
 * Gets all lyrics for the current user.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response with lyrics array.
 */
export const getUserLyrics = async (req, res, next) => {
  try {
    const userLyrics = await LyricsModel.find({
      owner: req.session.user.uid
    }).sort({ updatedAt: -1 }) // Sort by most recently updated first

    logger.info(`Retrieved ${userLyrics.length} lyrics for user ${req.session.user.email}`)

    return res.status(200).json({
      success: true,
      data: userLyrics
    })
  } catch (error) {
    logger.error('Error retrieving user lyrics:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving lyrics'
    })
  }
}

/**
 * Gets a single lyrics document by ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response with lyrics document.
 */
export const getLyricsById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lyrics ID format'
      })
    }

    // Find lyrics by ID and owner
    const lyrics = await LyricsModel.findOne({
      _id: req.params.id,
      owner: req.session.user.uid
    })

    // Check if lyrics exist
    if (!lyrics) {
      return res.status(404).json({
        success: false,
        message: 'Lyrics not found'
      })
    }

    logger.info(`Retrieved lyrics ${lyrics.title} for user ${req.session.user.email}`)

    return res.status(200).json({
      success: true,
      data: lyrics
    })
  } catch (error) {
    logger.error(`Error retrieving lyrics ID ${req.params.id}:`, error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving lyrics'
    })
  }
}

/**
 * Updates an existing lyrics document.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response with updated lyrics.
 */
export const updateLyrics = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lyrics ID format'
      })
    }

    // Ensure at least one field to update
    if (!req.body.title && req.body.content === undefined) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      })
    }

    // Prepare update object
    const updateData = {}
    if (req.body.title) updateData.title = req.body.title
    if (req.body.content !== undefined) updateData.content = req.body.content

    // Find and update lyrics, ensuring user owns the document
    const updatedLyrics = await LyricsModel.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.session.user.uid
      },
      updateData,
      { new: true } // Return the updated document
    )

    // Check if lyrics exist
    if (!updatedLyrics) {
      return res.status(404).json({
        success: false,
        message: 'Lyrics not found or you do not have permission to update'
      })
    }

    logger.info(`Updated lyrics ${updatedLyrics.title} by user ${req.session.user.email}`)

    return res.status(200).json({
      success: true,
      data: updatedLyrics
    })
  } catch (error) {
    logger.error(`Error updating lyrics ID ${req.params.id}:`, error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating lyrics'
    })
  }
}

/**
 * Deletes a lyrics document.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends JSON response confirming deletion.
 */
export const deleteLyrics = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lyrics ID format'
      })
    }

    // Find and delete lyrics, ensuring user owns the document
    const deletedLyrics = await LyricsModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.session.user.uid
    })

    // Check if lyrics existed
    if (!deletedLyrics) {
      return res.status(404).json({
        success: false,
        message: 'Lyrics not found or you do not have permission to delete'
      })
    }

    logger.info(`Deleted lyrics ${deletedLyrics.title} by user ${req.session.user.email}`)

    return res.status(200).json({
      success: true,
      message: 'Lyrics deleted successfully'
    })
  } catch (error) {
    logger.error(`Error deleting lyrics ID ${req.params.id}:`, error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting lyrics'
    })
  }
}
