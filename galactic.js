const SKILLS = {
    fire:   { name: "Hỏa Ngục",    type: "dmg",      val: 2.5 ,des: 'Gây dame'}, // x2.5 Sát thương
    water:  { name: "Thủy Hồi",    type: "heal",     val: 0.3 ,des: 'Hồi phục'}, // Hồi 30% MaxHP
    earth:  { name: "Giáp Đá",     type: "buff_def", val: 1.5 ,des: 'Tăng Thủ'}, // x1.5 Thủ
    wind:   { name: "Cuồng Phong", type: "pierce",   val: 1.5 ,des: 'Xuyên Giáp'}, // x1.5 ST Xuyên giáp
    light:  { name: "Thánh Quang", type: "hybrid",   val: 1.8 ,des: 'Siêu Cấp'}, // 1.8 ST + Hồi máu
    dark:   { name: "Nguyền Rủa",  type: "drain",    val: 0.2 ,des: 'Hấp Thụ'}, // Hút 20% máu địch
    void:   { name: "Hư Vô",       type: "true_dmg", val: 3.0 ,des: 'Siêu Công'}, // 3.0 ST Chuẩn
    normal: { name: "Nghiêm Túc",  type: "dmg",      val: 2.0 ,des: 'Tăng Cập'}  // x2.0 ST
};

const ELEMENT_ICONS = {
    fire: '🔥', water: '🌊', earth: '🪨', wind: '💨',
    light: '✨', dark: '💀', void: '🔮', normal: '⚔️'
};

class BattleEngine {
    constructor() {
        // Cấu hình
        this.config = {
            MAX_MP: 100,
            COST_SKILL: 50,
            MP_GAIN: 20,
            ANIM_DELAY: 600
        };

        // Dữ liệu
        this.db = [];
        this.inventory = [];
        this.player = null;
        this.enemy = null;
        this.state = 'LOADING'; // LOADING, IDLE, BUSY, END

        // Khởi chạy
        this.init();
    }

    /* --- 1. INITIALIZATION --- */
    async init() {
        try {
            // Load JSON Data
            const response = await fetch('data/cards_gacha.json');
            this.db = await response.json();
            
            // Load User Save
            this.loadSaveData();

            // Render Inventory
            this.renderInventory();
        } catch (err) {
            console.error("Critical Error:", err);
            // Fallback nếu không có server/file
            this.db = this.mockData();
            this.inventory = this.db.slice(0, 3);
            this.renderInventory();
        }
    }

    loadSaveData() {
        console.log("--- BẮT ĐẦU TẢI DỮ LIỆU ---");
        let foundInventory = [];

        // BƯỚC 1: QUÉT TẤT CẢ KEY TRONG LOCALSTORAGE
        // Thay vì đoán tên, ta duyệt qua toàn bộ dữ liệu đang lưu trong trình duyệt
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            
            try {
                const parsed = JSON.parse(value);
                
                // Kiểm tra xem dữ liệu này có chứa 'inventory' không
                if (parsed && Array.isArray(parsed.inventory)) {
                    console.log(`✅ Tìm thấy kho đồ tại key: [${key}]`);
                    console.log(`📦 Số lượng thẻ trong save: ${parsed.inventory.length}`);
                    foundInventory = parsed.inventory;
                    break; // Tìm thấy rồi thì dừng
                }
            } catch (e) {
                // Bỏ qua nếu không phải JSON
            }
        }

        // BƯỚC 2: XỬ LÝ DỮ LIỆU (QUAN TRỌNG)
        // Dữ liệu lưu có thể là ID (số) hoặc Object. Cần chuyển hết về dạng Object đầy đủ.
        if (foundInventory.length > 0) {
            this.inventory = foundInventory.map(item => {
                // Trường hợp 1: Lưu nguyên con Object thẻ (Đầy đủ thông tin)
                if (typeof item === 'object' && item.atk && item.name) {
                    return item;
                }
                
                // Trường hợp 2: Chỉ lưu ID (Ví dụ: 1, 5, 10) hoặc {id: 1}
                let searchId = (typeof item === 'object') ? item.id : item;
                
                // Tìm thẻ trong Database gốc (db) khớp với ID này
                // Lưu ý: Dùng == thay vì === để '1' vẫn bằng 1
                return this.db.find(c => c.id == searchId);
            }).filter(x => x); // Lọc bỏ các thẻ bị lỗi (null/undefined)
        } else {
            console.warn("❌ Không tìm thấy 'inventory' trong LocalStorage nào cả.");
            this.inventory = [];
        }

        // BƯỚC 3: KIỂM TRA LẠI
        if (!this.inventory || this.inventory.length === 0) {
            console.log("⚠️ Kho rỗng. Không có thẻ để hiển thị.");
            // Không tự động thêm thẻ mẫu nữa theo yêu cầu của bạn
        } else {
            console.log(`✅ Đã load thành công ${this.inventory.length} thẻ vào game.`);
        }

        // BƯỚC 4: SẮP XẾP THEO PHẨM CHẤT (SE > UR > SSR...)
        const rankScore = { 'SE': 100, 'UR': 90, 'SSR': 80, 'SR': 70, 'R': 60, 'N': 50 };
        this.inventory.sort((a, b) => {
            const scoreA = rankScore[a.type] || 0;
            const scoreB = rankScore[b.type] || 0;
            return scoreB - scoreA;
        });
    }

    renderInventory() {
        const grid = document.getElementById('inventory-grid');
        grid.innerHTML = '';

        // 1. TẠO KẺ ĐỊCH NGẪU NHIÊN & HIỂN THỊ
        if (this.db.length > 0) {
            this.nextEnemy = this.db[Math.floor(Math.random() * this.db.length)];
            
            const previewBox = document.getElementById('next-enemy-preview');
            previewBox.style.display = 'flex';
            document.getElementById('preview-e-img').src = this.nextEnemy.url;
            document.getElementById('preview-e-name').innerText = this.nextEnemy.name;
            const eIcon = ELEMENT_ICONS[this.nextEnemy.element] || '⚔️';
            document.getElementById('preview-e-elem').innerText = `Hệ: ${this.nextEnemy.element.toUpperCase()} ${eIcon}`;
        }

        // 2. CHECK KHO TRỐNG
        if(!this.inventory || this.inventory.length === 0) {
            grid.innerHTML = `<div style="text-align:center; color:#888; margin-top:50px;">KHO ĐỒ TRỐNG</div>`;
            return;
        }

        // 3. VẼ THẺ
        this.inventory.forEach(card => {
            const el = document.createElement('div');
            el.className = 'card-slot';
            
            // Màu sắc theo Rank
            let color = '#fff';
            if(card.type === 'SE') color = '#ff00ff'; 
            else if(card.type === 'UR') color = '#ff0055'; 
            else if(card.type === 'SSR') color = '#ffd700'; 
            else if(card.type === 'SR') color = '#00f3ff'; 
            else if(card.type === 'R') color = '#00ff99'; 

            const elemIcon = ELEMENT_ICONS[card.element] || '⚔️';

            el.style.borderColor = color;
            el.innerHTML = `
                <div class="card-elem-left" style="border-color:${color}">${elemIcon}</div>

                <span class="card-rank" style="background:${color}; color:#000">${card.type}</span>
                <img src="${card.url}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="card-name" style="color:${color}">${card.name}</div>
                <div style="text-align:center; font-size:0.7rem; color:#ccc; margin-top:5px">
                    HP: ${card.hp} | ATK: ${card.def || 50} <br> DEF: ${card.def || 50} | SPD: ${card.speed || 100}
                </div>
            `;
            
            el.onclick = () => this.openCardModal(card);
            
            grid.appendChild(el);
        });
    }
    
    openCardModal(card) {
        this.selectedCard = card;
        const modal = document.getElementById('card-modal');
        const elemIcon = ELEMENT_ICONS[card.element] || '⚔️';

        document.getElementById('m-img').src = card.url;
        document.getElementById('m-name').innerText = card.name;
        document.getElementById('m-rarity').innerText = card.type;
        document.getElementById('m-elem-badge').innerText = elemIcon;
        
        document.getElementById('m-hp').innerText = card.hp;
        document.getElementById('m-atk').innerText = card.atk;
        document.getElementById('m-def').innerText = card.def || 50;
        document.getElementById('m-spd').innerText = card.speed || 100;

        const skillInfo = SKILLS[card.element] || SKILLS['normal'];
        document.getElementById('m-skill-name').innerText = skillInfo.name;
        document.getElementById('m-skill-desc').innerText = `Loại: ${skillInfo.des.toUpperCase()} | ${skillInfo.val}x Hiệu quả`;

        modal.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('card-modal').style.display = 'none';
        this.selectedCard = null;
    }

    confirmSelection() {
        if (this.selectedCard) {
            const cardToPlay = this.selectedCard;
            const enemyToFight = this.nextEnemy;
            this.closeModal();
            this.startMatch(cardToPlay, enemyToFight);
        }
    }

    /* --- 3. BATTLE LOGIC --- */
    startMatch(card, preSelectedEnemy = null) {
        console.log("⚔️ Chuẩn bị vào trận...");

        // 1. Setup Player
        this.player = { ...card, maxHp: card.hp, currentHp: card.hp, mp: 50, isDefending: false, idStr:'p' };
        let enemyData = preSelectedEnemy;
        
        if (!enemyData) {
            console.log("⚠️ Không có địch xem trước, random địch mới.");
            enemyData = this.db[Math.floor(Math.random() * this.db.length)];
        }
        this.enemy = { ...enemyData, maxHp: enemyData.hp, currentHp: enemyData.hp, mp: 20, isDefending: false, idStr:'e' };

        // 3. Switch Scene (Chuyển cảnh)
        document.getElementById('scene-inventory').classList.remove('active');
        document.getElementById('scene-arena').classList.add('active');

        // 4. Init UI (Cập nhật giao diện)
        this.updateUnitUI(this.player);
        this.updateUnitUI(this.enemy);
        this.log(`Trận đấu bắt đầu: ${this.player.name} VS ${this.enemy.name}`);

        // 5. Check Speed (So tốc độ để xếp lượt)
        const pSpd = this.player.speed || 100;
        const eSpd = this.enemy.speed || 100;

        if (eSpd > pSpd) {
            this.setTurn('ENEMY');
        } else {
            this.setTurn('PLAYER');
        }
    }

    setTurn(who) {
        const banner = document.getElementById('turn-banner');
        const text = banner.querySelector('.turn-text');
        
        if (who === 'PLAYER') {
            this.state = 'IDLE';
            text.innerText = "PLAYER TURN";
            text.style.color = "var(--c-neon-blue)";
            banner.style.borderColor = "var(--c-neon-blue)";
            this.toggleControls(true);
        } else {
            this.state = 'BUSY';
            text.innerText = "ENEMY TURN";
            text.style.color = "var(--c-neon-pink)";
            banner.style.borderColor = "var(--c-neon-pink)";
            this.toggleControls(false);
            setTimeout(() => this.enemyAI(), 1500);
        }
    }

    /* --- 4. ACTIONS & COMBAT --- */
    playerAct(action) {
        if (this.state !== 'IDLE') return;
        this.state = 'BUSY';
        this.player.isDefending = false;

        if (action === 'defend') {
            this.performDefend(this.player);
            this.setTurn('ENEMY');
            return;
        }


        let isSkill = false;
        if (action === 'skill') {
            if (this.player.mp < this.config.COST_SKILL) {
                this.log("⚠️ Không đủ Mana!");
                this.state = 'IDLE';
                return;
            }
            this.player.mp -= this.config.COST_SKILL;
            isSkill = true;
        } else {
            this.player.mp = Math.min(this.config.MAX_MP, this.player.mp + this.config.MP_GAIN);
        }

        // Animation
        this.animateAttack('player', () => {
            if (isSkill) {
                this.castSkill(this.player, this.enemy);
            } else {
                this.dealDamage(this.player, this.enemy, 1.0, false);
            }
            
            // Nếu địch chưa chết thì đổi lượt
            if (this.enemy.currentHp > 0) this.setTurn('ENEMY');
        });
    }

    /* --- CẬP NHẬT: enemyAI --- */
    enemyAI() {
        if (this.state === 'END') return;
        this.enemy.isDefending = false;
        this.updateUnitUI(this.enemy);

        const hpPct = this.enemy.currentHp / this.enemy.maxHp;
        let action = 'attack';

        //if (hpPct < 0.3 && Math.random() < 0.4) action = 'heal';
        if (this.enemy.mp >= this.config.COST_SKILL && Math.random() < 0.6) action = 'skill';
        else if (hpPct < 0.4 && Math.random() < 0.3) action = 'defend';
        /*if (action === 'heal') {
            this.performHeal(this.enemy);
            this.setTurn('PLAYER');
            return;
        }*/

        if (action === 'defend') {
            this.performDefend(this.enemy);
            this.setTurn('PLAYER');
            return;
        }

        let isSkill = false;
        if (action === 'skill') {
            this.enemy.mp -= this.config.COST_SKILL;
            isSkill = true;
            this.log(`${this.enemy.name} tung Tuyệt Kỹ!`);
        } else {
            this.enemy.mp = Math.min(this.config.MAX_MP, this.enemy.mp + 15);
        }

        this.animateAttack('enemy', () => {
            if (isSkill) {
                this.castSkill(this.enemy, this.player);
            } else {
                this.dealDamage(this.enemy, this.player, 1.0, false);
            }

            if (this.player.currentHp > 0) this.setTurn('PLAYER');
        });
    }

    /* --- 5. CALCULATIONS & EFFECTS --- */
    performDefend(char) {
        char.isDefending = true;
        char.mp = Math.min(this.config.MAX_MP, char.mp + 10);
        this.log(`${char.name} đang phòng thủ!`);
        this.updateUnitUI(char);
    }

    performHeal(char, amount = null) {
        // Nếu gọi từ nút Heal thì amount là null -> lấy 30%. 
        // Nếu gọi từ Skill thì amount sẽ có số cụ thể.
        const amt = (amount !== null) ? amount : Math.floor(char.maxHp * 0.3);

        char.currentHp = Math.min(char.maxHp, char.currentHp + amt);
        
        this.createPopup(char.idStr, `+${amt}`, '#00ff99');
        this.updateUnitUI(char);
        this.log(`${char.name} hồi phục sinh lực.`);
    }

    dealDamage(attacker, defender, multiplier, isSkill) {
        // Tính khắc hệ
        let elemBonus = 1.0;
        // Logic đơn giản: Check chart (có thể mở rộng sau)
        const chart = { 'fire':'wind', 'wind':'earth', 'earth':'water', 'water':'fire', 'light':'dark', 'dark':'light' };
        if (chart[attacker.element] === defender.element) elemBonus = 1.5;
        if (chart[defender.element] === attacker.element) elemBonus = 0.5;

        // Tính Base Dmg
        let raw = attacker.atk * multiplier * elemBonus;
        
        // Tính Def
        let defVal = defender.def * 0.5;
        if (defender.isDefending) {
            defVal = defender.def * 2.5; // Block cực mạnh
            this.log("Đòn đánh bị chặn lại!");
        }

        let finalDmg = Math.floor(Math.max(10, raw - defVal));

        // Apply
        defender.currentHp -= finalDmg;
        
        // Visuals
        const isCrit = Math.random() < 0.3; // 15% Crit
        if (isCrit) finalDmg = Math.floor(finalDmg * 1.5);

        this.animateHit(defender.idStr);
        this.createPopup(defender.idStr, finalDmg, isCrit ? '#ffd700' : '#fff', isCrit);
        this.updateUnitUI(defender);
        this.updateUnitUI(attacker); // Update MP visual

        // Check Dead
        if (defender.currentHp <= 0) {
            defender.currentHp = 0;
            this.endGame(attacker === this.player);
        }
    }

    /* --- 6. ANIMATIONS & VISUALS --- */
    animateAttack(who, callback) {
        const el = document.getElementById(who === 'player' ? 'unit-player' : 'unit-enemy');
        const animClass = who === 'player' ? 'anim-attack-right' : 'anim-attack-left';
        
        el.classList.add(animClass);
        setTimeout(() => {
            el.classList.remove(animClass);
            if (callback) callback();
        }, 400);
    }

    animateHit(idStr) {
        const el = document.getElementById(idStr === 'p' ? 'unit-player' : 'unit-enemy');
        el.classList.add('anim-hit');
        setTimeout(() => el.classList.remove('anim-hit'), 500);
    }

    createPopup(idStr, text, color, isBig = false) {
        const layer = document.getElementById(`${idStr}-dmg-layer`);
        const el = document.createElement('div');
        el.className = isBig ? 'dmg-number dmg-crit' : 'dmg-number';
        el.innerText = text;
        el.style.color = color;
        
        // Random vị trí một chút cho tự nhiên
        const rndX = (Math.random() - 0.5) * 60;
        const rndY = (Math.random() - 0.5) * 20;
        el.style.left = `calc(50% + ${rndX}px)`;
        el.style.top = `calc(20% + ${rndY}px)`;

        layer.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    /* --- HÀM CẬP NHẬT UI (Đã sửa theo HTML mới) --- */
    updateUnitUI(char) {
        const prefix = char.idStr; // 'p' hoặc 'e'
        
        // 1. Tính toán % thanh hiển thị
        const hpPct = (char.currentHp / char.maxHp) * 100;
        const mpPct = (char.mp / this.config.MAX_MP) * 100;

        // 2. Cập nhật Tên và Ảnh
        // Kiểm tra xem phần tử có tồn tại không trước khi gán để tránh lỗi
        const nameEl = document.getElementById(`${prefix}-name`);
        if(nameEl) nameEl.innerText = char.name;

        const imgEl = document.getElementById(`${prefix}-img`);
        if(imgEl) imgEl.src = char.url;

        // 3. Cập nhật Thanh Máu & Mana
        const hpFill = document.getElementById(`${prefix}-hp-fill`);
        if(hpFill) hpFill.style.width = `${Math.max(0, hpPct)}%`;

        const hpText = document.getElementById(`${prefix}-hp-text`);
        if(hpText) hpText.innerText = `${Math.floor(char.currentHp)}/${char.maxHp}`;

        const mpFill = document.getElementById(`${prefix}-mp-fill`);
        if(mpFill) mpFill.style.width = `${mpPct}%`;

        // --- [SỬA LỖI] CẬP NHẬT ICON HỆ (p-elem / e-elem) ---
        const elemBadge = document.getElementById(`${prefix}-elem`);
        if (elemBadge) {
            // Danh sách Icon tương ứng với hệ
            const icons = {
                fire:   '🔥', // Hỏa
                water:  '🌊', // Thủy
                earth:  '🪨', // Thổ (Đá)
                wind:   '💨', // Phong
                light:  '✨', // Quang
                dark:   '💀', // Ám
                void:   '🔮', // Hư vô
                normal: '⚔️'  // Thường
            };

            // Danh sách Màu tương ứng để tạo hiệu ứng phát sáng (box-shadow/color)
            const colors = {
                fire:   '#ff4d4d', // Đỏ
                water:  '#4da6ff', // Xanh biển
                earth:  '#b38f00', // Vàng đất
                wind:   '#80ffdb', // Xanh gió
                light:  '#ffff80', // Vàng sáng
                dark:   '#bf80ff', // Tím
                void:   '#ff80df', // Hồng
                normal: '#cccccc'  // Xám
            };

            const type = char.element || 'normal';
            
            // Thay đổi Icon
            elemBadge.innerText = icons[type] || icons['normal'];
            
            // (Tùy chọn) Thêm hiệu ứng màu cho badge để đẹp hơn
            elemBadge.style.textShadow = `0 0 10px ${colors[type] || '#fff'}`;
            elemBadge.style.borderColor = colors[type] || '#fff';
        }
        // ----------------------------------------------------

        // 4. Hiệu ứng Khiên (Shield)
        const shield = document.getElementById(`${prefix}-shield`);
        if(shield) {
            if (char.isDefending) {
                shield.classList.add('active-shield');
                shield.style.opacity = '1'; // Đảm bảo khiên hiện lên
            } else {
                shield.classList.remove('active-shield');
                shield.style.opacity = '0';
            }
        }

        // 5. Kiểm tra nút Skill (Chỉ dành cho Player)
        if (char === this.player) {
            const btn = document.getElementById('btn-skill');
            if (btn) {
                // Disable nút nếu không đủ mana
                const notEnoughMp = char.mp < this.config.COST_SKILL;
                btn.disabled = notEnoughMp;
                btn.style.opacity = notEnoughMp ? 0.5 : 1;
                btn.style.cursor = notEnoughMp ? 'not-allowed' : 'pointer';
            }
        }
    }

    toggleControls(enable) {
        const btns = document.querySelectorAll('.cmd-btn');
        btns.forEach(b => {
            b.disabled = !enable;
            b.style.pointerEvents = enable ? 'auto' : 'none';
            if(!enable) b.style.opacity = 0.5;
            else b.style.opacity = 1;
        });
        // Re-check skill specific logic
        if(enable) this.updateUnitUI(this.player);
    }

    log(msg) {
        document.getElementById('battle-log').innerText = msg;
    }

    endGame(isWin) {
        this.state = 'END';
        const modal = document.getElementById('modal-result');
        const title = document.getElementById('res-title');
        const desc = document.getElementById('res-desc');

        setTimeout(() => {
            modal.style.display = 'flex';
            if (isWin) {
                title.innerText = "VICTORY";
                title.style.color = "var(--c-neon-gold)";
                desc.innerText = `Kẻ thù ${this.enemy.name} đã bị tiêu diệt!`;
            } else {
                title.innerText = "DEFEATED";
                title.style.color = "var(--c-neon-pink)";
                desc.innerText = "Hãy cường hóa thẻ bài và thử lại.";
            }
        }, 1000);
    }

    surrender() {
        if(confirm("Bạn có chắc muốn đầu hàng?")) location.reload();
    }

    

    // Dữ liệu giả phòng hờ lỗi
    mockData() {
        const elements = ['fire', 'water', 'earth', 'wind', 'light', 'dark'];
        const ranks = ['UR', 'SSR', 'SR', 'R'];
        let fakeList = [];

        for (let i = 1; i <= 20; i++) {
            const el = elements[Math.floor(Math.random() * elements.length)];
            const rank = ranks[Math.floor(Math.random() * ranks.length)];
            fakeList.push({
                id: i,
                name: `Chiến Binh ${el.toUpperCase()} ${i}`,
                atk: 100 + Math.floor(Math.random() * 200),
                hp: 1500 + Math.floor(Math.random() * 2000),
                def: 50,
                speed: 100 + Math.floor(Math.random() * 100),
                type: rank,
                element: el,
                url: `https://via.placeholder.com/200/000000/ffffff?text=${el.toUpperCase()}+${i}`
            });
        }
        return fakeList;
    }

    castSkill(attacker, defender) {
        // 1. Xác định Skill
        const elem = attacker.element || 'normal';
        const skill = SKILLS[elem] || SKILLS['normal'];
        
        console.log(`${attacker.name} dùng chiêu: ${skill.name}`);
        this.createPopup(attacker.idStr, skill.name, "#ffff00", true);

        // 2. Xử lý Hiệu ứng
        switch (skill.type) {
            case 'dmg': // Fire, Normal
                // Tận dụng hàm dealDamage có sẵn
                this.dealDamage(attacker, defender, skill.val, true);
                break;

            case 'heal': // Water
                const healAmt = Math.floor(attacker.maxHp * skill.val);
                this.performHeal(attacker, healAmt);
                break;

            case 'buff_def': // Earth
                attacker.def = Math.floor(attacker.def * skill.val);
                this.createPopup(attacker.idStr, "TĂNG GIÁP", "#cd853f");
                this.updateUnitUI(attacker);
                // Tìm div khiên để hiện (nếu có trong HTML)
                const shield = document.getElementById(attacker.idStr === 'p' ? 'p-shield' : 'e-shield');
                if(shield) shield.style.display = 'block';
                break;

            case 'pierce': // Wind (Xuyên giáp)
                // Tự tính damage xuyên giáp tại đây
                let pDmg = Math.floor(attacker.atk * skill.val);
                defender.currentHp -= pDmg;
                
                this.createPopup(defender.idStr, `-${pDmg}`, "#aaffff"); // Màu Cyan
                this.updateUnitUI(defender);
                this.checkDead(defender, attacker); // Kiểm tra chết
                break;

            case 'hybrid': // Light (Đánh + Hồi)
                this.dealDamage(attacker, defender, skill.val, true);
                // Hồi máu nhẹ
                this.performHeal(attacker, Math.floor(attacker.atk * 0.5));
                break;

            case 'drain': // Dark (Hút máu)
                let drain = Math.floor(defender.currentHp * skill.val);
                if(drain < 10) drain = 10;
                
                defender.currentHp -= drain;
                this.createPopup(defender.idStr, `-${drain}`, "#ff0066"); // Màu hồng
                this.performHeal(attacker, drain); // Hồi cho mình
                
                this.updateUnitUI(defender);
                this.checkDead(defender, attacker);
                break;

            case 'true_dmg': // Void (ST Chuẩn)
                let tDmg = Math.floor(attacker.atk * skill.val);
                defender.currentHp -= tDmg;
                
                this.createPopup(defender.idStr, `-${tDmg}`, "#d1a3ff"); // Màu tím
                this.updateUnitUI(defender);
                this.checkDead(defender, attacker);
                break;
        }
    }

    // Hàm phụ trợ kiểm tra chết (để dùng cho các skill tự trừ máu)
    checkDead(victim, killer) {
        if (victim.currentHp <= 0) {
            victim.currentHp = 0;
            this.updateUnitUI(victim);
            this.endGame(killer === this.player);
        }
    }

}

// Khởi tạo
const BattleSystem = new BattleEngine();