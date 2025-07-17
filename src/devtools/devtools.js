console.log('DevTools script loaded');

chrome.devtools.panels.create(
  "Job Prompts",
  null, // No icon for now to avoid path issues
  "../panel/panel.html",
  function(panel) {
    console.log('Panel creation callback executed');
    if (chrome.runtime.lastError) {
      console.error('DevTools panel creation failed:', chrome.runtime.lastError);
    } else {
      console.log('Job Prompts panel created successfully');
    }
  }
); 