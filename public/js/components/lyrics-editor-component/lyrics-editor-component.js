/**
 * @file Component for editing and saving lyrics.
 * @module components/lyrics-editor-component/lyrics-editor-component
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { createLyricsEditorTemplate } from './lyrics-editor-component-template.js'
import { LyricsService } from '../../services/lyrics-service.js'

/**
 * Component class for managing lyrics editor functionality.
 */
export class LyricsEditor {
  #container
  #lyricsService
  #abortController = new AbortController()
  #currentLyrics = null
  #isVisible = false

  /**
   * Creates a new instance of the lyrics editor component.
   *
   * @param {HTMLElement} container - The container element where the editor should be rendered.
   */
  constructor (container) {
    this.#container = container
    this.#lyricsService = new LyricsService()
  }

  /**
   * Initializes the lyrics editor component.
   */
  async init () {
    try {
      this.#container.style.display = 'none'
      this.#setupEventListeners()
    } catch (error) {
      console.error('Failed to initialize lyrics editor:', error)
    }
  }

  /**
   * Sets up event listeners for the lyrics editor component.
   *
   * @private
   */
  #setupEventListeners () {
    // Listen for custom events from other components
    document.addEventListener('lyrics:create', this.#handleCreateRequest.bind(this), { signal: this.#abortController.signal })
    document.addEventListener('lyrics:selected', this.#handleLyricsSelected.bind(this), { signal: this.#abortController.signal })

    // Event delegation for the container
    this.#container.addEventListener('click', this.#handleClick.bind(this), { signal: this.#abortController.signal })

    // Event delegation for template buttons
    this.#container.addEventListener('click', (event) => {
      const templateBtn = event.target.closest('.template-btn')
      if (templateBtn) {
        this.#insertTemplate(templateBtn)
      }
    }, { signal: this.#abortController.signal })

    // Event delegation for the download button
    this.#container.addEventListener('click', (event) => {
      if (event.target.closest('#download-lyrics-btn')) {
        this.#downloadLyrics()
      }
    }, { signal: this.#abortController.signal })
  }

  /**
   * Handles click events within the lyrics editor component.
   *
   * @param {Event} event - The click event.
   * @private
   */
  #handleClick (event) {
    if (event.target.closest('#save-lyrics-btn')) {
      this.#saveLyrics()
      return
    }

    if (event.target.closest('#cancel-lyrics-btn')) {
      this.#closeEditor()
    }
  }

  /**
   * Handles request to create new lyrics.
   *
   * @private
   */
  #handleCreateRequest () {
    this.#currentLyrics = null
    this.#renderEditor()
    this.#showEditor()
  }

  /**
   * Handles the lyrics:selected event.
   *
   * @param {CustomEvent} event - The custom event with lyrics data.
   * @private
   */
  #handleLyricsSelected (event) {
    if (event.detail && event.detail.lyrics) {
      this.#currentLyrics = event.detail.lyrics
      this.#renderEditor()
      this.#showEditor()
    }
  }

  /**
   * Renders the lyrics editor with current data.
   *
   * @private
   */
  #renderEditor () {
    this.#container.innerHTML = createLyricsEditorTemplate(this.#currentLyrics)
  }

  /**
   * Shows the editor component and sets up enhanced functionality.
   *
   * @private
   */
  #showEditor () {
    this.#container.style.display = 'block'
    this.#isVisible = true

    setTimeout(() => {
      const titleInput = document.getElementById('lyrics-title')
      const textarea = document.getElementById('lyrics-content')

      // Focus title field for new lyrics, otherwise focus content
      if (titleInput && this.#currentLyrics === null) {
        titleInput.focus()
      } else if (textarea) {
        textarea.focus()
      }
    }, 100)
  }

  /**
   * Inserts template text at cursor position.
   *
   * @param {HTMLElement} button - The template button that was clicked.
   * @private
   */
  #insertTemplate (button) {
    const template = button.dataset.template
    const textarea = document.getElementById('lyrics-content')

    if (!textarea || !template) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end)

    // Add newline if not at beginning of empty line
    let insertion = template + '\n'
    if (start > 0 && before.charAt(before.length - 1) !== '\n') {
      insertion = '\n' + insertion
    }

    // Update textarea content
    textarea.value = before + insertion + after

    // Position cursor after insertion
    const newCursorPos = start + insertion.length
    textarea.focus()
    textarea.selectionStart = newCursorPos
    textarea.selectionEnd = newCursorPos
  }

  /**
   * Hides the editor component.
   *
   * @private
   */
  #closeEditor () {
    this.#container.style.display = 'none'
    this.#isVisible = false
    this.#currentLyrics = null
  }

  /**
   * Saves the lyrics (create new or update existing).
   *
   * @private
   */
  async #saveLyrics () {
    const titleInput = document.getElementById('lyrics-title')
    const contentInput = document.getElementById('lyrics-content')

    if (!titleInput || !contentInput) return

    const title = titleInput.value.trim()
    const content = contentInput.value.trim()

    if (!title) {
      alert('Please enter a title for your lyrics.')
      titleInput.focus()
      return
    }

    try {
      const lyricsId = this.#currentLyrics?.id || this.#currentLyrics?._id
      let result

      if (lyricsId) {
        result = await this.#lyricsService.updateLyrics(lyricsId, { title, content })
        document.dispatchEvent(new CustomEvent('lyrics:updated', { detail: { lyrics: result } }))
      } else {
        result = await this.#lyricsService.createLyrics({ title, content })
        document.dispatchEvent(new CustomEvent('lyrics:created', { detail: { lyrics: result } }))
      }

      this.#closeEditor()
    } catch (error) {
      console.error('Error saving lyrics:', error)
      alert('Failed to save lyrics. Please try again.')
    }
  }

  /**
   * Creates and downloads the lyrics as a text file.
   *
   * @private
   */
  #downloadLyrics () {
    const titleInput = document.getElementById('lyrics-title')
    const contentInput = document.getElementById('lyrics-content')

    if (!titleInput || !contentInput) return

    const title = titleInput.value.trim() || 'Untitled'
    const content = contentInput.value

    // Create filename based on title (replace invalid characters)
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`

    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })

    // Create a temporary link for download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Hide the link and add it to DOM
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  }

  /**
   * Cleans up event listeners and resources when the component is no longer needed.
   */
  destroy () {
    this.#abortController.abort()
  }
}
