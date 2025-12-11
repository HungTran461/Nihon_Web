const PRICE = 1000;
const PITY_CAP = 150;
let soundOn = false;
let pool = [];
let giftcodes = [];
let state = { 
    coins: 5000, 
    pity: 0, 
    inventory: [], 
    history: [], 
    purchases: {}, 
    nextGuaranteed: null, 
    isFinished: false,
    usedCodes: []
};

async function initGame() {
    try {
        const [resCards, resCodes, resRates] = await Promise.all([
            fetch('data/cards_gacha.json'),
            fetch('data/giftcodes_gacha.json'),
            fetch('data/rates_gacha.json')
        ]);
        if (!resCards.ok || !resCodes.ok || !resRates.ok) {
            throw new Error("Không tìm thấy một trong các file JSON!");
        }
        const rawCards = await resCards.json();
        giftcodes = await resCodes.json(); 
        const ratesConfig = await resRates.json();
        const typeCounts = {};
        rawCards.forEach(card => {
            typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
        });
        pool = rawCards.map(card => {
            const totalTypeRate = ratesConfig[card.type] || 0;
            const count = typeCounts[card.type] || 1;
            const actualRate = totalTypeRate / count;
            return { ...card, rate: actualRate };
        });
        const rarityOrder = { 'SE': 6, 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2 };
        pool.sort((a, b) => (rarityOrder[b.type] || 0) - (rarityOrder[a.type] || 0));
        const saved = localStorage.getItem('gachaState_JSON_v2');
        if(saved) state = JSON.parse(saved); 
        
        updateUI();
        console.log(`Khởi tạo thành công: ${pool.length} thẻ.`);

    } catch (err) {
        alert("Lỗi khởi tạo: Kiểm tra lại các file JSON trong thư mục data/");
        console.error(err);
    }
}

function saveData() { localStorage.setItem('gachaState_JSON_v2', JSON.stringify(state)); updateUI(); }

function pull(times) {
    if(pool.length === 0) return alert("Dữ liệu đang tải hoặc bị lỗi...");
    const cost = PRICE * times;
    if(state.coins < cost) { 
        if(confirm("Thiếu Xu! Nạp thêm?")) openModal('rechargeModal'); 
        return; 
    }
    state.coins -= cost; 
    saveData();
    const items = [];
    for(let i = 0; i < times; i++) {
        items.push(rollItem());
    }
    let highestRarity = 'R';
    if (items.some(i => i.type === 'SE')) highestRarity = 'SE';
    else if (items.some(i => i.type === 'UR')) highestRarity = 'UR';
    else if (items.some(i => i.type === 'SSR')) highestRarity = 'SSR';
    else if (items.some(i => i.type === 'SR')) highestRarity = 'SR';
    const orb = document.getElementById('orb');
    const btn1 = document.getElementById('btnx1');
    const btn10 = document.getElementById('btnx10');
    btn1.disabled = true; 
    btn10.disabled = true;
    orb.classList.add('summoning');
    orb.classList.add(`orb-${highestRarity}`);
    
    playSound('sfx-spin');
    setTimeout(() => {
        orb.classList.remove('summoning');
        orb.classList.remove('orb-SE', 'orb-UR', 'orb-SSR', 'orb-SR', 'orb-R');
        playSound('sfx-win');
        if(times === 1) { 
            showDetail(items[0]); 
        } else { 
            showGridResult(items); 
        }
        
        btn1.disabled = false; 
        btn10.disabled = false;
    }, 1500); 
}

function rollItem() {
    let item;
    if (state.nextGuaranteed) {
        const guaranteedPool = pool.filter(x => x.type === state.nextGuaranteed);
        if (guaranteedPool.length > 0) {
            item = guaranteedPool[Math.floor(Math.random() * guaranteedPool.length)];
            state.nextGuaranteed = null;
            state.pity = 0;
            checkCompletion();
            saveData();
            if(!state.inventory.includes(item.id)) state.inventory.push(item.id);
            state.history.unshift({ id: item.id, time: new Date().toLocaleTimeString() });
            return item; 
        }
    }
    if(state.pity >= PITY_CAP - 1) {
        const ssrList = pool.filter(x => x.type === 'SSR');
        item = ssrList[Math.floor(Math.random() * ssrList.length)];
        state.pity = 0;
    } else {
        const rand = Math.random();
        let cumulative = 0;
        for(let i of pool) {
            cumulative += i.rate;
            if(rand < cumulative) { item = i; break; }
        }
        if(!item) item = pool[pool.length-1];
        if(item.type === 'SSR' || item.type === 'UR') state.pity = 0; else state.pity++;
    }
    if(!state.inventory.includes(item.id)) state.inventory.push(item.id);
    state.history.unshift({ id: item.id, time: new Date().toLocaleTimeString() });
    if(state.history.length > 50) state.history.pop();
    checkCompletion();
    saveData();
    return item;
}

function redeemCode() {
    try {
        const inputEl = document.getElementById('codeIdx');
        if (!inputEl) return;
        const code = inputEl.value.trim().toUpperCase();
        if (!code) {
            alert("Vui lòng nhập mã!");
            return;
        }
        if (!state.usedCodes) state.usedCodes = [];
        if (state.usedCodes.includes(code) && code !== 'RESET') {
            alert("Mã này bạn đã sử dụng rồi!");
            inputEl.value = ""; 
            return;
        }
        const found = giftcodes.find(gc => gc.code === code);
        if (found) {
            
            if (found.type === 'unlock_all') {
                pool.forEach(c => { 
                    if(!state.inventory.includes(c.id)) state.inventory.push(c.id); 
                });
                if (typeof checkCompletion === 'function') {
                    checkCompletion(); 
                }
            } 
            else if (found.type === 'add_coin') {
                state.coins += found.value;
            } 
            else if (found.type === 'force_next') {
                state.nextGuaranteed = found.value;
            }
            else if (found.type === 'reset_data') {
                resetData(); 
                return; 
            }
            if (code !== 'RESET') {
                state.usedCodes.push(code);
            }
            saveData();
            updateUI(); 
            inputEl.value = ""; 
            closeModal('giftcodeModal'); 
            playSound('sfx-win'); 
            alert(`Thành công! ${found.reward}`);
        } else {
            alert("Mã không đúng hoặc không tồn tại!");
            inputEl.value = "";
        }
    } catch (err) {
        console.error("Lỗi Giftcode:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
}

function resetData() {
    if(confirm("CẢNH BÁO: Xóa toàn bộ dữ liệu (Tiền, Thẻ, Lịch sử) để chơi lại?")) {
        localStorage.removeItem('gachaState_JSON_v2');
        location.reload();
    }
}

function showDetail(item) {
    document.getElementById('dImg').src = item.url;
    document.getElementById('dName').innerText = item.name;
    document.getElementById('dRarity').innerText = item.type;
    document.getElementById('dDesc').innerText = item.desc;
    let color = '#5eeeff'; if(item.type === 'SE') {
        color = '#fff'; 
        document.getElementById('dRarity').style.textShadow = "0 0 10px red, 0 0 20px blue"; 
    }
    else if(item.type === 'UR') color = 'var(--neon-red)';else if(item.type==='SSR')color='var(--neon-gold)';else if(item.type==='SR')color='var(--neon-purple)';
    document.getElementById('dRarity').style.color = color; document.getElementById('dName').style.color = color;
    openModal('detailModal');
    setTimeout(() => {
        const maxStats = {
            'SE': 10000, 
            'UR': 5000,
            'SSR': 200,
            'SR': 150,
            'R': 100
        };
        let max = maxStats[item.type] || 100;
        document.getElementById('valAtk').innerText = item.atk; document.getElementById('barAtk').style.width = (item.atk/max)*100+'%';
        document.getElementById('valDef').innerText = item.def; document.getElementById('barDef').style.width = (item.def/max)*100+'%';
    }, 300);
}

function showGridResult(items) {
    const grid = document.getElementById('resultGrid'); grid.innerHTML = '';
    items.forEach((item, idx) => {
        const div = createThumb(item, false);
        div.style.animation = `popIn 0.4s backwards ${idx*0.1}s`;
        grid.appendChild(div);
    });
    openModal('gridModal');
}

function calculateStats() {
    const types = ['SE', 'UR', 'SSR', 'SR', 'R'];
    let html = '';
    types.forEach(t => {
        const total = pool.filter(i => i.type === t).length;
        const owned = pool.filter(i => i.type === t && state.inventory.includes(i.id)).length;
        let c = '#fff'; 
        if(t === 'SE') c = '#fff; text-shadow: 0 0 5px #fff; font-weight: 900;'; 
        if(t === 'UR') c = 'var(--neon-red)'; 
        if(t === 'SSR') c = 'var(--neon-gold)'; 
        if(t === 'SR') c = 'var(--neon-purple)'; 
        if(t === 'R') c = 'var(--neon-blue)';
        html += `<div class="stat-item" style="color:${c}">${t} <br> ${owned}/${total}</div>`;
    });
    return html;
}

function openCollection() {
    const grid = document.getElementById('collectionGrid');
    const stats = document.getElementById('colStats');
    const types = ['SE', 'UR', 'SSR', 'SR', 'R'];
    let html = '';
    types.forEach(t => {
        const total = pool.filter(i => i.type === t).length;
        const owned = pool.filter(i => i.type === t && state.inventory.includes(i.id)).length;
        let c = '#fff'; if(t === 'SE') c = '#fff; text-shadow: 0 0 5px #fff; font-weight: 900;';if(t==='UR')c='var(--neon-red)'; if(t==='SSR')c='var(--neon-gold)'; if(t==='SR')c='var(--neon-purple)'; if(t==='R')c='var(--neon-blue)';
        html += `<div class="stat-item" style="color:${c}">${t} <br> ${owned}/${total}</div>`;
    });
    stats.innerHTML = html;
    filterCollection('ALL');
    document.getElementById('collectionModal').classList.add('show');
}


function filterCollection(type) {
    const grid = document.getElementById('collectionGrid');
    grid.innerHTML = ''; 
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    let filteredPool = [];
    if (type === 'ALL') {
        filteredPool = pool; 
    } else {
        filteredPool = pool.filter(card => card.type === type); 
    }
    if (filteredPool.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #777; padding: 20px;">Không có thẻ loại này</div>';
        return;
    }
    filteredPool.forEach(item => {
        const isOwned = state.inventory.includes(item.id);
        grid.appendChild(createThumb(item, !isOwned));
    });
}

function openHistory() {
    const grid = document.getElementById('historyGrid'); grid.innerHTML = '';
    if(state.history.length===0) grid.innerHTML='<p style="grid-column:1/-1;color:#ccc">Trống</p>';
    state.history.forEach(log => {
        const item = pool.find(i => i.id === log.id);
        if(item) {
            const div = createThumb(item, false);
            div.innerHTML += `<div class="timestamp">${log.time}</div>`;
            grid.appendChild(div);
        }
    });
    openModal('historyModal');
}

function createThumb(item, isLocked) {
    const div = document.createElement('div');
    div.className = `card-thumb ${isLocked ? 'locked' : 'bd-'+item.type}`;
    div.innerHTML = `<img src="${item.url}">`;
    if(!isLocked) div.onclick = () => showDetail(item);
    return div;
}

function updateUI() {
    document.getElementById('coin-display').innerText = state.coins.toLocaleString();
    document.getElementById('pity-display').innerText = state.pity;
}
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function openRecharge() { 
    const modal = document.getElementById('rechargeModal');
    if (state.purchases['100000'] >= 1) {
        document.getElementById('pack-100k').classList.add('sold-out');
    } else {
        document.getElementById('pack-100k').classList.remove('sold-out');
    }
    if (state.purchases['200000'] >= 1) {
        document.getElementById('pack-200k').classList.add('sold-out');
    } else {
        document.getElementById('pack-200k').classList.remove('sold-out');
    }

    modal.classList.add('show'); 
}

function buyCoins(amount) { 
    const LIMIT_THRESHOLD = 100000; 
    const MAX_BUY = 1; 
    if (amount >= LIMIT_THRESHOLD) {
        const boughtCount = state.purchases[amount] || 0;
        if (boughtCount >= MAX_BUY) {
            alert("Gói này chỉ được mua 1 lần duy nhất!");
            return;
        }
    }
    if(confirm(`Xác nhận nạp ${amount.toLocaleString()} Xu?`)){
        state.coins += amount;
        if (amount >= LIMIT_THRESHOLD) {
            state.purchases[amount] = (state.purchases[amount] || 0) + 1;
        }
        saveData(); 
        openRecharge(); 
        alert(`Nạp thành công +${amount.toLocaleString()} Xu!`);
        playSound('sfx-win');
    } 
}
function triggerFlash() { const f=document.getElementById('flash'); f.className='flash'; void f.offsetWidth; f.classList.add('do-flash'); }
function toggleSound() { soundOn=!soundOn; if(soundOn) document.getElementById('bgm').play().catch(()=>{}); else document.getElementById('bgm').pause(); }
function playSound(id) { if(soundOn){ const s=document.getElementById(id); s.currentTime=0; s.play().catch(()=>{}); } }
function checkCompletion() {
    if (state.isFinished) return;
    if (state.inventory.length >= pool.length && pool.length > 0) {
        state.isFinished = true; 
        saveData();
        document.getElementById('total-cards-count').innerText = pool.length;
        setTimeout(() => {
            closeModal('gridModal'); 
            closeModal('detailModal'); 
            document.getElementById('completionModal').classList.add('show');
            playSound('sfx-win'); 
            triggerFlash();
        }, 2000);
    }
}
function createRuneRing(elementId, radius, textContent, charSpacing) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = ''; 
    const text = textContent || "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ • MYSTIC GALAXY • ";
    const numChars = text.length;
    const angleStep = charSpacing ? charSpacing : (360 / numChars); 
    for (let i = 0; i < numChars; i++) {
        const span = document.createElement('span');
        span.className = 'rune-char';
        span.innerText = text[i];
        if(radius < 300) span.style.fontSize = "18px";
        span.style.transform = `rotate(${i * angleStep}deg) translateY(-${radius}px) rotate(90deg)`;
        container.appendChild(span);
    }
}

createRuneRing('runeOuter', 340, "• SUMMONING • THE • ANCIENT • SPIRITS • OF • THE • COSMOS • ", 10); 

createRuneRing('runeInner', 260, "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ"); 

initGame();