/**
 * @file Entry point for the piano component module, handling initialization and export.
 * @module components/piano-component/index
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { PianoComponent } from './piano-component.js'
export { PianoComponent }

// Initialize the component when this module is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the piano container exists on the page
  const pianoContainer = document.getElementById('piano-container')
  if (pianoContainer) {
    // Initialize the piano component
    const piano = new PianoComponent(pianoContainer)
    piano.init()
  }
})
