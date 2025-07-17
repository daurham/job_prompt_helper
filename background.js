// Background script for Job Prompt Helper
// Handles data loading and communication between content scripts and popup

// Load prompts from the data file
async function loadPromptsFromFile() {
  try {
    // Try to load from the prompts.js file
    const response = await fetch(chrome.runtime.getURL('data/prompts.js'));
    const text = await response.text();
    
    // Extract the prompts array from the file
    // This is a simple approach - in production you might want a more robust parser
    const match = text.match(/export const prompts = (\[[\s\S]*?\]);/);
    if (match) {
      // Evaluate the prompts array (safe since it's our own file)
      const prompts = eval(match[1]);
      return prompts;
    }
  } catch (error) {
    console.log('Could not load prompts from file:', error);
  }
  
  // Fallback to default prompts
  return getDefaultPrompts();
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

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrompts') {
    loadPromptsFromFile().then(prompts => {
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
    chrome.storage.local.get(['prompts'], (result) => {
      if (result.prompts) {
        sendResponse({ prompts: result.prompts });
      } else {
        // If no stored prompts, load from file
        loadPromptsFromFile().then(prompts => {
          sendResponse({ prompts: prompts });
        });
      }
    });
    return true;
  }
}); 