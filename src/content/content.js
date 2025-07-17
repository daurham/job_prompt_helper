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
}

function handleSearchKeydown(e) {
  if (e.key === 'Enter') {
    const resultsDiv = document.getElementById('results');
    const visibleResults = resultsDiv.querySelectorAll('.jph-copy-button');
    
    if (visibleResults.length === 1) {
      // Auto-copy the single result
      const button = visibleResults[0];
      const text = button.parentElement.textContent.replace('📋', '').replace('✓', '').trim();
      navigator.clipboard.writeText(text);
      button.textContent = '✓';
      button.title = 'Copied!';
      setTimeout(() => {
        button.textContent = '📋';
        button.title = 'Copy to clipboard';
      }, 1000);
      
      // Close the panel after copying
      setTimeout(() => {
        togglePanel();
      }, 500);
    }
  }
}

function togglePanel() {
  if (!panel) {
    createPanel();
  }
  
  isVisible = !isVisible;
  panel.style.display = isVisible ? 'block' : 'none';
  
  // Auto-focus the search input when panel becomes visible
  if (isVisible) {
    setTimeout(() => {
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
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