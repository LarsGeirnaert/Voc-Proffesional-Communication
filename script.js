// --- 1. SETUP ---
let activeDB = [];
let progressMap = JSON.parse(localStorage.getItem('vocab_progress_v2')) || {};
let starredMap = JSON.parse(localStorage.getItem('vocab_starred')) || {};
let wordStats = JSON.parse(localStorage.getItem('vocab_stats')) || {};

let activeQueue = [];
let currentItem = null;
let score = 0;
let currentListType = null;

let isMaintenanceMode = false; 

// SESSIE VARIABELEN
let sessionTotal = 0;
let sessionCount = 0;
let sessionCorrect = 0;
let sessionWrong = 0;
let sessionCorrectItems = [];
let sessionWrongItems = [];

// CONNECT GAME VARIABELEN
let connectSelection = null; 
let connectMatchesFound = 0;
let connectActiveItems = []; 
let connectLastRoundIds = []; // NIEUW: Houdt bij wat we net gehad hebben

const START_TIME = 25.0;
const VISUAL_MAX_TIME = 60.0;
let timer = START_TIME;
let timerEnabled = true;
let currentMode = 'overdrive';
let isFlipped = false; let isRevealed = false; let isProcessing = false;
let gameInterval; let isPlaying = false;

// AUTOMATISCHE START
window.onload = function() {
    // Check of beide bestanden geladen zijn en merge ze
    if (typeof vocabDatabase !== 'undefined' && typeof vocabSentences !== 'undefined') {
        activeDB = vocabDatabase.map(item => {
            return {
                ...item,
                s: vocabSentences[item.id] || null 
            };
        });

        fixRenamedWords(); 
        populateUnitDropdown();
        refreshStats();
        toggleSettingsUI();
    } else {
        document.getElementById('definition-area').innerText = "ERROR: vocab_base.js of vocab_sentences.js ontbreekt!";
        document.getElementById('definition-area').style.color = "var(--danger)";
    }
};

// --- DATA MIGREREN ---
function fixRenamedWords() {
    const fixes = [{ oldW: "a third-party purchase", newW: "third-party purchase" }];
    let changed = false;
    fixes.forEach(fix => {
        if (wordStats[fix.oldW]) {
            if (!wordStats[fix.newW]) wordStats[fix.newW] = { c: 0, t: 0 };
            wordStats[fix.newW].c += wordStats[fix.oldW].c;
            wordStats[fix.newW].t += wordStats[fix.oldW].t;
            delete wordStats[fix.oldW];
            localStorage.setItem('vocab_stats', JSON.stringify(wordStats));
            changed = true;
        }
        if (progressMap[fix.oldW] !== undefined) {
            if (progressMap[fix.newW] === undefined || progressMap[fix.oldW] > progressMap[fix.newW]) {
                progressMap[fix.newW] = progressMap[fix.oldW];
            }
            delete progressMap[fix.oldW];
            localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap));
            changed = true;
        }
        if (starredMap[fix.oldW]) {
            starredMap[fix.newW] = true;
            delete starredMap[fix.oldW];
            localStorage.setItem('vocab_starred', JSON.stringify(starredMap));
            changed = true;
        }
    });
    if (changed) console.log("Woordnamen bijgewerkt.");
}

// --- STATISTIEKEN ---
function updateStats(word, isCorrect) {
    if (!wordStats[word]) wordStats[word] = { c: 0, t: 0 };
    wordStats[word].t++; 
    if (isCorrect) wordStats[word].c++; 
    localStorage.setItem('vocab_stats', JSON.stringify(wordStats));
}

// --- RESET ---
function resetStarredToNew() {
    const starredKeys = Object.keys(starredMap);
    if (starredKeys.length === 0) { alert("Geen sterren."); return; }
    if(confirm(`Reset progressie van ${starredKeys.length} gemarkeerde woorden?`)) {
        starredKeys.forEach(word => { progressMap[word] = 0; });
        saveProgress();
        alert("Reset voltooid.");
    }
}
function unstarAll() {
    if(confirm("Alle sterren verwijderen?")) {
        starredMap = {}; localStorage.setItem('vocab_starred', JSON.stringify(starredMap));
        refreshStats();
        alert("Alle sterren zijn verwijderd.");
    }
}
function resetProgress() {
    if (!confirm("⚠️ WEET JE HET ZEKER?\n\nDit zal al je voortgang (groen/rood gemarkeerde woorden) wissen.")) return;
    let wisKlassement = confirm("Wil je ook het KLASSEMENT (statistieken) wissen?\n\n✅ Klik OK om ALLES te wissen.\n❌ Klik ANNULEREN om je ranglijst te BEWAREN.");
    localStorage.removeItem('vocab_progress_v2');
    localStorage.removeItem('vocab_starred');
    if (wisKlassement) localStorage.removeItem('vocab_stats');
    location.reload();
}

// --- UI ---
function handleSettingsChange() { 
    saveUnitSelection(); 
    refreshStats(); 
    populateUnitDropdown(); 
}

function toggleSettingsUI() {
    const mode = document.getElementById('mode-select').value;
    const timerLabel = document.getElementById('timer-toggle-label');
    const inputArea = document.getElementById('input-area');
    const startBtn = document.getElementById('start-btn');
    const unitSelect = document.getElementById('unit-select');
    const starLabel = document.getElementById('star-only-label');

    // Reset visibility
    unitSelect.style.display = 'block';
    if(starLabel) starLabel.style.display = 'flex';
    timerLabel.style.display = 'flex';

    if (mode === 'flashcards') {
        timerLabel.style.display = 'none'; 
        inputArea.style.display = 'none'; 
        startBtn.innerText = "START FLASHCARDS";
    } else if (mode === 'worst25') {
        timerLabel.style.display = 'none'; 
        unitSelect.style.display = 'none';
        if(starLabel) starLabel.style.display = 'none';
        inputArea.style.display = 'block'; 
        startBtn.innerText = "START PERSOONLIJK TRAJECT";
    } else if (mode === 'connect' || mode === 'fillblanks') {
        timerLabel.style.display = 'none'; 
        inputArea.style.display = 'none'; 
        startBtn.innerText = mode === 'connect' ? "START CONNECT" : "START ZINNEN MATCH";
    } else {
        inputArea.style.display = 'block'; 
        startBtn.innerText = "START OVERDRIVE";
    }
    refreshStats();
}

document.addEventListener('keydown', (e) => {
    if (!isPlaying || isProcessing) return;
    if (currentMode === 'connect' || currentMode === 'fillblanks') return;
    
    if (currentMode !== 'flashcards') return;
    if (!isRevealed) { e.preventDefault(); revealFlashcard(); return; }
    if (e.key === '1' || e.key === 'ArrowLeft') handleFlashcardResult(false);
    if (e.key === '2' || e.key === 'ArrowRight') handleFlashcardResult(true);
});

// --- QUEUE BUILDERS ---
function buildStandardQueue() {
    const selectedUnit = document.getElementById('unit-select').value;
    const starOnly = document.getElementById('star-only-check').checked;
    activeQueue = activeDB.filter(item => {
        const level = parseInt(progressMap[item.w] || 0);
        const notMastered = level < 2; 
        const unitMatch = (selectedUnit === 'all') || (item.u.toString() === selectedUnit);
        const starMatch = !starOnly || starredMap[item.w]; 
        return notMastered && unitMatch && starMatch;
    });
}

function buildWorst25Queue() {
    let allItems = activeDB.map(item => {
        let s = wordStats[item.w] || { c:0, t:0 };
        let pct = s.t > 0 ? (s.c / s.t) : 0; 
        return { item: item, pct: pct, t: s.t };
    });

    let worstPool = allItems.filter(x => x.pct < 1.0);
    let bestPool = allItems.filter(x => x.pct === 1.0);

    worstPool.sort((a, b) => {
        if (a.pct !== b.pct) return a.pct - b.pct; 
        return a.t - b.t;
    });

    bestPool.sort(() => Math.random() - 0.5);

    const TARGET_TOTAL = 25;
    const TARGET_BEST = 5;

    let countBest = Math.min(bestPool.length, TARGET_BEST);
    if (worstPool.length < (TARGET_TOTAL - countBest)) {
        countBest = Math.min(bestPool.length, TARGET_TOTAL - worstPool.length);
    }
    let countWorst = Math.min(worstPool.length, TARGET_TOTAL - countBest);

    let selectedBest = bestPool.slice(0, countBest).map(x => x.item);
    let selectedWorst = worstPool.slice(0, countWorst).map(x => x.item);
    
    activeQueue = selectedBest.concat(selectedWorst).sort(() => Math.random() - 0.5);
    
    sessionTotal = activeQueue.length;
    sessionCount = 0;
    sessionCorrect = 0;
    sessionWrong = 0;
    sessionCorrectItems = [];
    sessionWrongItems = [];
    updateSessionUI();
}

function updateSessionUI() {
    document.getElementById('sess-remaining').innerText = (sessionTotal - sessionCount);
    document.getElementById('sess-correct').innerText = sessionCorrect;
    document.getElementById('sess-wrong').innerText = sessionWrong;
}

// --- GAME START ---
function startGame() {
    currentMode = document.getElementById('mode-select').value;
    
    // UI RESET
    document.getElementById('definition-area').style.display = 'flex';
    document.getElementById('connect-area').style.display = 'none';
    document.getElementById('input-area').style.display = 'none';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('fc-controls').style.display = 'none';
    document.getElementById('fc-stop-controls').style.display = 'none';
    document.getElementById('timer-container-div').style.display = 'none';
    document.getElementById('timer').style.opacity = '0';
    document.getElementById('global-stats').style.display = 'flex';
    document.getElementById('session-stats').style.display = 'none';

    if (currentMode === 'worst25') {
        buildWorst25Queue();
        if (activeQueue.length === 0) { alert("Geen woorden beschikbaar."); return; }
        
        document.getElementById('global-stats').style.display = 'none';
        document.getElementById('session-stats').style.display = 'flex';
        document.getElementById('input-area').style.display = 'block'; 
        document.getElementById('game-controls').style.display = 'flex';
        
        isMaintenanceMode = false;
        timerEnabled = false;
        
        const input = document.getElementById('answer-input'); 
        input.style.display = 'block';
        input.disabled = false; 
        input.value = ""; 
        input.focus();
        
        nextWord();

    } else if (currentMode === 'connect' || currentMode === 'fillblanks') {
        // RESET LAST ROUND TRACKER BIJ START
        connectLastRoundIds = [];
        
        // CHECK OF ER WOORDEN ZIJN IN DE SELECTIE
        const selectedUnit = document.getElementById('unit-select').value;
        const starOnly = document.getElementById('star-only-check').checked;
        const potentialPool = activeDB.filter(item => {
            const unitMatch = (selectedUnit === 'all' || item.u.toString() === selectedUnit);
            const starMatch = !starOnly || starredMap[item.w];
            return unitMatch && starMatch;
        });

        if (potentialPool.length < 4) { 
            alert("Je hebt minimaal 4 woorden nodig in je selectie voor deze modus."); 
            return; 
        }

        document.getElementById('definition-area').style.display = 'none'; 
        document.getElementById('connect-area').style.display = 'block'; 
        document.getElementById('fc-stop-controls').style.display = 'block';
        
        isPlaying = true;
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('settings-div').style.display = 'none';
        
        nextConnectRound(); 
        return; 

    } else {
        // OVERDRIVE, FLASHCARDS
        buildStandardQueue();
        const selectedUnit = document.getElementById('unit-select').value;
        const starOnly = document.getElementById('star-only-check').checked;
        const totalInSelection = activeDB.filter(item => {
            const unitMatch = (selectedUnit === 'all' || item.u.toString() === selectedUnit);
            const starMatch = !starOnly || starredMap[item.w];
            return unitMatch && starMatch;
        });

        if(activeQueue.length === 0) {
            if (totalInSelection === 0) { alert("Geen woorden gevonden in deze selectie."); return; }
            isMaintenanceMode = true;
            activeQueue = activeDB.filter(item => {
                const unitMatch = (selectedUnit === 'all') || (item.u.toString() === selectedUnit);
                const starMatch = !starOnly || starredMap[item.w];
                return unitMatch && starMatch;
            });
            if(activeQueue.length === 0) { alert("Geen woorden beschikbaar."); return; }
        } else {
            isMaintenanceMode = false;
        }
        
        timerEnabled = document.getElementById('timer-check').checked;
        
        if (currentMode === 'flashcards') {
            document.getElementById('fc-controls').style.display = 'flex'; 
            document.getElementById('fc-stop-controls').style.display = 'block';
        } else {
            document.getElementById('input-area').style.display = 'block'; 
            document.getElementById('game-controls').style.display = 'flex';
            document.getElementById('timer-container-div').style.display = 'block'; 
            document.getElementById('timer').style.opacity = '1';
            
            const input = document.getElementById('answer-input'); 
            input.style.display = 'block';
            input.disabled = false; 
            input.value = ""; 
            input.focus();
            if (!timerEnabled) {
                document.getElementById('timer').innerText = "∞"; 
                document.getElementById('timer').style.color = "var(--accent)"; 
                document.getElementById('visual-timer').style.width = "100%";
            }
        }
        nextWord();
    }
    
    score = 0; timer = START_TIME; isPlaying = true; isProcessing = false; isRevealed = false;
    document.getElementById('score').innerText = score;
    
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('settings-div').style.display = 'none'; 
    
    if (currentMode !== 'flashcards' && currentMode !== 'connect' && currentMode !== 'fillblanks' && currentMode !== 'worst25') {
        gameInterval = setInterval(gameLoop, 100);
    }
}

// --- CONNECT & FILLBLANKS LOGIC (NIEUWE LOGICA) ---
function nextConnectRound() {
    // 1. BEPAAL DE 'FULL POOL' (Alle woorden die aan de filters voldoen)
    const selectedUnit = document.getElementById('unit-select').value;
    const starOnly = document.getElementById('star-only-check').checked;
    
    let fullPool = activeDB.filter(item => {
        const unitMatch = (selectedUnit === 'all' || item.u.toString() === selectedUnit);
        const starMatch = !starOnly || starredMap[item.w];
        return unitMatch && starMatch;
    });

    if (fullPool.length < 4) {
        alert("Te weinig woorden voor een nieuwe ronde.");
        stopGame();
        return;
    }

    // 2. KIES KANDIDATEN
    let candidates = [];

    if (fullPool.length <= 7) {
        // Groep is te klein om "vorige" uit te sluiten, dus pak gewoon alles
        candidates = fullPool;
    } else {
        // Groep is groot genoeg: Filter de woorden van de VORIGE ronde eruit
        candidates = fullPool.filter(item => !connectLastRoundIds.includes(item.w));
    }

    // 3. KIES 4 RANDOM ITEMS UIT KANDIDATEN
    // Shuffle
    candidates.sort(() => Math.random() - 0.5);
    // Pak de eerste 4
    connectActiveItems = candidates.slice(0, 4);

    // 4. SLA DEZE OP ALS 'VORIGE RONDE' VOOR DE VOLGENDE KEER
    connectLastRoundIds = connectActiveItems.map(i => i.w);

    connectMatchesFound = 0;
    renderConnectBoard();
}

function renderConnectBoard() {
    const colWords = document.getElementById('col-words');
    const colDefs = document.getElementById('col-defs');
    colWords.innerHTML = "";
    colDefs.innerHTML = "";

    let words = [...connectActiveItems].sort(() => Math.random() - 0.5);
    let defs = [...connectActiveItems].sort(() => Math.random() - 0.5);

    words.forEach(item => {
        let btn = document.createElement('div');
        btn.className = 'connect-btn';
        btn.innerText = item.w;
        btn.dataset.id = item.w; 
        btn.dataset.type = 'word';
        btn.onclick = () => handleConnectClick(btn, item.w, 'word');
        colWords.appendChild(btn);
    });

    defs.forEach(item => {
        let btn = document.createElement('div');
        btn.className = 'connect-btn';
        
        if (currentMode === 'fillblanks') {
            let sentences = item.s;
            let s = "";

            if (Array.isArray(sentences)) {
                // KIES RANDOM ZIN
                s = sentences[Math.floor(Math.random() * sentences.length)];
            } else {
                s = sentences || item.d;
            }

            if(s) {
                // VERVANG HET WOORD (Slimme check met 'to')
                let searchWord = item.w;
                if (searchWord.toLowerCase().startsWith("to ")) {
                    searchWord = searchWord.substring(3); 
                }
                const regex = new RegExp(searchWord, 'gi');
                s = s.replace(regex, '_______');
            }
            btn.innerText = s;
        } else {
            btn.innerText = item.d; 
        }

        btn.dataset.id = item.w; 
        btn.dataset.type = 'def';
        btn.onclick = () => handleConnectClick(btn, item.w, 'def');
        colDefs.appendChild(btn);
    });
}

function handleConnectClick(el, id, type) {
    if (el.classList.contains('correct')) return; 

    if (connectSelection && connectSelection.el === el) {
        el.classList.remove('selected');
        connectSelection = null;
        return;
    }

    if (!connectSelection) {
        connectSelection = { el: el, id: id, type: type };
        el.classList.add('selected');
        return;
    }

    if (connectSelection.type === type) {
        connectSelection.el.classList.remove('selected');
        connectSelection = { el: el, id: id, type: type };
        el.classList.add('selected');
        return;
    }

    let match = (connectSelection.id === id);

    if (match) {
        el.classList.add('correct');
        connectSelection.el.classList.add('correct');
        el.classList.remove('selected');
        connectSelection.el.classList.remove('selected');
        
        updateStats(id, true);
        let lvl = parseInt(progressMap[id] || 0);
        if(lvl < 2) progressMap[id] = lvl + 1;
        saveProgress();

        score++;
        document.getElementById('score').innerText = score;

        connectSelection = null;
        connectMatchesFound++;

        if (connectMatchesFound === 4) {
            setTimeout(nextConnectRound, 500);
        }

    } else {
        el.classList.add('wrong');
        connectSelection.el.classList.add('wrong');
        
        updateStats(connectSelection.id, false); 
        progressMap[connectSelection.id] = -1;
        starredMap[connectSelection.id] = true;
        saveProgress();

        let t1 = el;
        let t2 = connectSelection.el;
        
        setTimeout(() => {
            t1.classList.remove('wrong');
            t2.classList.remove('wrong');
            t1.classList.remove('selected');
            t2.classList.remove('selected');
        }, 500);
        
        connectSelection = null;
    }
}

// --- STANDAARD GAME LOOP LOGICA ---
function gameLoop() {
    if (!isPlaying) return;
    if (timerEnabled) {
        timer -= 0.1;
        const timerEl = document.getElementById('timer');
        timerEl.innerText = timer.toFixed(1) + 's';
        const bar = document.getElementById('visual-timer');
        let pct = (timer / VISUAL_MAX_TIME) * 100; if (pct > 100) pct = 100; if (pct < 0) pct = 0;
        bar.style.width = pct + "%";
        if (timer <= 10) { bar.className = "timer-fill danger"; timerEl.style.color = "var(--danger)"; } 
        else { bar.className = "timer-fill"; timerEl.style.color = "var(--accent)"; }
        if (timer <= 0) gameOver();
    }
}

// --- STANDAARD NEXTWORD ---
function nextWord() {
    if (currentMode === 'worst25' && activeQueue.length === 0) {
        endSessionVictory();
        return;
    }

    if (activeQueue.length === 0) { 
        fireConfetti();
        const area = document.getElementById('definition-area');
        area.innerHTML = `
            <div style="color:var(--success); font-size:1.3rem; font-weight:bold; margin-bottom:15px; animation: pulse 1s infinite;">
                🎉 Je hebt elk woord geraden!
            </div>
            <div style="color:var(--text-main); font-size:1rem;">
                Maar je kan gewoon doordoen...
            </div>
        `;
        isMaintenanceMode = true; 
        const selectedUnit = document.getElementById('unit-select').value;
        const starOnly = document.getElementById('star-only-check').checked;
        activeQueue = activeDB.filter(item => {
            const unitMatch = (selectedUnit === 'all') || (item.u.toString() === selectedUnit);
            const starMatch = !starOnly || starredMap[item.w];
            return unitMatch && starMatch;
        });
        isPlaying = false; 
        setTimeout(() => {
            if(document.getElementById('settings-div').style.display === 'none') {
                isPlaying = true;
                nextWord(); 
            }
        }, 3000);
        return; 
    }
    
    if (currentMode === 'worst25') {
        currentItem = activeQueue[0];
    } else {
        const selectedUnit = document.getElementById('unit-select').value;
        const starOnly = document.getElementById('star-only-check').checked;
        const unitWords = activeDB.filter(item => {
            const unitMatch = (selectedUnit === 'all' || item.u.toString() === selectedUnit);
            const starMatch = !starOnly || starredMap[item.w];
            return unitMatch && starMatch;
        });
        const masteredCount = unitWords.filter(w => parseInt(progressMap[w.w] || 0) === 2).length;
        const totalCount = unitWords.length;
        const masteryRatio = totalCount > 0 ? masteredCount / totalCount : 0;

        let candidates = [...activeQueue];
        if (candidates.length > 1 && currentItem) candidates = candidates.filter(w => w.w !== currentItem.w);
        
        let finalPool = candidates;

        if (isMaintenanceMode) {
            let notMasteredCandidates = candidates.filter(w => parseInt(progressMap[w.w] || 0) < 2);
            let masteredCandidates = candidates.filter(w => parseInt(progressMap[w.w] || 0) === 2);
            if (notMasteredCandidates.length > 0) {
                if (masteredCandidates.length > 0) {
                    if (Math.random() < 0.25) finalPool = notMasteredCandidates; 
                    else finalPool = masteredCandidates; 
                } else finalPool = notMasteredCandidates;
            }
        } else {
            if (masteryRatio >= 0.5) {
                let pickedReview = false;
                if (Math.random() < 0.10) {
                     let masteredInScope = unitWords.filter(i => (parseInt(progressMap[i.w] || 0) === 2));
                     if (currentItem) masteredInScope = masteredInScope.filter(w => w.w !== currentItem.w);
                     if (masteredInScope.length > 0) {
                         finalPool = [masteredInScope[Math.floor(Math.random() * masteredInScope.length)]];
                         pickedReview = true;
                     }
                }
                if (!pickedReview) {
                    let badCandidates = candidates.filter(w => parseInt(progressMap[w.w] || 0) === -1);
                    if (badCandidates.length > 0 && Math.random() < 0.9) finalPool = badCandidates;
                }
            }
        }
        if(finalPool.length > 0) currentItem = finalPool[Math.floor(Math.random() * finalPool.length)];
        else currentItem = candidates[0] || activeQueue[0];
    }
    
    isRevealed = false;
    document.getElementById('btn-show-answer').style.display = 'block';
    document.getElementById('fc-rating-btns').style.display = 'none';
    renderGameUI();
}

function toggleStarCurrent(word) {
    if(starredMap[word]) delete starredMap[word];
    else starredMap[word] = true;
    saveProgress(); 
    renderGameUI(); 
}

function renderGameUI() {
    const area = document.getElementById('definition-area');
    area.style.position = 'relative'; 
    area.classList.remove('fc-feedback-good', 'fc-feedback-bad');
    
    const isStarred = starredMap[currentItem.w];
    const starIcon = isStarred ? "★" : "☆";
    const starColor = isStarred ? "var(--gold)" : "#555";
    const starHtml = `<div style="position:absolute; top:10px; right:15px; font-size:1.8rem; color:${starColor}; cursor:pointer; z-index:10; user-select:none;" onclick="toggleStarCurrent('${currentItem.w.replace(/'/g, "\\'")}')" title="Klik om te markeren">${starIcon}</div>`;

    let contentHtml = "";

    if (currentMode === 'flashcards') {
        contentHtml = `
            <div class="flashcard-content" onclick="if(!isRevealed) revealFlashcard()">
                ${starHtml}
                <div class="fc-face fc-front">${currentItem.d}</div>
                <div class="fc-face fc-back">${currentItem.w}</div>
            </div>`;
    } else {
        // OVERDRIVE / WORST25 (Toon definitie)
        contentHtml = `
            ${starHtml}
            <div style="margin-top:10px;">${currentItem.d}</div>
        `;
        document.getElementById('answer-input').value = "";
    }

    const isMastered = parseInt(progressMap[currentItem.w] || 0) === 2;
    if (isMastered && currentMode !== 'worst25') {
        contentHtml += `<div style="font-size: 0.8rem; color: #facc15; margin-top: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">✨ Review: Al Gekend</div>`;
    }
    area.innerHTML = contentHtml;
}

// --- INPUT HANDLING ---
document.getElementById('answer-input').addEventListener('input', (e) => {
    if (!isPlaying || currentMode === 'flashcards' || currentMode === 'connect' || currentMode === 'fillblanks') return;
    const val = e.target.value.trim().toLowerCase();
    const correct = currentItem.w.toLowerCase();

    if (val === correct) { handleCorrect(); return; }

    const mistakeItem = activeDB.find(item => item.w.toLowerCase() === val);
    if (mistakeItem) {
        if (!correct.startsWith(val)) {
            updateStats(mistakeItem.w, false); 
            progressMap[mistakeItem.w] = -1;
            starredMap[mistakeItem.w] = true;
            if (currentMode !== 'worst25' && !activeQueue.some(i => i.w === mistakeItem.w)) {
                activeQueue.push(mistakeItem);
            }
            saveProgress(); 
            passWord(false, true); 
        }
    }
});

function passWord(skipVisuals = false, isConfusion = false) {
    if (!isPlaying) return;
    if (timerEnabled && currentMode === 'overdrive') timer -= 3;

    if (currentMode !== 'flashcards' && !skipVisuals) {
        const inputEl = document.getElementById('answer-input');
        inputEl.classList.add('flash-red');
        inputEl.value = "Antwoord: " + currentItem.w; 
        setTimeout(() => { inputEl.classList.remove('flash-red'); nextWord(); }, 1000);
    } else {
        if (currentMode === 'flashcards') nextWord();
    }

    updateStats(currentItem.w, false);
    progressMap[currentItem.w] = -1; 
    starredMap[currentItem.w] = true;

    if (currentMode === 'worst25') {
        sessionWrong++;
        sessionCount++;
        sessionWrongItems.push(currentItem);
        updateSessionUI();
        activeQueue = activeQueue.filter(i => i.w !== currentItem.w);
    } else {
        if (!activeQueue.some(i => i.w === currentItem.w)) activeQueue.push(currentItem);
    }

    saveProgress();
}

function handleCorrect(skipVisuals = false) {
    if (currentMode !== 'flashcards' && !skipVisuals) {
        const inputEl = document.getElementById('answer-input');
        inputEl.classList.add('flash-green'); setTimeout(() => inputEl.classList.remove('flash-green'), 300);
    }
    updateStats(currentItem.w, true);

    let lvl = parseInt(progressMap[currentItem.w] || 0);
    if (lvl === -1) lvl = 1; 
    else if (lvl === 0) lvl = 1; 
    else if (lvl === 1) lvl = 2;
    progressMap[currentItem.w] = lvl;
    
    if (currentMode === 'worst25') {
        sessionCorrect++;
        sessionCount++;
        sessionCorrectItems.push(currentItem);
        updateSessionUI();
        activeQueue = activeQueue.filter(i => i.w !== currentItem.w);
    } else {
        if (lvl === 2) {
            activeQueue = activeQueue.filter(i => i.w !== currentItem.w);
        }
    }
    
    saveProgress();

    if (timerEnabled && currentMode === 'overdrive') timer = Math.min(timer + 10, VISUAL_MAX_TIME);
    score++; document.getElementById('score').innerText = score;
    nextWord();
}

function endSessionVictory() {
    isPlaying = false;
    clearInterval(gameInterval);
    fireConfetti();
    const area = document.getElementById('definition-area');
    
    let wrongListHtml = sessionWrongItems.map(w => `<div style="color:var(--danger); padding:2px 0;">✕ ${w.w}</div>`).join('');
    let correctListHtml = sessionCorrectItems.map(w => `<div style="color:var(--success); padding:2px 0;">✓ ${w.w}</div>`).join('');

    let title = "Resultaten";
    let btnText = "Opnieuw Spelen";
    
    if (currentMode === 'worst25') {
        title = "Sessie Voltooid!";
        btnText = "Nog een keer (Persoonlijk Traject)";
    } else if (currentMode === 'connect' || currentMode === 'fillblanks') {
        title = currentMode === 'connect' ? "Connect 4 Voltooid!" : "Zinnen Match Voltooid!";
        btnText = currentMode === 'connect' ? "Nog een keer (Connect 4)" : "Nog een keer (Zinnen Match)";
    }

    area.innerHTML = `
        <div style="margin-bottom: 10px;"><span style="font-size: 2.5rem;">🏁</span></div>
        <div style="color:white; font-size:1.4rem; font-weight:bold; margin-bottom:15px;">${title}</div>
        
        <div style="display:flex; gap:10px; width:100%; height:200px; text-align:left;">
            <div style="flex:1; background:rgba(255,0,0,0.1); border-radius:8px; padding:10px; overflow-y:auto; border:1px solid var(--danger);">
                <div style="font-weight:bold; color:var(--danger); margin-bottom:5px; text-transform:uppercase; font-size:0.8rem;">Fout (${sessionWrongItems.length})</div>
                <div style="font-size:0.9rem;">${wrongListHtml || '<span style="color:#666; font-style:italic;">Geen fouten!</span>'}</div>
            </div>
            <div style="flex:1; background:rgba(0,255,0,0.1); border-radius:8px; padding:10px; overflow-y:auto; border:1px solid var(--success);">
                <div style="font-weight:bold; color:var(--success); margin-bottom:5px; text-transform:uppercase; font-size:0.8rem;">Goed (${sessionCorrectItems.length})</div>
                <div style="font-size:0.9rem;">${correctListHtml || '<span style="color:#666; font-style:italic;">Niks goed...</span>'}</div>
            </div>
        </div>
    `;
    
    document.getElementById('answer-input').style.display = 'none';
    document.getElementById('connect-area').style.display = 'none'; 
    
    const startBtn = document.getElementById('start-btn');
    startBtn.innerText = btnText;
    startBtn.style.display = 'block';
    
    document.getElementById('settings-div').style.display = 'flex';
}

function revealFlashcard() {
    if (!isPlaying || isRevealed) return;
    const card = document.querySelector('.flashcard-content');
    if (card) card.classList.add('flipped');
    document.getElementById('btn-show-answer').style.display = 'none';
    document.getElementById('fc-rating-btns').style.display = 'flex';
    isRevealed = true;
}
window.handleFlashcardResult = function(success) {
    if (!isPlaying || isProcessing) return;
    isProcessing = true;
    const area = document.getElementById('definition-area');
    if (success) area.classList.add('fc-feedback-good'); else area.classList.add('fc-feedback-bad');
    setTimeout(() => {
        if (success) handleCorrect(true); else passWord(true);
        isProcessing = false; 
    }, 500);
}

// --- STATS EN PROGRESS BARS ---
function refreshStats() {
    if (!activeDB || activeDB.length === 0) return;
    const selectedUnit = document.getElementById('unit-select').value;
    const sOnly = document.getElementById('star-only-check').checked;

    const unitScopeDB = activeDB.filter(item => {
        return selectedUnit === 'all' || item.u.toString() === selectedUnit;
    });

    const displayDB = unitScopeDB.filter(item => {
        return !sOnly || starredMap[item.w];
    });

    let counts = { "-1": 0, "0": 0, "1": 0, "2": 0 };
    let starCountForCard = 0; 
    let totalStarCountGlobal = 0; 

    displayDB.forEach(i => {
        let l = parseInt(progressMap[i.w] || 0);
        counts[l]++;
    });

    unitScopeDB.forEach(i => { if(starredMap[i.w]) starCountForCard++; });
    activeDB.forEach(i => { if(starredMap[i.w]) totalStarCountGlobal++; });
    
    document.getElementById('cnt-new').innerText = counts[0]; 
    document.getElementById('cnt-bad').innerText = counts[-1];
    document.getElementById('cnt-good').innerText = counts[1]; 
    document.getElementById('cnt-full').innerText = counts[2];
    document.getElementById('cnt-star').innerText = "★ " + starCountForCard;

    const resetBtn = document.getElementById('btn-reset-star');
    if(resetBtn) resetBtn.innerText = `Reset ★ (${totalStarCountGlobal})`;
    
    let pts = 0; 
    displayDB.forEach(i => { 
        let l = parseInt(progressMap[i.w] || 0); 
        if(l===2) pts+=3; 
        else if(l===1) pts+=2; 
        else if(l===-1) pts+=1; 
    });
    
    const max = displayDB.length * 3; 
    const pct = max > 0 ? Math.floor((pts/max)*100) : 0;
    
    document.getElementById('mastery-bar').style.width = pct + "%"; 
    document.getElementById('mastery-pct').innerText = pct + "%";
    document.getElementById('progress-label-text').innerText = (selectedUnit!=='all'?`UNIT ${selectedUnit}`:"TOTAAL") + (sOnly?" (★)":"");
}

function populateUnitDropdown() {
    const s = document.getElementById('unit-select');
    const currentSelection = s.value; 
    s.innerHTML = '<option value="all">Alle Units</option>';
    if (!activeDB) return;

    const starOnly = document.getElementById('star-only-check') ? document.getElementById('star-only-check').checked : false;

    [...new Set(activeDB.map(i => i.u))].sort((a, b) => a - b).forEach(u => {
        let o = document.createElement('option'); o.value = u;
        
        let unitWords = activeDB.filter(w => {
            const unitMatch = w.u === u;
            const starMatch = !starOnly || starredMap[w.w];
            return unitMatch && starMatch;
        });
        
        let pts = 0;
        unitWords.forEach(w => {
             let l = parseInt(progressMap[w.w]||0);
             if(l===2) pts+=3;
             else if(l===1) pts+=2;
             else if(l===-1) pts+=1;
        });
        let max = unitWords.length * 3;
        let pct = max > 0 ? Math.floor((pts/max)*100) : 0;

        o.innerText = (pct === 100 && max > 0) ? `Unit ${u} (100% ✅)` : `Unit ${u} (${pct}%)`;
        s.appendChild(o);
    });
    if (currentSelection && s.querySelector(`option[value="${currentSelection}"]`)) s.value = currentSelection;
    else { const saved = localStorage.getItem('vocab_last_unit'); if(saved && s.querySelector(`option[value="${saved}"]`)) s.value = saved; }
}

function saveUnitSelection() { localStorage.setItem('vocab_last_unit', document.getElementById('unit-select').value); }
function resetSpecificUnit() {
    const u = prompt("Unit resetten?"); if(!u) return; const tu = parseInt(u);
    if(![...new Set(activeDB.map(i=>i.u))].includes(tu)) { alert("Unit bestaat niet"); return; }
    if(confirm(`Unit ${tu} resetten?`)) { activeDB.forEach(i=>{if(i.u===tu)progressMap[i.w]=0}); saveProgress(); alert("Gereset"); }
}

function stopGame() { 
    isPlaying = false; clearInterval(gameInterval); 
    document.getElementById('input-area').style.display = 'none';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('fc-controls').style.display = 'none';
    document.getElementById('fc-stop-controls').style.display = 'none';
    document.getElementById('timer-container-div').style.display = 'none';
    document.getElementById('timer').style.opacity = '0';
    document.getElementById('btn-show-answer').style.display = 'none';
    
    if (currentMode === 'connect' || currentMode === 'fillblanks') {
        endSessionVictory(); 
    } else {
        const area = document.getElementById('definition-area');
        area.innerHTML = `<div style="margin-bottom: 15px;"><span style="font-size: 3rem;">🛑</span></div><div style="color: var(--danger); font-weight: bold; font-size: 1.5rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Spel Gestopt</div><div style="color: var(--text-muted); font-size: 1.1rem;">Je eindscore is: <span style="color: var(--accent); font-weight: bold; font-size: 1.3rem;">${score}</span></div>`;
        const startBtn = document.getElementById('start-btn'); 
        startBtn.innerText = "Opnieuw Spelen"; 
        startBtn.style.display = 'block';
        document.getElementById('settings-div').style.display = 'flex';
    }
}

function gameOver() { isPlaying=false; clearInterval(gameInterval); alert(`Game Over! Score: ${score}`); location.reload(); }

function fireConfetti() {
    const c=document.getElementById('confetti-canvas'), x=c.getContext('2d'); c.width=window.innerWidth; c.height=window.innerHeight;
    let p=[]; for(let i=0;i<150;i++) p.push({x:c.width/2,y:c.height/2,vx:(Math.random()-0.5)*20,vy:(Math.random()-0.5)*20-5,c:['#06b6d4','#f43f5e','#facc15'][Math.floor(Math.random()*3)]});
    function a(){x.clearRect(0,0,c.width,c.height); p.forEach(i=>{i.x+=i.vx;i.y+=i.vy;i.vy+=0.1;x.fillStyle=i.c;x.fillRect(i.x,i.y,5,5)}); if(p.some(i=>i.y<c.height)) requestAnimationFrame(a);} a();
}

function exportData() { const d = {p:progressMap,s:starredMap, st:wordStats}; const b = new Blob([JSON.stringify(d)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download="vocab_backup.json"; a.click(); }

function importData(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.p) progressMap = data.p; 
            if (data.s) starredMap = data.s;
            if (data.st) wordStats = data.st; 
            else if (data.progress) { progressMap = data.progress; starredMap = data.starred; } 
            saveProgress(); localStorage.setItem('vocab_stats', JSON.stringify(wordStats)); alert("Backup geladen!"); location.reload();
        } catch (err) { alert("Fout bij lezen bestand."); }
    }; reader.readAsText(file);
    input.value = '';
}

function showList(t) {
    currentListType = t;
    const m=document.getElementById('list-modal'), b=document.getElementById('modal-list-body'), h=document.getElementById('modal-title');
    let w=[], c="";
    if (!activeDB) return;
    const selectedUnit = document.getElementById('unit-select').value;
    const filteredDB = activeDB.filter(item => selectedUnit === 'all' || item.u.toString() === selectedUnit);

    if(t==='star'){ h.innerText="Gemarkeerd (in deze unit)"; c="var(--gold)"; w=filteredDB.filter(i=>starredMap[i.w]); } 
    else {
        const labels = {0:"Niet Gekend",'-1':"Slecht Gekend",1:"Goed Gekend",2:"Volledig Gekend"};
        const colors = {0:"#94a3b8",'-1':"var(--danger)",1:"var(--gold)",2:"var(--success)"};
        h.innerText=labels[t]; c=colors[t]; w=filteredDB.filter(i=>(parseInt(progressMap[i.w]||0)===t));
    }
    h.style.color=c; b.innerHTML="";
    if(w.length === 0) b.innerHTML = "<div style='text-align:center; padding:20px; color:#666;'>Geen woorden gevonden.</div>";
    else {
        w.forEach(i=>{
            const d=document.createElement('div'); d.className='list-item';
            d.innerHTML=`<span>${i.w}</span><span style="cursor:pointer; font-size:1.2rem;" onclick="toggleStar('${i.w.replace(/'/g,"\\'")}')">${starredMap[i.w]?'★':'☆'}</span>`;
            b.appendChild(d);
        });
    }
    m.style.display='flex';
}

function toggleStar(w) {
    if(starredMap[w]) delete starredMap[w]; else starredMap[w]=true;
    saveProgress();
    if (currentListType !== null) {
        const listBody = document.getElementById('modal-list-body'); const scrollPos = listBody.scrollTop;
        showList(currentListType); document.getElementById('modal-list-body').scrollTop = scrollPos;
    }
}

function closeModal() { document.getElementById('list-modal').style.display='none'; currentListType = null; }
window.onclick = e => { if(e.target == document.getElementById('list-modal')) closeModal(); if(e.target == document.getElementById('ranking-modal')) closeRanking(); }
function saveProgress() { localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap)); localStorage.setItem('vocab_starred', JSON.stringify(starredMap)); refreshStats(); populateUnitDropdown(); }

function showRanking() {
    const m = document.getElementById('ranking-modal');
    const b = document.getElementById('ranking-body');
    b.innerHTML = "";

    if (!activeDB) return;

    let selectedUnit = document.getElementById('unit-select').value;
    const mode = document.getElementById('mode-select').value; // <--- HUIDIGE MODE OPHALEN

    // --- DE FIX ---
    // Als we in "Persoonlijk Traject" zitten, negeer de unit-keuze en toon ALLES.
    if (mode === 'worst25') {
        selectedUnit = 'all';
    }
    // ----------------

    const scopeWords = activeDB.filter(item => selectedUnit === 'all' || item.u.toString() === selectedUnit);

    let list = scopeWords.map(item => {
        const s = wordStats[item.w] || { c: 0, t: 0 };
        const pct = s.t > 0 ? (s.c / s.t) * 100 : 0;
        return { w: item.w, pct: pct, c: s.c, t: s.t };
    });

    list.sort((a, b) => {
        if (a.t === 0 && b.t > 0) return 1;
        if (b.t === 0 && a.t > 0) return -1;
        if (Math.abs(b.pct - a.pct) > 0.1) return b.pct - a.pct;
        return b.c - a.c; 
    });

    let totalCorrect = 0; let totalAttempts = 0;
    list.forEach(i => { totalCorrect += i.c; totalAttempts += i.t; });

    if (list.length > 0) {
        // Pas de titel aan als het Persoonlijk Traject is, zodat het duidelijk is
        let titleText = (mode === 'worst25' || selectedUnit === 'all') ? "Totaal Score (Alles)" : "Totaal Score (Deze Unit)";

        const summary = document.createElement('div');
        summary.style.cssText = "text-align:center; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; margin-bottom:15px; border:1px solid var(--glass-border);";
        summary.innerHTML = `
            <div style="font-size:0.8rem; text-transform:uppercase; color:#94a3b8; letter-spacing:1px;">${titleText}</div>
            <div style="font-size:2rem; font-weight:bold; color:var(--accent);">
                ${totalCorrect} <span style="color:#64748b; font-size:1.5rem;">/</span> ${totalAttempts}
            </div>
            <div style="font-size:0.9rem; color:${getScoreColor((totalCorrect/totalAttempts)*100)}">
                ${totalAttempts > 0 ? ((totalCorrect/totalAttempts)*100).toFixed(1) : 0}%
            </div>
        `;
        b.appendChild(summary);
    }

    if (list.length === 0) {
        b.innerHTML = "<div style='text-align:center; padding:20px; color:#666;'>Geen woorden in deze selectie.</div>";
    } else {
        const table = document.createElement('table');
        table.className = "rank-table";
        table.innerHTML = `<thead><tr><th>#</th><th>Woord</th><th>Score</th><th>J/T</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        
        list.forEach((item, index) => {
            const row = document.createElement('tr'); row.className = "rank-row";
            let rankClass = "";
            if (item.t > 0) {
                if(index === 0) rankClass = "rank-1";
                else if(index === 1) rankClass = "rank-2";
                else if(index === 2) rankClass = "rank-3";
            }
            row.innerHTML = `
                <td class="${rankClass}">${index + 1}</td>
                <td style="font-weight:bold;">${item.w}</td>
                <td style="color:${item.t > 0 ? getScoreColor(item.pct) : '#666'}">${item.t > 0 ? item.pct.toFixed(0) + '%' : '-'}</td>
                <td style="font-size:0.8rem; color:#888;">${item.c}/${item.t}</td>
            `;
            tbody.appendChild(row);
        });
        b.appendChild(table);
    }
    m.style.display = 'flex';
}
function getScoreColor(pct) {
    if(pct >= 80) return "var(--success)";
    if(pct >= 50) return "var(--gold)";
    return "var(--danger)";
}

function closeRanking() { document.getElementById('ranking-modal').style.display = 'none'; }