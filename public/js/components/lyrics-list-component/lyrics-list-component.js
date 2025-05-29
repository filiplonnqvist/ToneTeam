/**
 * @file Component for displaying and managing a list of lyrics.
 * @module components/lyrics-list-component/lyrics-list-component
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { createLyricsListTemplate } from './lyrics-list-component-template.js'
import { LyricsService } from '../../services/lyrics-service.js'

/**
 * Component class for managing lyrics list functionality.
 */
export class LyricsList {
  #container
  #lyricsService
  #abortController = new AbortController()
  #lyrics = []

  /**
   * Creates a new instance of the lyrics list component.
   *
   * @param {HTMLElement} container - The container element where the list should be rendered.
   */
  constructor (container) {
    this.#container = container
    this.#lyricsService = new LyricsService()
  }

  /**
   * Initializes the lyrics list component.
   */
  async init () {
    try {
      this.render([])

      await this.loadLyrics()

      this.#setupEventListeners()
    } catch (error) {
      console.error('Failed to initialize lyrics list:', error)
    }
  }

  /**
   * Loads lyrics data from the server and updates the UI.
   */
  async loadLyrics () {
    try {
      const lyrics = await this.#lyricsService.getUserLyrics()
      this.#lyrics = lyrics
      this.render(lyrics)
    } catch (error) {
      console.error('Error loading lyrics:', error)
    }
  }

  /**
   * Renders the lyrics list with the provided data.
   *
   * @param {Array} lyrics - Array of lyrics objects to render.
   */
  render (lyrics) {
    this.#container.innerHTML = createLyricsListTemplate(lyrics)
  }

  /**
   * Sets up event listeners for the lyrics list component.
   *
   * @private
   */
  #setupEventListeners () {
    this.#container.addEventListener('click', this.#handleClick.bind(this), { signal: this.#abortController.signal })

    document.addEventListener('lyrics:created', this.#handleLyricsCreated.bind(this), { signal: this.#abortController.signal })
    document.addEventListener('lyrics:updated', this.#handleLyricsUpdated.bind(this), { signal: this.#abortController.signal })
    document.addEventListener('lyrics:new', this.#handleNewLyricsRequest.bind(this), { signal: this.#abortController.signal })
  }

  /**
   * Handles click events within the lyrics list component.
   *
   * @param {Event} event - The click event.
   * @private
   */
  #handleClick (event) {
    // Delete lyrics button
    if (event.target.closest('.delete-lyrics-btn')) {
      const lyricsItem = event.target.closest('.lyrics-item')
      if (lyricsItem) {
        const lyricsId = lyricsItem.dataset.id
        this.#handleDeleteLyrics(lyricsId)
      }
      return
    }

    // Clicking on a lyrics item (not on a button)
    const lyricsItem = event.target.closest('.lyrics-item')
    if (lyricsItem && !event.target.closest('button')) {
      const lyricsId = lyricsItem.dataset.id
      this.#handleEditLyrics(lyricsId)
    }
  }

  /**
   * Handles request to create new lyrics.
   *
   * @private
   */
  #handleNewLyricsRequest () {
    document.dispatchEvent(new CustomEvent('lyrics:create'))
  }

  /**
   * Handles editing an existing lyrics document.
   *
   * @param {string} lyricsId - The ID of the lyrics to edit.
   * @private
   */
  async #handleEditLyrics (lyricsId) {
    try {
      const lyrics = await this.#lyricsService.getLyricsById(lyricsId)

      document.dispatchEvent(new CustomEvent('lyrics:selected', {
        detail: { lyrics }
      }))
    } catch (error) {
      console.error(`Error editing lyrics ${lyricsId}:`, error)
    }
  }

  /**
   * Handles deleting a lyrics document.
   *
   * @param {string} lyricsId - The ID of the lyrics to delete.
   * @private
   */
  async #handleDeleteLyrics (lyricsId) {
    try {
      if (confirm('Are you sure you want to delete this lyrics?')) {
        await this.#lyricsService.deleteLyrics(lyricsId)

        await this.loadLyrics()

        document.dispatchEvent(new CustomEvent('lyrics:deleted', {
          detail: { lyricsId }
        }))
      }
    } catch (error) {
      console.error(`Error deleting lyrics ${lyricsId}:`, error)
    }
  }

  /**
   * Handles the lyrics:created event.
   *
   * @param {CustomEvent} event - The custom event.
   * @private
   */
  async #handleLyricsCreated (event) {
    await this.loadLyrics()
  }

  /**
   * Handles the lyrics:updated event.
   *
   * @param {CustomEvent} event - The custom event.
   * @private
   */
  async #handleLyricsUpdated (event) {
    await this.loadLyrics()
  }

  /**
   * Cleans up event listeners and resources when the component is no longer needed.
   */
  destroy () {
    this.#abortController.abort()
  }
}
