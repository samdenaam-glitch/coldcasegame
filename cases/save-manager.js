        const saveData = {
            version: this.version,
            slot: slot,
            createdAt: Date.now(),
            lastPlayed: Date.now(),
            gameState: gameState,
            isEmpty: false,
            preview: {
                playerRank: gameState.playerRank,
                casesSolved: gameState.casesSolved,
                currentCase: gameState.currentCaseIndex,
                totalCCP: gameState.coldCasePoints,
                playTime: gameState.totalPlayTime || 0
            }
        };
        
        this.saveToSlot(slot, saveData);
        this.currentSlot = slot;
        
        // Update save list
        this.updateSaveList();
        
        console.log(`💾 Game saved to slot ${slot}`);
        return saveData;
    },
    
    // Save data to specific slot
    saveToSlot(slot, data) {
        const slotKey = `coldCaseFiles_slot_${slot}`;
        localStorage.setItem(slotKey, JSON.stringify(data));
        
        // Also save to backup
        this.createBackup(slot, data);
    },
    
    // Load game from slot
    loadGame(slot = this.currentSlot) {
        const slotKey = `coldCaseFiles_slot_${slot}`;
        const savedData = localStorage.getItem(slotKey);
        
        if (!savedData) {
            console.warn(`⚠️ No save data in slot ${slot}`);
            return null;
        }
        
        try {
            const parsedData = JSON.parse(savedData);
            
            // Check version compatibility
            if (!this.isVersionCompatible(parsedData.version)) {
                console.warn('⚠️ Save version mismatch, attempting migration');
                const migrated = this.migrateSave(parsedData);
                if (migrated) {
                    this.saveToSlot(slot, migrated);
                    return migrated.gameState;
                }
                return null;
            }
            
            if (parsedData.isEmpty) {
                console.log(`📁 Empty save slot ${slot}`);
                return null;
            }
            
            this.currentSlot = slot;
            console.log(`💾 Game loaded from slot ${slot}`);
            return parsedData.gameState;
            
        } catch (error) {
            console.error('❌ Error loading save:', error);
            
            // Try to load from backup
            console.log('🔄 Attempting to load from backup...');
            const backup = this.loadBackup(slot);
            if (backup) {
                return backup.gameState;
            }
            
            return null;
        }
    },
    
    // Load all save slots for display
    getAllSaves() {
        const saves = [];
        
        for (let i = 0; i < this.saveSlots; i++) {
            const slotKey = `coldCaseFiles_slot_${i}`;
            const savedData = localStorage.getItem(slotKey);
            
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    saves.push({
                        slot: i,
                        ...parsed
                    });
                } catch (error) {
                    console.error(`❌ Error parsing save slot ${i}:`, error);
                    saves.push({
                        slot: i,
                        isEmpty: true,
                        corrupted: true
                    });
                }
            } else {
                saves.push({
                    slot: i,
                    isEmpty: true
                });
            }
        }
        
        return saves;
    },
    
    // Delete save from slot
    deleteSave(slot) {
        const slotKey = `coldCaseFiles_slot_${slot}`;
        localStorage.removeItem(slotKey);
        
        // Also delete backup
        const backupKey = `coldCaseFiles_backup_${slot}`;
        localStorage.removeItem(backupKey);
        
        // Create empty save
        this.createEmptySave(slot);
        
        console.log(`🗑️ Deleted save slot ${slot}`);
        return true;
    },
    
    // Export save to file
    exportSave(slot = this.currentSlot) {
        const saveData = this.loadGame(slot);
        if (!saveData) return null;
        
        const exportData = {
            game: 'Cold Case Files',
            version: this.version,
            exportedAt: Date.now(),
            data: saveData
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        return url;
    },
    
    // Import save from file
    async importSave(file, slot = this.currentSlot) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validate imported data
                    if (!this.validateImport(importedData)) {
                        reject(new Error('Invalid save file format'));
                        return;
                    }
                    
                    // Save to slot
                    const saveData = {
                        version: this.version,
                        slot: slot,
                        createdAt: Date.now(),
                        lastPlayed: Date.now(),
                        gameState: importedData.data,
                        isEmpty: false
                    };
                    
                    this.saveToSlot(slot, saveData);
                    resolve(saveData);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    },
    
    // Create backup of save
    createBackup(slot, data) {
        const backupKey = `coldCaseFiles_backup_${slot}`;
        const backupData = {
            ...data,
            backedUpAt: Date.now()
        };
        
        localStorage.setItem(backupKey, JSON.stringify(backupData));
    },
    
    // Load from backup
    loadBackup(slot) {
        const backupKey = `coldCaseFiles_backup_${slot}`;
        const backupData = localStorage.getItem(backupKey);
        
        if (backupData) {
            try {
                return JSON.parse(backupData);
            } catch (error) {
                console.error('❌ Error loading backup:', error);
            }
        }
        
        return null;
    },
    
    // Migrate old save format
    migrateOldSaves() {
        // Check for old save format
        const oldSave = localStorage.getItem('coldCaseFilesSave');
        
        if (oldSave) {
            try {
                const oldData = JSON.parse(oldSave);
                
                // Convert to new format
                const newSave = {
                    version: this.version,
                    slot: 0,
                    createdAt: oldData.saveTimestamp || Date.now(),
                    lastPlayed: Date.now(),
                    gameState: oldData,
                    isEmpty: false,
                    preview: {
                        playerRank: oldData.playerRank || 'ROOKIE DETECTIVE',
                        casesSolved: oldData.casesSolved || 0,
                        currentCase: oldData.currentCaseIndex || 0,
                        totalCCP: oldData.coldCasePoints || 100
                    }
                };
                
                // Save to slot 0
                this.saveToSlot(0, newSave);
                
                // Remove old save
                localStorage.removeItem('coldCaseFilesSave');
                
                console.log('🔄 Migrated old save to new format');
                
            } catch (error) {
                console.error('❌ Error migrating old save:', error);
            }
        }
    },
    
    // Migrate save to current version
    migrateSave(oldSave) {
        // Simple migration - just update version
        // In a real game, you'd have more complex migration logic
        return {
            ...oldSave,
            version: this.version,
            migratedAt: Date.now()
        };
    },
    
    // Check version compatibility
    isVersionCompatible(saveVersion) {
        const currentMajor = parseInt(this.version.split('.')[0]);
        const saveMajor = parseInt(saveVersion.split('.')[0]);
        
        return currentMajor === saveMajor;
    },
    
    // Validate imported save
    validateImport(importedData) {
        return (
            importedData.game === 'Cold Case Files' &&
            importedData.data &&
            importedData.data.playerRank &&
            importedData.data.casesSolved !== undefined
        );
    },
    
    // Update save list in UI
    updateSaveList() {
        const saves = this.getAllSaves();
        const event = new CustomEvent('saveListUpdated', { detail: saves });
        window.dispatchEvent(event);
    },
    
    // Get save statistics
    getStatistics() {
        const saves = this.getAllSaves();
        const validSaves = saves.filter(s => !s.isEmpty && !s.corrupted);
        
        return {
            totalSaves: validSaves.length,
            totalPlayTime: validSaves.reduce((sum, save) => sum + (save.preview?.playTime || 0), 0),
            totalCasesSolved: validSaves.reduce((sum, save) => sum + (save.preview?.casesSolved || 0), 0),
            mostRecentSave: validSaves.sort((a, b) => b.lastPlayed - a.lastPlayed)[0],
            slots: saves.map(save => ({
                slot: save.slot,
                isEmpty: save.isEmpty,
                corrupted: save.corrupted,
                preview: save.preview
            }))
        };
    },
    
    // Clear all saves (factory reset)
    clearAllSaves() {
        for (let i = 0; i < this.saveSlots; i++) {
            this.deleteSave(i);
        }
        
        // Clear other game data
        localStorage.removeItem('coldCaseFilesFirstVisit');
        
        console.log('🗑️ All saves cleared');
        return true;
    },
    
    // Auto-save functionality
    setupAutosave(interval = 300) { // seconds
        if (this.autosaveInterval
