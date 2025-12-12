const STORAGE_KEY = 'gachaState_JSON_v2'; 
let allCards = [];
let myInventory = [];
let team = [];

// Cấu hình độ khó
const DIFFICULTY_CONFIG = {
    easy:   { name: "DỄ",   hpMult: 0.5, dmgMult: 0.5, coinMult: 0.5 },
    normal: { name: "THƯỜNG", hpMult: 1.0, dmgMult: 1.0, coinMult: 1.0 },
    hard:   { name: "KHÓ",    hpMult: 2.5, dmgMult: 1.5, coinMult: 3.0 },
    hell:   { name: "ÁC MỘNG", hpMult: 6.0, dmgMult: 2.5, coinMult: 10.0 }
};

let gameState = {
    bossHp: 0,
    maxHp: 0,
    timeLeft: 60,
    isRunning: false,
    
    // Stats cơ bản (chưa nhân hệ số độ khó)
    baseBossHp: 0,
    baseBossDmg: 0,
    
    // Stats thực tế
    bossDmgReal: 0,
    coinReward: 0,
    
    totalDps: 0,
    atkMult: 1.0, defMult: 1.0,
    lastBossAttack: 0, lastBossStun: 0, bossHealsLeft: 5, lastBossHealTime: 0
};

let loops = [];
let cooldowns = { atk: 0, def: 0, heal: 0, revive: 0 };

window.onload = async () => {
    await loadData();
    if(myInventory.length < 5) {
        alert("Cần tối thiểu 5 thẻ để tham gia!");
        window.location.href = 'gacha.html';
        return;
    }
    prepareRaidData(); // Chuẩn bị dữ liệu nhưng chưa start
};

async function loadData() {
    try {
        const res = await fetch('data/cards_gacha.json');
        allCards = await res.json();
        const s = localStorage.getItem(STORAGE_KEY);
        if(s) myInventory = JSON.parse(s).inventory || [];
    } catch(e) { console.error(e); }
}

function prepareRaidData() {
    // 1. Random Team
    let pool = allCards.filter(c => myInventory.includes(c.id));
    pool.sort(() => Math.random() - 0.5);
    let selected = pool.slice(0, 5);

    gameState.totalDps = 0;
    team = selected.map(c => {
        let hp = c.hp || (c.def * 12);
        let spd = c.speed;
        if(!spd) spd = Math.floor((c.atk * 0.1) + 10);
        gameState.totalDps += c.atk;
        return { 
            ...c, maxHp: hp, currentHp: hp, speed: spd, 
            isDead: false, isStunned: false, elem: c.element ? c.element.toLowerCase() : 'normal'
        };
    });

    // 2. Tính chỉ số Boss CƠ BẢN (Chuẩn mức Normal)
    // Boss Normal chịu được 40s sát thương của team
    gameState.baseBossHp = gameState.totalDps * 40; 
    
    // Boss Normal đánh chết 1 thẻ trung bình trong 12 đòn
    let teamAvgHp = team.reduce((a,b)=>a+b.maxHp,0) / 5;
    gameState.baseBossDmg = Math.floor(teamAvgHp / 12); 

    updateHeader();
    renderTeam();
    // Chưa start game, chờ chọn độ khó
}

// --- HÀM CHỌN ĐỘ KHÓ ---
function selectDifficulty(mode) {
    const config = DIFFICULTY_CONFIG[mode];
    
    // Áp dụng hệ số nhân
    gameState.maxHp = Math.floor(gameState.baseBossHp * config.hpMult);
    gameState.bossHp = gameState.maxHp;
    gameState.bossDmgReal = Math.floor(gameState.baseBossDmg * config.dmgMult);
    gameState.coinReward = Math.floor(5000 * config.coinMult); // 5000 là base reward

    // Cập nhật UI
    document.getElementById('boss-name').innerText = `HẮC LONG (${config.name})`;
    document.getElementById('raid-difficulty-label').innerText = `ĐỘ KHÓ: ${config.name}`;
    document.getElementById('boss-hp-bar').style.width = '100%';
    document.getElementById('boss-hp-text').innerText = gameState.bossHp.toLocaleString();

    // Ẩn modal và bắt đầu
    document.getElementById('difficulty-overlay').classList.add('hidden');
    startGame();
}

let lastVisualTime = 0; 

function startGame() {
    gameState.isRunning = true;
    gameState.timeLeft = 60;
    let now = Date.now();
    gameState.lastBossAttack = now;
    gameState.lastBossStun = now;

    // Timer Loop
    loops.push(setInterval(() => {
        gameState.timeLeft--;
        const t = document.getElementById('raid-timer');
        t.innerText = gameState.timeLeft + 's';
        if(gameState.timeLeft <= 10) t.classList.add('timer-danger');
        if(gameState.timeLeft <= 0) endGame(false);
    }, 1000));

    // Combat Loop (Giữ nguyên 100ms để tính toán ngầm)
    loops.push(setInterval(() => {
        if(!gameState.isRunning) return;
        let currentTime = Date.now();

        // 1. BOSS AI & ATTACK (Chậm lại)
        bossAiLogic(currentTime);

        // 2. TEAM ĐÁNH BOSS
        let tickDmg = 0;
        team.forEach((c, i) => {
            if(c.isDead || c.isStunned) return;
            
            // Tính damage mỗi tick
            let spdMult = 1 + (c.speed / 200); 
            let d = (c.atk * spdMult * gameState.atkMult) / 10; 
            tickDmg += d;

            // Hiệu ứng thẻ bài nảy lên (Giảm tần suất nảy)
            // Chỉ nảy khi random trúng VÀ đã qua 1 khoảng thời gian
            if(Math.random() < 0.05) { // Giảm tỉ lệ nảy xuống 5% mỗi tick
                animateCardAttack(i); 
            }
        });
        
        if(tickDmg > 0) takeBossDamage(tickDmg);

        if(team.every(c => c.isDead)) endGame(false);

    }, 100));
}

function animateCardAttack(idx) {
    const el = document.getElementById(`card-${idx}`);
    if(!el) return;
    
    // Reset animation cũ để chạy lại được ngay
    el.classList.remove('card-attack');
    void el.offsetWidth; // Trigger Reflow (Bắt buộc để reset anim)
    el.classList.add('card-attack');
}

// --- BOSS AI & COMBAT ---
function bossAiLogic(now) {
    // Boss Đánh thường: Tăng lên 2500ms (2.5 giây)
    if(now - gameState.lastBossAttack > 2500) {
        bossAttackNormal();
        gameState.lastBossAttack = now;
    }

    // Boss Skill: Stun (Mỗi 15s)
    if(now - gameState.lastBossStun > 15000) {
        bossSkillStun();
        gameState.lastBossStun = now;
    }

    // Boss Heal: Giữ nguyên logic cũ
    if(gameState.bossHealsLeft > 0 && 
       gameState.bossHp < gameState.maxHp * 0.5 && 
       (now - gameState.lastBossHealTime > 8000)) {
        
        bossSkillHeal();
        gameState.lastBossHealTime = now;
    }
}

function bossAttackNormal() {
    let targets = team.filter(c => !c.isDead);
    if(targets.length === 0) return;

    const img = document.getElementById('boss-img');
    img.style.transform = 'scale(1.1) translateY(-10px)';
    setTimeout(()=>img.style.transform='scale(1)', 100);

    for(let k=0; k<2; k++) {
        if(targets.length===0) break;
        let idx = Math.floor(Math.random() * targets.length);
        let victim = targets[idx];
        
        let dmg = gameState.bossDmgReal / gameState.defMult;
        dmg -= (victim.def * 0.2); 
        if(dmg < 10) dmg = 10;

        takeCardDamage(victim, dmg);
        targets.splice(idx, 1);
    }
}

function bossSkillStun() {
    let targets = team.filter(c => !c.isDead && !c.isStunned);
    if(targets.length === 0) return;
    let victim = targets[Math.floor(Math.random() * targets.length)];
    victim.isStunned = true;
    
    const i = team.indexOf(victim);
    document.getElementById(`card-${i}`).classList.add('stunned');
    announceSkill("LÔI PHẠT! (CHOÁNG)", "cyan");

    setTimeout(() => {
        if(!gameState.isRunning) return;
        victim.isStunned = false;
        document.getElementById(`card-${i}`).classList.remove('stunned');
    }, 5000);
}

function bossSkillHeal() {
    gameState.bossHealsLeft--;
    let healAmt = gameState.maxHp * 0.4; 
    gameState.bossHp += healAmt;
    if(gameState.bossHp > gameState.maxHp) gameState.bossHp = gameState.maxHp;
    updateBossUI();
    announceSkill(`TÁI TẠO! (+${Math.floor(healAmt).toLocaleString()})`, "#00ff00");
    document.getElementById('boss-shaker').classList.add('boss-healing');
    setTimeout(()=>document.getElementById('boss-shaker').classList.remove('boss-healing'), 1000);
}

function announceSkill(text, color) {
    const el = document.getElementById('boss-skill-announce');
    el.innerText = text; el.style.color = color;
    el.classList.remove('skill-msg-anim'); void el.offsetWidth; el.classList.add('skill-msg-anim');
}

function takeBossDamage(amt) {
    gameState.bossHp -= amt;
    if(gameState.bossHp <= 0) endGame(true);
    updateBossBar();
    
    // --- THROTTLE VISUAL ---
    // Chỉ kích hoạt hiệu ứng hình ảnh mỗi 300ms một lần
    // Để tránh Boss bị co giật liên tục
    let now = Date.now();
    if (now - lastVisualTime > 300) {
        const img = document.getElementById('boss-img');
        
        // Reset animation cũ
        img.classList.remove('boss-hit');
        void img.offsetWidth; // Trigger Reflow
        img.classList.add('boss-hit');
        
        // Hiện số damage tích lũy (giả lập số to cho đã mắt)
        // Thay vì hiện lắt nhắt, ta hiện 1 số damage đại diện
        let displayDmg = Math.floor(amt * 15); // Nhân ảo lên chút nhìn cho sướng hoặc lấy dmg thực tế trong 300ms
        spawnText(displayDmg, "white");
        
        lastVisualTime = now;
    }
}

function updateBossBar() {
    // Tính phần trăm
    let pct = (gameState.bossHp / gameState.maxHp) * 100;
    
    // Giới hạn không cho < 0 hoặc > 100 để tránh lỗi visual
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    const bar = document.getElementById('boss-hp-bar');
    const text = document.getElementById('boss-hp-text');

    // Cập nhật Width
    bar.style.width = pct + '%';
    
    // Cập nhật Text số liệu
    text.innerText = Math.floor(gameState.bossHp).toLocaleString();

    // Đổi màu thanh máu khi máu thấp (Hiệu ứng nguy hiểm)
    if(pct < 20) {
        bar.style.background = "linear-gradient(90deg, #ff0000, #ff3333)"; // Đỏ rực
        bar.style.boxShadow = "0 0 10px red";
    } else {
        bar.style.background = "linear-gradient(90deg, #ff0055, #ff5500)"; // Màu gốc
        bar.style.boxShadow = "none";
    }
}

function takeCardDamage(card, amt) {
    card.currentHp -= amt;
    if(card.currentHp <= 0) { card.currentHp = 0; card.isDead = true; }
    
    const i = team.indexOf(card);
    document.getElementById(`hp-fill-${i}`).style.width = (card.currentHp / card.maxHp * 100) + '%';
    document.getElementById(`hp-txt-${i}`).innerText = Math.floor(card.currentHp);
    if(card.isDead) document.getElementById(`card-${i}`).classList.add('dead');
}

// --- SKILLS ---
function useTactics(type) {
    if(!gameState.isRunning || Date.now() < cooldowns[type]) return;
    let cdTime = 0;

    if(type === 'atk') {
        gameState.atkMult = 2.0; spawnText("DMG UP!!!", "red");
        setTimeout(() => gameState.atkMult = 1.0, 5000); cdTime = 15;
    }
    else if(type === 'def') {
        gameState.defMult = 3.0; spawnText("SHIELD UP!", "cyan");
        setTimeout(() => gameState.defMult = 1.0, 5000); cdTime = 15;
    }
    else if(type === 'heal') {
        team.forEach((c, i) => {
            if(!c.isDead) {
                c.currentHp = Math.min(c.maxHp, c.currentHp + c.maxHp*0.4);
                document.getElementById(`hp-fill-${i}`).style.width = (c.currentHp/c.maxHp*100)+'%';
                document.getElementById(`hp-txt-${i}`).innerText = Math.floor(c.currentHp);
            }
        });
        spawnText("HEAL +40%", "lime"); cdTime = 10;
    }
    else if(type === 'revive') {
    let dead = team.filter(c => c.isDead);
    
    if(dead.length > 0) {
        let t = dead[Math.floor(Math.random() * dead.length)];
        t.isDead = false; 
        t.currentHp = Math.floor(t.maxHp * 0.4);
        let i = team.indexOf(t); 
        document.getElementById(`card-${i}`).classList.remove('dead');
        document.getElementById(`hp-fill-${i}`).style.width = (t.currentHp / t.maxHp * 100) + '%';
        document.getElementById(`hp-txt-${i}`).innerText = Math.floor(t.currentHp);
        spawnText("REVIVE!", "gold");
        
    } else {
        spawnText("NO DEAD", "gray");
    }
    cdTime = 25;
}
    startCooldown(type, cdTime);
}

function startCooldown(type, sec) {
    cooldowns[type] = Date.now() + (sec * 1000);
    const overlay = document.getElementById(`cd-${type}`);
    const txt = document.getElementById(`txt-${type}`);
    overlay.style.transition = 'none'; overlay.style.transform = 'scaleY(1)'; 
    void overlay.offsetWidth;
    overlay.style.transition = `transform ${sec}s linear`; overlay.style.transform = 'scaleY(0)'; 
    let left = sec; txt.innerText = left;
    let timer = setInterval(() => {
        left--; if(left <= 0) { clearInterval(timer); txt.innerText = ""; } else txt.innerText = left;
    }, 1000);
}

function spawnText(txt, col) {
    const d = document.createElement('div'); d.className = 'float-dmg'; 
    d.innerText = txt.toLocaleString(); d.style.color = col;
    d.style.left = (40 + Math.random()*20) + '%'; d.style.top = (40 + Math.random()*20) + '%';
    document.getElementById('effect-layer').appendChild(d); setTimeout(()=>d.remove(), 800);
}

function updateBossUI() {
    const pct = (gameState.bossHp / gameState.maxHp) * 100;
    document.getElementById('boss-hp-bar').style.width = (pct<0?0:pct) + '%';
    document.getElementById('boss-hp-text').innerText = Math.floor(gameState.bossHp).toLocaleString();
}
function renderTeam() {
    const g = document.getElementById('raid-team-grid'); g.innerHTML = '';
    team.forEach((c, i) => {
        const d = document.createElement('div'); d.className = `raid-card rar-${c.type}`; d.id = `card-${i}`;
        d.innerHTML = `<div class="card-name">${c.name}</div><div class="card-img-wrap"><img src="${c.url}"></div><div class="card-stats"><div class="stat-row"><span class="st-atk">⚔️${c.atk}</span><span class="st-spd">⚡${c.speed}</span></div><div class="stat-row"><span class="st-def">🛡️${c.def}</span></div></div><div class="mini-hp-bg"><div class="mini-hp-fill" id="hp-fill-${i}" style="width:100%"></div></div><div class="hp-val-text" id="hp-txt-${i}">${Math.floor(c.currentHp)}</div>`;
        g.appendChild(d);
    });
}
function updateHeader() { document.getElementById('team-power').innerText = gameState.totalDps.toLocaleString(); }

function endGame(win) {
    gameState.isRunning = false; loops.forEach(clearInterval);
    document.getElementById('result-overlay').classList.remove('hidden');
    const t = document.getElementById('res-title'); const m = document.getElementById('res-msg');
    if(win) {
        t.innerText = "CHIẾN THẮNG!"; t.style.color="gold"; m.innerText = `Thưởng: ${gameState.coinReward.toLocaleString()} Xu`;
        let s = JSON.parse(localStorage.getItem(STORAGE_KEY)); s.coins += gameState.coinReward;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } else { t.innerText = "THẤT BẠI..."; t.style.color="red"; m.innerText = "Boss chưa bị tiêu diệt."; }
}

function backToDifficulty() {
    // Nếu đang đánh thì hỏi xác nhận, nếu đã hết giờ/thắng/thua thì thoát luôn
    if (gameState.isRunning) {
        if (!confirm("Đang trong trận chiến! Bạn có chắc muốn thoát về menu chọn độ khó?")) {
            return;
        }
    }

    // 1. Dừng game
    gameState.isRunning = false;
    loops.forEach(clearInterval); // Xóa hết bộ đếm giờ
    loops = []; // Reset mảng loops

    // 2. Reset UI Boss về mặc định
    document.getElementById('boss-hp-bar').style.width = '100%';
    document.getElementById('boss-hp-text').innerText = "Chọn độ khó...";
    document.getElementById('raid-timer').innerText = "60s";
    document.getElementById('raid-timer').classList.remove('timer-danger');

    // 3. Ẩn các Modal kết quả (nếu đang hiện)
    document.getElementById('result-overlay').classList.add('hidden');

    // 4. Hiện lại Modal chọn độ khó
    document.getElementById('difficulty-overlay').classList.remove('hidden');
}