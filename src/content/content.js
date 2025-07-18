// Create floating panel
let panel = null;
let isVisible = false;

function createPanel() {
  if (panel) return;
  
  panel = document.createElement('div');
  panel.id = 'job-prompt-panel';
  panel.className = 'jph-container';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 380px;
    height: 450px;
    z-index: 10000;
    display: none;
    animation: jph-slideIn 0.3s ease-out;
  `;
  
  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes jph-slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  panel.innerHTML = `
    <div class="jph-header">
      <h3>Job Prompt Helper</h3>
      <button id="close-panel" class="jph-settings-btn" title="Close">×</button>
    </div>
    <div class="jph-search-container">
      <input type="text" id="search" class="jph-search-input" placeholder="Search prompts..." />
    </div>
    <div id="results" class="jph-results"></div>
  `;
  
  document.body.appendChild(panel);
  
  // Add event listeners
  document.getElementById('close-panel').addEventListener('click', togglePanel);
  document.getElementById('search').addEventListener('input', (e) => renderResults(e.target.value));
  document.getElementById('search').addEventListener('keydown', handleSearchKeydown);
  document.getElementById('search').addEventListener('focus', updateSelectedState);
  document.getElementById('search').addEventListener('blur', () => {
    document.querySelectorAll('.jph-prompt').forEach(prompt => {
      prompt.classList.remove('jph-selected');
    });
  });
  
  // Load prompts and render
  loadPrompts();
}

async function loadPrompts() {
  try {
    // Get prompts from extension storage
    const response = await chrome.runtime.sendMessage({ action: 'loadStoredPrompts' });
    if (response && response.prompts) {
      window.jobPrompts = response.prompts;
    } else {
      // If no prompts, show empty state
      window.jobPrompts = [];
    }
  } catch (error) {
    console.error('Error loading prompts:', error);
    window.jobPrompts = [];
  }
  renderResults();
}

function renderResults(filter = "") {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;
  
  resultsDiv.innerHTML = "";
  const filtered = window.jobPrompts.filter(p =>
    p.label.toLowerCase().includes(filter.toLowerCase()) ||
    p.text.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (window.jobPrompts.length === 0) {
    resultsDiv.innerHTML = `
      <div class="jph-empty-state">
        <div class="jph-empty-state-icon">📝</div>
        <div class="jph-empty-state-text">No prompts yet</div>
        <div class="jph-empty-state-subtext">Click the extension icon to add your first prompt</div>
      </div>
    `;
    return;
  }
  
  if (filtered.length === 0) {
    resultsDiv.innerHTML = `
      <div class="jph-empty-state">
        <div class="jph-empty-state-icon">🔍</div>
        <div class="jph-empty-state-text">No prompts found</div>
        <div class="jph-empty-state-subtext">Try adjusting your search terms</div>
      </div>
    `;
    return;
  }
  
  filtered.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'jph-prompt';
    div.style.animationDelay = `${index * 0.05}s`;
    
    div.innerHTML = `
      <div class="jph-prompt-title">${p.label}</div>
      <div class="jph-prompt-text">
        ${p.text}
        <button class="jph-copy-button" title="Copy to clipboard">📋</button>
      </div>
    `;
    
    div.querySelector('button').addEventListener('click', () => {
      navigator.clipboard.writeText(p.text);
      const button = div.querySelector('button');
      button.textContent = '✓';
      button.title = 'Copied!';
      setTimeout(() => {
        button.textContent = '📋';
        button.title = 'Copy to clipboard';
      }, 1000);
    });
    
    resultsDiv.appendChild(div);
  });
  
  // Update selected state
  updateSelectedState();
}

function updateSelectedState() {
  // Remove all selected states
  document.querySelectorAll('.jph-prompt').forEach(prompt => {
    prompt.classList.remove('jph-selected');
  });
  
  // Add selected state to first visible prompt if search is focused
  const firstPrompt = document.querySelector('.jph-prompt');
  const searchInput = document.getElementById('search');
  if (firstPrompt && searchInput && document.activeElement === searchInput) {
    firstPrompt.classList.add('jph-selected');
  }
}

function copySelectedPrompt() {
  const selectedPrompt = document.querySelector('.jph-prompt.jph-selected');
  if (selectedPrompt) {
    const text = selectedPrompt.querySelector('.jph-prompt-text').textContent.replace('📋', '').replace('✓', '').trim();
    navigator.clipboard.writeText(text);
    
    // Show copy feedback
    const button = selectedPrompt.querySelector('.jph-copy-button');
    button.textContent = '✓';
    button.title = 'Copied!';
    setTimeout(() => {
      button.textContent = '📋';
      button.title = 'Copy to clipboard';
    }, 1000);
    
    // Close panel after copying
    setTimeout(() => {
      togglePanel();
    }, 500);
  }
}

function handleSearchKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    copySelectedPrompt();
  }
}

function togglePanel() {
  if (!panel) {
    createPanel();
  }
  
  isVisible = !isVisible;
  panel.style.display = isVisible ? 'block' : 'none';
  
  if (isVisible) {
    // Auto-focus the search input when panel becomes visible
    setTimeout(() => {
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
  } else {
    // Clear the search input when panel is closed
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.value = '';
      renderResults(''); // Re-render with empty filter to show all prompts
    }
  }
}

// Keyboard shortcut listener
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    togglePanel();
  }
});

// Initialize panel creation
createPanel(); 