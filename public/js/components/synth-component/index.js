/**
 * @file Entry point for the synth component module, handling initialization and export.
 * @module components/synth-component/index
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { SynthComponent } from './synth-component.js'
export { SynthComponent }

// Initialize the component when this module is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the synth container exists on the page
  const synthContainer = document.getElementById('synth-container')
  if (synthContainer) {
    // Initialize the synth component
    const synth = new SynthComponent(synthContainer)
    synth.init()
  }
})
