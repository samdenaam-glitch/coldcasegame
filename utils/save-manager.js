// ====== SAVE MANAGER INTEGRATION ======

function initGame() {
    console.log('🚓 Initializing game...');
    
    try {
        // Initialize save manager if available
        if (window.SaveManager && typeof window.SaveManager.init === 'function') {
            window.SaveManager.init();
        }
        
        // Try to load from save manager first
        let loadedState = null;
        if (window.SaveManager) {
            loadedState = window.SaveManager.quickLoad();
        }
        
        if (loadedState) {
            // Use save manager data
            Object.assign(gameState, loadedState);
            console.log('💾 Loaded from SaveManager');
        } else {
            // Fallback to simple localStorage
            loadGameState();
        }
        
        // Load current case
        loadCase(gameState.currentCaseIndex);
        
        // Update UI
        updateGameUI();
        updateProgressBar();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup auto-save if available
        if (window.SaveManager && typeof window.SaveManager.setupAutosave === 'function') {
            window.SaveManager.setupAutosave(60); // Auto-save every 60 seconds
        }
        
        console.log('✅ Game initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        return false;
    }
}

// Update saveGameState function in game.js:
function saveGameState() {
    // Try to use SaveManager if available
    if (window.SaveManager && typeof window.SaveManager.quickSave === 'function') {
        window.SaveManager.quickSave(gameState);
    } else {
        // Fallback to simple localStorage
        localStorage.setItem('coldCaseFilesSave', JSON.stringify(gameState));
    }
    console.log('💾 Game saved');
    showNotification('Progress saved!', 'info');
}

// Update loadGameState function in game.js:
function loadGameState() {
    // Try SaveManager first
    if (window.SaveManager && typeof window.SaveManager.quickLoad === 'function') {
        const saved = window.SaveManager.quickLoad();
        if (saved) {
            Object.assign(gameState, saved);
            console.log('💾 Loaded from SaveManager');
            return;
        }
    }
    
    // Fallback to simple localStorage
    const saved = localStorage.getItem('coldCaseFilesSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
            console.log('💾 Loaded from localStorage');
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
}
