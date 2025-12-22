// --- 1. SETUP ---
let activeDB = [];
let progressMap = JSON.parse(localStorage.getItem('vocab_progress_v2')) || {};
let starredMap = JSON.parse(localStorage.getItem('vocab_starred')) || {};
let wordStats = JSON.parse(localStorage.getItem('vocab_stats')) || {};

let activeQueue = [];
let currentItem = null;
let isReviewWord = false;
let score = 0;
let currentListType = null;

const START_TIME = 25.0;
const VISUAL_MAX_TIME = 60.0;
let timer = START_TIME;
let timerEnabled = true;
let currentMode = 'overdrive';
let isFlipped = false; let isRevealed = false; let isProcessing = false;
let gameInterval; let isPlaying = false;

// AUTOMATISCHE START
window.onload = function() {
    if (typeof vocabDatabase !== 'undefined') {
        activeDB = vocabDatabase;
        populateUnitDropdown();
        refreshStats();
        toggleSettingsUI();
    } else {
        document.getElementById('definition-area').innerText = "ERROR: vocab_data.js ontbreekt!";
        document.getElementById('definition-area').style.color = "var(--danger)";
    }
};

// --- STATISTIEKEN UPDATEN ---
function updateStats(word, isCorrect) {
    if (!wordStats[word]) {
        wordStats[word] = { c: 0, t: 0 };
    }
    wordStats[word].t++; 
    if (isCorrect) {
        wordStats[word].c++; 
    }
    localStorage.setItem('vocab_stats', JSON.stringify(wordStats));
}

// --- RESET FUNCTIES ---
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
    if (!confirm("⚠️ WEET JE HET ZEKER?\n\nDit zal al je voortgang (groen/rood gemarkeerde woorden) wissen.")) {
        return;
    }
    let wisKlassement = confirm("Wil je ook het KLASSEMENT (statistieken) wissen?\n\n✅ Klik OK om ALLES te wissen.\n❌ Klik ANNULEREN om je ranglijst te BEWAREN.");

    localStorage.removeItem('vocab_progress_v2');
    localStorage.removeItem('vocab_starred');

    if (wisKlassement) {
        localStorage.removeItem('vocab_stats');
    }
    location.reload();
}

// --- UI/SETTINGS ---
function handleSettingsChange() { 
    saveUnitSelection(); 
    refreshStats();
}

function toggleSettingsUI() {
    const mode = document.getElementById('mode-select').value;
    const timerLabel = document.getElementById('timer-toggle-label');
    const inputArea = document.getElementById('input-area');
    const startBtn = document.getElementById('start-btn');

    if (mode === 'flashcards') {
        timerLabel.style.display = 'none';
        inputArea.style.display = 'none';
        startBtn.innerText = "START FLASHCARDS";
    } else {
        timerLabel.style.display = 'flex';
        inputArea.style.display = 'block';
        startBtn.innerText = "START OVERDRIVE";
    }
    refreshStats();
}

document.addEventListener('keydown', (e) => {
    if (!isPlaying || currentMode !== 'flashcards' || isProcessing) return;
    if (!isRevealed) { e.preventDefault(); revealFlashcard(); return; }
    if (e.key === '1' || e.key === 'ArrowLeft') handleFlashcardResult(false);
    if (e.key === '2' || e.key === 'ArrowRight') handleFlashcardResult(true);
});

// --- GAME ---
function startGame() {
    buildQueue();
    if(activeQueue.length === 0) {
        const isStarMode = document.getElementById('star-only-check').checked;
        alert(isStarMode ? "Geen sterren in deze selectie." : "Alles al gekend! Reset of kies een andere unit.");
        return;
    }
    
    currentMode = document.getElementById('mode-select').value;
    timerEnabled = document.getElementById('timer-check').checked;
    score = 0; timer = START_TIME; isPlaying = true; isProcessing = false; isRevealed = false;
    document.getElementById('score').innerText = score;
    
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('settings-div').style.display = 'none'; 
    
    const inputArea = document.getElementById('input-area');
    const gameControls = document.getElementById('game-controls');
    const fcControls = document.getElementById('fc-controls');
    const fcStop = document.getElementById('fc-stop-controls');
    const timerDiv = document.getElementById('timer-container-div');
    const timerTxt = document.getElementById('timer');

    inputArea.style.display = 'none'; 
    gameControls.style.display = 'none';
    fcControls.style.display = 'none'; 
    fcStop.style.display = 'none';
    timerDiv.style.display = 'none'; 
    timerTxt.style.opacity = '0';

    if (currentMode === 'flashcards') {
        fcControls.style.display = 'flex'; 
        fcStop.style.display = 'block';
    } else {
        inputArea.style.display = 'block'; 
        gameControls.style.display = 'flex';
        timerDiv.style.display = 'block'; 
        timerTxt.style.opacity = '1';
        
        const input = document.getElementById('answer-input');
        input.disabled = false; input.value = ""; input.focus();
        
        if (!timerEnabled) {
            timerTxt.innerText = "∞"; timerTxt.style.color = "var(--accent)";
            document.getElementById('visual-timer').style.width = "100%";
        }
    }
    nextWord();
    if (currentMode !== 'flashcards') gameInterval = setInterval(gameLoop, 100);
}

function buildQueue() {
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

function gameLoop() {
    if (!isPlaying) return;
    if (timerEnabled) {
        timer -= 0.1;
        const timerEl = document.getElementById('timer');
        timerEl.innerText = timer.toFixed(1) + 's';
        const bar = document.getElementById('visual-timer');
        let pct = (timer / VISUAL_MAX_TIME) * 100;
        if (pct > 100) pct = 100; if (pct < 0) pct = 0;
        bar.style.width = pct + "%";
        if (timer <= 10) { bar.className = "timer-fill danger"; timerEl.style.color = "var(--danger)"; } 
        else { bar.className = "timer-fill"; timerEl.style.color = "var(--accent)"; }
        if (timer <= 0) gameOver();
    }
}

// --- NEXTWORD (AANGEPAST: Slimmere selectie) ---
function nextWord() {
    // 1. VICTORY CHECK
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

        // Hervul lijst (Infinite Mode)
        const selectedUnit = document.getElementById('unit-select').value;
        const starOnly = document.getElementById('star-only-check').checked;
        
        activeQueue = activeDB.filter(item => {
            const unitMatch = (selectedUnit === 'all') || (item.u.toString() === selectedUnit);
            const starMatch = !starOnly || starredMap[item.w];
            return unitMatch && starMatch;
        });

        isPlaying = false; 
        setTimeout(() => {
            if(document.getElementById('input-area').style.display !== 'none') {
                isPlaying = true;
                nextWord(); 
            }
        }, 3000);
        return; 
    }
    
    // 2. KIES NIEUW WOORD
    isReviewWord = false; 
    const starOnly = document.getElementById('star-only-check').checked;
    const selectedUnit = document.getElementById('unit-select').value;

    // A. Review logica (Mastered woorden soms terug laten komen)
    if (!starOnly) {
        const unitScopePool = activeDB.filter(item => {
            return selectedUnit === 'all' || item.u.toString() === selectedUnit;
        });
        let masteredInScope = unitScopePool.filter(i => (parseInt(progressMap[i.w] || 0) === 2));
        const masteryRatio = masteredInScope.length / unitScopePool.length;

        if (masteryRatio > 0.5 && Math.random() < 0.10) {
            if (masteredInScope.length > 0) {
                currentItem = masteredInScope[Math.floor(Math.random() * masteredInScope.length)];
                isReviewWord = true; 
            }
        }
    }
    
    // B. Standaard selectie (HIER IS DE WIJZIGING)
    if (!isReviewWord) {
        let candidates = [...activeQueue];
        
        // Zorg dat we niet direct hetzelfde woord kiezen (als er meer keuze is)
        if (candidates.length > 1 && currentItem) {
            candidates = candidates.filter(w => w.w !== currentItem.w);
        }

        // --- INTELLIGENTE SELECTIE START ---
        // Filter de woorden die 'Slecht' (-1) zijn
        let badCandidates = candidates.filter(w => parseInt(progressMap[w.w] || 0) === -1);

        let finalPool = candidates;

        // Als er slechte woorden zijn, geef ze 50% kans om uit die groep te kiezen.
        // Dit zorgt ervoor dat ze VAKER komen, maar niet ALTIJD.
        if (badCandidates.length > 0 && Math.random() < 0.5) {
            finalPool = badCandidates;
        }
        // --- INTELLIGENTE SELECTIE EINDE ---

        if(finalPool.length > 0) {
            currentItem = finalPool[Math.floor(Math.random() * finalPool.length)];
        } else {
            currentItem = candidates[0]; // Fallback
        }
    }
    
    isRevealed = false;
    document.getElementById('btn-show-answer').style.display = 'block';
    document.getElementById('fc-rating-btns').style.display = 'none';
    renderGameUI();
}

function renderGameUI() {
    const area = document.getElementById('definition-area');
    area.classList.remove('fc-feedback-good', 'fc-feedback-bad');
    
    let contentHtml = "";

    if (currentMode === 'flashcards') {
        contentHtml = `
            <div class="flashcard-content" onclick="if(!isRevealed) revealFlashcard()">
                <div class="fc-face fc-front">${currentItem.d}</div>
                <div class="fc-face fc-back">${currentItem.w}</div>
            </div>`;
    } else {
        contentHtml = currentItem.d;
        document.getElementById('answer-input').value = "";
    }

    if (isReviewWord) {
        contentHtml += `<div style="font-size: 0.8rem; color: #facc15; margin-top: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">✨ Review: Al Gekend</div>`;
    }

    area.innerHTML = contentHtml;
}

// --- INPUT HANDLING ---
document.getElementById('answer-input').addEventListener('input', (e) => {
    if (!isPlaying || currentMode === 'flashcards') return;
    const val = e.target.value.trim().toLowerCase();
    const correct = currentItem.w.toLowerCase();

    if (val === correct) { handleCorrect(); return; }

    const mistakeItem = activeDB.find(item => item.w.toLowerCase() === val);
    
    if (mistakeItem) {
        if (!correct.startsWith(val)) {
            // A. Straf het WOORD dat je typte
            updateStats(mistakeItem.w, false); 

            // B. Zet progressie van het getypte woord terug
            progressMap[mistakeItem.w] = -1;
            starredMap[mistakeItem.w] = true;
            
            saveProgress(); 
            
            // C. Reken het HUIDIGE woord ook fout
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

    if (isReviewWord) {
        progressMap[currentItem.w] = 1; activeQueue.push(currentItem);
    } else {
        progressMap[currentItem.w] = -1; starredMap[currentItem.w] = true;
    }
    saveProgress();
}

function handleCorrect(skipVisuals = false) {
    if (currentMode !== 'flashcards' && !skipVisuals) {
        const inputEl = document.getElementById('answer-input');
        inputEl.classList.add('flash-green'); setTimeout(() => inputEl.classList.remove('flash-green'), 300);
    }
    
    updateStats(currentItem.w, true);

    if (!isReviewWord) {
        let lvl = parseInt(progressMap[currentItem.w] || 0);
        if (lvl === -1) lvl = 1; 
        else if (lvl === 0) lvl = 1; 
        else if (lvl === 1) lvl = 2;
        
        progressMap[currentItem.w] = lvl;
        
        if (lvl === 2) {
            activeQueue = activeQueue.filter(i => i.w !== currentItem.w);
        }
        saveProgress();
    }
    if (timerEnabled && currentMode === 'overdrive') timer = Math.min(timer + 10, VISUAL_MAX_TIME);
    score++; document.getElementById('score').innerText = score;
    nextWord();
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

function refreshStats() {
    if (!activeDB || activeDB.length === 0) return;

    const selectedUnit = document.getElementById('unit-select').value;
    const filteredDB = activeDB.filter(item => {
        return selectedUnit === 'all' || item.u.toString() === selectedUnit;
    });

    let counts = { "-1": 0, "0": 0, "1": 0, "2": 0 };
    let starCountInUnit = 0;
    let totalStarCount = 0; 

    filteredDB.forEach(i => {
        let l = parseInt(progressMap[i.w] || 0);
        counts[l]++;
        if(starredMap[i.w]) starCountInUnit++;
    });

    activeDB.forEach(i => {
        if(starredMap[i.w]) totalStarCount++;
    });
    
    document.getElementById('cnt-new').innerText = counts[0]; 
    document.getElementById('cnt-bad').innerText = counts[-1];
    document.getElementById('cnt-good').innerText = counts[1]; 
    document.getElementById('cnt-full').innerText = counts[2];
    document.getElementById('cnt-star').innerText = "★ " + starCountInUnit;

    const resetBtn = document.getElementById('btn-reset-star');
    if(resetBtn) {
        resetBtn.innerText = `Reset ★ (${totalStarCount})`;
    }
    
    const sOnly = document.getElementById('star-only-check').checked;
    const rel = filteredDB.filter(i => (!sOnly || starredMap[i.w]));
    
    let pts = 0; 
    rel.forEach(i => { 
        let l = parseInt(progressMap[i.w] || 0); 
        if(l===2) pts+=3; 
        else if(l===1) pts+=2; 
        else if(l===-1) pts+=1; 
    });
    
    const max = rel.length * 3; 
    const pct = max > 0 ? ((pts/max)*100).toFixed(2) : "0.00";
    
    document.getElementById('mastery-bar').style.width = pct + "%"; 
    document.getElementById('mastery-pct').innerText = pct + "%";
    document.getElementById('progress-label-text').innerText = (selectedUnit!=='all'?`UNIT ${selectedUnit}`:"TOTAAL") + (sOnly?" (★)":"");
}

function populateUnitDropdown() {
    const s = document.getElementById('unit-select');
    const currentSelection = s.value; 
    
    s.innerHTML = '<option value="all">Alle Units</option>';
    if (!activeDB) return;

    [...new Set(activeDB.map(i => i.u))].sort((a, b) => a - b).forEach(u => {
        let o = document.createElement('option'); 
        o.value = u;
        
        let tot = activeDB.filter(w => w.u === u).length; 
        let mast = activeDB.filter(w => w.u === u && parseInt(progressMap[w.w] || 0) === 2).length;
        
        let pct = tot > 0 ? Math.floor((mast / tot) * 100) : 0;

        if (pct === 100) {
            o.innerText = `Unit ${u} (100% ✅)`;
        } else {
            o.innerText = `Unit ${u} (${pct}%)`;
        }
        s.appendChild(o);
    });
    
    if (currentSelection && s.querySelector(`option[value="${currentSelection}"]`)) {
        s.value = currentSelection;
    } else {
        const saved = localStorage.getItem('vocab_last_unit'); 
        if(saved && s.querySelector(`option[value="${saved}"]`)) s.value = saved; 
    }
}

function saveUnitSelection() { localStorage.setItem('vocab_last_unit', document.getElementById('unit-select').value); }
function resetSpecificUnit() {
    const u = prompt("Unit resetten?"); if(!u) return; const tu = parseInt(u);
    if(![...new Set(activeDB.map(i=>i.u))].includes(tu)) { alert("Unit bestaat niet"); return; }
    if(confirm(`Unit ${tu} resetten?`)) { activeDB.forEach(i=>{if(i.u===tu)progressMap[i.w]=0}); saveProgress(); alert("Gereset"); }
}

function stopGame() { 
    isPlaying = false; 
    clearInterval(gameInterval); 

    document.getElementById('input-area').style.display = 'none';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('fc-controls').style.display = 'none';
    document.getElementById('fc-stop-controls').style.display = 'none';
    document.getElementById('timer-container-div').style.display = 'none';
    document.getElementById('timer').style.opacity = '0';
    document.getElementById('btn-show-answer').style.display = 'none';

    const area = document.getElementById('definition-area');
    area.innerHTML = `
        <div style="margin-bottom: 15px;">
            <span style="font-size: 3rem;">🛑</span>
        </div>
        <div style="color: var(--danger); font-weight: bold; font-size: 1.5rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
            Spel Gestopt
        </div>
        <div style="color: var(--text-muted); font-size: 1.1rem;">
            Je eindscore is: <span style="color: var(--accent); font-weight: bold; font-size: 1.3rem;">${score}</span>
        </div>
    `;

    const startBtn = document.getElementById('start-btn');
    startBtn.innerText = "Opnieuw Spelen";
    startBtn.style.display = 'block';
    
    document.getElementById('settings-div').style.display = 'flex';
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
            
            saveProgress(); 
            localStorage.setItem('vocab_stats', JSON.stringify(wordStats)); 
            alert("Backup geladen!"); location.reload();
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
    const filteredDB = activeDB.filter(item => {
        return selectedUnit === 'all' || item.u.toString() === selectedUnit;
    });

    if(t==='star'){
        h.innerText="Gemarkeerd (in deze unit)"; c="var(--gold)";
        w=filteredDB.filter(i=>starredMap[i.w]);
    } else {
        const labels = {0:"Niet Gekend",'-1':"Slecht Gekend",1:"Goed Gekend",2:"Volledig Gekend"};
        const colors = {0:"#94a3b8",'-1':"var(--danger)",1:"var(--gold)",2:"var(--success)"};
        h.innerText=labels[t]; c=colors[t];
        w=filteredDB.filter(i=>(parseInt(progressMap[i.w]||0)===t));
    }

    h.style.color=c; b.innerHTML="";

    if(w.length === 0) {
        b.innerHTML = "<div style='text-align:center; padding:20px; color:#666;'>Geen woorden gevonden in deze categorie (voor deze unit).</div>";
    } else {
        w.forEach(i=>{
            const d=document.createElement('div');
            d.className='list-item';
            d.innerHTML=`<span>${i.w}</span><span style="cursor:pointer; font-size:1.2rem;" onclick="toggleStar('${i.w.replace(/'/g,"\\'")}')">${starredMap[i.w]?'★':'☆'}</span>`;
            b.appendChild(d);
        });
    }
    m.style.display='flex';
}

function toggleStar(w) {
    if(starredMap[w]) delete starredMap[w];
    else starredMap[w]=true;

    saveProgress();

    if (currentListType !== null) {
        const listBody = document.getElementById('modal-list-body');
        const scrollPos = listBody.scrollTop;
        showList(currentListType);
        document.getElementById('modal-list-body').scrollTop = scrollPos;
    }
}

function closeModal() {
    document.getElementById('list-modal').style.display='none';
    currentListType = null;
}

window.onclick = e => { 
    if(e.target == document.getElementById('list-modal')) closeModal(); 
    if(e.target == document.getElementById('ranking-modal')) closeRanking(); 
}

function saveProgress() {
    localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap));
    localStorage.setItem('vocab_starred', JSON.stringify(starredMap));
    refreshStats();
    populateUnitDropdown(); 
}

function showRanking() {
    const m = document.getElementById('ranking-modal');
    const b = document.getElementById('ranking-body');
    b.innerHTML = "";

    let list = Object.keys(wordStats).map(word => {
        const s = wordStats[word];
        const pct = s.t > 0 ? (s.c / s.t) * 100 : 0;
        return { w: word, pct: pct, c: s.c, t: s.t };
    }).filter(i => i.t > 0);

    list.sort((a, b) => {
        if (Math.abs(b.pct - a.pct) > 0.1) { 
            return b.pct - a.pct;
        }
        return b.c - a.c; 
    });

    if (list.length === 0) {
        b.innerHTML = "<div style='text-align:center; padding:20px; color:#666;'>Nog geen statistieken. Speel eerst een spel!</div>";
    } else {
        const table = document.createElement('table');
        table.className = "rank-table";
        table.innerHTML = `<thead><tr><th>#</th><th>Woord</th><th>Score</th><th>J/T</th></tr></thead><tbody></tbody>`;
        
        const tbody = table.querySelector('tbody');
        
        list.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = "rank-row";
            
            let rankClass = "";
            if(index === 0) rankClass = "rank-1";
            else if(index === 1) rankClass = "rank-2";
            else if(index === 2) rankClass = "rank-3";

            row.innerHTML = `
                <td class="${rankClass}">${index + 1}</td>
                <td style="font-weight:bold;">${item.w}</td>
                <td style="color:${getScoreColor(item.pct)}">${item.pct.toFixed(0)}%</td>
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

function closeRanking() {
    document.getElementById('ranking-modal').style.display = 'none';
}