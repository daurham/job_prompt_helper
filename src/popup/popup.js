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
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">No prompts yet</div>
        <div class="empty-state-subtext">Click the ⚙️ icon to add your first prompt</div>
      </div>
    `;
    return;
  }
  
  if (filtered.length === 0) {
    resultsDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No prompts found</div>
        <div class="empty-state-subtext">Try adjusting your search terms</div>
      </div>
    `;
    return;
  }
  
  filtered.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'prompt';
    div.style.animationDelay = `${index * 0.05}s`;
    div.innerHTML = `
      <div class="prompt-title">${p.label}</div>
      <div class="prompt-text">
        ${p.text}
        <button class="copy-button" title="Copy to clipboard">📋</button>
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

searchInput.addEventListener('input', e => renderResults(e.target.value));

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
