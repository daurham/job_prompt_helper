# Job Prompt Helper 🚀

A Chrome extension that helps job seekers quickly access and copy their personalized job application responses and personal information with a persistent floating panel.

## ✨ Features

- **Persistent Floating Panel**: Stays open while you work - won't close when clicking outside
- **Quick Access**: Instantly find and copy your job application answers
- **Search Functionality**: Filter through prompts by typing keywords
- **One-Click Copy**: Copy responses directly to your clipboard
- **Auto-Focus**: Search input automatically focused when panel opens
- **Auto-Copy**: Press Enter when only one result shows to auto-copy and close
- **Keyboard Shortcuts**: `Ctrl+Shift+J` to toggle the panel
- **Personal Information**: Store and access your contact details, social links, and addresses
- **Interview Responses**: Pre-written answers for common interview questions
- **Easy Data Management**: Built-in settings page to edit your prompts
- **Privacy First**: All data stored locally on your device

## 🎯 Perfect For

- **Job Seekers** - Quick access to your personal information and interview responses
- **Recruiters** - Efficiently copy candidate information during calls
- **Students** - Store and access your resume details and cover letter templates
- **Professionals** - Keep your contact information and professional responses handy

## 📋 What You Can Store

### Personal Information
- LinkedIn profile URL
- GitHub profile URL
- Portfolio website
- Email address
- Phone number
- Full address and location details

### Interview Responses
- "Tell me about yourself"
- "Why do you want this job?"
- "What are your strengths?"
- "What's your biggest weakness?"
- "Describe a challenging project"
- "Where do you see yourself in 5 years?"
- "Why should we hire you?"
- "What's your salary expectation?"
- "Do you have any questions?"
- "Availability"

## 🚀 Quick Start

1. **Install the extension** from the Chrome Web Store
2. **Click the extension icon** to open the popup
3. **Click the settings gear icon** to customize your prompts
4. **Add your personal information** and interview responses
5. **Go to any webpage** (like a job application site)
6. **Press `Ctrl+Shift+J`** to open the floating panel
7. **Start typing** to search for your prompts
8. **Click "Copy"** or press Enter to copy responses

## 🎯 How to Use

### Floating Panel (Recommended)
1. **Press `Ctrl+Shift+J`** anywhere on any webpage
2. **Panel appears** in the top-right corner with search focused
3. **Type to search** - results filter in real-time
4. **Press Enter** when only one result shows to auto-copy and close
5. **Or click "Copy"** for manual copying
6. **Click the X** or press `Ctrl+Shift+J` again to close

### Popup Version
1. **Click the Extension Icon** in your Chrome toolbar
2. **Search for Prompts** by typing in the search box
3. **Copy Responses** by clicking the "Copy" button
4. **Click the ⚙️ icon** to access settings
5. **Click the 🎯 icon** to support the developer

### Settings Page
1. **Click the ⚙️ settings icon** in the popup
2. **Edit your prompts** in the settings page:
   - Change labels and text for each prompt
   - Add new prompts with the "+ Add New Prompt" button
   - Reorder prompts using the up/down arrows
   - Delete prompts you don't need
   - Save individual prompts or all at once
3. **Use the search filter** to find specific prompts quickly
4. **Your data is stored securely** in Chrome's local storage

## ⌨️ Keyboard Shortcuts

- **`Ctrl+Shift+J`** (Windows/Linux) or **`Cmd+Shift+J`** (Mac)
  - Toggle the floating panel
  - Auto-focuses the search input
  - Works on any webpage

## 🔒 Privacy & Security

- **Your personal data is stored locally** in Chrome's extension storage
- **No data is sent to external servers** - everything stays on your device
- **Settings page data is private** and only accessible to you
- **No tracking or analytics** - complete privacy

## 🛠️ Customization

### Adding Your Own Prompts
1. Open the settings page (⚙️ icon)
2. Click "+ Add New Prompt"
3. Enter your label and text
4. Click "Save" to store it

### Organizing Your Prompts
- Use descriptive labels like "LinkedIn", "Email", "Why This Company"
- Group related prompts together
- Use the search filter to find prompts quickly
- Reorder prompts to match your workflow

## 📁 File Structure

```
job_prompt_helper/
├── manifest.json              # Extension configuration
├── background.js              # Background service worker
├── style.css                  # Global styling
├── README.md                  # Documentation
├── .gitignore                 # Git ignore rules
├── src/                       # Source code
│   ├── popup/                 # Popup interface
│   │   ├── popup.html        # Popup HTML
│   │   └── popup.js          # Popup functionality
│   ├── panel/                 # DevTools panel
│   │   ├── panel.html        # Panel HTML
│   │   └── panel.js          # Panel functionality
│   ├── devtools/              # DevTools integration
│   │   ├── devtools.html     # DevTools page
│   │   └── devtools.js       # DevTools panel creation
│   ├── content/               # Content scripts
│   │   └── content.js         # Floating panel functionality
│   └── settings/              # Settings interface
│       ├── settings.html      # Settings page
│       └── settings.js        # Settings functionality
├── data/                      # Data files
│   ├── prompts.js            # Your personal data (gitignored)
│   └── prompts.example.js    # Example data template
└── assets/                    # Images and icons
    ├── icon.png
    ├── extension_demo.png
    ├── load_unpacked.png
    └── toggled_dev_mode.png
```

## 🔧 Technical Details

- **Manifest Version**: 3
- **Permissions**: Storage access for user data
- **Browser Support**: Chrome and Chromium-based browsers
- **File Size**: Lightweight (< 1MB)
- **Content Scripts**: Runs on all websites for floating panel
- **DevTools Integration**: Optional persistent panel
- **Data Management**: Local storage with settings interface
- **Security**: All data stored locally, no external servers

## 🤝 Support

If you find this extension helpful, please consider supporting me:

- **Click the 🎯 icon** in the popup to visit our [Buy Me a Coffee page](https://coff.ee/daurham)
- **Leave a review** on the Chrome Web Store
- **Star the repository** on [GitHub](https://github.com/daurham/job_prompt_helper)

## 🐛 Issues & Support

If you encounter any issues or have suggestions for improvements:
- Open an issue on GitHub
- Include browser version and steps to reproduce
- Provide screenshots if applicable

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for job seekers everywhere**

*Helping you land your dream job, one prompt at a time.*

