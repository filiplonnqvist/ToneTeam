/**
 * @file Control panel component for piano controls.
 * @module components/control-panel-component/control-panel-component
 * @author Filip Lönnqvist
 * @version 1.0.0
 */

import { createControlPanelTemplate } from './control-panel-component-template.js'

/**
 * A component that provides controls for the piano.
 */
export class ControlPanel {
  #container
  #abortController = new AbortController()
  #isMuted = false
  #currentInstrument = 'piano' // Default instrument

  /**
   * Creates a new instance of control panel.
   *
   * @param {HTMLElement} container - The container element where the panel should be rendered
   */
  constructor (container) {
    this.#container = container
  }

  /**
   * Initializes the control panel component.
   */
  init () {
    this.render()
    this.#setupEventListeners()
  }

  /**
   * Renders the control panel.
   */
  render () {
    this.#container.innerHTML = createControlPanelTemplate(this.#isMuted, this.#currentInstrument)
  }

  /**
   * Sets up event listeners for the control panel.
   *
   * @private
   */
  #setupEventListeners () {
    // Handle all button clicks
    this.#container.addEventListener('click', (event) => {
      // Toggle sound button
      const soundToggle = event.target.closest('#piano-sound-toggle')
      if (soundToggle) {
        this.#toggleSound()
        return
      }

      // Toggle instrument button
      const instrumentToggle = event.target.closest('#instrument-toggle')
      if (instrumentToggle) {
        this.#toggleInstrument()
      }
    }, { signal: this.#abortController.signal })

    // Listen for state changes from piano/synth
    document.addEventListener('piano:sound-state-changed', (event) => {
      if (event.detail && event.detail.isMuted !== undefined) {
        this.#isMuted = event.detail.isMuted
        this.render() // Re-render the component to update the UI
      }
    }, { signal: this.#abortController.signal })
  }

  /**
   * Toggles the piano sound and dispatches event to piano component.
   *
   * @private
   */
  #toggleSound () {
    this.#isMuted = !this.#isMuted
    this.render() // Re-render with new state

    // Dispatch event to piano/synth components
    document.dispatchEvent(new CustomEvent('piano:toggle-sound', {
      detail: { isMuted: this.#isMuted }
    }))
  }

  /**
   * Toggles between piano and synth instruments.
   *
   * @private
   */
  #toggleInstrument () {
    this.#currentInstrument = this.#currentInstrument === 'piano' ? 'synth' : 'piano'
    this.render() // Re-render with new instrument

    // Dispatch event to notify room.ejs about instrument change
    document.dispatchEvent(new CustomEvent('instrument:changed', {
      detail: { instrument: this.#currentInstrument }
    }))
  }

  /**
   * Cleans up resources when the component is no longer needed.
   */
  destroy () {
    this.#abortController.abort()
  }
}
