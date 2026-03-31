// Background service worker for the extension
console.log('Service worker starting...');

// Check if chrome.alarms is available
if (typeof chrome !== 'undefined' && chrome.alarms) {
  console.log('Chrome alarms API is available');
} else {
  console.error('Chrome alarms API is not available');
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Airdrop Tracker extension installed');
  
  // Set up periodic data refresh only if alarms API is available
  if (chrome.alarms) {
    try {
      chrome.alarms.create('refreshAirdrops', {
        delayInMinutes: 1,
        periodInMinutes: 30 // Refresh every 30 minutes
      });
      console.log('Alarm created successfully');
    } catch (error) {
      console.error('Error creating alarm:', error);
    }
  }
  
  // Initial data fetch
  fetchAirdropData();
});

// Handle alarm events only if alarms API is available
if (chrome.alarms && chrome.alarms.onAlarm) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm.name);
    if (alarm.name === 'refreshAirdrops') {
      fetchAirdropData();
    }
  });
} else {
  console.warn('Chrome alarms API not available, periodic updates disabled');
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === 'fetchAirdrops') {
    fetchAirdropData().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }
});

// Fetch airdrop data from various sources
async function fetchAirdropData() {
  try {
    console.log('Fetching airdrop data...');
    
    // For now, we'll use mock data that simulates real airdrop information
    // In a production version, this would scrape from actual websites
    const mockAirdrops = [
      {
        name: "Warden Protocol",
        status: "Active",
        action: "Start earning PUMPS by connecting wallet and completing tasks",
        hotness: 613,
        url: "https://airdrops.io/warden-protocol/"
      },
      {
        name: "MEXC Exchange",
        status: "Active", 
        action: "Register and deposit, complete trading requirements",
        hotness: 115,
        url: "https://airdrops.io/mexc/"
      },
      {
        name: "Resolv Protocol",
        status: "Active",
        action: "Hold USR/RLP tokens, stake, and provide liquidity",
        hotness: 474,
        url: "https://airdrops.io/resolv/"
      },
      {
        name: "Humanity Protocol",
        status: "Active",
        action: "Complete testnet actions and verify identity",
        hotness: 303,
        url: "https://airdrops.io/humanity-protocol/"
      },
      {
        name: "Solix Browser",
        status: "Active",
        action: "Install and run the free browser extension",
        hotness: 464,
        url: "https://airdrops.io/solix/"
      },
      {
        name: "Liquity V2",
        status: "Active",
        action: "Supply BOLD tokens to stability pools",
        hotness: 73,
        url: "https://airdrops.io/liquity/"
      },
      {
        name: "Nodepay Network",
        status: "Active",
        action: "Collect points by sharing bandwidth",
        hotness: 89,
        url: "https://airdrops.io/nodepay/"
      },
      {
        name: "Looter Game",
        status: "Active",
        action: "Play the game and earn XP points",
        hotness: 86,
        url: "https://airdrops.io/looter/"
      }
    ];

    // Simulate some randomness in hotness scores
    mockAirdrops.forEach(airdrop => {
      airdrop.hotness += Math.floor(Math.random() * 20) - 10;
      airdrop.hotness = Math.max(0, airdrop.hotness);
    });

    // Sort by hotness (descending)
    mockAirdrops.sort((a, b) => b.hotness - a.hotness);

    // Store the data
    if (chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ 
        airdrops: mockAirdrops,
        lastUpdated: Date.now()
      });
      console.log('Airdrop data updated successfully');
    } else {
      console.error('Chrome storage API not available');
    }
  } catch (error) {
    console.error('Error fetching airdrop data:', error);
    
    // Store error state
    try {
      if (chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({
          airdrops: [],
          lastUpdated: Date.now(),
          error: error.message
        });
      }
    } catch (storageError) {
      console.error('Error storing error state:', storageError);
    }
  }
}

// Function to scrape airdrops.io (for future implementation)
async function scrapeAirdropsIo() {
  try {
    // This would be implemented with actual web scraping
    // For now, return mock data
    return [];
  } catch (error) {
    console.error('Error scraping airdrops.io:', error);
    return [];
  }
}

// Function to scrape KuCoin airdrops (for future implementation)
async function scrapeKuCoinAirdrops() {
  try {
    // This would be implemented with actual web scraping
    // For now, return mock data
    return [];
  } catch (error) {
    console.error('Error scraping KuCoin airdrops:', error);
    return [];
  }
}

console.log('Service worker loaded successfully');

