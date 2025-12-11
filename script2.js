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
    isFinished: false // <--- BIẾN MỚI
};

async function initGame() {
    try {
        // 1. TẢI DỮ LIỆU
        // Sử dụng Promise.all để tải 3 file cùng lúc -> Tốc độ nhanh hơn tải lần lượt
        const [resCards, resCodes, resRates] = await Promise.all([
            fetch('data/cards_gacha.json'),
            fetch('data/giftcodes_gacha.json'),
            fetch('data/rates_gacha.json')
        ]);

        // Kiểm tra nếu file lỗi (404 Not Found)
        if (!resCards.ok || !resCodes.ok || !resRates.ok) {
            throw new Error("Không tìm thấy một trong các file JSON!");
        }

        const rawCards = await resCards.json();
        giftcodes = await resCodes.json(); // Biến giftcodes phải được khai báo global ở ngoài
        const ratesConfig = await resRates.json();

        // 2. TÍNH TOÁN SỐ LƯỢNG THẺ (Logic của bạn - Rất tốt)
        const typeCounts = {};
        rawCards.forEach(card => {
            typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
        });

        // 3. GÁN TỶ LỆ TỰ ĐỘNG (Logic của bạn - Rất tốt)
        // Lưu ý: Biến 'pool' phải được khai báo global ở ngoài (let pool = [])
        pool = rawCards.map(card => {
            // Lấy tổng tỷ lệ từ file rates.json
            const totalTypeRate = ratesConfig[card.type] || 0;
            const count = typeCounts[card.type] || 1;
            
            // Chia đều
            const actualRate = totalTypeRate / count;

            return { ...card, rate: actualRate };
        });

        // 4. SẮP XẾP (SE -> R)
        const rarityOrder = { 'SE': 6, 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2 };
        pool.sort((a, b) => (rarityOrder[b.type] || 0) - (rarityOrder[a.type] || 0));

        // 5. LOAD SAVE GAME
        const saved = localStorage.getItem('gachaState_JSON_v2');
        if(saved) state = JSON.parse(saved); // Biến 'state' phải khai báo global
        
        updateUI();
        console.log(`Khởi tạo thành công: ${pool.length} thẻ.`);

    } catch (err) {
        alert("Lỗi khởi tạo: Kiểm tra lại các file JSON trong thư mục data/");
        console.error(err);
    }
}

function saveData() { localStorage.setItem('gachaState_JSON_v2', JSON.stringify(state)); updateUI(); }

// --- LOGIC QUAY MỚI (Đổi màu Orb trước) ---
function pull(times) {
    if(pool.length === 0) return alert("Dữ liệu đang tải hoặc bị lỗi...");
    
    // 1. Kiểm tra tiền
    const cost = PRICE * times;
    if(state.coins < cost) { 
        if(confirm("Thiếu Xu! Nạp thêm?")) openModal('rechargeModal'); 
        return; 
    }
    
    // 2. Trừ tiền & Lưu
    state.coins -= cost; 
    saveData();

    // 3. TÍNH KẾT QUẢ NGAY LẬP TỨC (Pre-calculate)
    const items = [];
    for(let i = 0; i < times; i++) {
        items.push(rollItem());
    }

    // 4. Tìm độ hiếm cao nhất để đổi màu Orb
    let highestRarity = 'R';
    // Kiểm tra ưu tiên: UR > SSR > SR > R
    if (items.some(i => i.type === 'SE')) highestRarity = 'SE';
    else if (items.some(i => i.type === 'UR')) highestRarity = 'UR';
    else if (items.some(i => i.type === 'SSR')) highestRarity = 'SSR';
    else if (items.some(i => i.type === 'SR')) highestRarity = 'SR';

    // 5. Kích hoạt hiệu ứng hình ảnh
    const orb = document.getElementById('orb');
    const btn1 = document.getElementById('btnx1');
    const btn10 = document.getElementById('btnx10');
    
    btn1.disabled = true; 
    btn10.disabled = true;
    
    // Thêm class màu tương ứng vào Orb
    orb.classList.add('summoning');
    orb.classList.add(`orb-${highestRarity}`); // Ví dụ: orb-SSR
    
    playSound('sfx-spin');

    // 6. Chờ Animation xong thì hiện kết quả
    setTimeout(() => {
        // Reset trạng thái Orb
        orb.classList.remove('summoning');
        orb.classList.remove('orb-SE', 'orb-UR', 'orb-SSR', 'orb-SR', 'orb-R'); // Xóa màu
        
        triggerFlash(); 
        playSound('sfx-win');
        
        // Hiển thị kết quả đã tính sẵn
        if(times === 1) { 
            showDetail(items[0]); 
        } else { 
            showGridResult(items); 
        }
        
        btn1.disabled = false; 
        btn10.disabled = false;
    }, 1500); // 1.5 giây hồi hộp
}

function rollItem() {
    let item;
    if (state.nextGuaranteed) {
        // Lọc ra danh sách các thẻ thuộc loại được bảo đảm (VD: Lấy hết thẻ SE)
        const guaranteedPool = pool.filter(x => x.type === state.nextGuaranteed);
        
        // Nếu tìm thấy thẻ loại đó trong game
        if (guaranteedPool.length > 0) {
            // Chọn ngẫu nhiên 1 thẻ trong nhóm đó
            item = guaranteedPool[Math.floor(Math.random() * guaranteedPool.length)];
            
            // QUAN TRỌNG: Xóa bảo đảm sau khi đã dùng
            state.nextGuaranteed = null;
            
            // Reset bảo hiểm vì đã ra thẻ xịn
            state.pity = 0;
            checkCompletion();
            // Lưu lại ngay lập tức để tránh F5 quay lại
            saveData();
            
            // Trả về thẻ ngay, bỏ qua đoạn random bên dưới
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

// --- UTILS ---
function redeemCode() {
    const input = document.getElementById('codeIdx').value.trim().toUpperCase();
    const found = giftcodes.find(gc => gc.code === input);
    if(found) {
        if (found.type === 'unlock_all') {
            // Thêm toàn bộ thẻ vào túi
            pool.forEach(c => { 
                if(!state.inventory.includes(c.id)) state.inventory.push(c.id); 
            });
            
            saveData();
            
            // --- THÊM DÒNG NÀY ĐỂ KÍCH HOẠT MÀN HÌNH CHIẾN THẮNG ---
            checkCompletion(); 
            // --------------------------------------------------------
            
            alert(`Thành công! ${found.reward}`);
        }
        else if(found.type === 'add_coin') { state.coins += found.value; }
        else if(found.type === 'reset_data') { resetData(); return; }
        else if (found.type === 'force_next') {
            state.nextGuaranteed = found.value; // Lưu lại loại thẻ (ví dụ: 'SE')
        }
        saveData(); alert(`Thành công! Nhận: ${found.reward}`); closeModal('giftcodeModal'); playSound('sfx-win');
    } else { alert("Mã không đúng!"); }
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
        color = '#fff'; // Màu trắng
        // Thêm hiệu ứng chữ cầu vồng
        document.getElementById('dRarity').style.textShadow = "0 0 10px red, 0 0 20px blue"; 
    }
    else if(item.type === 'UR') color = 'var(--neon-red)';else if(item.type==='SSR')color='var(--neon-gold)';else if(item.type==='SR')color='var(--neon-purple)';
    document.getElementById('dRarity').style.color = color; document.getElementById('dName').style.color = color;
    openModal('detailModal');
    setTimeout(() => {
        let max = item.type==='UR'?999:100;
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
    // 1. THÊM 'SE' VÀO ĐẦU DANH SÁCH (Để nó hiện đầu tiên)
    const types = ['SE', 'UR', 'SSR', 'SR', 'R'];
    
    let html = '';
    types.forEach(t => {
        // Đếm tổng số thẻ loại t trong pool
        const total = pool.filter(i => i.type === t).length;
        // Đếm số thẻ loại t đã sở hữu
        const owned = pool.filter(i => i.type === t && state.inventory.includes(i.id)).length;
        
        // 2. CẤU HÌNH MÀU SẮC CHO CHỮ SE
        let c = '#fff'; 
        if(t === 'SE') c = '#fff; text-shadow: 0 0 5px #fff; font-weight: 900;'; // Màu trắng phát sáng
        if(t === 'UR') c = 'var(--neon-red)'; 
        if(t === 'SSR') c = 'var(--neon-gold)'; 
        if(t === 'SR') c = 'var(--neon-purple)'; 
        if(t === 'R') c = 'var(--neon-blue)';
        
        // Tạo HTML hiển thị
        html += `<div class="stat-item" style="color:${c}">${t} <br> ${owned}/${total}</div>`;
    });
    return html;
}

// --- LOGIC BỘ SƯU TẬP MỚI ---

// Hàm mở Modal (Mặc định hiện tất cả)
function openCollection() {
    // 1. Tính toán thống kê (Giữ nguyên logic cũ)
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

    // 2. Mặc định lọc "Tất cả" khi mới mở
    filterCollection('ALL');
    
    // 3. Hiện Modal
    document.getElementById('collectionModal').classList.add('show');
}

// Hàm lọc thẻ theo loại (MỚI)
function filterCollection(type) {
    const grid = document.getElementById('collectionGrid');
    grid.innerHTML = ''; // Xóa lưới cũ

    // 1. Cập nhật giao diện nút bấm (Highlight nút đang chọn)
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');

    // 2. Lọc dữ liệu
    let filteredPool = [];
    if (type === 'ALL') {
        filteredPool = pool; // Lấy hết
    } else {
        filteredPool = pool.filter(card => card.type === type); // Lấy theo loại
    }

    // 3. Hiển thị thông báo nếu không có thẻ nào
    if (filteredPool.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #777; padding: 20px;">Không có thẻ loại này</div>';
        return;
    }

    // 4. Vẽ lại lưới thẻ
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
// --- LOGIC NẠP TIỀN (CÓ GIỚI HẠN) ---

// Mở cửa hàng và kiểm tra gói nào đã mua thì khóa lại
function openRecharge() { 
    const modal = document.getElementById('rechargeModal');
    
    // Kiểm tra gói 100k
    if (state.purchases['100000'] >= 1) {
        document.getElementById('pack-100k').classList.add('sold-out');
    } else {
        document.getElementById('pack-100k').classList.remove('sold-out');
    }

    // Kiểm tra gói 500k
    if (state.purchases['200000'] >= 1) {
        document.getElementById('pack-200k').classList.add('sold-out');
    } else {
        document.getElementById('pack-200k').classList.remove('sold-out');
    }

    modal.classList.add('show'); 
}

function buyCoins(amount) { 
    // Cấu hình giới hạn
    const LIMIT_THRESHOLD = 100000; // Các gói >= 100k sẽ bị giới hạn
    const MAX_BUY = 1; // Chỉ được mua 1 lần

    // 1. Kiểm tra giới hạn trước khi mua
    if (amount >= LIMIT_THRESHOLD) {
        const boughtCount = state.purchases[amount] || 0;
        if (boughtCount >= MAX_BUY) {
            alert("Gói này chỉ được mua 1 lần duy nhất!");
            return;
        }
    }

    // 2. Xác nhận mua
    if(confirm(`Xác nhận nạp ${amount.toLocaleString()} Xu?`)){
        state.coins += amount;
        
        // 3. Ghi lại lịch sử mua nếu là gói giới hạn
        if (amount >= LIMIT_THRESHOLD) {
            state.purchases[amount] = (state.purchases[amount] || 0) + 1;
        }

        saveData(); 
        
        // Cập nhật lại giao diện (để hiện chữ Đã Mua ngay lập tức)
        openRecharge(); 
        
        alert(`Nạp thành công +${amount.toLocaleString()} Xu!`);
        playSound('sfx-win');
    } 
}
function triggerFlash() { const f=document.getElementById('flash'); f.className='flash'; void f.offsetWidth; f.classList.add('do-flash'); }
function toggleSound() { soundOn=!soundOn; if(soundOn) document.getElementById('bgm').play().catch(()=>{}); else document.getElementById('bgm').pause(); }
function playSound(id) { if(soundOn){ const s=document.getElementById(id); s.currentTime=0; s.play().catch(()=>{}); } }
// Hàm kiểm tra xem đã đủ bộ sưu tập chưa
function checkCompletion() {
    // Nếu đã hoàn thành rồi thì không thông báo nữa
    if (state.isFinished) return;

    // So sánh số lượng thẻ đã có với tổng số thẻ trong pool
    if (state.inventory.length >= pool.length && pool.length > 0) {
        state.isFinished = true; // Đánh dấu đã xong
        saveData();

        // Hiện thông báo chúc mừng
        document.getElementById('total-cards-count').innerText = pool.length;
        
        // Chờ modal kết quả tắt đi rồi mới hiện chúc mừng (sau 2 giây)
        setTimeout(() => {
            closeModal('gridModal'); // Đóng bảng kết quả quay
            closeModal('detailModal'); // Đóng bảng chi tiết
            
            document.getElementById('completionModal').classList.add('show');
            playSound('sfx-win'); // Âm thanh chiến thắng
            
            // Bắn pháo bông (Optional - hiệu ứng thêm)
            triggerFlash();
        }, 2000);
    }
}
// --- HÀM TẠO VÒNG TRÒN CHỮ (Hỗ trợ nhiều vòng) ---
function createRuneRing(elementId, radius, textContent, charSpacing) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = ''; 

    // Nếu không truyền text, dùng text mặc định
    const text = textContent || "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ • MYSTIC GALAXY • ";
    
    const numChars = text.length;
    // Tính góc dựa trên số lượng chữ (360 độ / số chữ)
    // charSpacing là độ giãn, nếu không truyền thì tự chia đều 360
    const angleStep = charSpacing ? charSpacing : (360 / numChars); 

    for (let i = 0; i < numChars; i++) {
        const span = document.createElement('span');
        span.className = 'rune-char';
        span.innerText = text[i];
        
        // Chỉnh size chữ nhỏ hơn xíu cho vòng trong
        if(radius < 300) span.style.fontSize = "18px";

        // Xoay và đẩy ra xa tâm (radius)
        span.style.transform = `rotate(${i * angleStep}deg) translateY(-${radius}px) rotate(90deg)`;
        
        container.appendChild(span);
    }
}

// --- KHỞI TẠO 2 VÒNG CHỮ ---

// 1. Vòng Ngoài (Bán kính 340px - Rộng nhất)
createRuneRing('runeOuter', 340, "• SUMMONING • THE • ANCIENT • SPIRITS • OF • THE • COSMOS • ", 10); 
// (Số 10 ở cuối là khoảng cách giữa các chữ, chỉnh nhỏ thì chữ dày hơn)

// 2. Vòng Trong (Bán kính 260px - Nhỏ hơn)
createRuneRing('runeInner', 260, "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ"); 
// (Không truyền tham số cuối để nó tự chia đều 360 độ cho kín vòng tròn)
initGame();