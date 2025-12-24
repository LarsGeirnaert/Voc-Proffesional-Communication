// --- 1. GLOBALE VARIABELEN (TOEGANKELIJK VOOR ALLE BESTANDEN) ---
let activeDB = [];
let progressMap = JSON.parse(localStorage.getItem('vocab_progress_v2')) || {};
let starredMap = JSON.parse(localStorage.getItem('vocab_starred')) || {};
let wordStats = JSON.parse(localStorage.getItem('vocab_stats')) || {};

// DATA VOOR STATISTIEKEN
let bottomHistory = JSON.parse(localStorage.getItem('vocab_bottom_history')) || []; 
let confusionMap = JSON.parse(localStorage.getItem('vocab_confusions')) || {}; 

// SPEL STATUS
let activeQueue = [];
let currentItem = null;
let score = 0;
let currentListType = null;
let isMaintenanceMode = false; 
let isPlaying = false;
let currentMode = 'overdrive';

// TIMER
const START_TIME = 25.0;
const VISUAL_MAX_TIME = 60.0;
let timer = START_TIME;
let timerEnabled = true;
let gameInterval;

// --- 2. INITIALISATIE ---
window.onload = function() {
    if (typeof vocabDatabase !== 'undefined' && typeof vocabSentences !== 'undefined') {
        activeDB = vocabDatabase.map(item => {
            return {
                ...item,
                s: vocabSentences[item.id] || null 
            };
        });

        fixRenamedWords(); 
        populateUnitDropdown(); // (Staat in stats.js)
        refreshStats();         // (Staat in stats.js)
        toggleSettingsUI();
    } else {
        document.getElementById('definition-area').innerText = "ERROR: vocab_base.js of vocab_sentences.js ontbreekt!";
        document.getElementById('definition-area').style.color = "var(--danger)";
    }
};

// --- 3. DATA HELPERS ---
function saveProgress() { 
    localStorage.setItem('vocab_progress_v2', JSON.stringify(progressMap)); 
    localStorage.setItem('vocab_starred', JSON.stringify(starredMap)); 
    refreshStats(); 
    populateUnitDropdown(); 
}

function updateStats(word, isCorrect) {
    if (!wordStats[word]) wordStats[word] = { c: 0, t: 0 };
    wordStats[word].t++; 
    if (isCorrect) wordStats[word].c++; 
    localStorage.setItem('vocab_stats', JSON.stringify(wordStats));
    
    // Check ranking update (Staat in stats.js)
    if(typeof checkBottomRankings === 'function') checkBottomRankings();
}

function registerConfusion(targetWord, wrongWord) {
    if (!confusionMap[targetWord]) confusionMap[targetWord] = {};
    if (!confusionMap[targetWord][wrongWord]) confusionMap[targetWord][wrongWord] = 0;
    confusionMap[targetWord][wrongWord]++;
    localStorage.setItem('vocab_confusions', JSON.stringify(confusionMap));
}

function markAsBad(word) {
    progressMap[word] = -1;
    starredMap[word] = true;
}

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

// --- 4. SPEL START & STOP LOGICA ---
function toggleSettingsUI() {
    const mode = document.getElementById('mode-select').value;
    const timerLabel = document.getElementById('timer-toggle-label');
    const inputArea = document.getElementById('input-area');
    const startBtn = document.getElementById('start-btn');
    const unitSelect = document.getElementById('unit-select');
    const starLabel = document.getElementById('star-only-label');

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

function handleSettingsChange() { 
    localStorage.setItem('vocab_last_unit', document.getElementById('unit-select').value);
    refreshStats(); 
    populateUnitDropdown(); 
}

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

    // ROUTER: Welke game starten we?
    if (currentMode === 'connect' || currentMode === 'fillblanks') {
        startConnectGame(); // (Functie in game_connect.js)
    } else {
        startStandardGame(); // (Functie in game_standard.js)
    }
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
    
    if (currentMode === 'connect' || currentMode === 'fillblanks' || currentMode === 'worst25') {
        // Gebruik de functie uit game_standard.js (ook voor connect gebruiken we de "end screen" logica)
        if(typeof endSessionVictory === 'function') endSessionVictory(); 
        else {
            // Fallback reset UI
            const startBtn = document.getElementById('start-btn'); 
            startBtn.innerText = "Opnieuw Spelen"; 
            startBtn.style.display = 'block';
            document.getElementById('settings-div').style.display = 'flex';
        }
    } else {
        const area = document.getElementById('definition-area');
        area.innerHTML = `<div style="margin-bottom: 15px;"><span style="font-size: 3rem;">🛑</span></div><div style="color: var(--danger); font-weight: bold; font-size: 1.5rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Spel Gestopt</div><div style="color: var(--text-muted); font-size: 1.1rem;">Je eindscore is: <span style="color: var(--accent); font-weight: bold; font-size: 1.3rem;">${score}</span></div>`;
        const startBtn = document.getElementById('start-btn'); 
        startBtn.innerText = "Opnieuw Spelen"; 
        startBtn.style.display = 'block';
        document.getElementById('settings-div').style.display = 'flex';
    }
}

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

function gameOver() { 
    isPlaying=false; clearInterval(gameInterval); 
    alert(`Game Over! Score: ${score}`); 
    location.reload(); 
}

function fireConfetti() {
    const c=document.getElementById('confetti-canvas'), x=c.getContext('2d'); c.width=window.innerWidth; c.height=window.innerHeight;
    let p=[]; for(let i=0;i<150;i++) p.push({x:c.width/2,y:c.height/2,vx:(Math.random()-0.5)*20,vy:(Math.random()-0.5)*20-5,c:['#06b6d4','#f43f5e','#facc15'][Math.floor(Math.random()*3)]});
    function a(){x.clearRect(0,0,c.width,c.height); p.forEach(i=>{i.x+=i.vx;i.y+=i.vy;i.vy+=0.1;x.fillStyle=i.c;x.fillRect(i.x,i.y,5,5)}); if(p.some(i=>i.y<c.height)) requestAnimationFrame(a);} a();
}

// --- 5. CUSTOM RESET MODALS ---
let confirmCallbackYes = null;
let confirmCallbackNo = null;

function showCustomConfirm(text, onYes, onNo = null, title = "Weet je het zeker?") {
    document.getElementById('confirm-title').innerText = title;
    document.getElementById('confirm-text').innerText = text;
    confirmCallbackYes = onYes;
    confirmCallbackNo = onNo;
    document.getElementById('confirm-modal').style.display = 'flex';
}

document.getElementById('btn-confirm-yes').onclick = function() {
    document.getElementById('confirm-modal').style.display = 'none';
    if (confirmCallbackYes) confirmCallbackYes(); 
};
document.getElementById('btn-confirm-no').onclick = function() {
    document.getElementById('confirm-modal').style.display = 'none';
    if (confirmCallbackNo) confirmCallbackNo(); 
};
window.addEventListener('click', function(e) {
    if (e.target == document.getElementById('confirm-modal')) document.getElementById('confirm-modal').style.display = 'none';
});

// Reset Logica
function resetStarredToNew() {
    const starredKeys = Object.keys(starredMap);
    if (starredKeys.length === 0) { showCustomConfirm("Je hebt nog geen woorden gemarkeerd.", null, null, "Geen Sterren"); return; }
    showCustomConfirm(`Dit zal de voortgang van ${starredKeys.length} gemarkeerde woorden resetten.`, function() {
        starredKeys.forEach(word => { progressMap[word] = 0; });
        saveProgress();
        setTimeout(() => alert("Reset voltooid!"), 100); 
    });
}
function unstarAll() {
    showCustomConfirm("Alle sterren verwijderen? Voortgang blijft behouden.", function() {
        starredMap = {}; localStorage.setItem('vocab_starred', JSON.stringify(starredMap)); refreshStats();
    });
}
function resetSpecificUnit() {
    const u = prompt("Welke Unit wil je resetten? (Vul nummer in)"); if(!u) return; const tu = parseInt(u);
    if(![...new Set(activeDB.map(i=>i.u))].includes(tu)) { alert("Unit bestaat niet"); return; }
    showCustomConfirm(`Weet je zeker dat je ALLE progressie van Unit ${tu} wilt wissen?`, function() {
        activeDB.forEach(i => { if(i.u === tu) progressMap[i.w] = 0; }); saveProgress();
    });
}
function resetProgress() {
    showCustomConfirm("Dit zal AL je voortgang wissen. Dit kan niet ongedaan worden gemaakt.", function() {
        showCustomConfirm("Wil je ook het KLASSEMENT (je scores en grafieken) wissen?\n\nJA = Alles wissen\nNEE = Alleen voortgang wissen",
            function() { performFullReset(true); },
            function() { performFullReset(false); },
            "Ook statistieken wissen?"
        );
    }, null, "⚠ WEET JE HET ZEKER?");
}
function performFullReset(wisOokStats) {
    localStorage.removeItem('vocab_progress_v2');
    localStorage.removeItem('vocab_starred');
    localStorage.removeItem('vocab_bottom_history');
    localStorage.removeItem('vocab_confusions'); 
    localStorage.removeItem('vocab_bad_history');
    if (wisOokStats) localStorage.removeItem('vocab_stats');
    location.reload();
}