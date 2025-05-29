/**
 * @file Template generator for lyrics list component.
 * @module components/lyrics-list-component/lyrics-list-component-template
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Generates HTML for the lyrics list component.
 *
 * @param {Array} [lyrics=[]] - Array of lyrics objects to display in the list.
 * @returns {string} HTML string for the lyrics list component.
 */
export function createLyricsListTemplate (lyrics = []) {
  return `
    <div class="rounded-lg shadow-sm border border-purple-100 p-3 flex flex-col" 
         style="background: rgba(250, 245, 255, 0.7); backdrop-filter: blur(8px); height: 24rem;">
      <div id="lyrics-items" class="flex-grow overflow-y-auto overflow-x-hidden space-y-3" 
           style="scrollbar-width: thin; scrollbar-color: rgba(168, 85, 247, 0.5) transparent;">
        ${generateLyricsItems(lyrics)}
      </div>
    </div>
  `
}

/**
 * Generates HTML for individual lyrics items.
 *
 * @param {Array} lyrics - Array of lyrics objects.
 * @returns {string} HTML string for all lyrics items.
 */
function generateLyricsItems (lyrics) {
  if (!lyrics || lyrics.length === 0) {
    return `
      <div class="text-center p-4 text-gray-500">
        No lyrics yet? Hit that button!
      </div>
    `
  }

  return lyrics.map(lyric => {
    // Format the date
    const date = new Date(lyric.updatedAt)
    const formattedDate = new Intl.DateTimeFormat('en-SE', {
      day: 'numeric',
      month: 'short'
    }).format(date)

    return `
      <div class="lyrics-item bg-white bg-opacity-80 rounded-md shadow-sm overflow-hidden flex cursor-pointer group min-h-[3rem] w-full relative" data-id="${lyric.id || lyric._id}">
        <!-- Orange/pink accent bar -->
        <div class="w-2 bg-gradient-to-b from-rose-500 to-purple-700 min-h-full shrink-0"></div>
        
        <!-- Content -->
        <div class="flex-grow p-3 pr-10 max-w-[calc(100%-1rem)]">
          <div class="overflow-hidden">
            <h3 class="text-sm font-semibold text-purple-900 font-['Oxanium'] opacity-80 truncate">${lyric.title}</h3>
            <p class="text-xs text-gray-500 opacity-80">Last edited: ${formattedDate}</p>
          </div>
        </div>

        <!-- Absolute positioned delete button -->
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <button class="delete-lyrics-btn text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `
  }).join('')
}
