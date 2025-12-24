// VARIABELEN SPECIFIEK VOOR DEZE MODES
let isFlipped = false; 
let isRevealed = false; 
let isProcessing = false;

// SESSIE VARIABELEN (VOOR WORST25)
let sessionTotal = 0;
let sessionCount = 0;
let sessionCorrect = 0;
let sessionWrong = 0;
let sessionCorrectItems = [];
let sessionWrongItems = [];

// --- START FUNCTIE ---
function startStandardGame() {
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

    } else {
        // OVERDRIVE & FLASHCARDS
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
    
    if (currentMode !== 'flashcards' && currentMode !== 'worst25') {
        gameInterval = setInterval(gameLoop, 100);
    }
}

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

// --- CORE GAMEPLAY ---
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
        let textToShow = currentItem.d;
        if(currentMode === 'fillblanks') {
             // Logic handled in Connect mode, but kept for safety
        }

        contentHtml = `
            ${starHtml}
            <div style="margin-top:10px;">${textToShow}</div>
        `;
        document.getElementById('answer-input').value = "";
    }

    const isMastered = parseInt(progressMap[currentItem.w] || 0) === 2;
    if (isMastered && currentMode !== 'worst25') {
        contentHtml += `<div style="font-size: 0.8rem; color: #facc15; margin-top: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">✨ Review: Al Gekend</div>`;
    }
    area.innerHTML = contentHtml;
}

function toggleStarCurrent(word) {
    if(starredMap[word]) delete starredMap[word];
    else starredMap[word] = true;
    saveProgress(); 
    renderGameUI(); 
}

// --- VISUELE FEEDBACK FUNCTIE ---
function showRankFeedback(diff) {
    // FIX: Element aan CONTAINER hangen zodat hij niet wordt gewist door nextWord()
    const container = document.querySelector('.game-container');
    const el = document.createElement('div');
    el.className = 'rank-change-popup';
    
    if (diff > 0) {
        el.innerText = `▲ ${diff}`;
        el.style.color = "var(--success)";
    } else if (diff < 0) {
        el.innerText = `▼ ${Math.abs(diff)}`;
        el.style.color = "var(--danger)";
    } else {
        el.innerText = "=";
        el.style.color = "var(--text-muted)";
    }

    container.appendChild(el);
    setTimeout(() => el.remove(), 1500);
}

// --- INPUT LOGIC ---
document.getElementById('answer-input').addEventListener('input', (e) => {
    if (!isPlaying || currentMode === 'flashcards' || currentMode === 'connect') return;
    const val = e.target.value.trim().toLowerCase();
    const correct = currentItem.w.toLowerCase();

    if (val === correct) { handleCorrect(); return; }

    const mistakeItem = activeDB.find(item => item.w.toLowerCase() === val);
    if (mistakeItem) {
        if (!correct.startsWith(val)) {
            registerConfusion(currentItem.w, mistakeItem.w);
            updateStats(mistakeItem.w, false); 
            markAsBad(mistakeItem.w); 
            markAsBad(currentItem.w); 

            if (currentMode !== 'worst25' && !activeQueue.some(i => i.w === mistakeItem.w)) {
                activeQueue.push(mistakeItem);
            }
            saveProgress(); 
            passWord(false, true); 
        }
    }
});

function handleCorrect(skipVisuals = false) {
    if (currentMode !== 'flashcards' && !skipVisuals) {
        const inputEl = document.getElementById('answer-input');
        inputEl.classList.add('flash-green'); setTimeout(() => inputEl.classList.remove('flash-green'), 300);
    }

    // 1. RANK BEPALEN VOOR UPDATE
    const rankBefore = getWordRank(currentItem.w);

    updateStats(currentItem.w, true);

    // 2. RANK BEPALEN NA UPDATE
    const rankAfter = getWordRank(currentItem.w);
    
    // 3. VERSCHIL TONEN 
    const rankDiff = rankBefore - rankAfter;
    if (!skipVisuals) showRankFeedback(rankDiff);

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

    // 1. RANK VOOR
    const rankBefore = getWordRank(currentItem.w);

    updateStats(currentItem.w, false);
    markAsBad(currentItem.w);

    // 2. RANK NA
    const rankAfter = getWordRank(currentItem.w);

    // 3. VERSCHIL
    const rankDiff = rankBefore - rankAfter;
    if (!skipVisuals) showRankFeedback(rankDiff);

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

// --- EVENT HANDLERS VOOR TOETSENBORD ---
document.addEventListener('keydown', (e) => {
    if (!isPlaying || isProcessing) return;
    if (currentMode === 'connect' || currentMode === 'fillblanks') return;
    
    if (currentMode !== 'flashcards') return;
    if (!isRevealed) { e.preventDefault(); revealFlashcard(); return; }
    if (e.key === '1' || e.key === 'ArrowLeft') handleFlashcardResult(false);
    if (e.key === '2' || e.key === 'ArrowRight') handleFlashcardResult(true);
});

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