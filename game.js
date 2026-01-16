/* ====== COLD CASE FILES - GAME LOGIC ====== */
/* Main JavaScript File */

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
    gameVersion: '1.0.0'
};

// ====== SAMPLE CASES DATA ======
const cases = [
    {
        id: 'CCF-1987-045',
        title: 'THE VANISHING VIOLINIST',
        year: 1987,
        difficulty: 'BEGINNER',
        difficultyClass: 'difficulty-beginner',
        summary: 'Renowned violinist Evelyn Vance disappeared after her final performance at the Royal Symphony Hall on November 15, 1987. No ransom note, no witnesses, just an empty dressing room and a broken violin string.',
        
        evidence: {
            photos: [
                {
                    id: 'photo-1',
                    title: 'Backstage Area',
                    description: 'Backstage area - overturned stool and scattered sheet music',
                    clueId: 'overturned_stool'
                },
                {
                    id: 'photo-2',
                    title: 'Victim\'s Dressing Room',
                    description: 'Note the open window and untouched personal belongings',
                    clueId: 'open_window'
                },
                {
                    id: 'photo-3',
                    title: 'Concert Poster',
                    description: '"Final Performance of the Season" - November 15, 1987',
                    clueId: 'concert_date'
                }
            ],
            documents: [
                {
                    id: 'doc-1',
                    title: 'Concert Program',
                    content: 'Final piece: "Requiem for a Lost Note" - marked with unusual annotations',
                    clueId: 'annotated_program'
                },
                {
                    id: 'doc-2',
                    title: 'Anonymous Letter',
                    content: 'Postmarked November 14: "Your final performance will be memorable..."',
                    clueId: 'threat_letter'
                },
                {
                    id: 'doc-3',
                    title: 'Backstage Log',
                    content: 'Several unauthorized visitors signed in with false names',
                    clueId: 'false_names'
                }
            ],
            forensics: [
                {
                    id: 'forensic-1',
                    title: 'Fiber Analysis',
                    content: 'Unusual blue fibers found on the broken violin string - not from victim\'s clothing',
                    clueId: 'blue_fibers'
                },
                {
                    id: 'forensic-2',
                    title: 'Fingerprints',
                    content: 'Multiple unidentified prints on the dressing room window frame',
                    clueId: 'unidentified_prints'
                }
            ]
        },
        
        witnesses: [
            {
                name: 'Stage Manager',
                role: 'Carlos Mendoza',
                testimony: 'I heard arguing from her dressing room about 30 minutes before the show. A man\'s voice, sounded angry. When I knocked to check, she said everything was fine, but her voice was shaky.',
                questions: [
                    { id: 'q1', text: 'What did the man look like?', answer: 'I only saw his back - tall, wearing a dark coat. He had distinctive grey hair.' },
                    { id: 'q2', text: 'Had you seen him before?', answer: 'Maybe... there was a man with similar hair at last month\'s concert, arguing with Evelyn then too.' },
                    { id: 'q3', text: 'Was anything unusual backstage?', answer: 'The fire exit was propped open, which is against regulations.' }
                ],
                clueId: 'arguing_man'
            },
            {
                name: 'Understudy',
                role: 'Melissa Chen',
                testimony: 'Evelyn seemed distracted all week. She kept checking her phone and muttering about "unfinished business". I thought it was just pre-performance nerves.',
                questions: [
                    { id: 'q4', text: 'Did she mention any threats?', answer: 'She said someone was "trying to silence her music" but wouldn\'t say who.' },
                    { id: 'q5', text: 'Who was she talking to on the phone?', answer: 'I overheard her say "Adrian" once, sounding very upset.' },
                    { id: 'q6', text: 'Was she having problems with anyone?', answer: 'There were rumors about a dispute with a former duet partner.' }
                ],
                clueId: 'distracted_victim'
            }
        ],
        
        solution: {
            culprit: 'Adrian Volkov (Rival Musician)',
            motive: 'Professional jealousy and revenge for being replaced',
            method: 'Disguised as a stagehand, convinced Evelyn to meet him alone after the show',
            requiredClues: ['threat_letter', 'blue_fibers', 'arguing_man', 'annotated_program'],
            explanation: 'Adrian Volkov, Evelyn\'s former duet partner who was replaced, threatened her career. The blue fibers match his signature blue scarf. The annotated program reveals hidden musical threats.'
        },
        
        hints: [
            'Examine the concert program more carefully. The annotations may reveal a hidden message.',
            'Check the timeline - the argument happened 30 minutes before the show, not during.',
            'The blue fibers are the key physical evidence. Who wears blue accessories frequently?',
            'Look for connections between the anonymous letter and people in Evelyn\'s life.'
        ]
    },
    {
        id: 'CCF-1992-018',
        title: 'THE SILENCED WHISTLEBLOWER',
        year: 1992,
        difficulty: 'INTERMEDIATE',
        difficultyClass: 'difficulty-intermediate',
        summary: 'Corporate accountant Michael Thorne was found dead in his office after threatening to expose financial fraud. Suicide was ruled, but the evidence doesn\'t add up.',
        
        evidence: {
            photos: [],
            documents: [],
            forensics: []
        },
        
        witnesses: [],
        
        solution: {
            culprit: '',
            motive: '',
            method: '',
            requiredClues: [],
            explanation: ''
        },
        
        hints: []
    }
];

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
    
    // Modal elements
    solveModal: document.getElementById('solve-modal'),
    hintModal: document.getElementById('hint-modal'),
    closeModalButtons: document.querySelectorAll('.close-modal'),
    culpritSelect: document.getElementById('culprit-select'),
    motiveSelect: document.getElementById('motive-select'),
    methodSelect: document.getElementById('method-select'),
    finalTheory: document.getElementById('final-theory'),
    submitSolution: document.getElementById('submit-solution'),
    hintText: document.getElementById('hint-text'),
    confirmHint: document.getElementById('confirm-hint')
};

// ====== INITIALIZATION ======
function initGame() {
    console.log('🚓 Cold Case Files - Initializing Game');
    
    // Load saved game state
    loadGameState();
    
    // Set up current case
    loadCase(gameState.currentCaseIndex);
    
    // Update UI with game state
    updateGameUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if first time playing
    if (!localStorage.getItem('coldCaseFilesFirstVisit')) {
        showTutorial();
        localStorage.setItem('coldCaseFilesFirstVisit', 'true');
    }
    
    console.log('✅ Game initialized successfully');
}

// ====== CASE MANAGEMENT ======
function loadCase(caseIndex) {
    if (caseIndex < 0 || caseIndex >= cases.length) {
        console.error('Invalid case index:', caseIndex);
        return;
    }
    
    const currentCase = cases[caseIndex];
    gameState.currentCaseIndex = caseIndex;
    
    // Update case info
    elements.caseId.textContent = currentCase.id;
    elements.caseYear.textContent = currentCase.year;
    elements.caseDifficulty.textContent = currentCase.difficulty;
    elements.caseDifficulty.className = currentCase.difficultyClass;
    elements.caseTitle.textContent = currentCase.title;
    elements.caseSummary.textContent = currentCase.summary;
    
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
    
    console.log(`📁 Loaded case: ${currentCase.title}`);
}

function updateEvidenceDisplay(caseData) {
    // For now, we'll keep the static evidence display
    // In a full implementation, we'd dynamically generate evidence items
    console.log('Updating evidence display for:', caseData.title);
}

function updateWitnessesDisplay(caseData) {
    const witnesses = caseData.witnesses;
    
    // Show/hide witnesses based on data
    elements.witnesses.forEach((witnessElement, index) => {
        if (index < witnesses.length) {
            witnessElement.style.display = 'flex';
            
            // Update witness content
            const witnessHeader = witnessElement.querySelector('.witness-header h3');
            const witnessRole = witnessElement.querySelector('.witness-role');
            const testimony = witnessElement.querySelector('.witness-testimony p');
            const questionButtons = witnessElement.querySelectorAll('.question-btn');
            
            if (witnessHeader) witnessHeader.innerHTML = `<i class="fas fa-${index === 0 ? 'user-tie' : 'music'}"></i> ${witnesses[index].name}`;
            if (witnessRole) witnessRole.textContent = witnesses[index].role;
            if (testimony) testimony.textContent = witnesses[index].testimony;
            
            // Update question buttons
            questionButtons.forEach((btn, qIndex) => {
                if (qIndex < witnesses[index].questions.length) {
                    btn.textContent = witnesses[index].questions[qIndex].text;
                    btn.dataset.questionId = witnesses[index].questions[qIndex].id;
                    btn.dataset.witnessIndex = index;
                    btn.dataset.questionIndex = qIndex;
                } else {
                    btn.style.display = 'none';
                }
            });
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
    const clueList = elements.clueList;
    clueList.innerHTML = '';
    
    // Define all possible clues for this case
    const allClues = [
        { id: 'broken_string', text: 'Broken violin string' },
        { id: 'threat_letter', text: 'Anonymous threat letter' },
        { id: 'blue_fibers', text: 'Blue fibers on string' },
        { id: 'unidentified_prints', text: 'Unidentified fingerprints' },
        { id: 'arguing_man', text: 'Witness saw arguing man' },
        { id: 'annotated_program', text: 'Annotated concert program' }
    ];
    
    // Add clues to list
    allClues.forEach(clue => {
        const li = document.createElement('li');
        const isDiscovered = gameState.discoveredClues.includes(clue.id);
        
        li.innerHTML = `<i class="fas fa-${isDiscovered ? 'check-circle' : 'circle'}"></i> ${clue.text}`;
        clueList.appendChild(li);
        
        // Make clue clickable to discover
        li.style.cursor = 'pointer';
        li.title = isDiscovered ? 'Clue discovered' : 'Click to discover clue';
        li.addEventListener('click', () => discoverClue(clue.id, clue.text));
    });
}

// ====== GAME MECHANICS ======
function discoverClue(clueId, clueText) {
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
        
        // Play discovery sound (if audio is added)
        playSound('discovery');
        
        console.log(`🔍 Discovered clue: ${clueId}`);
    }
}

function askQuestion(witnessIndex, questionIndex) {
    const currentCase = cases[gameState.currentCaseIndex];
    const witness = currentCase.witnesses[witnessIndex];
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
        const randomHint = currentCase.hints[Math.floor(Math.random() * currentCase.hints.length)];
        
        // Show hint
        showNotification(`💡 Hint: ${randomHint}`);
        
        // Update UI
        updateGameUI();
        
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
    const solution = currentCase.solution;
    
    // Simple scoring system
    let score = 0;
    let maxScore = 100;
    
    // Check culprit (40 points)
    if (culprit === 'rival') score += 40;
    
    // Check motive (30 points)
    if (motive === 'jealousy') score += 30;
    
    // Check method (20 points)
    if (method === 'kidnap') score += 20;
    
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
    elements.nextWitnessBtn.style.visibility = gameState.currentWitnessIndex < cases[gameState.currentCaseIndex].witnesses.length - 1 ? 'visible' : 'visible';
}

function updateWitnessCounter() {
    const totalWitnesses = cases[gameState.currentCaseIndex].witnesses.length;
    elements.witnessCounter.textContent = `Witness ${gameState.currentWitnessIndex + 1} of ${totalWitnesses}`;
}

function switchWitness(direction) {
    const totalWitnesses = cases[gameState.currentCaseIndex].witnesses.length;
    
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
        const randomHint = currentCase.hints[Math.floor(Math.random() * currentCase.hints.length)];
        elements.hintText.textContent = randomHint;
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    closeModal(elements.solveModal);
    closeModal(elements.hintModal);
}

function showResultsModal(percentage, message, ccpReward, solution) {
    // Create results modal HTML
    const resultsHTML = `
        <div class="modal" id="results-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-line"></i> CASE RESULTS</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="results-container">
                        <div class="result-score">
                            <h3>ACCURACY: ${percentage}%</h3>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                        
                        <div class="result-message">
                            <p>${message}</p>
                            <p class="reward">Reward: <strong>+${ccpReward} Cold Case Points</strong></p>
                        </div>
                        
                        <div class="correct-solution">
                            <h4><i class="fas fa-check-circle"></i> CORRECT SOLUTION:</h4>
                            <ul>
                                <li><strong>Culprit:</strong> ${solution.culprit}</li>
                                <li><strong>Motive:</strong> ${solution.motive}</li>
                                <li><strong>Method:</strong> ${solution.method}</li>
                            </ul>
                            <p class="explanation">${solution.explanation}</p>
                        </div>
                        
                        <button id="next-case-btn" class="action-btn solve-btn">
                            <i class="fas fa-forward"></i> NEXT CASE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', resultsHTML);
    
    const resultsModal = document.getElementById('results-modal');
    const closeBtn = resultsModal.querySelector('.close-modal');
    const nextCaseBtn = document.getElementById('next-case-btn');
    
    // Show modal
    resultsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close button
    closeBtn.addEventListener('click', () => {
        resultsModal.remove();
        document.body.style.overflow = 'auto';
        
        // Load next case if available
        if (gameState.currentCaseIndex + 1 < cases.length) {
            gameState.currentCaseIndex++;
            loadCase(gameState.currentCaseIndex);
        }
    });
    
    // Next case button
    if (nextCaseBtn) {
        nextCaseBtn.addEventListener('click', () => {
            resultsModal.remove();
            document.body.style.overflow = 'auto';
            
            // Load next case if available
            if (gameState.currentCaseIndex + 1 < cases.length) {
                gameState.currentCaseIndex++;
                loadCase(gameState.currentCaseIndex);
            } else {
                showNotification('🎉 Congratulations! You\'ve solved all available cases. More coming soon!');
            }
        });
    }
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.game-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `game-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#e74c3c' : '#2c3e50'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button event
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ====== SAVE/LOAD SYSTEM ======
function saveGameState() {
    const saveData = {
        ...gameState,
        saveTimestamp: Date.now(),
        saveVersion: gameState.gameVersion
    };
    
    localStorage.setItem('coldCaseFilesSave', JSON.stringify(saveData));
    showNotification('💾 Game progress saved successfully!');
    
    console.log('💾 Game state saved');
}

function loadGameState() {
    const savedData = localStorage.getItem('coldCaseFilesSave');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            // Only load if version matches
            if (parsedData.saveVersion === gameState.gameVersion) {
                Object.assign(gameState, parsedData);
                console.log('💾 Game state loaded');
                showNotification('💾 Previous game loaded', 'info');
            } else {
                console.log('⚠️ Save version mismatch, using default state');
            }
        } catch (error) {
            console.error('❌ Error loading saved game:', error);
        }
    }
}

function resetGameState() {
    if (confirm('Are you sure you want to reset your game progress? This cannot be undone.')) {
        localStorage.removeItem('coldCaseFilesSave');
        localStorage.removeItem('coldCaseFilesFirstVisit');
        
        // Reset game state
        Object.assign(gameState, {
            currentCaseIndex: 0,
            playerRank: 'ROOKIE DETECTIVE',
            casesSolved: 0,
            coldCasePoints: 100,
            currentWitnessIndex: 0,
            investigationProgress: 40,
            discoveredClues: ['broken_string', 'threat_letter'],
            playerNotes: ''
        });
        
        loadCase(0);
        updateGameUI();
        updateProgressBar();
        
        showNotification('🔄 Game reset to initial state');
        console.log('🔄 Game state reset');
    }
}

// ====== TUTORIAL ======
function showTutorial() {
    const tutorialHTML = `
        <div class="modal" id="tutorial-modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-graduation-cap"></i> WELCOME, DETECTIVE</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="tutorial-steps">
                        <div class="tutorial-step">
                            <h3><i class="fas fa-search"></i> STEP 1: EXAMINE EVIDENCE</h3>
                            <p>Click through photos, documents, and forensic reports in the evidence panel. Click on clues to discover them.</p>
                        </div>
                        
                        <div class="tutorial-step">
                            <h3><i class="fas fa-user-check"></i> STEP 2: INTERVIEW WITNESSES</h3>
                            <p>Switch between witnesses and ask them questions. Their answers may reveal crucial information.</p>
                        </div>
                        
                        <div class="tutorial-step">
                            <h3><i class="fas fa-clipboard"></i> STEP 3: TAKE NOTES</h3>
                            <p>Use the detective's notepad to record your theories and connect the clues.</p>
                        </div>
                        
                        <div class="tutorial-step">
                            <h3><i class="fas fa-check-double"></i> STEP 4: SOLVE THE CASE</h3>
                            <p>When you're ready, click "SOLVE CASE" to submit your solution. You'll be graded on accuracy!</p>
                        </div>
                        
                        <div class="tutorial-tips">
                            <h4><i class="fas fa-lightbulb"></i> QUICK TIPS:</h4>
                            <ul>
                                <li>Discover clues to earn <strong>Cold Case Points (CCP)</strong></li>
                                <li>Use CCP to purchase hints when stuck</li>
                                <li>Save your progress regularly</li>
                                <li>Perfect solves improve your detective rank</li>
                            </ul>
                        </div>
                        
                        <button id="start-game-btn" class="action-btn solve-btn" style="width: 100%; margin-top: 20px;">
                            <i class="fas fa-play"></i> START SOLVING
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', tutorialHTML);
    
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeBtn = tutorialModal.querySelector('.close-modal');
    const startBtn = document.getElementById('start-game-btn');
    
    tutorialModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    closeBtn.addEventListener('click', () => {
        tutorialModal.remove();
        document.body.style.overflow = 'auto';
    });
    
    startBtn.addEventListener('click', () => {
        tutorialModal.remove();
        document.body.style.overflow = 'auto';
        showNotification('🔍 First case loaded: "The Vanishing Violinist"');
    });
}

// ====== SOUND EFFECTS ======
function playSound(soundName) {
    // In a full implementation, you would load and play audio files
    console.log(`🔊 Playing sound: ${soundName}`);
    
    // For now, we'll just log it
    const sounds = {
        'discovery': '🔍',
        'solve': '✅',
        'hint': '💡',
        'error': '❌'
    };
    
    if (sounds[soundName]) {
        console.log(sounds[soundName]);
    }
}

// ====== EVENT LISTENERS SETUP ======
function setupEventListeners() {
    // Evidence tabs
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Witness navigation
    elements.prevWitnessBtn.addEventListener('click', () => switchWitness('prev'));
    elements.nextWitnessBtn.addEventListener('click', () => switchWitness('next'));
    
    // Question buttons
    elements.questionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const witnessIndex = parseInt(e.target.dataset.witnessIndex) || 0;
            const questionIndex = parseInt(e.target.dataset.questionIndex) || 0;
            askQuestion(witnessIndex, questionIndex);
        });
    });
    
    // Detective notes auto-save
    elements.detectiveNotes.addEventListener('input', (e) => {
        gameState.playerNotes = e.target.value;
        // Auto-save after 2 seconds of no typing
        clearTimeout(window.notesSaveTimeout);
        window.notesSaveTimeout = setTimeout(() => {
            saveGameState();
        }, 2000);
    });
    
    // Action buttons
    elements.hintBtn.addEventListener('click', () => openModal(elements.hintModal));
    elements.solveBtn.addEventListener('click', () => openModal(elements.solveModal));
    
    // Footer buttons
    elements.newCaseBtn.addEventListener('click', () => {
        if (gameState.currentCaseIndex + 1 < cases.length) {
            gameState.currentCaseIndex++;
            loadCase(gameState.currentCaseIndex);
            showNotification(`📁 New case loaded: ${cases[gameState.currentCaseIndex].title}`);
        } else {
            showNotification('🎉 All cases solved! More coming in future updates.', 'info');
        }
    });
    
    elements.saveBtn.addEventListener('click', saveGameState);
    elements.loadBtn.addEventListener('click', () => {
        loadGameState();
        loadCase(gameState.currentCaseIndex);
        updateGameUI();
        updateProgressBar();
    });
    
    elements.helpBtn.addEventListener('click', showTutorial);
    
    // Modal controls
    elements.closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Submit solution
    elements.submitSolution.addEventListener('click', submitSolution);
    
    // Purchase hint
    elements.confirmHint.addEventListener('click', purchaseHint);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape closes modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        // Ctrl/Cmd + S saves game
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveGameState();
        }
        
        // Ctrl/Cmd + N for new case
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            elements.newCaseBtn.click();
        }
        
        // Number keys for tabs
        if (e.key >= '1' && e.key <= '3') {
            const tabNames = ['photos', 'documents', 'forensics'];
            const tabIndex = parseInt(e.key) - 1;
            if (tabIndex < tabNames.length) {
                switch