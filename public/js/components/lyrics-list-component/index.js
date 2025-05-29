/**
 * @file Entry point for the lyrics list component module.
 * @module components/lyrics-list-component/index
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

import { LyricsList } from './lyrics-list-component.js'
export { LyricsList }

// Initialize the component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const lyricsListContainer = document.getElementById('lyrics-list-container')
  if (lyricsListContainer) {
    const lyricsList = new LyricsList(lyricsListContainer)
    lyricsList.init()
  }
})
