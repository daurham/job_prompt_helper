// Create floating panel
let panel = null;
let isVisible = false;

function createPanel() {
  if (panel) return;
  
  panel = document.createElement('div');
  panel.id = 'job-prompt-panel';
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 380px;
    height: 450px;
    background: Canvas;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    display: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    overflow: hidden;
    border: 1px solid ButtonBorder;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
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
    <div style="background: Highlight; color: HighlightText; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Job Prompt Helper</h3>
      <button id="close-panel" style="background: none; border: none; color: HighlightText; font-size: 18px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
    </div>
    <div style="padding: 12px 16px; border-bottom: 1px solid ButtonBorder; position: relative;">
      <input type="text" id="search" placeholder="Search prompts..." style="width: 100%; padding: 8px 12px; border: 1px solid ButtonBorder; border-radius: 6px; font-size: 13px; transition: all 0.2s; background: Field; color: FieldText; font-family: inherit;">
    </div>
    <div id="results" style="max-height: 350px; overflow-y: auto; padding: 0;"></div>
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
    // Try to get prompts from extension storage
    const response = await chrome.runtime.sendMessage({ action: 'loadStoredPrompts' });
    if (response && response.prompts) {
      window.jobPrompts = response.prompts;
    } else {
      // Fallback to default prompts if storage is empty
      window.jobPrompts = getDefaultPrompts();
    }
  } catch (error) {
    // If we can't access extension storage, use default prompts
    window.jobPrompts = getDefaultPrompts();
  }
  renderResults();
}

function getDefaultPrompts() {
  return [
    { label: "LinkedIn", text: "https://www.linkedin.com/in/[yourprofile]" },
    { label: "GitHub", text: "https://github.com/[yourprofile]" },
    { label: "Website", text: "https://[yourwebsite].com" },
    { label: "Email", text: "yourname@[yourwebsite].com" },
    { label: "Phone", text: "+1234567890" },
    { label: "Address_short", text: "123 Main St" },
    { label: "Address_full", text: "123 Main St, Anytown, USA" },
    { label: "City", text: "Anytown" },
    { label: "State", text: "CA" },
    { label: "Zip", text: "12345" },
    { label: "Country", text: "USA" },
    { label: "Date of Birth", text: "1990-01-01" },
    { label: "Gender", text: "Prefer not to say" },
    { label: "Nationality", text: "American" },
    { label: "Project I'm proud of", text: "I built a full-stack application that [describe your project and its impact]..." },
    { label: "Biggest challenge", text: "Once had to [describe a challenging situation and how you overcame it]..." },
    { label: "Why this company?", text: "I admire your mission to [describe what attracts you to the company]..." },
    { label: "What's your biggest weakness?", text: "I'm a perfectionist and sometimes it's hard to delegate. To overcome this, I've learned to [describe how you've improved]..." },
    { label: "What's your biggest strength?", text: "I'm a quick learner and always eager to take on new challenges. I [describe your key strengths]..." }
  ];
}

function renderResults(filter = "") {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;
  
  resultsDiv.innerHTML = "";
  const filtered = window.jobPrompts.filter(p =>
    p.label.toLowerCase().includes(filter.toLowerCase()) ||
    p.text.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (filtered.length === 0) {
    resultsDiv.innerHTML = `
      <div style="padding: 32px 16px; text-align: center; color: GrayText;">
        <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;">🔍</div>
        <div style="font-size: 13px; line-height: 1.4;">No prompts found</div>
      </div>
    `;
    return;
  }
  
  filtered.forEach((p, index) => {
    const div = document.createElement('div');
    div.style.cssText = `
      padding: 8px 16px;
      border-bottom: 1px solid ButtonBorder;
      transition: background-color 0.2s;
      cursor: pointer;
      position: relative;
      animation: fadeIn 0.2s ease-out ${index * 0.05}s both;
    `;
    
    div.innerHTML = `
      <div style="font-weight: 600; color: CanvasText; margin-bottom: 4px; font-size: 13px; text-transform: capitalize;">${p.label}</div>
      <div style="color: GrayText; font-size: 12px; line-height: 1.4; margin-bottom: 6px; word-break: break-word; background: Field; padding: 6px 8px; border-radius: 4px; border-left: 2px solid Highlight; position: relative; padding-right: 32px;">
        ${p.text}
        <button class="copy-button" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: Highlight; color: HighlightText; border: none; padding: 4px; border-radius: 4px; font-size: 12px; cursor: pointer; transition: all 0.2s; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; opacity: 0.7;" title="Copy to clipboard">📋</button>
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
    const visibleResults = resultsDiv.querySelectorAll('.copy-button');
    
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