/**
 * @file Service for handling lyrics data and API communication.
 * @module services/lyrics-service
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Service class for handling lyrics-related operations.
 */
export class LyricsService {
  /**
   * Base URL for lyrics API endpoints.
   *
   * @type {string}
   * @private
   */
  #apiUrl = '/api/lyrics'

  /**
   * Creates a new lyrics document.
   *
   * @async
   * @param {object} lyricsData - The lyrics data to create.
   * @param {string} lyricsData.title - The title of the lyrics.
   * @param {string} [lyricsData.content] - The content of the lyrics.
   * @returns {Promise<object>} The created lyrics object.
   * @throws {Error} If the API request fails.
   */
  async createLyrics (lyricsData) {
    try {
      const response = await fetch(this.#apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lyricsData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to create lyrics')
      }

      return result.data
    } catch (error) {
      console.error('Error creating lyrics:', error)
      throw error
    }
  }

  /**
   * Gets all lyrics for the current user.
   *
   * @async
   * @returns {Promise<Array>} Array of lyrics objects.
   * @throws {Error} If the API request fails.
   */
  async getUserLyrics () {
    try {
      const response = await fetch(this.#apiUrl)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to retrieve lyrics')
      }

      return result.data
    } catch (error) {
      console.error('Error retrieving user lyrics:', error)
      throw error
    }
  }

  /**
   * Gets a single lyrics document by ID.
   *
   * @async
   * @param {string} lyricsId - The ID of the lyrics to retrieve.
   * @returns {Promise<object>} The lyrics object.
   * @throws {Error} If the API request fails.
   */
  async getLyricsById (lyricsId) {
    try {
      const response = await fetch(`${this.#apiUrl}/${lyricsId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to retrieve lyrics')
      }

      return result.data
    } catch (error) {
      console.error(`Error retrieving lyrics ID ${lyricsId}:`, error)
      throw error
    }
  }

  /**
   * Updates an existing lyrics document.
   *
   * @async
   * @param {string} lyricsId - The ID of the lyrics to update.
   * @param {object} updateData - The data to update.
   * @param {string} [updateData.title] - The updated title.
   * @param {string} [updateData.content] - The updated content.
   * @returns {Promise<object>} The updated lyrics object.
   * @throws {Error} If the API request fails.
   */
  async updateLyrics (lyricsId, updateData) {
    try {
      const response = await fetch(`${this.#apiUrl}/${lyricsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to update lyrics')
      }

      return result.data
    } catch (error) {
      console.error(`Error updating lyrics ID ${lyricsId}:`, error)
      throw error
    }
  }

  /**
   * Deletes a lyrics document.
   *
   * @async
   * @param {string} lyricsId - The ID of the lyrics to delete.
   * @returns {Promise<boolean>} True if deletion was successful.
   * @throws {Error} If the API request fails.
   */
  async deleteLyrics (lyricsId) {
    try {
      const response = await fetch(`${this.#apiUrl}/${lyricsId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete lyrics')
      }

      return true
    } catch (error) {
      console.error(`Error deleting lyrics ID ${lyricsId}:`, error)
      throw error
    }
  }
}
