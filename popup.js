// Popup JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  const refreshBtn = document.getElementById('refreshBtn');
  const statusText = document.getElementById('statusText');
  const lastUpdated = document.getElementById('lastUpdated');
  const loading = document.getElementById('loading');
  const airdropList = document.getElementById('airdropList');
  const emptyState = document.getElementById('emptyState');
  const retryBtn = document.getElementById('retryBtn');

  // Initialize popup
  init();

  // Event listeners
  refreshBtn.addEventListener('click', handleRefresh);
  retryBtn.addEventListener('click', handleRefresh);

  async function init() {
    try {
      await loadAirdrops();
    } catch (error) {
      console.error('Error initializing popup:', error);
      showError();
    }
  }

  async function loadAirdrops() {
    showLoading();
    
    try {
      // Get data from storage
      const result = await chrome.storage.local.get(['airdrops', 'lastUpdated']);
      
      if (result.airdrops && result.airdrops.length > 0) {
        displayAirdrops(result.airdrops);
        updateStatus(result.lastUpdated);
      } else {
        // No data available, trigger background fetch
        await triggerBackgroundFetch();
        // Try again after a short delay
        setTimeout(async () => {
          const newResult = await chrome.storage.local.get(['airdrops', 'lastUpdated']);
          if (newResult.airdrops && newResult.airdrops.length > 0) {
            displayAirdrops(newResult.airdrops);
            updateStatus(newResult.lastUpdated);
          } else {
            showEmpty();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading airdrops:', error);
      showError();
    }
  }

  function displayAirdrops(airdrops) {
    hideLoading();
    hideEmpty();
    
    airdropList.innerHTML = '';
    
    airdrops.forEach((airdrop, index) => {
      const item = createAirdropItem(airdrop, index);
      airdropList.appendChild(item);
    });
    
    // Add fade-in animation
    airdropList.classList.add('fade-in');
    statusText.textContent = `${airdrops.length} active airdrops`;
  }

  function createAirdropItem(airdrop, index) {
    const item = document.createElement('div');
    item.className = 'airdrop-item slide-in';
    item.style.animationDelay = `${index * 0.1}s`;
    
    // Determine status class
    let statusClass = 'status-active';
    let statusText = 'Active';
    
    if (airdrop.status === 'Upcoming') {
      statusClass = 'status-upcoming';
      statusText = 'Upcoming';
    } else if (airdrop.status === 'Ended') {
      statusClass = 'status-ended';
      statusText = 'Ended';
    }

    item.innerHTML = `
      <div class="airdrop-content">
        <div class="airdrop-header">
          <div class="airdrop-name">${escapeHtml(airdrop.name)}</div>
          <div class="airdrop-hotness">
            🔥 ${airdrop.hotness || 0}
          </div>
        </div>
        <div class="airdrop-action">${escapeHtml(airdrop.action)}</div>
      </div>
      <div class="airdrop-status">
        <span class="status-badge ${statusClass}">${statusText}</span>
        <svg class="external-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7"></path>
          <path d="M7 7h10v10"></path>
        </svg>
      </div>
    `;

    // Add click handler
    item.addEventListener('click', () => {
      const url = airdrop.url || 'https://airdrops.io';
      chrome.tabs.create({ url: url });
      window.close();
    });

    return item;
  }

  function showLoading() {
    loading.style.display = 'flex';
    airdropList.style.display = 'none';
    emptyState.style.display = 'none';
    statusText.textContent = 'Loading...';
  }

  function hideLoading() {
    loading.style.display = 'none';
    airdropList.style.display = 'block';
  }

  function showEmpty() {
    hideLoading();
    airdropList.style.display = 'none';
    emptyState.style.display = 'flex';
    statusText.textContent = 'No airdrops found';
  }

  function hideEmpty() {
    emptyState.style.display = 'none';
  }

  function showError() {
    hideLoading();
    airdropList.style.display = 'none';
    emptyState.style.display = 'flex';
    statusText.textContent = 'Error loading data';
  }

  function updateStatus(lastUpdated) {
    if (lastUpdated) {
      const date = new Date(lastUpdated);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      
      let timeText;
      if (diffMinutes < 1) {
        timeText = 'Just now';
      } else if (diffMinutes < 60) {
        timeText = `${diffMinutes}m ago`;
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        timeText = `${diffHours}h ago`;
      }
      
      lastUpdated.textContent = `Updated ${timeText}`;
    }
  }

  async function handleRefresh() {
    refreshBtn.classList.add('spinning');
    
    try {
      await triggerBackgroundFetch();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Give time for background script
      await loadAirdrops();
    } catch (error) {
      console.error('Error refreshing:', error);
      showError();
    } finally {
      refreshBtn.classList.remove('spinning');
    }
  }

  async function triggerBackgroundFetch() {
    // Send message to background script to fetch new data
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'fetchAirdrops' }, (response) => {
        resolve(response);
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Handle storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.airdrops) {
      const newAirdrops = changes.airdrops.newValue;
      if (newAirdrops && newAirdrops.length > 0) {
        displayAirdrops(newAirdrops);
        if (changes.lastUpdated) {
          updateStatus(changes.lastUpdated.newValue);
        }
      }
    }
  });
});

