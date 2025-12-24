let connectSelection = null; 
let connectMatchesFound = 0;
let connectActiveItems = []; 
let connectLastRoundIds = []; 

function startConnectGame() {
    connectLastRoundIds = [];
    
    // Check of er genoeg woorden zijn
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

    // UI Wisselen
    document.getElementById('definition-area').style.display = 'none'; 
    document.getElementById('connect-area').style.display = 'block'; 
    document.getElementById('fc-stop-controls').style.display = 'block';
    
    isPlaying = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('settings-div').style.display = 'none';
    
    nextConnectRound(); 
}

function nextConnectRound() {
    const selectedUnit = document.getElementById('unit-select').value;
    const starOnly = document.getElementById('star-only-check').checked;
    
    // 1. Haal alle woorden op die mogen (Unit + Stars)
    let scopeWords = activeDB.filter(item => {
        const unitMatch = (selectedUnit === 'all' || item.u.toString() === selectedUnit);
        const starMatch = !starOnly || starredMap[item.w];
        return unitMatch && starMatch;
    });

    if (scopeWords.length < 4) {
        alert("Te weinig woorden beschikbaar (minimaal 4 nodig).");
        stopGame();
        return;
    }

    // 2. OVERDRIVE LOGICA: VERDEEL IN 'NOG LEREN' EN 'AL GEKEND'
    // Priority = Nieuw (0), Slecht (-1), of Goed (1). Mastered = Volledig (2).
    let priorityPool = scopeWords.filter(item => parseInt(progressMap[item.w] || 0) < 2);
    let masteredPool = scopeWords.filter(item => parseInt(progressMap[item.w] || 0) === 2);

    let candidates = [];

    if (priorityPool.length > 0) {
        // We hebben nog woorden te leren! Hussel ze.
        priorityPool.sort(() => Math.random() - 0.5);
        
        // Begin met de prioriteitswoorden
        candidates = [...priorityPool];

        // Als we minder dan 4 'te leren' woorden hebben, vul aan met 'al gekende' woorden
        if (candidates.length < 4) {
            masteredPool.sort(() => Math.random() - 0.5);
            candidates = candidates.concat(masteredPool);
        }
    } else {
        // Alles is al gekend (Maintenance Mode), gebruik alles door elkaar
        candidates = scopeWords.sort(() => Math.random() - 0.5);
    }

    // 3. Voorkom herhaling van de vorige ronde (indien mogelijk)
    // Alleen filteren als we dan nog steeds genoeg keuze hebben (> 7)
    if (candidates.length > 7) {
        candidates = candidates.filter(item => !connectLastRoundIds.includes(item.w));
    }

    // 4. SLIMME MATCHING (NEMESIS)
    // We pakken het eerste woord uit onze geprioriteerde lijst als 'Anker'
    let anchorWord = candidates[0];
    let nemesis = null;

    // Check of dit anker een vijand heeft in de confusionMap
    if (confusionMap[anchorWord.w]) {
        let mistakes = Object.keys(confusionMap[anchorWord.w]).sort((a, b) => {
            return confusionMap[anchorWord.w][b] - confusionMap[anchorWord.w][a];
        });

        // Zoek de ergste vijand die OOK in de huidige 'scope' zit
        for (let mistakeWord of mistakes) {
            let found = scopeWords.find(item => item.w === mistakeWord);
            if (found) {
                nemesis = found;
                break; 
            }
        }
    }

    // 5. STEL DE DEFINITIEVE LIJST SAMEN (TOP 4)
    let finalSelection = [];

    if (nemesis && nemesis.w !== anchorWord.w) {
        // We hebben een nemesis gevonden! Zet ze samen in de lijst.
        finalSelection.push(anchorWord);
        finalSelection.push(nemesis);
        
        // Vul de overige 2 plekken met de volgende kandidaten (die niet anker of nemesis zijn)
        let fillers = candidates.filter(i => i.w !== anchorWord.w && i.w !== nemesis.w);
        finalSelection = finalSelection.concat(fillers.slice(0, 2));
    } else {
        // Geen nemesis, pak gewoon de bovenste 4 van de geprioriteerde lijst
        finalSelection = candidates.slice(0, 4);
    }

    // Update status
    connectActiveItems = finalSelection;
    connectLastRoundIds = connectActiveItems.map(i => i.w);
    connectMatchesFound = 0;
    
    renderConnectBoard();
}

function renderConnectBoard() {
    const colWords = document.getElementById('col-words');
    const colDefs = document.getElementById('col-defs');
    colWords.innerHTML = "";
    colDefs.innerHTML = "";

    // Hussel de woorden en definities apart van elkaar voor weergave
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
                s = sentences[Math.floor(Math.random() * sentences.length)];
            } else {
                s = sentences || item.d;
            }
            if(s) {
                let searchWord = item.w;
                if (searchWord.toLowerCase().startsWith("to ")) searchWord = searchWord.substring(3); 
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

    // Deselecteer als je op dezelfde klikt
    if (connectSelection && connectSelection.el === el) {
        el.classList.remove('selected');
        connectSelection = null;
        return;
    }

    // Eerste selectie
    if (!connectSelection) {
        connectSelection = { el: el, id: id, type: type };
        el.classList.add('selected');
        return;
    }

    // Zelfde type aangeklikt (bijv. 2 woorden)? Wissel selectie.
    if (connectSelection.type === type) {
        connectSelection.el.classList.remove('selected');
        connectSelection = { el: el, id: id, type: type };
        el.classList.add('selected');
        return;
    }

    // CHECK MATCH
    let match = (connectSelection.id === id);

    if (match) {
        // --- CORRECT ---
        el.classList.add('correct');
        connectSelection.el.classList.add('correct');
        el.classList.remove('selected');
        connectSelection.el.classList.remove('selected');
        
        // Update stats (alleen voor dit woord, want het is een match)
        updateStats(id, true);
        
        // Progressie omhoog (van Rood/Nieuw -> Oranje)
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
        // --- FOUT ---
        el.classList.add('wrong');
        connectSelection.el.classList.add('wrong');
        
        // 1. Strafpunten voor WOORD A (Eerste klik)
        updateStats(connectSelection.id, false); // 0/1 erbij in ranking
        markAsBad(connectSelection.id);          // Wordt rood
        
        // 2. Strafpunten voor WOORD B (Tweede klik) -> NIEUW
        updateStats(id, false);                  // 0/1 erbij in ranking
        markAsBad(id);                           // Wordt rood
        
        // 3. Registreer de verwarring (voor de 'Meest Verwarde' lijst)
        registerConfusion(connectSelection.id, id);

        saveProgress();

        // Visuele feedback (even rood knipperen)
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