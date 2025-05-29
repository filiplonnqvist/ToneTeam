/**
 * @file Template generator for lyrics editor component.
 * @module components/lyrics-editor-component/lyrics-editor-component-template
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Generates HTML for the lyrics editor component.
 *
 * @param {object} [lyrics=null] - Lyrics object to edit, or null for new lyrics.
 * @returns {string} HTML string for the lyrics editor component.
 */
export function createLyricsEditorTemplate (lyrics = null) {
  const title = lyrics ? lyrics.title : ''
  const content = lyrics ? lyrics.content : ''
  const isNewLyrics = !lyrics

  return `
      <div class="bg-gradient-to-br from-gray-900/70 to-purple-900/70 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden flex flex-col border border-purple-900/30 transition-all duration-300 transform h-full">
      <!-- Editor Header -->
      <div class="flex justify-between items-center p-4 bg-black/30 border-b border-purple-800/30">
        <div class="flex-grow flex items-center">
          <input type="text" id="lyrics-title" placeholder="Untitled" value="${title}" maxlength="40"
                 class="bg-transparent border-b-2 border-purple-500/50 hover:border-purple-400 focus:border-purple-400 focus:outline-none text-xl font-medium font-['Oxanium'] text-purple-200 placeholder-purple-400/50 w-full transition-all duration-200 px-1">
        </div>
        <div class="flex space-x-2 ml-3">
          <button id="save-lyrics-btn" class="group px-4 py-1.5 bg-gradient-to-r from-rose-500 to-purple-700 text-white text-sm font-['Oxanium'] rounded-full shadow-sm hover:shadow-md transition-all flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            ${isNewLyrics ? 'CREATE' : 'SAVE'}
          </button>
          <button id="cancel-lyrics-btn" class="group px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-gray-500/20 text-gray-300 hover:text-white text-sm rounded-full font-['Oxanium'] shadow-sm hover:shadow-md transition-all flex items-center hover:bg-white/15">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400 group-hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>  
            CANCEL
          </button>
        </div>
      </div>
      
      <!-- Quickbar for verse insertion -->
      <div class="flex items-center justify-between px-4 py-1.5 bg-black/40 border-b border-purple-800/30 text-xs font-['Oxanium'] text-gray-400">
        <!-- Template buttons on left -->
        <div class="flex items-center">
          <button class="template-btn px-2 py-0.5 rounded hover:bg-purple-700/40 hover:text-purple-200 transition-colors" data-template="--- [Intro] ---">INTRO</button>
          <button class="template-btn px-2 py-0.5 rounded hover:bg-purple-700/40 hover:text-purple-200 mr-1 transition-colors" data-template="--- [Verse] ---">VERSE</button>
          <button class="template-btn px-2 py-0.5 rounded hover:bg-purple-700/40 hover:text-purple-200 mr-1 transition-colors" data-template="--- [Chorus] ---">CHORUS</button>
          <button class="template-btn px-2 py-0.5 rounded hover:bg-purple-700/40 hover:text-purple-200 mr-1 transition-colors" data-template="--- [Bridge] ---">BRIDGE</button>
          <button class="template-btn px-2 py-0.5 rounded hover:bg-purple-700/40 hover:text-purple-200 transition-colors" data-template="--- [Outro] ---">OUTRO</button>
        </div>
        
        <!-- Download button on right -->
        <button id="download-lyrics-btn" class="flex items-center px-1.5 py-0.5 rounded border border-purple-500/30 hover:bg-purple-700/40 hover:text-purple-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>DOWNLOAD</span>
        </button>
      </div>

      <!-- Lyrics Content - Dark background with light text -->
      <textarea id="lyrics-content" placeholder="Write your lyrics here..." spellcheck="false"
          class="flex-grow w-full bg-transparent outline-none resize-none text-gray-200 placeholder-gray-500 p-4 leading-relaxed tracking-wide font-light text-sm font-['Oxanium'] overflow-auto">${content}</textarea>
                
      <!-- Status bar -->
      <div class="px-4 py-2 bg-black/40 border-t border-purple-800/30 flex justify-between items-center text-xs text-gray-400">
        <!-- Left side -->
        <div>
          <!-- Empty but keeps layout structure -->
        </div>
      
      <!-- Hidden ID field for updates -->
      ${lyrics && lyrics._id ? `<input type="hidden" id="lyrics-id" value="${lyrics._id}">` : ''}
    </div>
  `
}
