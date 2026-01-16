/* ====== COLD CASE FILES - GAME LOGIC ====== */
/* Main JavaScript File - Updated for External Case Loading */

// ====== GAME STATE & DATA ======
const gameState = {
    currentCaseIndex: 0,
    playerRank: 'ROOKIE DETECTIVE',
    casesSolved: 0,
    coldCasePoints: 100,
    currentWitnessIndex: 0,
    investigationProgress: 40,
    discoveredClues: ['broken_string', 'threat_letter'],
    playerNotes: '',
    gameVersion: '1.0.0',
    availableCases: [],
    caseProgress: {}
};

// ====== LOAD EXTERNAL CASES ======
let cases = [];

async function loadExternalCases() {
    console.log('📂 Loading cases from external files...');
    
    try {
        // Try to load from cases folder
        const response = await fetch('cases/cases-index.json');
        if (!response.ok) {
            throw new Error('Cases index not found');
        }
        
        const caseFiles = await response.json();
        console.log(`Found ${caseFiles.length} case files:`, caseFiles);
        
        // Load each case file
        cases = [];
        for (const caseFile of caseFiles) {
            try {
                const caseResponse = await fetch(`cases/${caseFile}`);
                if (!caseResponse.ok) {
                    console.warn(`⚠️ Case file not found: ${caseFile}`);
                    continue;
                }
                
                const caseData = await caseResponse.json();
                cases.push(caseData);
                console.log(`✅ Loaded: ${caseData.title}`);
            } catch (caseError) {
                console.error(`❌ Error loading ${caseFile}:`, caseError);
            }
        }
        
        // If no cases loaded, use fallback
        if (cases.length === 0) {
            console.log('🔄 No cases found, using fallback');
            cases = [getFallbackCase()];
        }
        
        console.log(`✅ Total cases loaded: ${cases.length}`);
        return cases;
        
    } catch (error) {
        console.error('❌ Failed to load external cases:', error);
        console.log('🔄 Using fallback case');
        cases = [getFallbackCase()];
        return cases;
    }
}

function getFallbackCase() {
    return {
        "id": "CCF-1987-045",
        "title": "THE VANISHING VIOLINIST",
        "year": 1987,
        "difficulty": "BEGINNER",
        "difficultyClass": "difficulty-beginner",
        "summary": "Renowned violinist Evelyn Vance disappeared after her final performance at the Royal Symphony Hall on November 15, 1987. No ransom note, no witnesses, just an empty dressing room and a broken violin string.",
        
        "evidence": {
            "photos": [
                {
                    "id": "photo-1",
                    "title": "Crime Scene: Backstage Area",
                    "description": "Dressing room area showing overturned stool, scattered sheet music, and a single broken violin string (E-string) on the floor.",
                    "clueId": "broken_string"
                },
                {
                    "id": "photo-2",
                    "title": "Victim's Dressing Room",
                    "description": "Room appears undisturbed except for open window. Personal belongings still present including purse, phone, and coat.",
                    "clueId": "open_window"
                }
            ],
            
            "documents": [
                {
                    "id": "doc-1",
                    "title": "CONCERT PROGRAM",
                    "content": "Final piece: 'Requiem for a Lost Note' - marked with unusual annotations",
                    "clueId": "annotated_program"
                },
                {
                    "id": "doc-2",
                    "title": "ANONYMOUS THREAT LETTER",
                    "content": "Postmarked November 14: 'Your final performance will be memorable...'",
                    "clueId": "threat_letter"
                }
            ],
            
            "forensics": [
                {
                    "id": "forensic-1",
                    "title": "FIBER ANALYSIS REPORT",
                    "content": "Blue polyester fibers embedded in broken violin string - match stagehand uniform",
                    "clueId": "blue_fibers"
                }
            ]
        },
        
        "witnesses": [
            {
                "name": "Carlos Mendoza",
                "role": "Stage Manager",
                "testimony": "I heard arguing from her dressing room about 30 minutes before the show. A man's voice, sounded angry. When I knocked to check, she said everything was fine, but her voice was shaky.",
                "questions": [
                    { "id": "q1", "text": "What did the man look like?", "answer": "Tall, wearing a dark coat, distinctive grey hair." },
                    { "id": "q2", "text": "Had you seen him before?", "answer": "Similar man argued with Evelyn at last month's concert." }
                ],
                "clueId": "arguing_man"
            },
            {
                "name": "Melissa Chen",
                "role": "Understudy Violinist",
                "testimony": "Evelyn seemed distracted all week. She kept checking her phone and muttering about 'unfinished business'.",
                "questions": [
                    { "id": "q3", "text": "Did she mention any threats?", "answer": "She said someone was 'trying to silence her music'." },
                    { "id": "q4", "text": "Who was she talking to on the phone?", "answer": "I overheard her say 'Adrian, it's over'." }
                ],
                "clueId": "distracted_victim"
            }
        ],
        
        "solution": {
            "culprit": "Adrian Volkov (Rival Musician)",
            "motive": "Professional jealousy and revenge for being replaced",
            "method": "Disguised as a stagehand, convinced Evelyn to meet him alone",
            "requiredClues": ["threat_letter", "blue_fibers", "arguing_man", "annotated_program"],
            "explanation": "Adrian Volkov, Evelyn's former duet partner who was replaced, threatened her career. The blue fibers match his signature blue scarf. The annotated program reveals hidden musical threats."
        },
        
        "hints": [
            "Examine the concert program annotations carefully.",
            "The blue fibers are key - they match a specific uniform.",
            "Connect the threat letter's mention of 'Aris' to both Evelyn and her main rival."
        ]
    };
}

// ====== DOM ELEMENTS ======
const elements = {
    // Header elements
    rank: document.getElementById('rank'),
    casesSolved: document.getElementById('cases-solved'),
    ccp: document.getElementById('ccp'),
    
    // Case info elements
    caseId: document.getElementById('case-id'),
    caseYear: document.getElementById('case-year'),
    caseDifficulty: document.getElementById('case-difficulty'),
    caseTitle: document.getElementById('case-title'),
    caseSummary: document.getElementById('case-summary'),
    
    // Evidence elements
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    evidenceGrid: document.querySelector('.evidence-grid'),
    documentList: document.querySelector('.document-list'),
    forensicsList: document.querySelector('.forensics-list'),
    
    // Witness elements
    prevWitnessBtn: document.getElementById('prev-witness'),
    nextWitnessBtn: document.getElementById('next-witness'),
    witnessCounter: document.querySelector('.witness-counter'),
    witnesses: document.querySelectorAll('.witness'),
    questionButtons: document.querySelectorAll('.question-btn'),
    
    // Notes elements
    detectiveNotes: document.getElementById('detective-notes'),
    clueList: document.getElementById('clue-list'),
    
    // Action buttons
    hintBtn: document.getElementById('hint-btn'),
    solveBtn: document.getElementById('solve-btn'),
    
    // Footer elements
    progressFill: document.querySelector('.progress-fill'),
    progressText: document.querySelector('.progress-text'),
    newCaseBtn: document.getElementById('new-case-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    helpBtn: document.getElementById('help-btn'),
    selectCaseBtn: document.getElementById('select-case-btn'),
    
    // Modal elements
    solveModal: document.getElementById('solve-modal'),
    hintModal: document.getElementById('hint-modal'),
    caseSelectionModal: document.getElementById('case-selection-modal'),
    closeModalButtons: document.querySelectorAll('.close-modal'),
    culpritSelect: document.getElementById('culprit-select'),
    motiveSelect: document.getElementById('motive-select'),
    methodSelect: document.getElementById('method-select'),
    finalTheory: document.getElementById('final-theory'),
    submitSolution: document.getElementById('submit-solution'),
    hintText: document.getElementById('hint-text'),
    confirmHint: document.getElementById('confirm-hint'),
    closeCaseSelect: document.getElementById('close-case-select'),
    caseListContainer: document.getElementById('case-list-container'),
    
    // Loading screen
    loadingScreen: document.getElementById('loading-screen')
};

// ====== INITIALIZATION ======
async function initGame() {
    console.log('🚓 Cold Case Files - Initializing Game');
    
    try {
        // Load external cases first
        await loadExternalCases();
        
        // Initialize save manager if available
        if (window.SaveManager) {
            window.SaveManager.init();
        }
        
        // Load saved game state
        loadGameState();
        
        // Set up current case
        if (cases.length > 0) {
            loadCase(gameState.currentCaseIndex);
        } else {
            console.error('No cases available to load');
            showNotification('❌ No case files found. Please check cases folder.', 'error');
        }
        
        // Update UI with game state
        updateGameUI();
        
        // Set up event listeners
        setupEventListeners();
        
        // Check if first time playing
        if (!localStorage.getItem('coldCaseFilesFirstVisit')) {
            setTimeout(() => showTutorial(), 1000);
            localStorage.setItem('coldCaseFilesFirstVisit', 'true');
        }
        
        console.log('✅ Game initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        showNotification('❌ Game initialization failed. Check console for details.', 'error');
        return false;
    }
}

// ====== CASE MANAGEMENT ======
function loadCase(caseIndex) {
    if (!cases || cases.length === 0) {
        console.error('No cases available');
        showNotification('❌ No cases loaded. Please check case files.', 'error');
        return;
    }
    
    if (caseIndex < 0 || caseIndex >= cases.length) {
        console.error('Invalid case index:', caseIndex);
        caseIndex = 0;
    }
    
    const currentCase = cases[caseIndex];
    gameState.currentCaseIndex = caseIndex;
    
    console.log(`📁 Loading case: ${currentCase.title}`);
    
    // Update case info
    elements.caseId.textContent = currentCase.id || 'CCF-XXXX-XXX';
    elements.caseYear.textContent = currentCase.year || 'XXXX';
    elements.caseDifficulty.textContent = currentCase.difficulty || 'UNKNOWN';
    elements.caseDifficulty.className = currentCase.difficultyClass || 'difficulty-unknown';
    elements.caseTitle.textContent = currentCase.title || 'UNKNOWN CASE';
    elements.caseSummary.textContent = currentCase.summary || 'No case description available.';
    
    // Update evidence display
    updateEvidenceDisplay(currentCase);
    
    // Update witnesses display
    updateWitnessesDisplay(currentCase);
    
    // Update clue list
    updateClueList();
    
    // Reset witness index
    gameState.currentWitnessIndex = 0;
    updateWitnessNavigation();
    
    // Reset investigation progress for new case
    gameState.investigationProgress = 40;
    updateProgressBar();
    
    // Clear notes for new case
    elements.detectiveNotes.value = '';
    gameState.playerNotes = '';
    
    // Reset discovered clues for this case
    gameState.discoveredClues = currentCase.evidence?.photos?.[0]?.clueId ? [currentCase.evidence.photos[0].clueId] : [];
    
    showNotification(`📁 Case loaded: ${currentCase.title}`);
}

function updateEvidenceDisplay(caseData) {
    // Clear existing evidence
    if (elements.evidenceGrid) {
        elements.evidenceGrid.innerHTML = '';
    }
    if (elements.documentList) {
        elements.documentList.innerHTML = '';
    }
    if (elements.forensicsList) {
        elements.forensicsList.innerHTML = '';
    }
    
    const evidence = caseData.evidence || {};
    
    // Update photos
    if (evidence.photos && elements.evidenceGrid) {
        evidence.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'evidence-item';
            photoElement.dataset.id = photo.id;
            
            photoElement.innerHTML = `
                <div class="evidence-img-placeholder">
                    <i class="fas fa-image"></i>
                    <span>${photo.title || 'Evidence Photo'}</span>
                </div>
                <p class="evidence-desc">${photo.description || 'No description'}</p>
            `;
            
            photoElement.addEventListener('click', () => {
                discoverClue(photo.clueId, photo.title);
                showNotification(`🔍 Examined: ${photo.title}`);
            });
            
            elements.evidenceGrid.appendChild(photoElement);
        });
    }
    
    // Update documents
    if (evidence.documents && elements.documentList) {
        evidence.documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-item';
            docElement.dataset.id = doc.id;
            
            docElement.innerHTML = `
                <h4><i class="fas fa-file-alt"></i> ${doc.title || 'UNKNOWN DOCUMENT'}</h4>
                <p>${doc.content ? doc.content.substring(0, 100) + '...' : 'No content'}</p>
            `;
            
            docElement.addEventListener('click', () => {
                discoverClue(doc.clueId, doc.title);
                showNotification(`📄 Document: ${doc.title}`);
                // In a full implementation, show document modal here
            });
            
            elements.documentList.appendChild(docElement);
        });
    }
    
    // Update forensics
    if (evidence.forensics && elements.forensicsList) {
        evidence.forensics.forEach(forensic => {
            const forensicElement = document.createElement('div');
            forensicElement.className = 'forensic-item';
            forensicElement.dataset.id = forensic.id;
            
            forensicElement.innerHTML = `
                <h4><i class="fas fa-microscope"></i> ${forensic.title || 'FORENSIC REPORT'}</h4>
                <p>${forensic.content ? forensic.content.substring(0, 100) + '...' : 'No data'}</p>
            `;
            
            forensicElement.addEventListener('click', () => {
                discoverClue(forensic.clueId, forensic.title);
                showNotification(`🔬 Forensic: ${forensic.title}`);
            });
            
            elements.forensicsList.appendChild(forensicElement);
        });
    }
}

function updateWitnessesDisplay(caseData) {
    const witnesses = caseData.witnesses || [];
    
    // Update witness containers
    elements.witnesses.forEach((witnessElement, index) => {
        if (index < witnesses.length) {
            witnessElement.style.display = 'flex';
            
            // Update witness content
            const witness = witnesses[index];
            const witnessHeader = witnessElement.querySelector('.witness-header h3');
            const witnessRole = witnessElement.querySelector('.witness-role');
            const testimony = witnessElement.querySelector('.witness-testimony p');
            const questionButtons = witnessElement.querySelectorAll('.question-btn');
            
            if (witnessHeader) {
                witnessHeader.innerHTML = `<i class="fas fa-${index === 0 ? 'user-tie' : 'music'}"></i> ${witness.name || 'UNKNOWN WITNESS'}`;
            }
            if (witnessRole) witnessRole.textContent = witness.role || 'Unknown role';
            if (testimony) testimony.textContent = witness.testimony || 'No testimony available.';
            
            // Update question buttons
            if (witness.questions) {
                questionButtons.forEach((btn, qIndex) => {
                    if (qIndex < witness.questions.length) {
                        btn.textContent = witness.questions[qIndex].text;
                        btn.dataset.questionId = witness.questions[qIndex].id;
                        btn.dataset.witnessIndex = index;
                        btn.dataset.questionIndex = qIndex;
                        btn.style.display = 'block';
                    } else {
                        btn.style.display = 'none';
                    }
                });
            }
        } else {
            witnessElement.style.display = 'none';
        }
    });
    
    // Set first witness as active
    elements.witnesses.forEach((witness, index) => {
        witness.classList.toggle('active', index === 0);
    });
    
    gameState.currentWitnessIndex = 0;
    updateWitnessCounter();
}

function updateClueList() {
    const currentCase = cases[gameState.currentCaseIndex];
    if (!currentCase) return;
    
    const clueList = elements.clueList;
    clueList.innerHTML = '';
    
    // Collect all clues from the case
    const allClues = [];
    
    // From photos
    if (currentCase.evidence?.photos) {
        currentCase.evidence.photos.forEach(photo => {
            if (photo.clueId) {
                allClues.push({
                    id: photo.clueId,
                    text: photo.title || 'Photo clue',
                    type: 'photo'
                });
            }
        });
    }
    
    // From documents
    if (currentCase.evidence?.documents) {
        currentCase.evidence.documents.forEach(doc => {
            if (doc.clueId) {
                allClues.push({
                    id: doc.clueId,
                    text: doc.title || 'Document clue',
                    type: 'document'
                });
            }
        });
    }
    
    // From forensics
    if (currentCase.evidence?.forensics) {
        currentCase.evidence.forensics.forEach(forensic => {
            if (forensic.clueId) {
                allClues.push({
                    id: forensic.clueId,
                    text: forensic.title || 'Forensic clue',
                    type: 'forensic'
                });
            }
        });
    }
    
    // From witnesses
    if (currentCase.witnesses) {
        currentCase.witnesses.forEach(witness => {
            if (witness.clueId) {
                allClues.push({
                    id: witness.clueId,
                    text: `${witness.name}'s testimony`,
                    type: 'witness'
                });
            }
        });
    }
    
    // Add clues to list
    allClues.forEach(clue => {
        const li = document.createElement('li');
        const isDiscovered = gameState.discoveredClues.includes(clue.id);
        
        li.innerHTML = `<i class="fas fa-${isDiscovered ? 'check-circle' : 'circle'}"></i> ${clue.text}`;
        
        // Make clue clickable to discover
        if (!isDiscovered) {
            li.style.cursor = 'pointer';
            li.title = 'Click to discover clue';
            li.addEventListener('click', () => discoverClue(clue.id, clue.text));
        }
        
        clueList.appendChild(li);
    });
}

// ====== CASE SELECTION MODAL ======
function showCaseSelectionModal() {
    elements.caseListContainer.innerHTML = '';
    
    if (!cases || cases.length === 0) {
        elements.caseListContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8a9ba8;">
                <i class="fas fa-folder-open" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>No Cases Available</h3>
                <p>Check the cases folder for case files.</p>
            </div>
        `;
        openModal(elements.caseSelectionModal);
        return;
    }
    
    cases.forEach((caseItem, index) => {
        const caseCard = document.createElement('div');
        caseCard.className = 'case-selection-card';
        caseCard.style.cssText = `
            background-color: #1a2b3e;
            border: 1px solid #2c3e50;
            border-radius: 5px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        caseCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <div style="font-size: 12px; color: #8a9ba8;">${caseItem.id || 'CASE-XXX'}</div>
                    <div style="font-weight: bold; color: #e6e6e6; font-size: 16px;">${caseItem.title || 'Unknown Case'}</div>
                </div>
                <span style="
                    background-color: ${caseItem.difficulty === 'BEGINNER' ? '#3dcc91' : caseItem.difficulty === 'INTERMEDIATE' ? '#f5a623' : '#e74c3c'};
                    color: #0a1929;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: bold;
                ">
                    ${caseItem.difficulty || 'UNKNOWN'}
                </span>
            </div>
            <div style="font-size: 12px; color: #8a9ba8; margin-bottom: 10px;">
                Year: ${caseItem.year || 'XXXX'} | Status: ${index === gameState.currentCaseIndex ? 'Current' : 'Available'}
            </div>
            <div style="font-size: 13px; color: #8a9ba8; line-height: 1.4;">
                ${caseItem.summary ? caseItem.summary.substring(0, 120) + '...' : 'No description'}
            </div>
        `;
        
        caseCard.addEventListener('mouseenter', () => {
            caseCard.style.borderColor = '#4a90e2';
            caseCard.style.transform = 'translateY(-2px)';
        });
        
        caseCard.addEventListener('mouseleave', () => {
            caseCard.style.borderColor = '#2c3e50';
            caseCard.style.transform = 'translateY(0)';
        });
        
        caseCard.addEventListener('click', () => {
            loadCase(index);
            closeModal(elements.caseSelectionModal);
        });
        
        elements.caseListContainer.appendChild(caseCard);
    });
    
    openModal(elements.caseSelectionModal);
}

// ====== GAME MECHANICS (Keep existing functions) ======
function discoverClue(clueId, clueText) {
    if (!clueId) return;
    
    if (!gameState.discoveredClues.includes(clueId)) {
        gameState.discoveredClues.push(clueId);
        
        // Award CCP for discovering clues
        gameState.coldCasePoints += 10;
        
        // Update investigation progress
        gameState.investigationProgress = Math.min(100, gameState.investigationProgress + 15);
        
        // Update UI
        updateClueList();
        updateGameUI();
        updateProgressBar();
        
        // Show notification
        showNotification(`🔍 Clue Discovered: ${clueText} (+10 CCP)`);
        
        console.log(`🔍 Discovered clue: ${clueId}`);
    }
}

function askQuestion(witnessIndex, questionIndex) {
    const currentCase = cases[gameState.currentCaseIndex];
    if (!currentCase || !currentCase.witnesses) return;
    
    const witness = currentCase.witnesses[witnessIndex];
    if (!witness || !witness.questions) return;
    
    const question = witness.questions[questionIndex];
    if (!question) return;
    
    // Show answer in a notification
    showNotification(`🗣️ ${witness.name}: "${question.answer}"`);
    
    // Award CCP for asking questions
    gameState.coldCasePoints += 5;
    gameState.investigationProgress = Math.min(100, gameState.investigationProgress + 5);
    
    // Update UI
    updateGameUI();
    updateProgressBar();
    
    // Check if this reveals a clue
    if (witness.clueId && !gameState.discoveredClues.includes(witness.clueId)) {
        discoverClue(witness.clueId, `Witness testimony: ${witness.name}`);
    }
    
    console.log(`❓ Asked question: ${question.text}`);
}

function purchaseHint() {
    if (gameState.coldCasePoints >= 25) {
        gameState.coldCasePoints -= 25;
        
        const currentCase = cases[gameState.currentCaseIndex];
        if (currentCase && currentCase.hints && currentCase.hints.length > 0) {
            const randomHint = currentCase.hints[Math.floor(Math.random() * currentCase.hints.length)];
            
            // Show hint
            showNotification(`💡 Hint: ${randomHint}`);
            
            // Update UI
            updateGameUI();
        }
        
        // Close hint modal
        closeModal(elements.hintModal);
        
        console.log('💡 Hint purchased');
    } else {
        showNotification('❌ Not enough Cold Case Points! Solve more clues.', 'error');
    }
}

function submitSolution() {
    const culprit = elements.culpritSelect.value;
    const motive = elements.motiveSelect.value;
    const method = elements.methodSelect.value;
    const theory = elements.finalTheory.value;
    
    if (!culprit || !motive || !method || !theory) {
        showNotification('❌ Please fill in all fields before submitting.', 'error');
        return;
    }
    
    const currentCase = cases[gameState.currentCaseIndex];
    if (!currentCase || !currentCase.solution) {
        showNotification('❌ Case data incomplete.', 'error');
        return;
    }
    
    const solution = currentCase.solution;
    
    // Simple scoring system
    let score = 0;
    let maxScore = 100;
    
    // Check culprit (40 points)
    if (culprit.includes('rival') || culprit.includes('Adrian')) score += 40;
    
    // Check motive (30 points)
    if (motive.includes('jealousy')) score += 30;
    
    // Check method (20 points)
    if (method.includes('kidnap') || method.includes('stagehand')) score += 20;
    
    // Theory completeness (10 points)
    if (theory.length > 50) score += 10;
    
    // Bonus for discovered clues
    const clueBonus = Math.min(20, gameState.discoveredClues.length * 5);
    score += clueBonus;
    
    // Calculate result
    const percentage = Math.round((score / maxScore) * 100);
    let resultMessage = '';
    let ccpReward = 0;
    
    if (percentage >= 90) {
        resultMessage = '🎖️ PERFECT SOLVE! All evidence accounted for.';
        ccpReward = 100;
        gameState.playerRank = updateRank(true);
    } else if (percentage >= 70) {
        resultMessage = '✅ CASE SOLVED! Good detective work.';
        ccpReward = 70;
    } else if (percentage >= 50) {
        resultMessage = '⚠️ PARTIAL SOLVE. Some inconsistencies remain.';
        ccpReward = 50;
    } else {
        resultMessage = '❌ CASE UNSOLVED. Review the evidence and try again.';
        ccpReward = 10;
    }
    
    // Update game state
    gameState.casesSolved++;
    gameState.coldCasePoints += ccpReward;
    
    // Reset for next case (if available)
    gameState.discoveredClues = [];
    gameState.investigationProgress = 40;
    
    // Show results
    showResultsModal(percentage, resultMessage, ccpReward, solution);
    
    console.log(`📊 Case solved with ${percentage}% accuracy`);
}

function updateRank(perfectSolve = false) {
    const ranks = [
        'ROOKIE DETECTIVE',
        'DETECTIVE',
        'SENIOR DETECTIVE',
        'INSPECTOR',
        'CHIEF INSPECTOR'
    ];
    
    const currentIndex = ranks.indexOf(gameState.playerRank);
    
    if (perfectSolve && currentIndex < ranks.length - 1) {
        return ranks[currentIndex + 1];
    }
    
    return gameState.playerRank;
}

// ====== UI UPDATES ======
function updateGameUI() {
    elements.rank.textContent = gameState.playerRank;
    elements.casesSolved.textContent = gameState.casesSolved;
    elements.ccp.textContent = gameState.coldCasePoints;
}

function updateProgressBar() {
    elements.progressFill.style.width = `${gameState.investigationProgress}%`;
    elements.progressText.textContent = `INVESTIGATION PROGRESS: ${gameState.investigationProgress}%`;
}

function updateWitnessNavigation() {
    updateWitnessCounter();
    
    // Show/hide navigation buttons
    elements.prevWitnessBtn.style.visibility = gameState.currentWitnessIndex > 0 ? 'visible' : 'hidden';
    elements.nextWitnessBtn.style.visibility = gameState.currentWitnessIndex < (cases[gameState.currentCaseIndex]?.witnesses?.length || 1) - 1 ? 'visible' : 'hidden';
}

function updateWitnessCounter() {
    const currentCase = cases[gameState.currentCaseIndex];
    const totalWitnesses = currentCase?.witnesses?.length || 0;
    elements.witnessCounter.textContent = `Witness ${gameState.currentWitnessIndex + 1} of ${totalWitnesses}`;
}

function switchWitness(direction) {
    const currentCase = cases[gameState.currentCaseIndex];
    if (!currentCase) return;
    
    const totalWitnesses = currentCase.witnesses?.length || 0;
    
    if (direction === 'next' && gameState.currentWitnessIndex < totalWitnesses - 1) {
        gameState.currentWitnessIndex++;
    } else if (direction === 'prev' && gameState.currentWitnessIndex > 0) {
        gameState.currentWitnessIndex--;
    }
    
    // Update active witness
    elements.witnesses.forEach((witness, index) => {
        witness.classList.toggle('active', index === gameState.currentWitnessIndex);
    });
    
    updateWitnessNavigation();
}

function switchTab(tabName) {
    // Update tab buttons
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// ====== MODAL FUNCTIONS ======
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate hint modal
    if (modal === elements.hintModal) {
        const currentCase = cases[gameState.currentCaseIndex];
        if (currentCase && currentCase.hints && currentCase.hints.length > 0) {
            const randomHint = currentCase.hints[Math.floor(Math.random() * currentCase.hints.length)];
            elements.hintText.textContent = randomHint;
        }
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    closeModal(elements.solveModal);
    closeModal(elements.hintModal);
    closeModal(elements.caseSelectionModal);
}

function showResultsModal(percentage, message, ccpReward, solution) {
    // Create results modal HTML
    const resultsHTML = `
        <div class="modal" id="results-modal">
            <div class="modal-content">
                <div class="modal-header">
                   