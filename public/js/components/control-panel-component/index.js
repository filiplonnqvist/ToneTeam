/**
 * @file Entry point for the control panel component module.
 * @module components/control-panel-component/index
 * @author Filip Lönnqvist
 * @version 1.0.0
 */

import { ControlPanel } from './control-panel-component.js'
export { ControlPanel }

// Initialize the component when this module is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the control panel container exists on the page
  const controlPanelContainer = document.getElementById('control-panel-container')
  if (controlPanelContainer) {
    // Initialize the control panel component
    const controlPanel = new ControlPanel(controlPanelContainer)
    controlPanel.init()
  }
})
