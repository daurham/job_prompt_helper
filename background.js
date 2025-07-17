// Background script for Job Prompt Helper
// Handles data loading and communication between content scripts and popup

// Check if this is a first-time installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🎉 Job Prompt Helper installed! Setting up initial prompts...');
    
    // Add some basic example prompts for new users
    const examplePrompts = [
      { label: "Email", text: "yourname@example.com" },
      { label: "Phone", text: "+1 (555) 123-4567" },
      { label: "LinkedIn", text: "https://www.linkedin.com/in/yourprofile" },
      { label: "Tell me about yourself", text: "I'm a [your role] with [X] years of experience in [your field]. I specialize in [your key skills] and have worked on projects involving [relevant experience]..." }
    ];
    
    chrome.storage.local.set({ prompts: examplePrompts }, () => {
      console.log('✅ Initial prompts set up! Users can customize them via the settings page.');
    });
  }
});

// Load prompts from storage (user's data)
async function loadStoredPrompts() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['prompts'], (result) => {
      resolve(result.prompts || []);
    });
  });
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrompts') {
    loadStoredPrompts().then(prompts => {
      sendResponse({ prompts: prompts });
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'savePrompts') {
    chrome.storage.local.set({ prompts: request.prompts }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'loadStoredPrompts') {
    loadStoredPrompts().then(prompts => {
      sendResponse({ prompts: prompts });
    });
    return true;
  }
}); 