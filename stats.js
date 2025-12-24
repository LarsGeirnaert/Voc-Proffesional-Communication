// --- HULPFUNCTIE: BEREKEN GLOBALE RANKING ---
function getGlobalRankings() {
    let list = activeDB.map(item => {
        const s = wordStats[item.w] || { c: 0, t: 0 };
        const pct = s.t > 0 ? (s.c / s.t) * 100 : 0;
        return { w: item.w, pct: pct, c: s.c, t: s.t, id: item.id };
    });

    list.sort((a, b) => {
        if (a.t === 0 && b.t > 0) return 1; 
        if (b.t === 0 && a.t > 0) return -1;
        if (Math.abs(b.pct - a.pct) > 0.1) return b.pct - a.pct;
        if (b.c !== a.c) return b.c - a.c;
        return a.w.localeCompare(b.w);
    });

    return list;
}

// --- UPDATE BOTTOM HISTORY (Ranking Tracker) ---
function checkBottomRankings() {
    if(!activeDB || activeDB.length === 0) return;
    const ranking = getGlobalRankings();
    const totalWords = ranking.length;
    const startIndex = Math.max(0, totalWords - 21);
    
    for (let i = startIndex; i < totalWords; i++) {
        const wordObj = ranking[i];
        if (!bottomHistory.includes(wordObj.w)) {
            bottomHistory.push(wordObj.w);
        }
    }
    localStorage.setItem('vocab_bottom_history', JSON.stringify(bottomHistory));
}

// --- PROGRESS BARS & COUNTS ---
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
    
    checkBottomRankings();
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
             if(l===2) pts+=3; else if(l===1) pts+=2; else if(l===-1) pts+=1;
        });
        let max = unitWords.length * 3;
        let pct = max > 0 ? Math.floor((pts/max)*100) : 0;

        o.innerText = (pct === 100 && max > 0) ? `Unit ${u} (100% ✅)` : `Unit ${u} (${pct}%)`;
        s.appendChild(o);
    });
    if (currentSelection && s.querySelector(`option[value="${currentSelection}"]`)) s.value = currentSelection;
    else { const saved = localStorage.getItem('vocab_last_unit'); if(saved && s.querySelector(`option[value="${saved}"]`)) s.value = saved; }
}

// --- KLASSEMENT MODAL ---
function showRanking() {
    const m = document.getElementById('ranking-modal');
    const b = document.getElementById('ranking-body');
    b.innerHTML = "";

    if (!activeDB) return;

    let selectedUnit = document.getElementById('unit-select').value;
    const mode = document.getElementById('mode-select').value;

    if (mode === 'worst25') {
        selectedUnit = 'all';
    }

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

    let titleText = (mode === 'worst25' || selectedUnit === 'all') ? "Totaal Score (Alles)" : "Totaal Score (Deze Unit)";

    // SECTIE 1: SUMMARY
    const summary = document.createElement('div');
    summary.style.cssText = "text-align:center; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; margin-bottom:25px; border:1px solid var(--glass-border);";
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

    // SECTIE 2: GROOTSTE COMEBACKS
    const ranking = getGlobalRankings(); 
    let comebacks = [];
    ranking.forEach((item, index) => {
        if (index < 169 && bottomHistory.includes(item.w)) {
            comebacks.push({ w: item.w, rank: index + 1 });
        }
    });
    
    if (comebacks.length > 0) {
        const comebackDiv = document.createElement('div');
        comebackDiv.style.marginBottom = "25px";
        let cbHtml = `
            <div style="background:rgba(0, 255, 0, 0.05); border:1px solid var(--success); border-radius:8px; padding:10px;">
                <h3 style="color:var(--success); margin:0 0 5px 0; font-size:1rem;">🏆 Grootste Comebacks (${comebacks.length})</h3>
                <div style="font-size:0.8rem; color:#aaa; margin-bottom:10px;">Van de bodem naar de top!</div>
                <table class="rank-table" style="font-size:0.9rem; margin:0;">
                    <tbody>`;
        comebacks.forEach(c => {
            cbHtml += `<tr><td style="border:none;">${c.w}</td><td style="color:var(--gold); text-align:right; border:none;">Nu op #${c.rank}</td></tr>`;
        });
        cbHtml += "</tbody></table></div>";
        comebackDiv.innerHTML = cbHtml;
        b.appendChild(comebackDiv);
    }

    // SECTIE 3: VAAK VERWARD
    let mergedConfusions = {};
    Object.keys(confusionMap).forEach(w1 => {
        Object.keys(confusionMap[w1]).forEach(w2 => {
            let pairKey = [w1, w2].sort().join('|');
            if (!mergedConfusions[pairKey]) mergedConfusions[pairKey] = 0;
            mergedConfusions[pairKey] += confusionMap[w1][w2];
        });
    });

    let confusionList = Object.keys(mergedConfusions).map(key => {
        let parts = key.split('|');
        return { w1: parts[0], w2: parts[1], count: mergedConfusions[key] };
    });
    confusionList.sort((a, b) => b.count - a.count);
    
    if (confusionList.length > 0) {
        const confDiv = document.createElement('div');
        confDiv.style.marginBottom = "30px"; 
        
        let confRows = "";
        confusionList.slice(0, 10).forEach(c => {
            confRows += `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="text-align:right; color:var(--text-main); padding-right:10px; width:45%;">${c.w1}</td>
                <td style="text-align:center; color:#666; font-size:0.8rem; width:10%;">↔</td>
                <td style="text-align:left; color:var(--text-main); padding-left:10px; width:45%;">${c.w2}</td>
                <td style="text-align:right; font-weight:bold; color:var(--danger); width:30px;">${c.count}x</td>
            </tr>`;
        });

        if (confusionList.length > 10) {
            confRows += `<tr><td colspan="4" style="text-align:center; color:#666; font-size:0.8rem; padding:5px;">... en nog ${confusionList.length - 10} paren</td></tr>`;
        }

        confDiv.innerHTML = `
            <details style="background:rgba(255, 255, 255, 0.03); border:1px solid #444; border-radius:8px; overflow:hidden;">
                <summary style="padding:12px 15px; cursor:pointer; font-weight:bold; color:#ff6b6b; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2);">
                    <span>😵 Meest Verwarde Woorden (${confusionList.length})</span>
                    <span style="font-size:0.8rem; opacity:0.7;">▼</span>
                </summary>
                <div style="padding:0;">
                    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                        <thead style="background:rgba(255,255,255,0.05); color:#888; font-size:0.8rem;">
                            <tr>
                                <th style="text-align:right; padding:8px;">Woord A</th>
                                <th></th>
                                <th style="text-align:left; padding:8px;">Woord B</th>
                                <th style="text-align:right; padding:8px;">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${confRows}
                        </tbody>
                    </table>
                </div>
            </details>
        `;
        b.appendChild(confDiv);
    }

    // SECTIE 4: NORMALE LIJST
    const listTitle = document.createElement('h3');
    listTitle.innerText = "Alle Woorden & Scores";
    listTitle.style.cssText = "color:var(--text-main); font-size:1rem; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #444;";
    b.appendChild(listTitle);

    if (list.length === 0) {
        b.innerHTML += "<div style='text-align:center; padding:20px; color:#666;'>Geen woorden in deze selectie.</div>";
    } else {
        const table = document.createElement('table');
        table.className = "rank-table";
        // --- UPDATE: HEADER MET STER KOLOM ---
        table.innerHTML = `<thead><tr><th>#</th><th>Woord</th><th>Score</th><th>J/T</th><th style="text-align:center">★</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        
        list.forEach((item, index) => {
            const row = document.createElement('tr'); 
            row.className = "rank-row";
            if (typeof showWordDetail === 'function') {
                row.onclick = () => showWordDetail(item.w);
                row.style.cursor = "pointer";
            }
            let rankClass = "";
            if (item.t > 0) {
                if(index === 0) rankClass = "rank-1";
                else if(index === 1) rankClass = "rank-2";
                else if(index === 2) rankClass = "rank-3";
            }

            // Ster logica
            const isStarred = starredMap[item.w];
            const starIcon = isStarred ? "★" : "☆";
            const starColor = isStarred ? "var(--gold)" : "#555";

            // --- UPDATE: RIJ MET STER KOLOM ---
            row.innerHTML = `
                <td class="${rankClass}">${index + 1}</td>
                <td style="font-weight:bold;">${item.w}</td>
                <td style="color:${item.t > 0 ? getScoreColor(item.pct) : '#666'}">${item.t > 0 ? item.pct.toFixed(0) + '%' : '-'}</td>
                <td style="font-size:0.8rem; color:#888;">${item.c}/${item.t}</td>
                <td style="font-size:1.2rem; color:${starColor}; cursor:pointer; text-align:center;" 
                    onclick="event.stopPropagation(); toggleStarRanking('${item.w.replace(/'/g, "\\'")}')">
                    ${starIcon}
                </td>
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

// --- NIEUWE FUNCTIE: STER TOGGLEN IN RANKING ---
function toggleStarRanking(w) {
    if(starredMap[w]) delete starredMap[w]; else starredMap[w] = true;
    saveProgress();
    showRanking(); // Direct de ranking verversen
}

// --- KLEINE LIJST MODAL (New, Bad, Good, Full) ---
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
window.onclick = e => { 
    if(e.target == document.getElementById('list-modal')) closeModal(); 
    if(e.target == document.getElementById('ranking-modal')) closeRanking(); 
    if(e.target == document.getElementById('confirm-modal')) document.getElementById('confirm-modal').style.display = 'none';
}

// --- IMPORT & EXPORT ---
function exportData() { 
    const d = { p: progressMap, s: starredMap, st: wordStats, bh: bottomHistory, cm: confusionMap }; 
    const b = new Blob([JSON.stringify(d)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download="vocab_backup.json"; a.click(); 
}

function importData(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.p) progressMap = data.p; 
            if (data.s) starredMap = data.s;
            if (data.st) wordStats = data.st;
            if (data.bh) bottomHistory = data.bh; 
            if (data.cm) confusionMap = data.cm; 
            else if (data.progress) { progressMap = data.progress; starredMap = data.starred; } 
            saveProgress(); 
            localStorage.setItem('vocab_stats', JSON.stringify(wordStats)); 
            localStorage.setItem('vocab_bottom_history', JSON.stringify(bottomHistory));
            localStorage.setItem('vocab_confusions', JSON.stringify(confusionMap));
            alert("Backup geladen!"); location.reload();
        } catch (err) { alert("Fout bij lezen bestand."); }
    }; reader.readAsText(file);
    input.value = '';
}

// --- HELPER: VIND DE RANK VAN 1 WOORD ---
function getWordRank(word) {
    const list = getGlobalRankings();
    const index = list.findIndex(item => item.w === word);
    return index !== -1 ? index + 1 : list.length + 1;
}