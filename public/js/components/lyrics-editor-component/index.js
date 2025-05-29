/**
 * @file Entry point for the lyrics editor component module.
 * @module components/lyrics-editor-component/index
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { LyricsEditor } from './lyrics-editor-component.js'
export { LyricsEditor }

// Initialize the component when this module is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the editor container exists on the page
  const editorContainer = document.getElementById('lyrics-editor-container')
  if (editorContainer) {
    // Initialize the lyrics editor component
    const editor = new LyricsEditor(editorContainer)
    editor.init()
  }
})
