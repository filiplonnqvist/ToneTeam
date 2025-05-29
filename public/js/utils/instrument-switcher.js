/**
 * @file Instrument switcher utility for toggling between piano and synth views.
 * @module utils/instrument-switcher
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Initializes event listener for switching between instrument views (piano and synth).
 *
 * @function
 * @name initInstrumentSwitcher
 * @returns {void}
 */
export function initInstrumentSwitcher () {
  document.addEventListener('DOMContentLoaded', () => {
    const pianoContainer = document.getElementById('piano-container')
    const synthContainer = document.getElementById('synth-container')

    document.addEventListener('instrument:changed', (event) => {
      if (event.detail.instrument === 'synth') {
        pianoContainer.classList.add('hidden')
        pianoContainer.classList.remove('flex')
        synthContainer.classList.remove('hidden')
        synthContainer.classList.add('flex')
      } else {
        pianoContainer.classList.remove('hidden')
        pianoContainer.classList.add('flex')
        synthContainer.classList.add('hidden')
        synthContainer.classList.remove('flex')
      }
    })
  })
}
