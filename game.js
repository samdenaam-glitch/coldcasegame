/* ====== COLD CASE FILES - GAME LOGIC ====== */
/* Complete Working Version */

console.log('🎮 game.js loading...');

// ====== GAME STATE ======
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

// ====== SAMPLE CASE (Fallback) ======
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
                    title: 'Crime Scene: Backstage Area',
                    description: 'Dressing room area showing overturned stool, scattered sheet music.',
                    clueId: 'broken_string'
                },
                {
                    id: 'photo-2',
                    title: 'Victim\'s Dressing Room',
                    description: 'Room appears undisturbed except for open window.',
                    clueId: 'open_window'
                }
            ],
            documents: [
                {
                    id: 'doc-1',
                    title: 'CONCERT PROGRAM',
                    content: 'Final piece marked with unusual annotations.',
                    clueId: 'annotated_program'
                },
                {
                    id: 'doc-2',
                    title: 'ANONYMOUS LETTER',
                    content: 'Postmarked November 14 threatening letter.',
                    clueId: 'threat_letter'
                }
            ],
            forensics: [
                {
                    id: 'forensic-1',
                    title: 'FIBER ANALYSIS',
                    content: 'Blue fibers found on broken violin string.',
                    clueId: 'blue_fibers'
                }
            ]
        },
        
        witnesses: [
            {
                name: 'Carlos Mendoza',
                role: 'Stage Manager',
                testimony: 'I heard arguing from her dressing room about 30 minutes before the show.',
                questions: [
                    { id: 'q1', text: 'What did the man look like?', answer: 'Tall, dark coat, grey hair.' },
                    { id: 'q2', text: 'Had you seen him before?', answer: 'Similar man argued with her last month.' }
                ],
                clueId: 'arguing_man'
            },
            {
                name: 'Melissa Chen',
                role: 'Understudy Violinist',
                testimony: 'Evelyn seemed distracted all week.',
                questions: [
                    { id: 'q3', text: 'Did she mention any threats?', answer: 'Someone was trying to silence her music.' },
                    { id: 'q4', text: 'Who was she talking to?', answer: 'I overheard her say "Adrian, it\'s over".' }
                ],
                clueId: 'distracted_victim'
            }
        ],
        
        solution: {
            culprit: 'Adrian Volkov',
            motive: 'Professional jealousy',
            method: 'Disguised as stagehand',
            requiredClues: ['threat_letter', 'blue_fibers', 'arguing_man'],
            explanation: 'Adrian Volkov, the former duet partner, threatened her career.'
        },
        
        hints: [
            'Examine the concert program annotations.',
            'The blue fibers are key evidence.',
            'Connect the threat letter to both people.'
        ]
    }
];

// ====== DOM ELEMENTS ======
const elements = {
    rank: document.getElementById('rank'),
    casesSolved: document.getElementById('cases-solved'),
    ccp: document.getElementById('ccp'),
    caseId: document.getElementById('case-id'),
    caseYear: document.getElementById('case-year'),
    caseDifficulty: document.getElementById('case-difficulty'),
    caseTitle: document.getElementById('case-title'),
    caseSummary: document.getElementById('case-summary'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    prevWitnessBtn: document.getElementById('prev-witness'),
    nextWitnessBtn: document.getElementById('next-witness'),
    witnessCounter: document.querySelector('.witness-counter'),
    witnesses: document.querySelectorAll('.witness'),
    questionButtons: document.querySelectorAll('.question-btn'),
    detectiveNotes: document.getElementById('detective-notes'),
    clueList: document.getElementById('clue-list'),
    hintBtn: document.getElementById('hint-btn'),
    solveBtn: document.getElementById('solve-btn'),
    progressFill: document.querySelector('.progress-fill'),
    progressText: document.querySelector('.progress-text'),
    newCaseBtn: document.getElementById('new-case-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    helpBtn: document.getElementById('help-btn'),
    selectCaseBtn: document.getElementById('select-case-btn'),
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
    caseListContainer: document.getElementById('case-list-container')
};

// ====== CORE FUNCTIONS ======

function initGame() {
    console.log('🚓 Initializing game...');
    
    try {
        // Load game state
        loadGameState();
        
        // Load current case
        loadCase(gameState.currentCaseIndex);
        
        // Update UI
        updateGameUI();
        updateProgressBar();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ Game initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        return false;
    }
}

function loadGameState() {
    const saved = localStorage.getItem('coldCaseFilesSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
            console.log('💾 Loaded saved game');
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
}

function saveGameState() {
    localStorage.setItem('coldCaseFilesSave', JSON.stringify(gameState));
    console.log('💾 Game saved');
    showNotification('Progress saved!', 'info');
}

function loadCase(caseIndex) {
    if (caseIndex < 0 || caseIndex >= cases.length) {
        console.error('Invalid case index');
        return;
    }
    
    const currentCase = cases[caseIndex];
    gameState.currentCaseIndex = caseIndex;
    
    // Update UI
    elements.caseId.textContent = currentCase.id;
    elements.caseYear.textContent = currentCase.year;
    elements.caseDifficulty.textContent = currentCase.difficulty;
    elements.caseDifficulty.className = currentCase.difficultyClass;
    elements.caseTitle.textContent = currentCase.title;
    elements.caseSummary.textContent = currentCase.summary;
    
    updateClueList();
    gameState.currentWitnessIndex = 0;
    updateWitnessNavigation();
    
    console.log(`📁 Loaded case: ${currentCase.title}`);
}

function updateGameUI() {
    elements.rank.textContent = gameState.playerRank;
    elements.casesSolved.textContent = gameState.casesSolved;
    elements.ccp.textContent = gameState.coldCasePoints;
}

function updateProgressBar() {
    elements.progressFill.style.width = `${gameState.investigationProgress}%`;
    elements.progressText.textContent = `PROGRESS: ${gameState.investigationProgress}%`;
}

function updateClueList() {
    const clueList = elements.clueList;
    clueList.innerHTML = '';
    
    const allClues = [
        { id: 'broken_string', text: 'Broken violin string' },
        { id: 'threat_letter', text: 'Anonymous threat letter' },
        { id: 'blue_fibers', text: 'Blue fibers on string' },
        { id: 'arguing_man', text: 'Witness saw arguing man' }
    ];
    
    allClues.forEach(clue => {
        const li = document.createElement('li');
        const discovered = gameState.discoveredClues.includes(clue.id);
        li.innerHTML = `<i class="fas fa-${discovered ? 'check-circle' : 'circle'}"></i> ${clue.text}`;
        
        if (!discovered) {
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => discoverClue(clue.id, clue.text));
        }
        
        clueList.appendChild(li);
    });
}

function discoverClue(clueId, clueText) {
    if (!gameState.discoveredClues.includes(clueId)) {
        gameState.discoveredClues.push(clueId);
        gameState.coldCasePoints += 10;
        gameState.investigationProgress = Math.min(100, gameState.investigationProgress + 15);
        
        updateClueList();
        updateGameUI();
        updateProgressBar();
        
        showNotification(`🔍 Discovered: ${clueText} (+10 CCP)`, 'info');
    }
}

function updateWitnessNavigation() {
    const totalWitnesses = cases[gameState.currentCaseIndex].witnesses.length;
    elements.witnessCounter.textContent = `Witness ${gameState.currentWitnessIndex + 1} of ${totalWitnesses}`;
    
    elements.prevWitnessBtn.style.visibility = gameState.currentWitnessIndex > 0 ? 'visible' : 'hidden';
    elements.nextWitnessBtn.style.visibility = gameState.currentWitnessIndex < totalWitnesses - 1 ? 'visible' : 'hidden';
}

function switchWitness(direction) {
    const totalWitnesses = cases[gameState.currentCaseIndex].witnesses.length;
    
    if (direction === 'next' && gameState.currentWitnessIndex < totalWitnesses - 1) {
        gameState.currentWitnessIndex++;
    } else if (direction === 'prev' && gameState.currentWitnessIndex > 0) {
        gameState.currentWitnessIndex--;
    }
    
    elements.witnesses.forEach((witness, index) => {
        witness.classList.toggle('active', index === gameState.currentWitnessIndex);
    });
    
    updateWitnessNavigation();
}

function askQuestion(witnessIndex, questionIndex) {
    const witness = cases[gameState.currentCaseIndex].witnesses[witnessIndex];
    const question = witness.questions[questionIndex];
    
    showNotification(`🗣️ ${witness.name}: "${question.answer}"`, 'info');
    gameState.coldCasePoints += 5;
    gameState.investigationProgress = Math.min(100, gameState.investigationProgress + 5);
    
    updateGameUI();
    updateProgressBar();
}

function switchTab(tabName) {
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// ====== MODAL FUNCTIONS ======

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal);
    });
}

function showCaseSelectionModal() {
    elements.caseListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #8a9ba8;">
            <i class="fas fa-folder-open" style="font-size: 48px;"></i>
            <h3>Case Selection</h3>
            <p>Currently only one case available.</p>
            <p style="margin-top: 20px; color: #4a90e2;">THE VANISHING VIOLINIST (1987)</p>
        </div>
    `;
    openModal(elements.caseSelectionModal);
}

function purchaseHint() {
    if (gameState.coldCasePoints >= 25) {
        gameState.coldCasePoints -= 25;
        const hint = cases[gameState.currentCaseIndex].hints[0];
        showNotification(`💡 Hint: ${hint}`, 'info');
        updateGameUI();
        closeModal(elements.hintModal);
    } else {
        showNotification('Not enough CCP!', 'error');
    }
}

function submitSolution() {
    const culprit = elements.culpritSelect.value;
    const motive = elements.motiveSelect.value;
    const method = elements.methodSelect.value;
    
    if (!culprit || !motive || !method) {
        showNotification('Please fill all fields!', 'error');
        return;
    }
    
    let score = 0;
    if (culprit === 'rival') score += 40;
    if (motive === 'jealousy') score += 30;
    if (method === 'kidnap') score += 20;
    
    const percentage = Math.round((score / 100) * 100);
    let message = '';
    
    if (percentage >= 90) {
        message = '🎖️ PERFECT SOLVE!';
        gameState.coldCasePoints += 100;
        gameState.playerRank = 'DETECTIVE';
    } else if (percentage >= 70) {
        message = '✅ CASE SOLVED!';
        gameState.coldCasePoints += 70;
    } else if (percentage >= 50) {
        message = '⚠️ PARTIAL SOLVE';
        gameState.coldCasePoints += 50;
    } else {
        message = '❌ NEED MORE EVIDENCE';
        gameState.coldCasePoints += 10;
    }
    
    gameState.casesSolved++;
    gameState.discoveredClues = [];
    gameState.investigationProgress = 40;
    
    updateGameUI();
    updateProgressBar();
    updateClueList();
    
    closeModal(elements.solveModal);
    showNotification(`${message} (+${gameState.coldCasePoints} CCP)`, 'success');
}

// ====== NOTIFICATION SYSTEM ======

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#3dcc91' : '#2c3e50'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-family: 'Roboto Mono', monospace;
        font-size: 13px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====== EVENT LISTENERS ======

function setupEventListeners() {
    console.log('🔌 Setting up event listeners...');
    
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
    
    // Notes auto-save
    elements.detectiveNotes.addEventListener('input', (e) => {
        gameState.playerNotes = e.target.value;
    });
    
    // Action buttons
    elements.hintBtn.addEventListener('click', () => openModal(elements.hintModal));
    elements.solveBtn.addEventListener('click', () => openModal(elements.solveModal));
    elements.selectCaseBtn.addEventListener('click', showCaseSelectionModal);
    
    // Footer buttons
    elements.saveBtn.addEventListener('click', saveGameState);
    elements.loadBtn.addEventListener('click', loadGameState);
    elements.helpBtn.addEventListener('click', () => {
        showNotification('🔍 Click evidence to discover clues. Interview witnesses. Solve the case!', 'info');
    });
    elements.newCaseBtn.addEventListener('click', () => {
        showNotification('No more cases available yet!', 'info');
    });
    
    // Modal controls
    elements.closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    elements.submitSolution.addEventListener('click', submitSolution);
    elements.confirmHint.addEventListener('click', purchaseHint);
    elements.closeCaseSelect.addEventListener('click', () => closeModal(elements.caseSelectionModal));
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    console.log('✅ Event listeners set up');
}

// ====== INITIALIZE GAME ======
console.log('🎮 game.js loaded successfully');
// Game will be initialized by index.html