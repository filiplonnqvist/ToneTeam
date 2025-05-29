/**
 * Creates the HTML template for the control panel.
 *
 * @param {boolean} isMuted - Whether the piano sound is currently muted
 * @param {string} currentInstrument - Current instrument ('piano' or 'synth')
 * @returns {string} HTML as a string
 */
export function createControlPanelTemplate (isMuted, currentInstrument = 'piano') {
  // Generate the appropriate icon path based on mute state
  const iconPathMarkup = isMuted
    ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>'

  // Instrument icons
  const instrumentIconMarkup = currentInstrument === 'piano'
    // Piano icon
    ? `<rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2"/>
     <rect x="7" y="7" width="2" height="6" fill="currentColor"/>
     <rect x="11" y="7" width="2" height="6" fill="currentColor"/>
     <rect x="15" y="7" width="2" height="6" fill="currentColor"/>`
    // Synth icon
    : `<rect x="2" y="8" width="20" height="8" rx="2" stroke-width="2"/>
     <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
     <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
     <circle cx="18" cy="12" r="1.5" fill="currentColor"/>`

  // Neon colors and effects based on mute state
  const neonColors = isMuted
    ? {
        border: 'border-red-400',
        shadow: 'shadow-red-500/20',
        text: 'text-red-300',
        hoverShadow: 'group-hover:shadow-red-500/40'
      }
    : {
        border: 'border-cyan-400',
        shadow: 'shadow-cyan-500/20',
        text: 'text-cyan-300',
        hoverShadow: 'group-hover:shadow-cyan-500/40'
      }

  // Neon colors for instrument toggle
  const instrumentColors = currentInstrument === 'piano'
    ? {
        border: 'border-gray-300',
        shadow: 'shadow-gray-400/20',
        text: 'text-gray-200',
        hoverShadow: 'group-hover:shadow-gray-300/40'
      }
    : {
        border: 'border-purple-400',
        shadow: 'shadow-purple-500/20',
        text: 'text-purple-300',
        hoverShadow: 'group-hover:shadow-purple-500/40'
      }

  return `
    <div class="control-panel-container flex flex-col gap-3 p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
      <button id="piano-sound-toggle" 
              class="relative w-12 h-12 rounded-lg transition-all duration-300 overflow-hidden group"
              title="${isMuted ? 'Unmute Piano' : 'Mute Piano'}">
        
        <!-- Digital neon background with subtle pulse -->
        <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm ${neonColors.border} border-2 rounded-lg 
                    shadow-lg ${neonColors.shadow} 
                    animate-[pulse_4s_ease-in-out_infinite] 
                    ${neonColors.hoverShadow} 
                    hover:shadow-xl
                    transition-all duration-300"></div>
        
        <!-- Icon with neon glow -->
        <div class="relative z-10 h-full w-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6 ${neonColors.text} 
                      transition-all duration-200 
                      group-hover:scale-110 
                      group-hover:brightness-125
                      drop-shadow-sm" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            ${iconPathMarkup}
          </svg>
        </div>
        
        <!-- Hover intensity overlay -->
        <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        
        <!-- Click effect -->
        <div class="absolute inset-0 bg-white/15 opacity-0 group-active:opacity-40 transition-all duration-75 rounded-lg"></div>
      </button>

      <!-- Instrument Toggle Button -->
      <button id="instrument-toggle" 
              class="relative w-12 h-12 rounded-lg transition-all duration-300 overflow-hidden group"
              title="Switch to ${currentInstrument === 'piano' ? 'Synth' : 'Piano'}">
        
        <!-- Digital neon background with subtle pulse -->
        <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm ${instrumentColors.border} border-2 rounded-lg 
                    shadow-lg ${instrumentColors.shadow} 
                    ${instrumentColors.hoverShadow} 
                    hover:shadow-xl
                    transition-all duration-300"></div>
        
        <!-- Icon with neon glow -->
        <div class="relative z-10 h-full w-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6 ${instrumentColors.text} 
                      transition-all duration-200 
                      group-hover:scale-110 
                      group-hover:brightness-125
                      drop-shadow-sm" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            ${instrumentIconMarkup}
          </svg>
        </div>
        
        <!-- Hover intensity overlay -->
        <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        
        <!-- Click effect -->
        <div class="absolute inset-0 bg-white/15 opacity-0 group-active:opacity-40 transition-all duration-75 rounded-lg"></div>
      </button>
    </div>
  `
}
