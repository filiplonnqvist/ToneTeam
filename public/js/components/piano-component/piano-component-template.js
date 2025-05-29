/**
 * @file HTML template generator for the piano component.
 * @module components/piano-component/piano-component-template
 * @author Filip Lönnqvist <fl223km@student.lnu.se>
 * @version 2.1.3
 */

/**
 * Creates the HTML structure for the piano component using Tailwind CSS classes.
 * This implementation uses a fully responsive approach with percentage-based positioning.
 *
 * @returns {string} - HTML as a string
 */
export function createPianoTemplate () {
  return `
    <div class="relative flex flex-col items-center justify-end w-full mx-auto p-4" style="min-height: 80vh">
      <!-- Piano Header -->

      <!-- Piano Wrapper with CSS variables for scaling -->
      <div id="piano-wrapper" 
           class="relative mx-auto overflow-visible filter drop-shadow-2xl mb-8"
           style="--piano-width: 500px; width: var(--piano-width);">
        
        <div id="keyboard" 
             class="absolute left-1/2 transform -translate-x-1/2 -translate-y-[150px] w-full bg-gray-900 bg-opacity-80 rounded-md flex justify-center items-center box-border"
             style="height: calc(var(--piano-width) * 0.365); padding: calc(var(--piano-width) * 0.202) calc(var(--piano-width) * 0.519);">

          <div class="relative flex">

            <!-- White keys with relative sizes -->
            ${generateWhiteKeys()}

            <!-- Black keys with relative positions -->
            ${generateBlackKeys()}
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * Generates the white keys for the piano.
 *
 * @returns {string} HTML for all white keys
 */
function generateWhiteKeys () {
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5']
  const labels = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']

  return notes.map((note, index) => `
    <div class="white-key flex-shrink-0 bg-gradient-to-b from-white to-gray-100 border border-gray-400 rounded-b-md relative z-[1] my-0 transition-all duration-200 shadow-md hover:shadow-gray-500/50" 
         style="width: calc(var(--piano-width) * 0.096); height: calc(var(--piano-width) * 0.346); margin-right: calc(var(--piano-width) * -0.002);"
         data-note="${note}">
      <span class="key-label absolute bottom-[10px] left-1/2 transform -translate-x-1/2 text-gray-500 text-sm pointer-events-none font-light">${labels[index]}</span>
    </div>
  `).join('')
}

/**
 * Generates the black keys for the piano with their relative positions.
 *
 * @returns {string} HTML for all black keys
 */
function generateBlackKeys () {
  const blackKeys = [
    { note: 'C#4', label: '2', position: 10 },
    { note: 'D#4', label: '3', position: 20 },
    { note: 'F#4', label: '5', position: 40 },
    { note: 'G#4', label: '6', position: 50 },
    { note: 'A#4', label: '7', position: 60 },
    { note: 'C#5', label: '9', position: 80 },
    { note: 'D#5', label: '0', position: 90 }
  ]

  return blackKeys.map(key => `
    <div class="black-key bg-gradient-to-b from-gray-900 to-gray-800 absolute z-[2] rounded-b-md border border-gray-800 shadow-lg shadow-gray-900/20 transition-all duration-200 hover:shadow-gray-600/50" 
         style="width: calc(var(--piano-width) * 0.058); height: calc(var(--piano-width) * 0.192); left: ${key.position}%; margin-left: calc(var(--piano-width) * -0.029);"
         data-note="${key.note}">
      <span class="key-label absolute bottom-[20px] left-1/2 transform -translate-x-1/2 text-gray-300 text-xs pointer-events-none font-light">${key.label}</span>
    </div>
  `).join('')
}
