// Load prompts from storage instead of file
let prompts = [];

async function loadPrompts() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'loadStoredPrompts' });
    prompts = response.prompts || [];
    renderResults();
  } catch (error) {
    console.error('Error loading prompts:', error);
  }
}

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

function renderResults(filter = "") {
  resultsDiv.innerHTML = "";
  const filtered = prompts.filter(p =>
    p.label.toLowerCase().includes(filter.toLowerCase()) ||
    p.text.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (prompts.length === 0) {
    resultsDiv.innerHTML = `
      <div class="jph-empty-state">
        <div class="jph-empty-state-icon">📝</div>
        <div class="jph-empty-state-text">No prompts yet</div>
        <div class="jph-empty-state-subtext">Click the ⚙️ icon to add your first prompt</div>
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
  if (firstPrompt && document.activeElement === searchInput) {
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
    
    // Close popup after copying
    setTimeout(() => {
      window.close();
    }, 500);
  }
}

searchInput.addEventListener('input', e => {
  renderResults(e.target.value);
});

// Handle Enter key
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    copySelectedPrompt();
  }
});

// Handle focus events to update selected state
searchInput.addEventListener('focus', updateSelectedState);
searchInput.addEventListener('blur', () => {
  document.querySelectorAll('.jph-prompt').forEach(prompt => {
    prompt.classList.remove('jph-selected');
  });
});

// Settings button handler
document.getElementById('settings-btn').addEventListener('click', () => {
  // Open settings page in extension context
  chrome.tabs.create({ 
    url: chrome.runtime.getURL('src/settings/settings.html'),
    active: true
  });
});

// Support button handler
document.getElementById('support-btn').addEventListener('click', () => {
  chrome.tabs.create({ 
    url: 'https://coff.ee/daurham',
    active: true
  });
});

// Load prompts on startup
loadPrompts();
