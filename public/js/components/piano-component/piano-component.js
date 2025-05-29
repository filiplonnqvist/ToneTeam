/**
 * @file Interactive piano component using Web Audio API.
 * @module components/piano-component/piano-component
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { createPianoTemplate } from './piano-component-template.js'

/**
 * A piano component that creates an interactive piano interface.
 */
export class PianoComponent {
  #container
  #audioContext
  #sounds
  #whiteKeys
  #blackKeys
  #isMuted = false
  #isActive = true
  #abortController = new AbortController()
  #keyboardMap = {
    q: 'C4',
    w: 'D4',
    e: 'E4',
    r: 'F4',
    t: 'G4',
    y: 'A4',
    u: 'B4',
    i: 'C5',
    o: 'D5',
    p: 'E5',
    2: 'C#4',
    3: 'D#4',
    5: 'F#4',
    6: 'G#4',
    7: 'A#4',
    9: 'C#5',
    0: 'D#5'
  }

  /**
   * Creates a new instance of the piano.
   *
   * @param {HTMLElement} container - The container element where the piano should be rendered
   */
  constructor (container) {
    this.#container = container
  }

  /**
   * Initializes the piano component with HTML, loads audio and sets up event listeners.
   */
  async init () {
    this.#container.innerHTML = createPianoTemplate()

    this.#whiteKeys = this.#container.querySelectorAll('.white-key')
    this.#blackKeys = this.#container.querySelectorAll('.black-key')

    const audioData = await this.#loadPianoSounds()
    if (audioData) {
      this.#audioContext = audioData.audioContext
      this.#sounds = audioData.sounds
    }

    this.#setupEventListeners()
  }

  /**
   * Loads and decodes sound samples for piano playback.
   *
   * @private
   * @async
   * @returns {Promise<{audioContext: AudioContext, sounds: object}>} Object containing AudioContext and audio buffers.
   * @throws {Error} If loading or decoding the audio fails.
   */
  async #loadPianoSounds () {
    try {
      const samples = [
        '/js/components/piano-component/samples/C4.wav',
        '/js/components/piano-component/samples/C5.wav'
      ]

      // Initialize Web Audio API context with fallback for older browsers
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Fetch both audio files in parallel for better performance
      const responses = await Promise.all(samples.map(url => fetch(url)))

      // Convert fetched responses to ArrayBuffer format (raw binary audio data)
      const audioData = await Promise.all(responses.map(response => response.arrayBuffer()))

      // Decode raw audio data to a format usable by Web Audio API
      const audioBuffers = await Promise.all(
        audioData.map(data => audioContext.decodeAudioData(data)))

      // Return both the audio context and the decoded sounds
      return {
        audioContext,
        sounds: {
          C4: audioBuffers[0],
          C5: audioBuffers[1]
        }
      }
    } catch (error) {
      console.log('Cannot load piano samples:', error)
    }
  }

  /**
   * Configures event listeners for both mouse and keyboard interactions.
   *
   * @private
   */
  #setupEventListeners () {
    const allKeys = [...this.#whiteKeys, ...this.#blackKeys]

    allKeys.forEach(key => {
      key.addEventListener('mousedown', () => {
        const note = key.dataset.note
        key.classList.add('bg-[#ddd]', 'transform', 'translate-y-[2px]')
        this.#playNote(note)
      }, { signal: this.#abortController.signal })

      key.addEventListener('mouseup', () => {
        key.classList.remove('bg-[#ddd]', 'transform', 'translate-y-[2px]')
      }, { signal: this.#abortController.signal })

      key.addEventListener('mouseleave', () => {
        key.classList.remove('bg-[#ddd]', 'transform', 'translate-y-[2px]')
      }, { signal: this.#abortController.signal })
    })

    // If the instrument is changed to piano, activate the component
    document.addEventListener('instrument:changed', (event) => {
      this.#isActive = (event.detail.instrument === 'piano')
    }, { signal: this.#abortController.signal })

    window.addEventListener('keydown', (event) => {
      if (event.repeat || !this.#isActive) return

      const note = this.#keyboardMap[event.key]
      if (note) {
        const pianoKey = this.#container.querySelector(`[data-note="${note}"]`)
        if (pianoKey) {
          pianoKey.classList.add('bg-[#ddd]', 'transform', 'translate-y-[2px]')
          this.#playNote(note)
        }
      }
    }, { signal: this.#abortController.signal })

    window.addEventListener('keyup', (event) => {
      if (!this.#isActive) return

      const note = this.#keyboardMap[event.key]
      if (note) {
        const pianoKey = this.#container.querySelector(`[data-note="${note}"]`)
        if (pianoKey) {
          pianoKey.classList.remove('bg-[#ddd]', 'transform', 'translate-y-[2px]')
        }
      }
    }, { signal: this.#abortController.signal })

    document.addEventListener('piano:toggle-sound', (event) => {
      if (event.detail && event.detail.isMuted !== undefined) {
        this.#isMuted = event.detail.isMuted

        document.dispatchEvent(new CustomEvent('piano:sound-state-changed', {
          detail: { isMuted: this.#isMuted }
        }))
      }
    }, { signal: this.#abortController.signal })
  }

  /**
   * Plays a specific piano note with the correct pitch.
   *
   * @private
   * @param {string} note - Tone which should be played (t.ex. 'C4', 'F#4', 'A5')
   */
  #playNote (note) {
    // If the sound is muted, do not play any sound
    if (this.#isMuted) return

    // Extract the octave number from the end of the note string
    const octave = note.slice(-1)

    // Extract the note name without the octave
    const noteName = note.slice(0, -1)

    let baseSound
    if (octave === '5') {
      baseSound = this.#sounds.C5
    } else {
      baseSound = this.#sounds.C4
    }

    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    // Calculate how many semitones to shift from the base tone
    const semitone = noteOrder.indexOf(noteName)

    // Create a new audio buffer source for a specific note
    const source = this.#audioContext.createBufferSource()

    source.buffer = baseSound
    source.detune.value = semitone * 100
    source.connect(this.#audioContext.destination)
    source.start()
  }

  /**
   * Releases resources when the component is no longer needed.
   */
  destroy () {
    this.#abortController.abort()
    if (this.#audioContext) {
      this.#audioContext.close()
    }
  }
}
