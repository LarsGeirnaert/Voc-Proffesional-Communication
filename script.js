// --- 1. SETUP ---
let activeDB = []; 
let progressMap = JSON.parse(localStorage.getItem('vocab_progress_v2')) || {};
let starredMap = JSON.parse(localStorage.getItem('vocab_starred')) || {};

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
        activeDB = vocabDatabase; // Gebruik direct de standaard lijst
        populateUnitDropdown(); 
        refreshStats(); 
        toggleSettingsUI(); // Meteen UI aanpassen aan standaard selectie
    } else {
        document.getElementById('definition-area').innerText = "ERROR: vocab_data.js ontbreekt!";
        document.getElementById('definition-area').style.color = "var(--danger)";
    }
};

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
    if(confirm("LET OP: DIT WIST ALLES!")) {
        localStorage.removeItem('vocab_progress_v2');
        localStorage.removeItem('vocab_starred');
        location.reload();
    }
}

// --- UI/SETTINGS ---
function handleSettingsChange() { saveUnitSelection(); refreshStats(); }

function toggleSettingsUI() {
    const mode = document.getElementById('mode-select').value;
    const timerLabel = document.getElementById('timer-toggle-label');
    const inputArea = document.getElementById('input-area');
    const startBtn = document.getElementById('start-btn');

    if (mode === 'flashcards') {
        timerLabel.style.display = 'none';
        inputArea.style.display = 'none'; // Verberg input meteen
        startBtn.innerText = "START FLASHCARDS";
    } else {
        timerLabel.style.display = 'flex';
        inputArea.style.display = 'block'; // Toon input meteen
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
    
    // UI Updates
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('settings-div').style.display = 'none'; 
    
    const inputArea = document.getElementById('input-area');
    const gameControls = document.getElementById('game-controls');
    const fcControls = document.getElementById('fc-controls');
    const fcStop = document.getElementById('fc-stop-controls');
    const timerDiv = document.getElementById('timer-container-div');
    const timerTxt = document.getElementById('timer');

    // Verberg alles eerst
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

// --- NEXTWORD ---
function nextWord() {
    if (activeQueue.length === 0) { endGameVictory(); return; }
    
    isReviewWord = false; 
    const starOnly = document.getElementById('star-only-check').checked;
    const selectedUnit = document.getElementById('unit-select').value;

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
    
    if (!isReviewWord) {
        let candidates = [...activeQueue];
        if (candidates.length > 1 && currentItem) candidates = candidates.filter(w => w.w !== currentItem.w);
        currentItem = candidates[Math.floor(Math.random() * candidates.length)];
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

// Input Handling
document.getElementById('answer-input').addEventListener('input', (e) => {
    if (!isPlaying || currentMode === 'flashcards') return;
    const val = e.target.value.trim().toLowerCase();
    const correct = currentItem.w.toLowerCase();

    if (val === correct) { handleCorrect(); return; }

    const mistakeItem = activeDB.find(item => item.w.toLowerCase() === val);
    if (mistakeItem) {
        if (!correct.startsWith(val)) {
            progressMap[mistakeItem.w] = -1;
            starredMap[mistakeItem.w] = true;
            localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap));
            localStorage.setItem('vocab_starred', JSON.stringify(starredMap));
            refreshStats();
            
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

    // 1. Haal geselecteerde unit op
    const selectedUnit = document.getElementById('unit-select').value;

    // 2. Filter de database op deze unit (of 'all')
    const filteredDB = activeDB.filter(item => {
        return selectedUnit === 'all' || item.u.toString() === selectedUnit;
    });

    // 3. Tel statistieken op basis van de GEFILTERDE lijst
    let counts = { "-1": 0, "0": 0, "1": 0, "2": 0 };
    let starCount = 0;

    filteredDB.forEach(i => {
        let l = parseInt(progressMap[i.w] || 0);
        counts[l]++;
        if(starredMap[i.w]) starCount++;
    });
    
    // 4. Update de UI
    document.getElementById('cnt-new').innerText = counts[0]; 
    document.getElementById('cnt-bad').innerText = counts[-1];
    document.getElementById('cnt-good').innerText = counts[1]; 
    document.getElementById('cnt-full').innerText = counts[2];
    document.getElementById('cnt-star').innerText = "★ " + starCount;
    
    // Progress Bar Logica (Houdt ook rekening met ster-filter voor de bar zelf)
    const sOnly = document.getElementById('star-only-check').checked;
    
    // Voor de progress bar filteren we NOG dieper (ook op sterren als dat aanstaat)
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
    const s = document.getElementById('unit-select'); s.innerHTML='<option value="all">Alle Units</option>';
    if (!activeDB) return;

    [...new Set(activeDB.map(i=>i.u))].sort((a,b)=>a-b).forEach(u => {
        let o=document.createElement('option'); o.value=u;
        // Check of unit voltooid is (handig voor de gebruiker)
        let tot = activeDB.filter(w=>w.u===u).length; 
        let mast = activeDB.filter(w=>w.u===u && parseInt(progressMap[w.w]||0)===2).length;
        
        o.innerText = (tot>0 && tot===mast) ? `Unit ${u} (VOLTOOID)` : `Unit ${u}`; 
        s.appendChild(o);
    });
    const saved = localStorage.getItem('vocab_last_unit'); if(saved) { const o=s.querySelector(`option[value="${saved}"]`); if(o) s.value=saved; }
}
function saveUnitSelection() { localStorage.setItem('vocab_last_unit', document.getElementById('unit-select').value); }
function resetSpecificUnit() {
    const u = prompt("Unit resetten?"); if(!u) return; const tu = parseInt(u);
    if(![...new Set(activeDB.map(i=>i.u))].includes(tu)) { alert("Unit bestaat niet"); return; }
    if(confirm(`Unit ${tu} resetten?`)) { activeDB.forEach(i=>{if(i.u===tu)progressMap[i.w]=0}); saveProgress(); alert("Gereset"); }
}

function stopGame() { isPlaying=false; clearInterval(gameInterval); alert(`Gestopt. Score: ${score}`); location.reload(); }

function gameOver() { isPlaying=false; clearInterval(gameInterval); alert(`Game Over! Score: ${score}`); location.reload(); }

function endGameVictory() {
    isPlaying = false;
    clearInterval(gameInterval);
    fireConfetti();
    const area = document.getElementById('definition-area');
    area.innerHTML = "<div style='color:var(--success); font-size:1.5rem; animation: pulse 1s infinite;'>🎉 GEWELDIG! 🎉<br>Alles gekend in deze selectie!</div>";
    document.getElementById('answer-input').style.display = 'none';
    document.getElementById('start-btn').innerText = "Opnieuw Spelen";
    document.getElementById('start-btn').style.display = 'block';
}

function fireConfetti() {
    const c=document.getElementById('confetti-canvas'), x=c.getContext('2d'); c.width=window.innerWidth; c.height=window.innerHeight;
    let p=[]; for(let i=0;i<150;i++) p.push({x:c.width/2,y:c.height/2,vx:(Math.random()-0.5)*20,vy:(Math.random()-0.5)*20-5,c:['#06b6d4','#f43f5e','#facc15'][Math.floor(Math.random()*3)]});
    function a(){x.clearRect(0,0,c.width,c.height); p.forEach(i=>{i.x+=i.vx;i.y+=i.vy;i.vy+=0.1;x.fillStyle=i.c;x.fillRect(i.x,i.y,5,5)}); if(p.some(i=>i.y<c.height)) requestAnimationFrame(a);} a();
}

function exportData() { const d = {p:progressMap,s:starredMap}; const b = new Blob([JSON.stringify(d)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download="vocab_backup.json"; a.click(); }

function importData(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.p && data.s) { progressMap = data.p; starredMap = data.s; }
            else if (data.progress && data.starred) { progressMap = data.progress; starredMap = data.starred; }
            else { alert("Ongeldig bestand."); return; }
            saveProgress(); alert("Backup geladen!"); location.reload();
        } catch (err) { alert("Fout bij lezen bestand."); }
    }; reader.readAsText(file);
    input.value = '';
}

function showList(t) {
    currentListType = t;
    const m=document.getElementById('list-modal'), b=document.getElementById('modal-list-body'), h=document.getElementById('modal-title');
    let w=[], c="";

    if (!activeDB) return;

    // 1. Haal de geselecteerde unit op uit de dropdown
    const selectedUnit = document.getElementById('unit-select').value;

    // 2. Filter de database op deze unit (of 'all')
    const filteredDB = activeDB.filter(item => {
        return selectedUnit === 'all' || item.u.toString() === selectedUnit;
    });

    // 3. Toon alleen woorden uit deze unit die aan de criteria (t) voldoen
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

window.onclick = e => { if(e.target == document.getElementById('list-modal')) closeModal(); }

function saveProgress() {
    localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap));
    localStorage.setItem('vocab_starred', JSON.stringify(starredMap));
    refreshStats();
}