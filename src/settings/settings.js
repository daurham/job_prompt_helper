// Settings page for managing prompts

let prompts = [];
let hasUnsavedChanges = false;
let searchFilter = '';

// Load prompts from storage
async function loadPrompts() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'loadStoredPrompts' });
    prompts = response.prompts || [];
    renderPrompts();
  } catch (error) {
    console.error('Error loading prompts:', error);
    showStatus('Error loading prompts', 'error');
  }
}

// Filter prompts based on search
function filterPrompts() {
  const filteredPrompts = prompts.filter(prompt => 
    prompt.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    prompt.text.toLowerCase().includes(searchFilter.toLowerCase())
  );
  return filteredPrompts;
}

// Render prompts in the UI
function renderPrompts() {
  const container = document.getElementById('prompts-container');
  container.innerHTML = '';
  
  const filteredPrompts = filterPrompts();
  
  if (prompts.length === 0) {
    container.innerHTML = `
      <div class="jph-empty-state">
        <div class="jph-empty-state-icon">📝</div>
        <div class="jph-empty-state-text">No prompts yet</div>
        <div class="jph-empty-state-subtext">Click "Add New Prompt" to get started!</div>
      </div>
    `;
    return;
  }
  
  if (filteredPrompts.length === 0 && searchFilter) {
    container.innerHTML = `
      <div class="jph-empty-state">
        <div class="jph-empty-state-icon">🔍</div>
        <div class="jph-empty-state-text">No prompts found</div>
        <div class="jph-empty-state-subtext">Try adjusting your search terms</div>
      </div>
    `;
    return;
  }
  
  filteredPrompts.forEach((prompt, displayIndex) => {
    const actualIndex = prompts.indexOf(prompt);
    const promptDiv = document.createElement('div');
    promptDiv.className = 'jph-prompt-editor';
    promptDiv.innerHTML = `
      <input type="text" 
             placeholder="Prompt Label (e.g., LinkedIn, Email)" 
             value="${prompt.label}" 
             data-index="${actualIndex}" 
             data-field="label"
             class="prompt-label">
      <textarea placeholder="Prompt Text (e.g., your LinkedIn URL)" 
                data-index="${actualIndex}" 
                data-field="text"
                class="prompt-text">${prompt.text}</textarea>
      <div class="jph-prompt-actions">
        <button class="jph-btn jph-btn-primary save-individual" data-index="${actualIndex}">💾 Save</button>
        <button class="jph-btn jph-btn-secondary move-up" data-index="${actualIndex}" ${actualIndex === 0 ? 'disabled' : ''}>↑ Up</button>
        <button class="jph-btn jph-btn-secondary move-down" data-index="${actualIndex}" ${actualIndex === prompts.length - 1 ? 'disabled' : ''}>↓ Down</button>
        <button class="jph-btn jph-btn-danger delete-prompt" data-index="${actualIndex}">🗑️ Delete</button>
        <div class="jph-save-status" data-index="${actualIndex}"></div>
      </div>
    `;
    container.appendChild(promptDiv);
  });
  
  // Add event listeners for input changes and buttons
  addInputListeners();
  addButtonListeners();
}

// Add event listeners to inputs
function addInputListeners() {
  document.querySelectorAll('.prompt-label, .prompt-text').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = parseInt(e.target.dataset.index);
      const field = e.target.dataset.field;
      const value = e.target.value.trim();
      
      if (index >= 0 && index < prompts.length) {
        prompts[index][field] = value;
        hasUnsavedChanges = true;
        updateSaveButton();
        showIndividualSaveStatus(index, 'unsaved');
      }
    });
  });
}

// Add event listeners to buttons
function addButtonListeners() {
  // Individual save buttons
  document.querySelectorAll('.save-individual').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      saveIndividualPrompt(index);
    });
  });
  
  // Move up buttons
  document.querySelectorAll('.move-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      movePrompt(index, -1);
    });
  });
  
  // Move down buttons
  document.querySelectorAll('.move-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      movePrompt(index, 1);
    });
  });
  
  // Delete buttons
  document.querySelectorAll('.delete-prompt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      deletePrompt(index);
    });
  });
}

// Show individual save status
function showIndividualSaveStatus(index, status) {
  const statusElement = document.querySelector(`[data-index="${index}"].jph-save-status`);
  if (statusElement) {
    statusElement.textContent = status === 'saved' ? 'Saved' : 'Unsaved';
    statusElement.className = `jph-save-status ${status}`;
  }
}

// Save individual prompt
async function saveIndividualPrompt(index) {
  try {
    await chrome.runtime.sendMessage({ 
      action: 'savePrompts', 
      prompts: prompts 
    });
    
    showIndividualSaveStatus(index, 'saved');
    showStatus(`Prompt "${prompts[index].label}" saved!`, 'success');
    
    // Clear individual save status after 2 seconds
    setTimeout(() => {
      const statusElement = document.querySelector(`[data-index="${index}"].jph-save-status`);
      if (statusElement) {
        statusElement.style.opacity = '0';
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error saving prompt:', error);
    showStatus('Error saving prompt', 'error');
  }
}

// Move prompt up or down
function movePrompt(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < prompts.length) {
    const temp = prompts[index];
    prompts[index] = prompts[newIndex];
    prompts[newIndex] = temp;
    hasUnsavedChanges = true;
    updateSaveButton();
    renderPrompts();
    showStatus(`Moved "${temp.label}" ${direction > 0 ? 'down' : 'up'}`, 'success');
  }
}

// Delete prompt
function deletePrompt(index) {
  const promptLabel = prompts[index].label;
  if (confirm(`Are you sure you want to delete "${promptLabel}"?`)) {
    prompts.splice(index, 1);
    hasUnsavedChanges = true;
    updateSaveButton();
    renderPrompts();
    showStatus(`Deleted "${promptLabel}"`, 'success');
  }
}

// Add new prompt
function addNewPrompt() {
  prompts.push({
    label: 'New Prompt',
    text: 'Enter your text here'
  });
  hasUnsavedChanges = true;
  updateSaveButton();
  renderPrompts();
  
  // Focus on the new prompt's label input
  setTimeout(() => {
    const newInput = document.querySelector(`[data-index="${prompts.length - 1}"][data-field="label"]`);
    if (newInput) {
      newInput.focus();
      newInput.select();
    }
  }, 100);
}

// Save all prompts
async function saveAllPrompts() {
  try {
    await chrome.runtime.sendMessage({ 
      action: 'savePrompts', 
      prompts: prompts 
    });
    
    hasUnsavedChanges = false;
    updateSaveButton();
    showStatus('All prompts saved successfully!', 'success');
    
    // Clear all individual save statuses
    document.querySelectorAll('.jph-save-status').forEach(status => {
      status.style.opacity = '0';
    });
    
    // Reload the prompts to ensure consistency
    setTimeout(() => {
      loadPrompts();
    }, 1000);
    
  } catch (error) {
    console.error('Error saving prompts:', error);
    showStatus('Error saving prompts', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('status-message');
  statusDiv.textContent = message;
  statusDiv.className = `jph-status-message jph-status-${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Update save button state
function updateSaveButton() {
  const saveBtn = document.getElementById('save-all');
  if (hasUnsavedChanges) {
    saveBtn.textContent = 'Save All Changes*';
    saveBtn.classList.add('unsaved');
  } else {
    saveBtn.textContent = 'Save All Changes';
    saveBtn.classList.remove('unsaved');
  }
}

// Handle search filter
function handleSearchFilter() {
  searchFilter = document.getElementById('search-filter').value;
  renderPrompts();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadPrompts();
  
  // Add event listeners
  document.getElementById('add-prompt').addEventListener('click', addNewPrompt);
  document.getElementById('save-all').addEventListener('click', saveAllPrompts);
  document.getElementById('search-filter').addEventListener('input', handleSearchFilter);
  
  // Warn before leaving with unsaved changes
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}); 