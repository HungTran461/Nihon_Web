const STORAGE_KEY = 'gachaState_JSON_v2'; 
let allCards = [];
let myInventory = [];
let selectedPreview = null;
let player = null;
let enemy = null;
let isFighting = false;

const SKILLS = {
    fire:   { name: "Hỏa Ngục", desc: "Gây 250% ST bùng nổ.", type: "dmg", val: 2.5 },
    water:  { name: "Thủy Hồi", desc: "Hồi 30% Máu tối đa.", type: "heal", val: 0.3 },
    earth:  { name: "Giáp Đá", desc: "Tăng 50% Phòng thủ.", type: "buff_def", val: 1.5 },
    wind:   { name: "Cuồng Phong", desc: "Gây 150% ST xuyên giáp.", type: "pierce", val: 1.5 },
    light:  { name: "Thánh Quang", desc: "Gây 180% ST + Hồi máu.", type: "hybrid", val: 1.8 },
    dark:   { name: "Nguyền Rủa", desc: "Hút 20% máu địch.", type: "drain", val: 0.2 },
    void:   { name: "Hư Vô", desc: "Gây 300% ST Chuẩn.", type: "true_dmg", val: 3.0 },
    normal: { name: "Đấm Nghiêm Túc", desc: "Gây 200% ST.", type: "dmg", val: 2.0 }
};

window.onload = async () => {
    await loadData();
    renderInventory();
};

async function loadData() {
    try {
        const res = await fetch('data/cards_gacha.json');
        allCards = await res.json();
        const saved = localStorage.getItem(STORAGE_KEY);
        if(saved) myInventory = JSON.parse(saved).inventory || [];
    } catch(e) { console.error(e); }
}

function parseCard(cardData) {
    let hp = cardData.hp || (cardData.def * 12);
    let elem = cardData.element ? cardData.element.toLowerCase() : 'normal';
    // Fix hệ cũ
    if(elem==='ice') elem='water'; if(elem==='nature') elem='earth'; if(elem==='poison') elem='dark';
    
    // TÍNH SPEED TỰ ĐỘNG NẾU THIẾU
    let spd = cardData.speed;
    if(!spd) {
        // Tốc độ cơ bản dựa trên độ hiếm và công
        let base = cardData.atk * 0.1; 
        if(cardData.type === 'UR') base += 20;
        else if(cardData.type === 'SSR') base += 15;
        else base += 10;
        spd = Math.floor(base);
    }

    return { 
        ...cardData, 
        realElement: elem,
        maxHp: hp, currentHp: hp, 
        speed: spd, 
        energy: 0, // Mana (0-100)
        actionGauge: 0 // Thanh hành động (0-1000)
    };
}

function getElemInfo(code) {
    const map = {
        fire: {n:'Hỏa', c:'el-fire'}, water: {n:'Thủy', c:'el-water'}, earth: {n:'Thổ', c:'el-earth'},
        wind: {n:'Phong', c:'el-wind'}, light: {n:'Quang', c:'el-light'}, dark: {n:'Ám', c:'el-dark'},
        void: {n:'Hư Không', c:'el-void'}, normal: {n:'Thường', c:'el-normal'}
    };
    return map[code] || map['normal'];
}

// --- RENDER ---
function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const userCards = allCards.filter(c => myInventory.includes(c.id));
    userCards.sort((a,b) => b.atk - a.atk);
    userCards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'select-card';
        div.onclick = () => previewCard(card, div);
        div.innerHTML = `<img src="${card.url}">`;
        grid.appendChild(div);
    });
}

function previewCard(card, element) {
    selectedPreview = card;
    document.querySelectorAll('.select-card').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('preview-placeholder').classList.add('hidden');
    document.getElementById('preview-content').classList.remove('hidden');

    const pCard = parseCard(card); // Để lấy stat đã tính toán
    const elemInfo = getElemInfo(pCard.realElement);
    const skill = SKILLS[pCard.realElement];

    document.getElementById('prev-name').innerText = pCard.name;
    document.getElementById('prev-img').src = pCard.url;
    document.getElementById('prev-rarity').innerText = pCard.type;
    
    const elBadge = document.getElementById('prev-elem');
    elBadge.innerText = elemInfo.n;
    elBadge.className = `elem-badge ${elemInfo.c}`;

    document.getElementById('prev-atk').innerText = pCard.atk;
    document.getElementById('prev-def').innerText = pCard.def;
    document.getElementById('prev-hp').innerText = pCard.maxHp;
    document.getElementById('prev-spd').innerText = pCard.speed; // HIỆN SPEED

    document.getElementById('skill-name').innerText = skill.name;
    document.getElementById('skill-desc').innerText = skill.desc;
}

function confirmBattle() {
    if(!selectedPreview) return;
    player = parseCard(selectedPreview);
    
    const rand = allCards[Math.floor(Math.random() * allCards.length)];
    enemy = parseCard(rand);
    enemy.maxHp = Math.floor(enemy.maxHp * 1.5);
    enemy.currentHp = enemy.maxHp;

    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('arena-screen').classList.remove('hidden');

    initFighterUI('p', player);
    initFighterUI('e', enemy);
    log(`⚔️ BẮT ĐẦU: ${player.name} (SPD ${player.speed}) vs ${enemy.name} (SPD ${enemy.speed})`);
    
    startCombatLoop();
}

function initFighterUI(prefix, char) {
    // --- RESET TRẠNG THÁI CŨ ---
    const visual = document.getElementById(prefix+'-visual');
    visual.classList.remove('fighter-dead'); // Xóa class chết
    
    const resDiv = document.getElementById(prefix+'-result');
    if(resDiv) {
        resDiv.innerText = "";
        resDiv.className = "battle-result"; // Reset class
    }
    // ---------------------------

    document.getElementById(prefix+'-img').src = char.url;
    document.getElementById(prefix+'-name').innerText = char.name;
    document.getElementById(prefix+'-spd-text').innerText = `SPD: ${char.speed}`;
    
    const el = getElemInfo(char.realElement);
    document.getElementById(prefix+'-elem-badge').innerText = el.n;
    document.getElementById(prefix+'-elem-badge').className = `elem-badge ${el.c}`;
    updateBars(prefix, char);
}

function updateBars(prefix, char) {
    if(char.currentHp < 0) char.currentHp = 0;
    const hpPct = (char.currentHp / char.maxHp) * 100;
    document.getElementById(prefix+'-hp-bar').style.width = hpPct + '%';
    document.getElementById(prefix+'-hp-text').innerText = Math.floor(char.currentHp);
    
    if(char.energy > 100) char.energy = 100;
    document.getElementById(prefix+'-mp-bar').style.width = char.energy + '%';

    // Update Action Bar (Vàng)
    let apPct = (char.actionGauge / 1000) * 100; 
    if(apPct > 100) apPct = 100;
    document.getElementById(prefix+'-ap-bar').style.width = apPct + '%';
}

// --- LOGIC ATB (ACTIVE TIME BATTLE) ---
async function startCombatLoop() {
    isFighting = true;
    const MAX_GAUGE = 1000;
    
    // Ẩn nút back khi đang đánh
    document.getElementById('btn-back').classList.add('hidden'); 
    
    while(player.currentHp > 0 && enemy.currentHp > 0) {
        const TICK_RATE = 10; 
        player.actionGauge += player.speed / 2;
        enemy.actionGauge += enemy.speed / 2;
        
        updateBars('p', player);
        updateBars('e', enemy);

        if(player.actionGauge >= MAX_GAUGE || enemy.actionGauge >= MAX_GAUGE) {
            let pReady = player.actionGauge >= MAX_GAUGE;
            let eReady = enemy.actionGauge >= MAX_GAUGE;
            
            // Xử lý tốc độ
            if(pReady && eReady) {
                if(player.speed >= enemy.speed) { 
                    await takeTurn(player, enemy, 'p', 'e'); pReady=false; 
                } else { 
                    await takeTurn(enemy, player, 'e', 'p'); eReady=false; 
                }
            }

            if(pReady && player.currentHp > 0 && enemy.currentHp > 0) {
                 await takeTurn(player, enemy, 'p', 'e');
            }
            if(eReady && player.currentHp > 0 && enemy.currentHp > 0) {
                 await takeTurn(enemy, player, 'e', 'p');
            }
        }
        await new Promise(r => setTimeout(r, 20)); 
    }
    
    isFighting = false;
    
    // --- XỬ LÝ KẾT THÚC TRẬN ĐẤU (MỚI) ---
    const isWin = player.currentHp > 0;
    
    if(isWin) {
        showEndGameEffect('p', 'e'); // Player thắng, Enemy thua
        log("🏆 CHIẾN THẮNG! Kẻ địch đã gục ngã.", "log-sys");
    } else {
        showEndGameEffect('e', 'p'); // Enemy thắng, Player thua
        log("💀 THẤT BẠI... Bạn đã hết sức lực.", "log-e");
    }
    
    document.getElementById('btn-back').classList.remove('hidden');
}
function showEndGameEffect(winnerPrefix, loserPrefix) {
    // Xử lý kẻ thua (Xám màu + Chữ LOSE)
    const loserVisual = document.getElementById(loserPrefix + '-visual');
    loserVisual.classList.add('fighter-dead');
    
    const loserText = document.getElementById(loserPrefix + '-result');
    loserText.innerText = "LOSE";
    loserText.classList.add('res-show', 'res-lose');

    // Xử lý kẻ thắng (Chữ WIN)
    const winnerText = document.getElementById(winnerPrefix + '-result');
    winnerText.innerText = "WIN";
    winnerText.classList.add('res-show', 'res-win');
}

async function takeTurn(attacker, defender, atkPrefix, defPrefix) {
    document.getElementById('turn-indicator').innerText = `Lượt của ${attacker.name}`;
    document.getElementById('turn-indicator').style.color = atkPrefix==='p' ? '#00ff00' : '#ff3333';
    
    // Reset thanh hành động
    attacker.actionGauge = 0;
    updateBars(atkPrefix, attacker);

    // Hồi năng lượng
    attacker.energy += 25;

    // Chờ xíu cho người chơi nhận ra đến lượt
    await new Promise(r => setTimeout(r, 500));

    if(attacker.energy >= 100) {
        attacker.energy = 0;
        await useSkill(attacker, defender, atkPrefix, defPrefix);
    } else {
        await attackNormal(attacker, defender, atkPrefix, defPrefix);
    }
    
    updateBars(atkPrefix, attacker);
    // Delay sau khi đánh
    await new Promise(r => setTimeout(r, 800));
}

async function attackNormal(attacker, defender, atkPrefix, defPrefix) {
    const mult = getMultiplier(attacker.realElement, defender.realElement);
    const variance = (Math.random() * 0.2) + 0.9;
    let dmg = Math.floor((attacker.atk * mult * variance) - (defender.def * 0.2));
    if(dmg < 1) dmg = 1;

    defender.currentHp -= dmg;
    updateBars(defPrefix, defender);
    
    visualEffect(defPrefix, dmg, mult > 1 ? 'crit' : 'normal');
    log(`${attacker.name} đánh: ${dmg} ST.`, atkPrefix==='p'?'log-p':'log-e');
}

async function useSkill(attacker, defender, atkPrefix, defPrefix) {
    const skill = SKILLS[attacker.realElement];
    let msg = `[ULTIMATE] ${skill.name}! `;
    
    const pop = document.getElementById(atkPrefix+'-skill-pop');
    pop.innerText = skill.name;
    pop.classList.add('skill-active');
    setTimeout(()=>pop.classList.remove('skill-active'), 1000);

    let dmg = 0;
    switch(skill.type) {
        case 'dmg': 
            dmg = Math.floor(attacker.atk * skill.val - (defender.def * 0.2));
            defender.currentHp -= dmg;
            break;
        case 'heal':
            let heal = Math.floor(attacker.maxHp * skill.val);
            attacker.currentHp += heal;
            updateBars(atkPrefix, attacker);
            visualEffect(atkPrefix, `+${heal}`, 'heal');
            msg += `Hồi phục ${heal} máu.`;
            break;
        case 'buff_def':
            attacker.def = Math.floor(attacker.def * skill.val);
            visualEffect(atkPrefix, "DEF UP", 'heal');
            msg += `Tăng phòng thủ.`;
            break;
        case 'pierce':
        case 'true_dmg':
            dmg = Math.floor(attacker.atk * skill.val);
            defender.currentHp -= dmg;
            msg += `Sát thương chuẩn ${dmg}.`;
            break;
        case 'drain':
            dmg = Math.floor(defender.currentHp * skill.val);
            defender.currentHp -= dmg;
            attacker.currentHp += dmg;
            updateBars(atkPrefix, attacker);
            msg += `Hút ${dmg} máu.`;
            break;
        case 'hybrid':
            dmg = Math.floor(attacker.atk * skill.val);
            defender.currentHp -= dmg;
            let h = Math.floor(attacker.maxHp * 0.15);
            attacker.currentHp += h;
            updateBars(atkPrefix, attacker);
            msg += `Đánh ${dmg}, hồi ${h}.`;
            break;
        default:
             dmg = Math.floor(attacker.atk * 1.5);
             defender.currentHp -= dmg;
    }

    if(dmg > 0) {
        if(dmg < 1) dmg = 1;
        updateBars(defPrefix, defender);
        visualEffect(defPrefix, dmg, 'skill');
    }
    log(msg, "log-sys");
}

function visualEffect(prefix, text, type) {
    const el = document.getElementById(prefix+'-visual');
    el.classList.remove('shake');
    void el.offsetWidth;
    if(type !== 'heal') el.classList.add('shake');

    const num = document.getElementById(prefix+'-dmg');
    num.innerText = text;
    num.style.color = (type==='crit'||type==='skill')?'red':(type==='heal'?'lime':'yellow');
    num.classList.remove('float-up');
    void num.offsetWidth;
    num.classList.add('float-up');
}

function getMultiplier(a, b) {
    const rules = {fire:'wind', wind:'earth', earth:'water', water:'fire'};
    if(rules[a] === b) return 1.5;
    if(rules[b] === a) return 0.8;
    if((a==='light'&&b==='dark')||(a==='dark'&&b==='light')) return 1.5;
    return 1.0;
}

function log(msg, cls) {
    const b = document.getElementById('battle-log');
    b.innerHTML += `<div class="${cls||''}">${msg}</div>`;
    b.scrollTop = b.scrollHeight;
}