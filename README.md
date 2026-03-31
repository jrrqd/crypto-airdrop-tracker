# Airdrop Tracker Chrome Extension

A minimalistic Chrome extension that displays the latest crypto airdrop schedules in a clean, modern popup interface.

## Features

- **Minimalistic Design**: Clean, modern interface with gradient header and smooth animations
- **Real-time Updates**: Automatically refreshes airdrop data every 30 minutes
- **Hotness Scoring**: Shows popularity scores for each airdrop
- **Direct Links**: Click any airdrop to open its page in a new tab
- **Status Indicators**: Clear visual indicators for active, upcoming, and ended airdrops
- **Responsive Layout**: Optimized for the extension popup format

## Installation

Via Chrome Web Store
[Via Chrome Web Store](https://chromewebstore.google.com/detail/airdrop-tracker/amjgfpkbidikfbdpnbnedphdaglglldn?authuser=0&hl=en-GB)

Manual
1. Download the `airdrop-extension.zip` file
2. Extract the contents to a folder
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select the extracted folder
6. The extension icon will appear in your browser toolbar

## Troubleshooting

If you encounter the "Service worker registration failed" error:

1. Make sure you have the latest version of the extension files
2. The manifest.json now includes the "alarms" permission which is required
3. The background.js has been updated with proper error handling
4. Try removing and re-installing the extension

## Usage

1. Click the Airdrop Tracker icon in your browser toolbar
2. View the list of current active airdrops
3. Click on any airdrop item to open its page in a new tab
4. Use the refresh button to manually update the data
5. Click "View More Airdrops" to visit airdrops.io for additional opportunities

## Data Sources

The extension currently uses mock data that simulates real airdrop information from popular sources like:
- airdrops.io
- KuCoin Airdrop Calendar
- CoinMarketCap Airdrops

*Note: In a production version, this would include actual web scraping functionality to fetch live data.*

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage, active tab access, and alarms for periodic updates
- **Background Script**: Service worker for data fetching and storage
- **Popup Interface**: HTML/CSS/JavaScript with modern design
- **Data Storage**: Chrome local storage for caching airdrop data

## Recent Fixes

- Added "alarms" permission to manifest.json
- Improved error handling in background service worker
- Added API availability checks to prevent undefined errors
- Enhanced logging for debugging purposes
- Removed problematic content security policy

## Files Structure

```
airdrop-extension/
├── manifest.json          # Extension configuration (updated)
├── background.js          # Service worker for data management (fixed)
├── popup.html            # Main popup interface
├── popup.css             # Styling for the popup
├── popup.js              # Popup functionality
├── demo.html             # Demo version for testing
├── README.md             # This file
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Development

To modify or extend the extension:

1. Edit the relevant files in the extension folder
2. Reload the extension in Chrome extensions page
3. Test the changes in the popup

For adding real data sources:
- Modify `background.js` to implement actual web scraping
- Update the `host_permissions` in `manifest.json` for new domains
- Add error handling for network requests

## License

This extension is provided as-is for educational and personal use.

