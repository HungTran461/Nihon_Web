/**
 * NIHONGO CUTE - MAIN SCRIPT
 * Updated: Final Clean Version
 */

/* =========================================
   1. KHO DỮ LIỆU (DATABASE)
   ========================================= */

// --- 1.1 Dữ liệu Bảng chữ cái (Hiragana/Katakana) ---
const charMaps = {
    hiragana: {
        a:'あ', i:'い', u:'う', e:'え', o:'お',
        ka:'か', ki:'き', ku:'く', ke:'け', ko:'こ',
        sa:'さ', shi:'し', su:'す', se:'せ', so:'そ',
        ta:'た', chi:'ち', tsu:'つ', te:'て', to:'と',
        na:'な', ni:'に', nu:'ぬ', ne:'ね', no:'の',
        ha:'は', hi:'ひ', fu:'ふ', he:'へ', ho:'ほ',
        ma:'ま', mi:'み', mu:'む', me:'め', mo:'も',
        ya:'や', yu:'ゆ', yo:'よ',
        ra:'ら', ri:'り', ru:'る', re:'れ', ro:'ろ',
        wa:'わ', wo:'を', n:'ん',
        ga:'が', gi:'ぎ', gu:'ぐ', ge:'げ', go:'ご',
        za:'ざ', ji:'じ', zu:'ず', ze:'ぜ', zo:'ぞ',
        da:'だ', ji_d:'ぢ', zu_d:'づ', de:'で', do:'ど',
        ba:'ば', bi:'び', bu:'ぶ', be:'べ', bo:'ぼ',
        pa:'ぱ', pi:'ぴ', pu:'ぷ', pe:'ぺ', po:'ぽ',
        kya:'きゃ', kyu:'きゅ', kyo:'きょ', sha:'しゃ', shu:'しゅ', sho:'しょ',
        cha:'ちゃ', chu:'ちゅ', cho:'ちょ', nya:'にゃ', nyu:'にゅ', nyo:'にょ',
        hya:'ひゃ', hyu:'ひゅ', hyo:'ひょ', mya:'みゃ', myu:'みゅ', myo:'みょ',
        rya:'りゃ', ryu:'りゅ', ryo:'りょ', gya:'ぎゃ', gyu:'ぎゅ', gyo:'ぎょ',
        ja:'じゃ', ju:'じゅ', jo:'じょ', bya:'びゃ', byu:'びゅ', byo:'びょ',
        pya:'ぴゃ', pyu:'ぴゅ', pyo:'ぴょ'
    },
    katakana: {
        a:'ア', i:'イ', u:'ウ', e:'エ', o:'オ',
        ka:'カ', ki:'キ', ku:'ク', ke:'ケ', ko:'コ',
        sa:'サ', shi:'シ', su:'ス', se:'セ', so:'ソ',
        ta:'タ', chi:'チ', tsu:'ツ', te:'テ', to:'ト',
        na:'ナ', ni:'ニ', nu:'ヌ', ne:'ネ', no:'ノ',
        ha:'ハ', hi:'ヒ', fu:'フ', he:'ヘ', ho:'ホ',
        ma:'マ', mi:'ミ', mu:'ム', me:'メ', mo:'モ',
        ya:'ヤ', yu:'ユ', yo:'ヨ',
        ra:'ラ', ri:'リ', ru:'ル', re:'レ', ro:'ロ',
        wa:'ワ', wo:'ヲ', n:'ン',
        ga:'ガ', gi:'ギ', gu:'グ', ge:'ゲ', go:'ゴ',
        za:'ザ', ji:'ジ', zu:'ズ', ze:'ゼ', zo:'ゾ',
        da:'ダ', ji_d:'ヂ', zu_d:'ヅ', de:'デ', do:'ド',
        ba:'バ', bi:'ビ', bu:'ブ', be:'ベ', bo:'ボ',
        pa:'パ', pi:'ピ', pu:'プ', pe:'ペ', po:'ポ',
        kya:'キャ', kyu:'キュ', kyo:'キョ', sha:'シャ', shu:'シュ', sho:'ショ',
        cha:'チャ', chu:'チュ', cho:'チョ', nya:'ニャ', nyu:'ニュ', nyo:'ニョ',
        hya:'ヒャ', hyu:'ヒュ', hyo:'ヒョ', mya:'ミャ', myu:'ミュ', myo:'ミョ',
        rya:'リャ', ryu:'リュ', ryo:'リョ', gya:'ギャ', gyu:'ギュ', gyo:'ギョ',
        ja:'ジャ', ju:'ジュ', jo:'ジョ', bya:'ビャ', byu:'ビュ', byo:'ビョ',
        pya:'ピャ', pyu:'ピュ', pyo:'ピョ'
    }
};

const basicRows = [['a','i','u','e','o'],['ka','ki','ku','ke','ko'],['sa','shi','su','se','so'],['ta','chi','tsu','te','to'],['na','ni','nu','ne','no'],['ha','hi','fu','he','ho'],['ma','mi','mu','me','mo'],['ya','','yu','','yo'],['ra','ri','ru','re','ro'],['wa','','','','wo'],['n','','','','']];
const dakutenRows = [['ga','gi','gu','ge','go'],['za','ji','zu','ze','zo'],['da','ji_d','zu_d','de','do'],['ba','bi','bu','be','bo'],['pa','pi','pu','pe','po']];
const yoonRows = [['kya','kyu','kyo'],['sha','shu','sho'],['cha','chu','cho'],['nya','nyu','nyo'],['hya','hyu','hyo'],['mya','myu','myo'],['rya','ryu','ryo'],['gya','gyu','gyo'],['ja','ju','jo'],['bya','byu','byo'],['pya','pyu','pyo']];

// --- 1.2 Dữ liệu Từ vựng gợi ý (Hiragana & Katakana) ---
const hiraganaVocab = {
    'a': {j:'あめ',v:'🍬 Kẹo/Mưa'}, 'i': {j:'いぬ',v:'🐕 Chó'}, 'u': {j:'うみ',v:'🌊 Biển'}, 'e': {j:'えき',v:'🚉 Nhà ga'}, 'o': {j:'おにぎり',v:'🍙 Cơm nắm'},
    'ka':{j:'かさ',v:'☂️ Ô'}, 'ki':{j:'き',v:'🌳 Cây'}, 'ku':{j:'くつ',v:'👟 Giày'}, 'ke':{j:'けさ',v:'☀️ Sáng nay'}, 'ko':{j:'こども',v:'👶 Trẻ em'},
    'sa':{j:'さくら',v:'🌸 Hoa anh đào'}, 'shi':{j:'しお',v:'🧂 Muối'}, 'su':{j:'すし',v:'🍣 Sushi'}, 'se':{j:'せんせい',v:'👩‍🏫 Giáo viên'}, 'so':{j:'そら',v:'☁️ Bầu trời'},
    'ta':{j:'たこ',v:'🐙 Bạch tuộc'}, 'chi':{j:'ちかてつ',v:'🚇 Tàu điện'}, 'tsu':{j:'つくえ',v:'🪑 Bàn'}, 'te':{j:'てがみ',v:'✉️ Thư'}, 'to':{j:'とけい',v:'⏰ Đồng hồ'},
    'na':{j:'なつ',v:'☀️ Mùa hè'}, 'ni':{j:'にく',v:'🥩 Thịt'}, 'nu':{j:'ぬいぐるみ',v:'🧸 Thú bông'}, 'ne':{j:'ねこ',v:'🐱 Mèo'}, 'no':{j:'のみもの',v:'🥤 Đồ uống'},
    'ha':{j:'はな',v:'🌺 Hoa'}, 'hi':{j:'ひと',v:'🧑 Người'}, 'fu':{j:'ふね',v:'🚢 Thuyền'}, 'he':{j:'へや',v:'🏠 Phòng'}, 'ho':{j:'ほし',v:'⭐ Sao'},
    'ma':{j:'まど',v:'🪟 Cửa sổ'}, 'mi':{j:'みず',v:'💧 Nước'}, 'mu':{j:'むし',v:'🐛 Côn trùng'}, 'me':{j:'め',v:'👁️ Mắt'}, 'mo':{j:'もも',v:'🍑 Đào'},
    'ya':{j:'やま',v:'⛰️ Núi'}, 'yu':{j:'ゆき',v:'❄️ Tuyết'}, 'yo':{j:'よる',v:'🌃 Tối'},
    'ra':{j:'らいしゅう',v:'📅 Tuần sau'}, 'ri':{j:'りんご',v:'🍎 Táo'}, 'ru':{j:'るす',v:'🚪 Vắng nhà'}, 're':{j:'れいぞうこ',v:'🧊 Tủ lạnh'}, 'ro':{j:'ろうそく',v:'🕯️ Nến'},
    'wa':{j:'わたし',v:'🙋 Tôi'}, 'wo':{j:'を',v:'(Trợ từ)'}, 'n':{j:'ほん',v:'📚 Sách'},
    'ga':{j:'がっこう',v:'🏫 Trường học'}, 'za':{j:'ざっし',v:'📖 Tạp chí'}, 'da':{j:'だいがく',v:'🎓 Đại học'}, 'ba':{j:'ばら',v:'🌹 Hoa hồng'}, 'pa':{j:'ぱん',v:'🍞 Bánh mì'},
    'kya':{j:'きゃく',v:'👥 Khách'}, 'sha':{j:'しゃしん',v:'📸 Ảnh'}, 'cha':{j:'ちゃわん',v:'🍚 Bát cơm'}, 'nya':{j:'にゃんこ',v:'🐈 Mèo con'}
};

const katakanaVocab = {
    'a':{j:'アイス',v:'🍦 Kem'}, 'i':{j:'インク',v:'✒️ Mực'}, 'u':{j:'ウイスキー',v:'🥃 Whiskey'}, 'e':{j:'エレベーター',v:'🛗 Thang máy'}, 'o':{j:'オレンジ',v:'🍊 Cam'},
    'ka':{j:'カメラ',v:'📷 Camera'}, 'ki':{j:'キウイ',v:'🥝 Kiwi'}, 'ku':{j:'クラス',v:'🏫 Lớp'}, 'ke':{j:'ケーキ',v:'🍰 Bánh kem'}, 'ko':{j:'コーヒー',v:'☕ Cà phê'},
    'sa':{j:'サッカー',v:'⚽ Bóng đá'}, 'shi':{j:'シャツ',v:'👕 Sơ mi'}, 'su':{j:'スポーツ',v:'🏅 Thể thao'}, 'se':{j:'セーター',v:'🧶 Áo len'}, 'so':{j:'ソファー',v:'🛋️ Sofa'},
    'ta':{j:'タクシー',v:'🚕 Taxi'}, 'chi':{j:'チーズ',v:'🧀 Phô mai'}, 'tsu':{j:'ツアー',v:'🚩 Tour'}, 'te':{j:'テニス',v:'🎾 Tennis'}, 'to':{j:'トイレ',v:'🚽 Toilet'},
    'na':{j:'ナイフ',v:'🍴 Dao'}, 'ni':{j:'ニュース',v:'📰 Tin tức'}, 'nu':{j:'ヌードル',v:'🍜 Mì'}, 'ne':{j:'ネクタイ',v:'👔 Cà vạt'}, 'no':{j:'ノート',v:'📓 Vở'},
    'ha':{j:'ハンバーガー',v:'🍔 Burger'}, 'hi':{j:'ヒーター',v:'🔥 Lò sưởi'}, 'fu':{j:'フランス',v:'🇫🇷 Pháp'}, 'he':{j:'ヘルメット',v:'⛑️ Mũ BH'}, 'ho':{j:'ホテル',v:'🏨 Khách sạn'},
    'ma':{j:'マスク',v:'😷 Khẩu trang'}, 'mi':{j:'ミルク',v:'🥛 Sữa'}, 'mu':{j:'ムード',v:'✨ Mood'}, 'me':{j:'メロン',v:'🍈 Dưa lưới'}, 'mo':{j:'モデル',v:'💃 Người mẫu'},
    'ya':{j:'ヤング',v:'👶 Trẻ'}, 'yu':{j:'ユーザー',v:'👤 User'}, 'yo':{j:'ヨーグルト',v:'🥣 Sữa chua'},
    'ra':{j:'ライオン',v:'🦁 Sư tử'}, 'ri':{j:'リボン',v:'🎀 Nơ'}, 'ru':{j:'ルール',v:'📏 Rule'}, 're':{j:'レストラン',v:'🍽️ Nhà hàng'}, 'ro':{j:'ロボット',v:'🤖 Robot'},
    'wa':{j:'ワイン',v:'🍷 Rượu vang'}, 'wo':{j:'ヲタク',v:'🤓 Otaku'}, 'n':{j:'パン',v:'🍞 Bánh mì'},
    'ga':{j:'ガラス',v:'🪟 Kính'}, 'za':{j:'ゼロ',v:'0️⃣ Số 0'}, 'da':{j:'ダンス',v:'💃 Dance'}, 'ba':{j:'バス',v:'🚌 Bus'}, 'pa':{j:'パーティー',v:'🎉 Tiệc'}
};

// --- 1.3 Dữ liệu Minna no Nihongo (Bài 1 & 2) ---
const minnaData = {
    '1': [
        // --- Đại từ & Con người ---
        { k: '私', r: 'わたし', m: 'Tôi' },
        { k: '私たち', r: 'わたしたち', m: 'Chúng tôi' },
        { k: 'あなた', r: 'あなた', m: 'Bạn / Anh / Chị' },
        { k: 'あの人', r: 'あのひと', m: 'Người kia' },
        { k: 'あの方', r: 'あのかた', m: 'Vị kia (Lịch sự)' },
        { k: '～さん', r: '～さん', m: 'Ông/Bà/Anh/Chị (Hậu tố)' },
        { k: '～ちゃん', r: '～ちゃん', m: 'Bé (gái)' },
        { k: '～くん', r: '～くん', m: 'Bé (trai)' },
        { k: '～人', r: '～じん', m: 'Người nước ~' },

        // --- Nghề nghiệp ---
        { k: '先生', r: 'せんせい', m: 'Giáo viên (Gọi người khác)' },
        { k: '教師', r: 'きょうし', m: 'Giáo viên (Nói về mình)' },
        { k: '学生', r: 'がくせい', m: 'Học sinh, Sinh viên' },
        { k: '会社員', r: 'かいしゃいん', m: 'Nhân viên công ty' },
        { k: '社員', r: 'しゃいん', m: 'Nhân viên công ty' },
        { k: '銀行員', r: 'ぎんこういん', m: 'Nhân viên ngân hàng' },
        { k: '医者', r: 'いしゃ', m: 'Bác sĩ' },
        { k: '研究者', r: 'けんきゅうしゃ', m: 'Nhà nghiên cứu' },
        { k: 'エンジニア', r: 'エンジニア', m: 'Kỹ sư' },

        // --- Địa điểm & Khác ---
        { k: '大学', r: 'だいがく', m: 'Trường đại học' },
        { k: '病院', r: 'びょういん', m: 'Bệnh viện' },
        { k: '電気', r: 'でんき', m: 'Điện / Đèn điện' },

        // --- Từ để hỏi & Tuổi ---
        { k: 'だれ', r: 'だれ', m: 'Ai?' },
        { k: 'どなた', r: 'どなた', m: 'Vị nào? (Lịch sự)' },
        { k: '歳', r: '～さい', m: '～ tuổi' },
        { k: '何歳', r: 'なんさい', m: 'Mấy tuổi?' },
        { k: 'おいくつ', r: 'おいくつ', m: 'Bao nhiêu tuổi? (Lịch sự)' },

        // --- Chào hỏi & Giao tiếp (Rất quan trọng) ---
        { k: 'はい', r: 'はい', m: 'Vâng / Dạ' },
        { k: 'いいえ', r: 'いいえ', m: 'Không' },
        { k: '失礼ですが', r: 'しつれいですが', m: 'Xin cho hỏi' },
        { k: 'お名前は？', r: 'おなまえは', m: 'Tên bạn là gì?' },
        { k: '初めまして', r: 'はじめまして', m: 'Chào lần đầu gặp' },
        { k: '～から来ました', r: '～からきました', m: 'Đến từ ～' },
        { k: 'どうぞよろしく', r: 'どうぞ よろしく', m: 'Rất mong được giúp đỡ' },
        { k: 'お願いします', r: 'おねがいします', m: 'Làm ơn / Nhờ bạn' },

        // --- Tên các nước (Katakana) ---
        { k: 'アメリカ', r: 'アメリカ', m: 'Mỹ' },
        { k: 'イギリス', r: 'イギリス', m: 'Anh' },
        { k: 'インド', r: 'インド', m: 'Ấn Độ' },
        { k: 'インドネシア', r: 'インドネシア', m: 'Indonesia' },
        { k: '韓国', r: 'かんこく', m: 'Hàn Quốc' },
        { k: 'タイ', r: 'タイ', m: 'Thái Lan' },
        { k: '中国', r: 'ちゅうごく', m: 'Trung Quốc' },
        { k: 'ドイツ', r: 'ドイツ', m: 'Đức' },
        { k: '日本', r: 'にほん', m: 'Nhật Bản' },
        { k: 'フランス', r: 'フランス', m: 'Pháp' },
        { k: 'ブラジル', r: 'ブラジル', m: 'Brazil' },
        { k: 'ベトナム', r: 'ベトナム', m: 'Việt Nam' }
    ],
    '2': [
        { k: 'これ', r: 'これ', m: 'Cái này (gần người nói)' },
        { k: 'それ', r: 'それ', m: 'Cái đó (gần người nghe)' },
        { k: 'あれ', r: 'あれ', m: 'Cái kia (xa cả hai)' },
        { k: 'この～', r: 'この', m: '～ này' },
        { k: 'その～', r: 'その', m: '～ đó' },
        { k: 'あの～', r: 'あの', m: '～ kia' },
        { k: '本', r: 'ほん', m: 'Sách' },
        { k: '辞書', r: 'じしょ', m: 'Từ điển' },
        { k: '雑誌', r: 'ざっし', m: 'Tạp chí' },
        { k: '新聞', r: 'しんぶん', m: 'Báo' },
        { k: 'ノート', r: 'ノート', m: 'Vở' },
        { k: '手帳', r: 'てちょう', m: 'Sổ tay' },
        { k: '名刺', r: 'めいし', m: 'Danh thiếp' },
        { k: 'カード', r: 'カード', m: 'Thẻ (Card)' },
        { k: '鉛筆', r: 'えんぴつ', m: 'Bút chì' },
        { k: 'ボールペン', r: 'ボールペン', m: 'Bút bi' },
        { k: '時計', r: 'とけい', m: 'Đồng hồ' },
        { k: '傘', r: 'かさ', m: 'Cái ô' },
        { k: '鞄', r: 'かばん', m: 'Cặp sách, túi xách' },
        { k: 'テープ', r: 'テープ', m: 'Băng cassette/Băng dính' },
        { k: 'レコーダー', r: 'レコーダー', m: 'Máy ghi âm' },
        { k: 'テレビ', r: 'テレビ', m: 'Tivi' },
        { k: 'ラジオ', r: 'ラジオ', m: 'Radio' },
        { k: 'カメラ', r: 'カメラ', m: 'Máy ảnh' },
        { k: 'コンピューター', r: 'コンピューター', m: 'Máy vi tính' },
        { k: '自動車', r: 'じどうしゃ', m: 'Ô tô' },
        { k: '机', r: 'つくえ', m: 'Cái bàn' },
        { k: '椅子', r: 'いす', m: 'Cái ghế' },
        { k: 'チョコレート', r: 'チョコレート', m: 'Sô cô la' },
        { k: 'コーヒー', r: 'コーヒー', m: 'Cà phê' },
        { k: '英語', r: 'えいご', m: 'Tiếng Anh' },
        { k: '日本語', r: 'にほんご', m: 'Tiếng Nhật' },
        { k: '～語', r: '～ご', m: 'Tiếng ～' },
        { k: '何', r: 'なん', m: 'Cái gì' },
        { k: 'そうです', r: 'そうです', m: 'Đúng rồi / Vậy đó' }
    ]
};

const n5KanjiData = [
    // --- 1. SỐ ĐẾM & TIỀN TỆ (14 chữ) ---
    {c:'一',h:'NHẤT',m:'Một',on:'ICHI',kun:'hito'},
    {c:'二',h:'NHỊ',m:'Hai',on:'NI',kun:'futa'},
    {c:'三',h:'TAM',m:'Ba',on:'SAN',kun:'mit'},
    {c:'四',h:'TỨ',m:'Bốn',on:'SHI',kun:'yon'},
    {c:'五',h:'NGŨ',m:'Năm',on:'GO',kun:'itsu'},
    {c:'六',h:'LỤC',m:'Sáu',on:'ROKU',kun:'mut'},
    {c:'七',h:'THẤT',m:'Bảy',on:'SHICHI',kun:'nana'},
    {c:'八',h:'BÁT',m:'Tám',on:'HACHI',kun:'yat'},
    {c:'九',h:'CỬU',m:'Chín',on:'KYUU',kun:'kokono'},
    {c:'十',h:'THẬP',m:'Mười',on:'JUU',kun:'tou'},
    {c:'百',h:'BÁCH',m:'Trăm',on:'HYAKU',kun:'-'},
    {c:'千',h:'THIÊN',m:'Nghìn',on:'SEN',kun:'chi'},
    {c:'万',h:'VẠN',m:'Mười nghìn',on:'MAN',kun:'-'},
    {c:'円',h:'YÊN',m:'Yên / Tròn',on:'EN',kun:'maru'},

    // --- 2. THỜI GIAN (13 chữ) ---
    {c:'日',h:'NHẬT',m:'Ngày / Mặt trời',on:'NICHI',kun:'hi'},
    {c:'月',h:'NGUYỆT',m:'Tháng / Mặt trăng',on:'GETSU',kun:'tsuki'},
    {c:'火',h:'HỎA',m:'Lửa / Thứ 3',on:'KA',kun:'hi'},
    {c:'水',h:'THỦY',m:'Nước / Thứ 4',on:'SUI',kun:'mizu'},
    {c:'木',h:'MỘC',m:'Cây / Thứ 5',on:'MOKU',kun:'ki'},
    {c:'金',h:'KIM',m:'Vàng / Tiền / Thứ 6',on:'KIN',kun:'kane'},
    {c:'土',h:'THỔ',m:'Đất / Thứ 7',on:'DO',kun:'tsuchi'},
    {c:'年',h:'NIÊN',m:'Năm',on:'NEN',kun:'toshi'},
    {c:'時',h:'THỜI',m:'Giờ',on:'JI',kun:'toki'},
    {c:'分',h:'PHÂN',m:'Phút / Phân chia',on:'FUN',kun:'wa'},
    {c:'午',h:'NGỌ',m:'Trưa',on:'GO',kun:'-'},
    {c:'今',h:'KIM',m:'Bây giờ',on:'KON',kun:'ima'},
    {c:'半',h:'BÁN',m:'Một nửa',on:'HAN',kun:'naka'},

    // --- 3. CON NGƯỜI & CƠ THỂ (11 chữ) ---
    {c:'人',h:'NHÂN',m:'Người',on:'JIN',kun:'hito'},
    {c:'男',h:'NAM',m:'Nam giới',on:'DAN',kun:'otoko'},
    {c:'女',h:'NỮ',m:'Nữ giới',on:'JO',kun:'onna'},
    {c:'子',h:'TỬ',m:'Trẻ con',on:'SHI',kun:'ko'},
    {c:'父',h:'PHỤ',m:'Bố',on:'FU',kun:'chichi'},
    {c:'母',h:'MẪU',m:'Mẹ',on:'BO',kun:'haha'},
    {c:'友',h:'HỮU',m:'Bạn bè',on:'YUU',kun:'tomo'},
    {c:'口',h:'KHẨU',m:'Miệng',on:'KOU',kun:'kuchi'},
    {c:'目',h:'MỤC',m:'Mắt',on:'MOKU',kun:'me'},
    {c:'耳',h:'NHĨ',m:'Tai',on:'JI',kun:'mimi'},
    {c:'手',h:'THỦ',m:'Tay',on:'SHU',kun:'te'},
    {c:'足',h:'TÚC',m:'Chân',on:'SOKU',kun:'ashi'}, // Bổ sung cho đủ bộ phận

    // --- 4. PHƯƠNG HƯỚNG & VỊ TRÍ (10 chữ) ---
    {c:'上',h:'THƯỢNG',m:'Trên',on:'JOU',kun:'ue'},
    {c:'下',h:'HẠ',m:'Dưới',on:'KA',kun:'shita'},
    {c:'左',h:'TẢ',m:'Trái',on:'SA',kun:'hidari'},
    {c:'右',h:'HỮU',m:'Phải',on:'U',kun:'migi'},
    {c:'中',h:'TRUNG',m:'Trong / Giữa',on:'CHUU',kun:'naka'},
    {c:'外',h:'NGOẠI',m:'Ngoài',on:'GAI',kun:'soto'},
    {c:'東',h:'ĐÔNG',m:'Phía Đông',on:'TOU',kun:'higashi'},
    {c:'西',h:'TÂY',m:'Phía Tây',on:'SEI',kun:'nishi'},
    {c:'南',h:'NAM',m:'Phía Nam',on:'NAN',kun:'minami'},
    {c:'北',h:'BẮC',m:'Phía Bắc',on:'HOKU',kun:'kita'},

    // --- 5. ĐỘNG TỪ CĂN BẢN (10 chữ) ---
    {c:'行',h:'HÀNH',m:'Đi',on:'KOU',kun:'i'},
    {c:'来',h:'LAI',m:'Đến',on:'RAI',kun:'ku'},
    {c:'食',h:'THỰC',m:'Ăn',on:'SHOKU',kun:'ta'},
    {c:'飲',h:'ẨM',m:'Uống',on:'IN',kun:'no'},
    {c:'見',h:'KIẾN',m:'Nhìn',on:'KEN',kun:'mi'},
    {c:'聞',h:'VĂN',m:'Nghe',on:'BUN',kun:'ki'},
    {c:'読',h:'ĐỘC',m:'Đọc',on:'DOKU',kun:'yo'},
    {c:'書',h:'THƯ',m:'Viết',on:'SHO',kun:'ka'},
    {c:'話',h:'THOẠI',m:'Nói chuyện',on:'WA',kun:'hana'},
    {c:'買',h:'MÃI',m:'Mua',on:'BAI',kun:'ka'},

    // --- 6. TÍNH TỪ CĂN BẢN (8 chữ) ---
    {c:'大',h:'ĐẠI',m:'To lớn',on:'DAI',kun:'oo'},
    {c:'小',h:'TIỂU',m:'Nhỏ bé',on:'SHOU',kun:'chii'},
    {c:'高',h:'CAO',m:'Cao / Đắt',on:'KOU',kun:'taka'},
    {c:'安',h:'AN',m:'Rẻ / An toàn',on:'AN',kun:'yasu'},
    {c:'新',h:'TÂN',m:'Mới',on:'SHIN',kun:'atara'},
    {c:'古',h:'CỔ',m:'Cũ',on:'KO',kun:'furu'},
    {c:'多',h:'ĐA',m:'Nhiều',on:'TA',kun:'oo'},
    {c:'少',h:'THIỂU',m:'Ít',on:'SHOU',kun:'suku'},

    // --- 7. THIÊN NHIÊN & ĐỜI SỐNG (14 chữ) ---
    {c:'山',h:'SƠN',m:'Núi',on:'SAN',kun:'yama'},
    {c:'川',h:'XUYÊN',m:'Sông',on:'SEN',kun:'kawa'},
    {c:'雨',h:'VŨ',m:'Mưa',on:'U',kun:'ame'},
    {c:'花',h:'HOA',m:'Hoa',on:'KA',kun:'hana'},
    {c:'天',h:'THIÊN',m:'Trời',on:'TEN',kun:'ama'}, // Thay cho Khí
    {c:'気',h:'KHÍ',m:'Tinh thần/Khí',on:'KI',kun:'-'},
    {c:'学',h:'HỌC',m:'Học',on:'GAKU',kun:'mana'},
    {c:'校',h:'HIỆU',m:'Trường học',on:'KOU',kun:'-'},
    {c:'本',h:'BẢN',m:'Sách / Gốc',on:'HON',kun:'moto'},
    {c:'名',h:'DANH',m:'Tên',on:'MEI',kun:'na'},
    {c:'店',h:'ĐIẾM',m:'Cửa hàng',on:'TEN',kun:'mise'},
    {c:'駅',h:'DỊCH',m:'Nhà ga',on:'EKI',kun:'-'},
    {c:'電',h:'ĐIỆN',m:'Điện',on:'DEN',kun:'-'},
    {c:'車',h:'XA',m:'Xe cộ',on:'SHA',kun:'kuruma'},
    {c:'国',h:'QUỐC',m:'Đất nước',on:'KOKU',kun:'kuni'},
    {c:'道',h:'ĐẠO',m:'Đường',on:'DOU',kun:'michi'}, // Bổ sung cho đủ 80
    {c:'白',h:'BẠCH',m:'Màu trắng',on:'HAKU',kun:'shiro'},
    {c:'長',h:'TRƯỜNG',m:'Dài',on:'CHOU',kun:'naga'}
];

const radicalsData = [
    // --- 1 NÉT (6 bộ) ---
    {c:'一', h:'NHẤT', m:'Số một'},
    {c:'丨', h:'CỔN', m:'Nét sổ thẳng'},
    {c:'丶', h:'CHỦ', m:'Điểm, chấm'},
    {c:'丿', h:'PHIỆT', m:'Nét phẩy, xiên trái'},
    {c:'乙', h:'ẤT', m:'Can Ất, nét cong'},
    {c:'亅', h:'QUYẾT', m:'Nét móc'},

    // --- 2 NÉT (23 bộ) ---
    {c:'二', h:'NHỊ', m:'Số hai'},
    {c:'亠', h:'ĐẦU', m:'Đầu, nắp, mái'},
    {c:'人', h:'NHÂN', m:'Người'},
    {c:'儿', h:'NHI', m:'Trẻ con, đi bằng 2 chân'},
    {c:'入', h:'NHẬP', m:'Vào'},
    {c:'八', h:'BÁT', m:'Số tám'},
    {c:'冂', h:'QUYNH', m:'Vùng biên giới, hoang địa'},
    {c:'冖', h:'MỊCH', m:'Trùm khăn lên'},
    {c:'冫', h:'BĂNG', m:'Nước đá, lạnh'},
    {c:'几', h:'KỶ', m:'Cái ghế'},
    {c:'凵', h:'KHẢM', m:'Há miệng, hố sâu'},
    {c:'刀', h:'ĐAO', m:'Con dao, vũ khí'},
    {c:'力', h:'LỰC', m:'Sức lực'},
    {c:'勹', h:'BAO', m:'Bao bọc'},
    {c:'匕', h:'CHỦY', m:'Cái thìa (muỗng)'},
    {c:'匚', h:'PHƯƠNG', m:'Tủ đựng, vật vuông'},
    {c:'匸', h:'HỆ', m:'Che đậy, giấu giếm'},
    {c:'十', h:'THẬP', m:'Số mười'},
    {c:'卜', h:'BỐC', m:'Xem bói'},
    {c:'卩', h:'TIẾT', m:'Đốt tre'},
    {c:'厂', h:'HÁN', m:'Sườn núi'},
    {c:'厶', h:'KHƯ', m:'Riêng tư'},
    {c:'又', h:'HỰU', m:'Lại nữa, cái tay'},

    // --- 3 NÉT (31 bộ) ---
    {c:'口', h:'KHẨU', m:'Cái miệng'},
    {c:'囗', h:'VI', m:'Vây quanh (bức tường)'},
    {c:'土', h:'THỔ', m:'Đất'},
    {c:'士', h:'SĨ', m:'Kẻ sĩ, người có học'},
    {c:'夂', h:'TRUY', m:'Đến sau'},
    {c:'夊', h:'TUY', m:'Đi chậm'},
    {c:'夕', h:'TỊCH', m:'Đêm tối'},
    {c:'大', h:'ĐẠI', m:'To lớn'},
    {c:'女', h:'NỮ', m:'Phụ nữ'},
    {c:'子', h:'TỬ', m:'Con cái'},
    {c:'宀', h:'MIÊN', m:'Mái nhà'},
    {c:'寸', h:'THỐN', m:'Tấc (đo lường), một chút'},
    {c:'小', h:'TIỂU', m:'Nhỏ bé'},
    {c:'尢', h:'UÔNG', m:'Yếu đuối, què'},
    {c:'尸', h:'THI', m:'Xác chết'},
    {c:'屮', h:'TRIỆT', m:'Mầm non, cỏ'},
    {c:'山', h:'SƠN', m:'Núi'},
    {c:'巛', h:'XUYÊN', m:'Sông ngòi'},
    {c:'工', h:'CÔNG', m:'Thợ, công việc'},
    {c:'己', h:'KỶ', m:'Bản thân'},
    {c:'巾', h:'CÂN', m:'Cái khăn'},
    {c:'干', h:'CAN', m:'Can thiệp, khô, thiên can'},
    {c:'幺', h:'YÊU', m:'Nhỏ nhắn, yêu ớt'},
    {c:'广', h:'NGHIỄM', m:'Mái nhà rộng, sườn núi'},
    {c:'廴', h:'DẪN', m:'Bước dài'},
    {c:'廾', h:'CỦNG', m:'Chắp tay (nâng vật)'},
    {c:'弋', h:'DẶC', m:'Bắn tên, cọc gỗ'},
    {c:'弓', h:'CUNG', m:'Cái cung'},
    {c:'彐', h:'KỆ', m:'Đầu con heo'},
    {c:'彡', h:'SAM', m:'Lông tóc, vằn'},
    {c:'彳', h:'XÍCH', m:'Bước chân trái'},

    // --- 4 NÉT (34 bộ) ---
    {c:'心', h:'TÂM', m:'Tim, tấm lòng'},
    {c:'戈', h:'QUA', m:'Cây giáo, mác'},
    {c:'戶', h:'HỘ', m:'Cửa một cánh'},
    {c:'手', h:'THỦ', m:'Tay'},
    {c:'支', h:'CHI', m:'Cành cây'},
    {c:'攴', h:'PHỘC', m:'Đánh khẽ'},
    {c:'文', h:'VĂN', m:'Văn chương, vẻ đẹp'},
    {c:'斗', h:'ĐẨU', m:'Cái đấu (đo lường)'},
    {c:'斤', h:'CÂN', m:'Cái rìu'},
    {c:'方', h:'PHƯƠNG', m:'Vuông, phương hướng'},
    {c:'无', h:'VÔ', m:'Không có'},
    {c:'日', h:'NHẬT', m:'Mặt trời, ngày'},
    {c:'曰', h:'VIẾT', m:'Nói rằng'},
    {c:'月', h:'NGUYỆT', m:'Mặt trăng, tháng'},
    {c:'木', h:'MỘC', m:'Cây, gỗ'},
    {c:'欠', h:'KHIẾM', m:'Thiếu, nợ, khiếm khuyết'},
    {c:'止', h:'CHỈ', m:'Dừng lại'},
    {c:'歹', h:'ĐÃI', m:'Xấu xa, tệ hại, chết'},
    {c:'殳', h:'THÙ', m:'Binh khí dài'},
    {c:'毋', h:'VÔ', m:'Chớ, đừng (ngăn cấm)'},
    {c:'比', h:'TỶ', m:'So sánh'},
    {c:'毛', h:'MAO', m:'Lông'},
    {c:'氏', h:'THỊ', m:'Họ tên, dòng họ'},
    {c:'气', h:'KHÍ', m:'Không khí, hơi nước'},
    {c:'水', h:'THỦY', m:'Nước'},
    {c:'火', h:'HỎA', m:'Lửa'},
    {c:'爪', h:'TRẢO', m:'Móng vuốt'},
    {c:'父', h:'PHỤ', m:'Cha'},
    {c:'爻', h:'HÀO', m:'Hào (trong bát quái)'},
    {c:'爿', h:'TƯỜNG', m:'Mảnh gỗ (bên trái)'},
    {c:'片', h:'PHIẾN', m:'Mảnh, tấm (bên phải)'},
    {c:'牛', h:'NGƯU', m:'Con trâu'},
    {c:'犬', h:'KHUYỂN', m:'Con chó'},

    // --- 5 NÉT (23 bộ) ---
    {c:'玄', h:'HUYỀN', m:'Màu đen, huyền bí'},
    {c:'玉', h:'NGỌC', m:'Đá quý'},
    {c:'瓜', h:'QUA', m:'Quả dưa'},
    {c:'瓦', h:'NGÕI', m:'Viên ngói'},
    {c:'甘', h:'CAM', m:'Ngọt'},
    {c:'生', h:'SINH', m:'Sinh đẻ, sống'},
    {c:'用', h:'DỤNG', m:'Dùng'},
    {c:'田', h:'ĐIỀN', m:'Ruộng'},
    {c:'疋', h:'SƠ', m:'Đơn vị đo vải, cái chân'},
    {c:'疒', h:'NẠCH', m:'Bệnh tật'},
    {c:'癶', h:'BÁT', m:'Gạt ra, bước đi'},
    {c:'白', h:'BẠCH', m:'Màu trắng'},
    {c:'皮', h:'BÌ', m:'Da'},
    {c:'皿', h:'MÃNH', m:'Bát đĩa'},
    {c:'目', h:'MỤC', m:'Mắt'},
    {c:'矛', h:'MÂU', m:'Cây giáo'},
    {c:'矢', h:'THỈ', m:'Mũi tên'},
    {c:'石', h:'THẠCH', m:'Đá'},
    {c:'示', h:'THỊ', m:'Chỉ thị, thần đất'},
    {c:'禸', h:'NHỰU', m:'Vết chân thú'},
    {c:'禾', h:'HÒA', m:'Lúa'},
    {c:'穴', h:'HUYỆT', m:'Hang lỗ'},
    {c:'立', h:'LẬP', m:'Đứng'},

    // --- 6 NÉT (29 bộ) ---
    {c:'竹', h:'TRÚC', m:'Tre trúc'},
    {c:'米', h:'MỄ', m:'Gạo'},
    {c:'糸', h:'MỊCH', m:'Sợi tơ'},
    {c:'缶', h:'PHẪU', m:'Đồ sành'},
    {c:'网', h:'VÕNG', m:'Cái lưới'},
    {c:'羊', h:'DƯƠNG', m:'Con dê'},
    {c:'羽', h:'VŨ', m:'Lông vũ'},
    {c:'老', h:'LÃO', m:'Già'},
    {c:'而', h:'NHI', m:'Mà, râu'},
    {c:'耒', h:'LỖI', m:'Cái cày'},
    {c:'耳', h:'NHĨ', m:'Tai'},
    {c:'聿', h:'DUẬT', m:'Cây bút'},
    {c:'肉', h:'NHỤC', m:'Thịt'},
    {c:'臣', h:'THẦN', m:'Bề tôi'},
    {c:'自', h:'TỰ', m:'Tự mình'},
    {c:'至', h:'CHÍ', m:'Đến'},
    {c:'臼', h:'CỐI', m:'Cái cối'},
    {c:'舌', h:'THIỆT', m:'Cái lưỡi'},
    {c:'舛', h:'SUYỄN', m:'Sai lầm, trái ngược'},
    {c:'舟', h:'CHU', m:'Cái thuyền'},
    {c:'艮', h:'CẤN', m:'Bền cứng, quẻ Cấn'},
    {c:'色', h:'SẮC', m:'Màu sắc'},
    {c:'艸', h:'THẢO', m:'Cỏ'},
    {c:'虍', h:'HÔ', m:'Vằn hổ'},
    {c:'虫', h:'TRÙNG', m:'Côn trùng, sâu bọ'},
    {c:'血', h:'HUYẾT', m:'Máu'},
    {c:'行', h:'HÀNH', m:'Đi, thi hành'},
    {c:'衣', h:'Y', m:'Áo'},
    {c:'襾', h:'Á', m:'Che đậy'},

    // --- 7 NÉT (20 bộ) ---
    {c:'見', h:'KIẾN', m:'Nhìn thấy'},
    {c:'角', h:'GIÁC', m:'Sừng, góc'},
    {c:'言', h:'NGÔN', m:'Lời nói'},
    {c:'谷', h:'CỐC', m:'Khe suối, thung lũng'},
    {c:'豆', h:'ĐẬU', m:'Hạt đậu, cái bát'},
    {c:'豕', h:'THỈ', m:'Con heo'},
    {c:'豸', h:'TRÃI', m:'Loài sâu không chân'},
    {c:'貝', h:'BỐI', m:'Vỏ sò, bảo bối, tiền'},
    {c:'赤', h:'XÍCH', m:'Màu đỏ'},
    {c:'走', h:'TẨU', m:'Chạy'},
    {c:'足', h:'TÚC', m:'Chân'},
    {c:'身', h:'THÂN', m:'Thân thể'},
    {c:'車', h:'XA', m:'Xe'},
    {c:'辛', h:'TÂN', m:'Cay, vất vả'},
    {c:'辰', h:'THẦN', m:'Can Thần, thời gian'},
    {c:'辵', h:'SƯỚC', m:'Bước đi, chợt đi chợt dừng'},
    {c:'邑', h:'ẤP', m:'Vùng đất, ấp'},
    {c:'酉', h:'DẬU', m:'Men rượu, can Dậu'},
    {c:'釆', h:'BIỆN', m:'Phân biệt'},
    {c:'里', h:'LÝ', m:'Dặm, làng xóm'},

    // --- 8 NÉT (9 bộ) ---
    {c:'金', h:'KIM', m:'Vàng, kim loại'},
    {c:'長', h:'TRƯỜNG', m:'Dài, lớn'},
    {c:'門', h:'MÔN', m:'Cửa 2 cánh'},
    {c:'阜', h:'PHỤ', m:'Đống đất, gò'},
    {c:'隶', h:'ĐÃI', m:'Kịp, theo kịp'},
    {c:'隹', h:'CHUY', m:'Chim đuôi ngắn'},
    {c:'雨', h:'VŨ', m:'Mưa'},
    {c:'青', h:'THANH', m:'Màu xanh'},
    {c:'非', h:'PHI', m:'Không phải'},

    // --- 9 NÉT (11 bộ) ---
    {c:'面', h:'DIỆN', m:'Mặt'},
    {c:'革', h:'CÁCH', m:'Da thú (đã thuộc)'},
    {c:'韋', h:'VI', m:'Da thuộc (mềm)'},
    {c:'韭', h:'CỬU', m:'Rau hẹ'},
    {c:'音', h:'ÂM', m:'Âm thanh'},
    {c:'頁', h:'HIỆT', m:'Trang giấy, cái đầu'},
    {c:'風', h:'PHONG', m:'Gió'},
    {c:'飛', h:'PHI', m:'Bay'},
    {c:'食', h:'THỰC', m:'Ăn'},
    {c:'首', h:'THỦ', m:'Đầu'},
    {c:'香', h:'HƯƠNG', m:'Mùi thơm'},

    // --- 10 NÉT (8 bộ) ---
    {c:'馬', h:'MÃ', m:'Con ngựa'},
    {c:'骨', h:'CỐT', m:'Xương'},
    {c:'高', h:'CAO', m:'Cao'},
    {c:'髟', h:'TIÊU', m:'Tóc dài'},
    {c:'鬥', h:'ĐẤU', m:'Đánh nhau'},
    {c:'鬯', h:'SƯỞNG', m:'Rượu nếp'},
    {c:'鬲', h:'CÁCH', m:'Nồi, đỉnh (nấu ăn)'},
    {c:'鬼', h:'QUỶ', m:'Con ma'},

    // --- 11 NÉT (6 bộ) ---
    {c:'魚', h:'NGƯ', m:'Con cá'},
    {c:'鳥', h:'ĐIỂU', m:'Con chim (đuôi dài)'},
    {c:'鹵', h:'LỖ', m:'Đất mặn'},
    {c:'鹿', h:'LỘC', m:'Con hươu'},
    {c:'麥', h:'MẠCH', m:'Lúa mạch'},
    {c:'麻', h:'MA', m:'Cây gai'},

    // --- 12 NÉT (4 bộ) ---
    {c:'黃', h:'HOÀNG', m:'Màu vàng'},
    {c:'黍', h:'THỬ', m:'Lúa nếp'},
    {c:'黑', h:'HẮC', m:'Màu đen'},
    {c:'黹', h:'CHỈ', m:'May vá'},

    // --- 13 NÉT (4 bộ) ---
    {c:'黽', h:'MÃNH', m:'Con ếch'},
    {c:'鼎', h:'ĐỈNH', m:'Cái đỉnh (vạc)'},
    {c:'鼓', h:'CỔ', m:'Cái trống'},
    {c:'鼠', h:'THỬ', m:'Con chuột'},

    // --- 14 NÉT (2 bộ) ---
    {c:'鼻', h:'TỴ', m:'Cái mũi'},
    {c:'齊', h:'TỀ', m:'Ngang bằng, tề chỉnh'},

    // --- 15 NÉT (1 bộ) ---
    {c:'齒', h:'XỈ', m:'Răng'},

    // --- 16 NÉT (2 bộ) ---
    {c:'龍', h:'LONG', m:'Con rồng'},
    {c:'龜', h:'QUY', m:'Con rùa'},

    // --- 17 NÉT (1 bộ) ---
    {c:'龠', h:'DƯỢC', m:'Sáo 3 lỗ'}
];

const grammarData = {
    '1': [
        {
            title: 'N1 は N2 です。',
            mean: 'N1 là N2',
            note: 'Dùng để giới thiệu tên, nghề nghiệp, quốc tịch. "は" đọc là "wa".',
            ex: [
                { j: 'わたしは マイク・ミラーです。', v: 'Tôi là Mike Miller.' },
                { j: 'わたしは かいしゃいんです。', v: 'Tôi là nhân viên công ty.' }
            ]
        },
        {
            title: 'N1 は N2 じゃありません / ではありません。',
            mean: 'N1 không phải là N2',
            note: 'Phủ định của "desu". Văn nói thường dùng "Ja arimasen", văn viết dùng "Dewa arimasen".',
            ex: [
                { j: 'サントスさんは がくせいじゃありません。', v: 'Anh Santos không phải là sinh viên.' },
                { j: 'わたしは いしゃじゃありません。', v: 'Tôi không phải là bác sĩ.' }
            ]
        },
        {
            title: 'N1 は N2 ですか。',
            mean: 'N1 là N2 phải không?',
            note: 'Thêm "ka" vào cuối câu khẳng định để tạo thành câu hỏi. Lên giọng ở cuối câu.',
            ex: [
                { j: 'ミラーさんは かいしゃいんですか。', v: 'Anh Miller có phải là nhân viên công ty không?' },
                { j: '...はい、かいしゃいんです。', v: '...Vâng, là nhân viên công ty.' }
            ]
        },
        {
            title: 'N も',
            mean: 'N cũng...',
            note: 'Dùng trợ từ "mo" thay cho "wa" khi chủ đề giống với câu trước đó.',
            ex: [
                { j: 'ミラーさんは かいしゃいんです。', v: 'Anh Miller là nhân viên công ty.' },
                { j: 'グプタさんも かいしゃいんです。', v: 'Anh Gupta cũng là nhân viên công ty.' }
            ]
        },
        {
            title: 'N1 の N2',
            mean: 'N2 của N1',
            note: 'Trợ từ "no" nối 2 danh từ. N1 bổ nghĩa cho N2 để chỉ sự sỡ hữu.',
            ex: [
                { j: 'グプタさんは IMCのしゃいんです。', v: 'Anh Gupta là nhân viên của công ty AKC.' },
                { j: 'ワンさんは こうべびょういんのいしゃです。', v: 'Chị Y là bác sĩ của bệnh viện Kobe.' }
            ]
        }
    ],
    '2': [
        {
            title: 'これ / それ / あれ',
            mean: 'Cái này / Cái đó / Cái kia',
            note: 'Đại từ chỉ định, đóng vai trò là chủ ngữ. <br>これ (Gần người nói), それ (Gần người nghe), あれ (Xa cả hai).',
            ex: [
                { j: 'これは じしょです。', v: 'Cái này là từ điển.' },
                { j: 'それは わたしの かさです。', v: 'Cái đó là cái ô của tôi.' }
            ]
        },
        {
            title: 'この N / その N / あの N',
            mean: 'Cái N này / Cái N đó / Cái N kia',
            note: 'Bổ nghĩa cho danh từ đi ngay sau nó.',
            ex: [
                { j: 'このほんは わたしのです。', v: 'Quyển sách này là của tôi.' },
                { j: 'あのかたは どなたですか。', v: 'Vị kia là ai vậy?' }
            ]
        },
        {
            title: 'そうです / そうじゃありません',
            mean: 'Đúng vậy / Không phải vậy',
            note: 'Dùng để trả lời câu hỏi xác nhận danh từ.',
            ex: [
                { j: 'それは テレホンカードですか。', v: 'Đó là thẻ điện thoại phải không?' },
                { j: '...はい、そうです。', v: '...Vâng, đúng vậy.' }
            ]
        },
        {
            title: 'N1 の N2',
            mean: 'N2 thuộc về N1',
            note: 'Trợ từ "no" nối 2 danh từ. N1 bổ nghĩa cho N2 để chỉ xuất xứ, nội dung...',
            ex: [
                { j: 'これは コンピューターのほんです。', v: 'Đây là sách về máy tính.' },
                { j: 'これは わたしのほんです。', v: 'Đây là sách của tôi.' }
            ]
        }
    ]
};


// --- 1.6 Dữ liệu Bài tập (Exercises) - Đã cập nhật định dạng "Kana(Kanji)" ---
const exercisesData = {
    '1': [
        {
            q: 'わたし(私) ＿ マイク・ミラーです。(Tôi là Mike Miller.)', 
            opts: ['は', 'の', 'も'],
            ans: 0 
        },
        {
            q: 'あのひと(あの人) ＿ どなたですか。(Người kia là ai?)',
            opts: ['わ', 'は', 'が'],
            ans: 1 
        },
        {
            q: 'ゆたさん ＿ がくせい(学生)です。(Yuta cũng là sinh viên.)',
            opts: ['は', 'の', 'も'], 
            ans: 2 
        },
        {
            q: 'A: わたし(私)は ベトナムじん(人)です。<br>B: グプタさん ＿ ベトナムじん(人)ですか。',
            opts: ['は', 'の', 'も'],
            ans: 2 
        },
        {

            q: 'はじめまして(初めまして)。どうぞ ＿。',
            opts: ['おねがいします(お願いします)', 'よろしく', 'しつれいします(失礼します)'],
            ans: 1 
        }
    ],
    '2': [
        {
            q: '＿ は じしょ(辞書)です。(Cái này là từ điển.)',
            opts: ['これ', 'それ', 'あれ'],
            ans: 0
        },
        {
            q: 'それは ＿ の かさ(傘)ですか。',
            opts: ['だれ(誰)', 'なん(何)', 'どなた'],
            ans: 0
        },
        {
            q: 'この ＿ は わたし(私)のです。',
            opts: ['ほん(本)', 'これ', 'それ'],
            ans: 0 
        },
        {

            q: 'そうです ＿。(Vậy hả?)',
            opts: ['か', 'ね', 'じゃありません'],
            ans: 0
        },
        {
            q: 'これは 「9」ですか、「7」ですか。<br>...＿ です。',
            opts: ['はい、9', 'いいえ、7', '9'],
            ans: 2 
        }
    ]
};

// --- Dữ liệu Sắp xếp câu  ---
const exerciseScrambleData = {
    '1': [
        { 
            question: "Tôi là sinh viên.", 
            parts: ["せんせい","わたし", "は", "がくせい", "けんきゅうしゃ", "です", "あなた"],
            correct: ["わたし", "は", "がくせい", "です"] 
        },
        { 
            question: "Anh Santos không phải là giáo viên.", 
            parts: ["は", "せんせい", "じゃ", "ありません", "ですか", "です", "サントスさん", "いしゃ"],
            correct: ["サントスさん", "は", "せんせい", "じゃ", "ありません"]
        }
    ],
    '2': [
        { 
            question: "Cái này là quyển sách.", 
            parts: ["これ", "は", "本", "です"],
            correct: ["これ", "は", "本", "です"]
        },
        { 
            question: "Đó là cái gì?", 
            parts: ["それ", "は", "何", "ですか"],
            correct: ["それ", "は", "何", "ですか"]
        }
    ]
};

/* --- DỮ LIỆU BÀI TẬP NGHE HIỂU --- */
const exerciseListeningData = {
    '1': [
        {
            title: "Kaiwa 1: はじめまして。", // Tiêu đề bài
            audio: 'Sound/01_Track_1.mp3',      // File nghe 
            questions: [
                { q: "Người đang được giới thiệu là ai?", opts: ["やまだ", "ミラー", "さとう"], ans: 1 },
                { q: "Người đó đến từ nước nào?", opts: ["ドイツ", "イギリス", "アメリカ"], ans: 2 }
            ]
        },
        {
            title: "Mondai 1", 
            audio: 'Sound/02_Track_2.mp3',     
            questions: [
                { q: "Câu hỏi thứ 1 là gì?", opts: ["あなたは サントスさんですか。", "あなたは サントンさんですか。", "あなたは ザントズさんですか。"], ans: 0 },
                { q: "Câu hỏi thứ 2 là gì?", opts: ["どなたですか。", "あのひとは。", "おなまえは。"], ans: 2 },
                { q: "Câu hỏi thứ 3 là gì?", opts: ["なんですか。", "なんさいですか。", "おいくつですか。"], ans: 1 },
                { q: "Câu hỏi thứ 4 là gì?", opts: ["インドじんですか。", "ブラジルじんですか。", "アメリカじんですか。"], ans: 2 },
                { q: "Câu hỏi thứ 5 là gì?", opts: ["かいしゃいんですか。", "しゃいんですか。", "ぎんこういんですか。"], ans: 0 },
            ]
        },
        {
            title: "Mondai 2", 
            audio: 'Sound/03_Track_3.mp3',     
            questions: [
                { q: "Ai đang được giới thiệu ở câu 1?", opts: ["サントス", "シュミット", "ミラー"], ans: 1 },
                { q: "Câu hỏi thứ 2, Wang bao nhiêu tuổi?", opts: ["28", "29", "21"], ans: 1 },
            ]
        },
        {
            title: "Mondai 3", 
            audio: 'Sound/04_Track_4.mp3',     
            questions: [
                { q: "Câu thứ 1 đúng hay sai?", opts: ["ちがいます。", "ただしい"], ans: 1 },
                { q: "Câu thứ 2 đúng hay sai?", opts: ["ちがいます。", "ただしい"], ans: 0 },
                { q: "Câu thứ 3 đúng hay sai?", opts: ["ちがいます。", "ただしい"], ans: 1 },
            ]
        }
    ],
    '2': [
        {
            title: "Kaiwa 2: これから あせわに なります。", // Tiêu đề bài con
            audio: 'Sound/05_Track_5.mp3',      // File nghe 2 (Khác file trên)
            questions: [
                { q: "Số phòng của Santos là bao nhiêu?", opts: ["408", "407", "409"], ans: 0 },
                { q: "Santos đã tặng món quà gì ?", opts: ["クッキ", "おちゃ", "コーヒー"], ans: 2 }
            ]
        }
    ]
};

const extraData = {
    'school': [
        {k:'机', r:'つくえ', m:'Cái bàn'},
        {k:'椅子', r:'いす', m:'Cái ghế'},
        {k:'扇風機', r:'せんぷうき', m:'Quạt máy'},
        {k:'水ボトル', r:'みずボトル', m:'Quạt máy'},
        {k:'携帯電話', r:'けいたいでんわ', m:'Điện thoại di động'},
        {k:'時計', r:'とけい', m:'Đồng hồ'},
        {k:'廊下', r:'ろうか', m:'Hành lang'},
        {k:'階段', r:'かいだん', m:'Cầu thang'},
        {k:'鞄', r:'かばん', m:'Cái cặp'},
        {k:'ペン', r:'ペン', m:'Bút (nói chung)'},
        {k:'鉛筆', r:'えんぴつ', m:'Bút chì'},
        {k:'消しゴム', r:'けしゴム', m:'Cục tẩy'},
        {k:'ボールペン', r:'ボールペン', m:'Bút bi'},
        {k:'シャープペンシル', r:'シャープペンシル', m:'Bút chì kim'},
        {k:'ホワイトボード', r:'ホワイトボード', m:'Tấm bảng trắng'},
        {k:'マーカー', r:'マーカー', m:'Bút lông'},
        {k:'ドア', r:'ドア', m:'Cửa'},
        {k:'エレベーター', r:'エレベーター', m:'Thang máy'},
        {k:'辞書', r:'じしょ', m:'Từ điển'},
        {k:'ノート', r:'ノート', m:'Cuốn tập'},
        {k:'シーディープレーヤー', r:'シーディープレーヤー', m:'Máy CD'},
        {k:'スクリーン', r:'スクリーン', m:'Màn chiếu'},
        {k:'プロジェクター', r:'プロジェクター', m:'Máy chiếu'},
        {k:'エアコン', r:'エアコン', m:'Máy lạnh'},
        {k:'延長コード', r:'えんちょうコード', m:'Ổ cắm điện'},
        {k:'黒板消し', r:'こくばんけし', m:'Cục xóa bảng'},
        {k:'ブラインド', r:'ブラインド', m:'Rèm cuốn'},
        {k:'窓口', r:'まど', m:'Cửa sổ'},
        {k:'黒板', r:'こくばん', m:'Bảng đen'},
        {k:'教室', r:'きょうしつ', m:'Lớp học'},
        {k:'食堂', r:'しょくどう', m:'Nhà ăn'},
        {k:'事務所', r:'じむしょ', m:'Văn phòng'},
        {k:'会議室', r:'かいぎしつ', m:'Phòng họp'},
        {k:'受付', r:'うけつけ', m:'Quầy lễ tân'},
        {k:'自動販売機', r:'じどうはんばいき', m:'Máy bán hàng tự động'},
    ],
    'toilet': [
        {k:'お手洗い', r:'おてあらい', m:'Nhà vệ sinh (Lịch sự)'},
        {k:'トイレ', r:'トイレ', m:'Nhà vệ sinh'},
        {k:'洗面台', r:'せんめんだい', m:'Bồn rửa mặt'},
        {k:'ほうき', r:'ほうき', m:'Cây chổi'},
        {k:'塵取り', r:'ちりとり', m:'Đồ hốt rác'},
        {k:'ごみぷくろ', r:'ごみぷくろ', m:'Bọc đựng rác'},
        {k:'ごみ箱', r:'ごみばこ', m:'Thùng rác'},
        {k:'雑巾', r:'ぞうきん', m:'Giẻ lau'},
        {k:'鏡', r:'かがみ', m:'Gương'},
        {k:'石鹸', r:'せっけん', m:'Xà phòng'},
        {k:'洗剤', r:'せんざい', m:'Chất tẩy rửa'},
        {k:'芳香剤', r:'ほうこうざい', m:'Sáp thơm'},
        {k:'ハンドソープ', r:'ハンドソープ', m:'Nước rửa tay'},
        {k:'ブラシ', r:'ブラシ', m:'Bàn chải chà sàn'},
        {k:'モップ', r:'モップ', m:'Cây lau nhà'},
        {k:'バケツ', r:'バケツ', m:'Cái xô'},
        {k:'スリッパ', r:'スリッパ', m:'Dép đi trong nhà'},
        {k:'マット', r:'マット', m:'Thảm chùi chân'},
        {k:'トング', r:'トング', m:'Cái kẹp gắp'},
        {k:'トイレットペーパー', r:'トイレットペーパー', m:'Giấy vệ sinh'},
        {k:'シャワー', r:'シャワー', m:'Vòi hoa sen'},
        {k:'お風呂', r:'おふろ', m:'Bồn tắm'},
        {k:'シャンプー', r:'シャンプー', m:'Dầu gội'},
        {k:'タオル', r:'タオル', m:'Khăn tắm'},
        {k:'便器', r:'べんき', m:'Bồn cầu'},
        {k:'便座', r:'べんざ', m:'Bệ ngồi bồn cầu'},
        {k:'タンク', r:'タンク', m:'Bình chứa nước'},
        {k:'石鹸置き', r:'せっけんおき', m:'Khay đựng xà phòng'},
        {k:'ペーパーホルダー', r:'ペーパーホルダー', m:'Giá đựng giấy'},
    ],
    'time': [
        {k:'今', r:'いま', m:'Bây giờ'},
        {k:'～時', r:'～じ', m:'～ Giờ'},
        {k:'一時', r:'いちじ', m:'1 Giờ'},
        {k:'二時', r:'にじ', m:'2 Giờ'},
        {k:'三時', r:'さんじ', m:'3 Giờ'},
        {k:'四時', r:'よじ', m:'4 Giờ'},
        {k:'五時', r:'ごじ', m:'5 Giờ'},
        {k:'六時', r:'ろくじ', m:'6 Giờ'},
        {k:'七時', r:'しちじ', m:'7 Giờ'},
        {k:'八時', r:'はちじ', m:'8 Giờ'},
        {k:'九時', r:'くじ', m:'9 Giờ'},
        {k:'十時', r:'じゅうじ', m:'10 Giờ'},
        {k:'十一時', r:'じゅういちじ', m:'11 Giờ'},
        {k:'十二時', r:'じゅうにじ', m:'12 Giờ'},
        {k:'～分', r:'～ふん', m:'～ Phút'},
        {k:'一分', r:'いっぷん', m:'1 Phút'},
        {k:'五分', r:'ごふん', m:'5 Phút'},
        {k:'十分', r:'じゅっぷん', m:'10 phút'},
        {k:'半', r:'はん', m:'Rưỡi (30 phút)'},
        {k:'午前', r:'ごぜん', m:'Buổi sáng (AM)'},
        {k:'午後', r:'ごご', m:'Buổi chiều (PM)'},
        {k:'朝', r:'あさ', m:'Sáng'},
        {k:'昼', r:'ひる', m:'Trưa'},
        {k:'晩', r:'ばん', m:'Tối'},
        {k:'昨日', r:'きのう', m:'Hôm qua'},
        {k:'今日', r:'きょう', m:'Hôm nay'},
        {k:'明日', r:'あした', m:'Ngày mai'},
        {k:'何時', r:'なんじ', m:'Mấy giờ'}
    ],
    'week': [
        {k:'月曜日', r:'げつようび', m:'Thứ 2'},
        {k:'火曜日', r:'かようび', m:'Thứ 3'},
        {k:'水曜日', r:'すいようび', m:'Thứ 4'},
        {k:'木曜日', r:'もくようび', m:'Thứ 5'},
        {k:'金曜日', r:'きんようび', m:'Thứ 6'},
        {k:'土曜日', r:'どようび', m:'Thứ 7'},
        {k:'日曜日', r:'にちようび', m:'Chủ nhật'},
        {k:'何曜日', r:'なんようび', m:'Thứ mấy'}
    ],
    'number': [ // Nhóm Số đếm
        {k:'零', r:'ゼロ', m:'Số 0'},
        {k:'一', r:'いち', m:'Số 1'},
        {k:'二', r:'に', m:'Số 2'},
        {k:'三', r:'さん', m:'Số 3'},
        {k:'四', r:'よん', m:'Số 4'},
        {k:'五', r:'ご', m:'Số 5'},
        {k:'六', r:'ろく', m:'Số 6'},
        {k:'七', r:'なな', m:'Số 7'},
        {k:'八', r:'はち', m:'Số 8'},
        {k:'九', r:'きゅう', m:'Số 9'},
        {k:'十', r:'じゅう', m:'Số 10'},
        {k:'百', r:'ひゃく', m:'Số 100 (Trăm)'},
        {k:'千', r:'せん', m:'Số 1000 (Nghìn)'},
        {k:'一万', r:'いちまん', m:'Số 10.000 (Vạn)'}
    ],

    'age': [ // Nhóm Tuổi tác
        {k:'一歳', r:'いっさい', m:'1 tuổi'},
        {k:'八歳', r:'はっさい', m:'8 tuổi'},
        {k:'十歳', r:'じゅっさい', m:'10 tuổi'},
        {k:'二十歳', r:'はたち', m:'20 tuổi (Đặc biệt)'},
        {k:'何歳', r:'なんさい', m:'Mấy tuổi?'},
        {k:'おいくつ', r:'おいくつ', m:'Bao nhiêu tuổi (Lịch sự)'}
    ]
};

// --- 1.7 Dữ liệu Hội thoại  ---

const kaiwaData = {
    '1': [ // Bài 1 là một Mảng gồm nhiều hội thoại
        {
            name: 'Kaiwa', // Tên nút hiển thị
            title: '初めまして (Rất hân hạnh)',
            img: 'Image/Kaiwa_B1_Main.png',
            audio: 'Sound/01_Track_1.mp3',
            dialogue: [
                { role: 'A', name: '佐藤 (Satou)', text: 'おはよう ございます。', mean: 'Chào buổi sáng.', icon: 'Image/Av_Girl_BlackHair.png', side: 'left', gender: 'female' },
                { role: 'B', name: '山田 (Yamada)', text: 'おはよう ございます。\nさとう(佐藤)さん、こちらは ミラーさんです。', mean: 'Chào buổi sáng. Chị Satou, đây là anh Miller.', icon: 'Image/Av_Boy_BlackHair.png', side: 'left', gender: 'male'  },
                { role: 'C', name: 'ミラー (Miller)', text: 'はじ(初)めまして。マイク ミラーです。\nアメリカから き(来)ました。\nどうぞ よろしく。', mean: 'Rất hân hạnh. Tôi là Mike Miller. Tôi đến từ Mỹ. Rất mong được giúp đỡ.', icon: 'Image/Av_Boy_YellowHair.png', side: 'right' , gender: 'male' },
                { role: 'A', name: '佐藤 (Satou)', text: 'さとう(佐藤)けいこです。\nどうぞ よろしく。', mean: 'Tôi là Satou Keiko. Rất mong được giúp đỡ.', icon: 'Image/Av_Girl_BlackHair.png', side: 'left', gender: 'female'  }
            ]
        },
        {
            name: 'Renshyuu C-1', // Hội thoại phụ
            title: 'Hỏi đáp',
            img: 'Image/Kaiwa_B1_C1.png',
            audio: '', // Không có audio
            dialogue: [
                { role: 'A', name: 'A', text: 'はじ(初)めまして。マイク ミラーです。\nアメリカから き(来)ました。どうぞ よろしく。', mean: 'Hân hạnh được gặp. Tôi là Mike Miller. Tôi đến từ Mỹ. Rất mong được giúp đỡ.', icon: 'Image/Av_Boy_YellowHair.png',side: 'left' , gender: 'male' },
                { role: 'B', name: 'B', text: 'さとう(佐藤)です。\nどうぞ よろしく。', mean: 'Tôi là Satou Keiko. Rất mong được giúp đỡ.', icon: 'Image/Av_Girl_BlackHair.png', side: 'right', gender: 'female'  }
            ]
        },
        {
            name: 'Renshyuu C-2', // Hội thoại phụ
            title: 'Hỏi đáp',
            img: 'Image/Kaiwa_B1_C2.png',
            audio: '', // Không có audio
            dialogue: [
                { role: 'A', name: 'A', text: '失礼ですが、お名前は？', mean: 'Xin lỗi, tên anh/chị là gì?', icon: 'Image/Av_Boy_BlackHair.png',side: 'left' , gender: 'male' },
                { role: 'B', name: 'B', text: 'イーです。', mean: 'Tôi là Y.', icon: 'Image/Av_Girl_BrownHair.png',side: 'right', gender: 'female'  },
                { role: 'A', name: 'A', text: 'リーさんですか。', mean: 'Bạn Lee phải không?', icon: 'Image/Av_Boy_BlackHair.png', side: 'left' , gender: 'male' },
                { role: 'B', name: 'B', text: 'いいえ、イーです。', mean: 'Không, là Y.', icon: 'Image/Av_Girl_BrownHair.png', side: 'right', gender: 'female'  }
            ]
        },
        {
            name: 'Renshyuu C-3', // Hội thoại phụ
            title: 'Hỏi đáp',
            img: 'Image/Kaiwa_B1_C3.png',
            audio: '', // Không có audio
            dialogue: [
                { role: 'A', name: 'A', text: 'たなか(田中)さん、おはよう ございます。', mean: 'Anh Tanaka, chào buổi sáng.', icon: 'Image/Av_Boy_BlackHair.png',side: 'left' , gender: 'male' },
                { role: 'B', name: 'B', text: 'おはよう ございます。', mean: 'Chào buổi sáng.', icon: 'Image/Av_Boy_BlackHair2.png',side: 'left', gender: 'male'  },
                { role: 'A', name: 'A', text: 'こちらは ミラーさんです。', mean: 'Đây là anh Miller.', icon: 'Image/Av_Boy_BlackHair.png', side: 'left' , gender: 'male' },
                { role: 'C', name: 'C', text: 'はじ(初)めまして。マイク ミラーです。\nIMCの しゃいん(社員)です。\nどうぞ よろしく おねが(願)いします。', mean: 'Hân hạnh được gặp. Tôi là Miller. Nhân viên của công ty IMC. Rất mong nhân được sự giúp đỡ.', icon: 'Image/Av_Boy_YellowHair.png', side: 'right' , gender: 'male' },
                { role: 'B', name: 'B', text: 'たなか(田中)です。よろしく おねが(願)いします。', mean: 'Tôi là Tanaka. Mong dược giúp đỡ.', icon: 'Image/Av_Boy_BlackHair2.png', side: 'left', gender: 'male'  }
            ]
        }
    ],
    '2': [
        {
            name: 'Kaiwa',
            title: 'ほんの気持ちです (Chút lòng thành)',
            img: 'Image/Kaiwa_B2_Main.png',
            audio: 'Sound/05_Track_5.mp3',
            dialogue: [
                { role: 'B', name: 'サントス (Santos)', text: '。。。', mean: '(Nhấn chuông)', icon: 'Image/Av_Boy_BlackHair.png', side: 'right', gender: 'male' },
                { role: 'A', name: '山田 (Yamada)', text: 'はい。どなたですか。', mean: 'Vâng. Ai đấy ạ?', icon: 'Image/Av_Boy_BlueHair.png',side: 'left', gender: 'male' },
                { role: 'B', name: 'サントス (Santos)', text: '４０８の サントスです。', mean: 'Tôi là Santos ở phòng 408.', icon: 'Image/Av_Boy_BlackHair.png', side: 'right', gender: 'male' },
                { role: 'A', name: '山田 (Yamada)', text: '。。。', mean: '(Mở cửa)', icon: 'Image/Av_Boy_BlueHair.png',side: 'left', gender: 'male' },
                { role: 'B', name: 'サントス (Santos)', text: 'こんにちは。サントスさん。\nこれから お世話に なります。\nどうぞ よろしく お願いします。', mean: 'Chào anh Santos. Từ nay mong anh giúp đỡ. Rất mong được làm quen.', icon: 'Image/Av_Boy_BlackHair.png', side: 'right', gender: 'male' },
                { role: 'A', name: '山田 (Yamada)', text: 'こちらこそ よろしく おねが(願)いします。', mean: 'Chính tôi mới cần anh giúp đỡ.', icon: 'Image/Av_Boy_BlueHair.png', side: 'left', gender: 'male' },
                { role: 'B', name: 'サントス (Santos)', text: 'あのう、これ、コーヒーです。どうぞ。', mean: 'À, cái này... Là cà phê ạ. Xin mời.', icon: 'Image/Av_Boy_BlackHair.png', side: 'right', gender: 'male' },
                { role: 'A', name: '山田 (Yamada)', text: 'どうも ありがとうございます。', mean: 'Cảm ơn anh rất nhiều.', icon: 'Image/Av_Boy_BlueHair.png', side: 'left', gender: 'male' }
            ]
        }
    ]
};
/* =========================================
   2. TRẠNG THÁI & LOGIC ĐIỀU HƯỚNG
   ========================================= */

let currentSystem = 'hiragana';
let currentKanjiTab = 'radicals';

// Hàm mở Section duy nhất (Quản lý toàn bộ Logic hiển thị)
function openSection(id) {
    const mainMenu = document.getElementById('mainMenu');
    const heroSection = document.getElementById('heroSection');
    if (mainMenu) mainMenu.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    
    document.querySelectorAll('.section-content').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    }
    if (id === 'kanaSection') {
        currentSystem = 'hiragana';
        const container = document.getElementById('gridContainer');
        if (container) container.innerHTML = ''; 
        renderGrid('hiragana');
        resetTabs('#kanaSection', 0);
    }
    else if (id === 'vocabSection') {
        const sel = document.getElementById('lessonSelect');
        if(sel) sel.value = "1";
        renderVocabList("1");
    }
    else if (id === 'kanjiSection') {
        renderKanjiGrid(currentKanjiTab || 'radicals');
        const tabs = document.querySelectorAll('#kanjiSection .tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick').includes(currentKanjiTab));
        if (activeBtn) activeBtn.classList.add('active');
    }
    else if (id === 'gameSection') {
        switchGameTab('flashcard', { target: document.querySelector('#gameSection .tab-btn') });
    }
    else if (id === 'grammarSection') {
        renderGrammar('1');
        const tabs = document.querySelectorAll('#grammarSection .tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        if(tabs[0]) tabs[0].classList.add('active');
    }
    else if (id === 'exerciseSection') {
        switchExerciseTab('1');
    }
    if (id === 'kaiwaSection') {
        switchKaiwaTab('1'); 
    }
}

function closeSection() {
    document.querySelectorAll('.section-content').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    document.getElementById('mainMenu').style.display = 'grid';
    document.getElementById('heroSection').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetTabs(selector, index) {
    const tabs = document.querySelectorAll(selector + ' .tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if(tabs[index]) tabs[index].classList.add('active');
}

/* =========================================
   3. LOGIC KANA (BẢNG CHỮ CÁI)
   ========================================= */
function switchTab(system, event) {
    currentSystem = system;
    document.querySelectorAll('#kanaSection .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderGrid(system);
}

function renderGrid(system) {
    const container = document.getElementById('gridContainer');
    container.innerHTML = ''; 
    createSection(container, 'Âm Cơ Bản', basicRows, 'grid-5', system);
    createSection(container, 'Biến Âm', dakutenRows, 'grid-5', system);
    createSection(container, 'Ảo Âm', yoonRows, 'grid-3', system);
}

function createSection(container, titleText, dataRows, gridClass, system) {
    const title = document.createElement('div');
    title.className = 'kana-section-title';
    title.innerText = titleText;
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = gridClass;

    dataRows.forEach(row => {
        row.forEach(romaji => {
            const box = document.createElement('div');
            box.className = 'kana-box';
            if (!romaji) {
                box.classList.add('empty');
            } else {
                const char = charMaps[system][romaji];
                const display = romaji.replace('_d', '');
                box.innerHTML = `<div class="kana-char">${char}</div><div class="kana-romaji">${display}</div>`;
                box.onclick = () => openModal(char, romaji);
            }
            grid.appendChild(box);
        });
    });
    container.appendChild(grid);
}

/* =========================================
   4. LOGIC TỪ VỰNG (VOCAB)
   ========================================= */
function changeLesson() {
    const id = document.getElementById('lessonSelect').value;
    renderVocabList(id);
}

function renderVocabList(id) {
    const container = document.getElementById('vocabListContainer');
    container.innerHTML = '';
    const list = minnaData[id] || extraData[id];
    if (list && list.length > 0) {
        list.forEach(word => {
            // Xử lý hiển thị Kanji (nếu giống Hiragana thì hiện gạch ngang)
            const kanjiDisplay = word.k === word.r ? '<span class="no-kanji">-</span>' : word.k;
            
            const row = document.createElement('div');
            row.className = 'vocab-row';
            
            row.innerHTML = `
                <div class="cell-kanji">${kanjiDisplay}</div>
                <div class="cell-reading">${word.r}</div>
                <div class="cell-mean">${word.m}</div>
                <div class="cell-audio">
                    <button class="btn-vocab-speak" onclick="speak('${word.r}')" title="Nghe phát âm">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            `;
            container.appendChild(row);
        });
    } else {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#999">Chưa có dữ liệu cho mục này.</div>';
    }
}

/* =========================================
   5. LOGIC HÁN TỰ (KANJI)
   ========================================= */
function switchKanjiTab(tab, event) {
    currentKanjiTab = tab;
    document.querySelectorAll('#kanjiSection .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderKanjiGrid(tab);
}

function renderKanjiGrid(type) {
    const container = document.getElementById('kanjiListContainer');
    container.innerHTML = '';
    const data = (type === 'n5') ? n5KanjiData : radicalsData;

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'kanji-card';
        card.innerHTML = `<div class="k-hanviet">${item.h}</div><div class="k-char">${item.c}</div><div class="k-mean">${item.m}</div>`;
        card.onclick = () => openKanjiModal(item, type);
        container.appendChild(card);
    });
}

function openKanjiModal(item, type) {
    const modal = document.getElementById('charModal');
    const audioBtn = document.querySelector('.btn-audio-large');
    const readingsBox = document.getElementById('kanjiReadings');

    document.getElementById('modalChar').innerText = item.c;
    document.getElementById('modalRomaji').innerText = item.h;

    if (type === 'n5') {
        readingsBox.style.display = 'block';
        document.getElementById('modalOnyomi').innerText = item.on || '-';
        document.getElementById('modalKunyomi').innerText = item.kun || '-';
        if(audioBtn) {
            audioBtn.style.display = 'inline-block';
            audioBtn.onclick = function() {
                speak(item.c); 
            };
        }
        speak(item.c);
    } else {
        readingsBox.style.display = 'none';
        if(audioBtn) audioBtn.style.display = 'none';
    }

    // Ảnh Stroke Order
    const hex = ('00000' + item.c.charCodeAt(0).toString(16)).slice(-5);
    document.getElementById('strokeImage').src = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
    document.querySelector('.stroke-order-container').style.display = 'block';

    document.getElementById('modalExamples').innerHTML = `<li style="padding:15px">Nghĩa: <strong>${item.m}</strong></li>`;
    modal.classList.add('show');
}

/* =========================================
   6. MODAL & HELPER (CHUNG)
   ========================================= */
function openModal(char, romaji) {
    const modal = document.getElementById('charModal');
    const audioBtn = document.querySelector('.btn-audio-large');
    if(audioBtn) {
        audioBtn.style.display = 'inline-block';
        audioBtn.onclick = function() {
            speak(char);
        };
    }
    document.getElementById('modalChar').innerText = char;
    document.getElementById('modalRomaji').innerText = romaji.replace('_d', '');
    document.querySelector('.stroke-order-container').style.display = 'none';
    const readingsBox = document.getElementById('kanjiReadings');
    if(readingsBox) readingsBox.style.display = 'none';

    // Data từ vựng gợi ý
    const listEl = document.getElementById('modalExamples');
    listEl.innerHTML = '';
    let wordInfo = (currentSystem === 'hiragana') ? hiraganaVocab[romaji] : katakanaVocab[romaji];

    if(wordInfo) {
        const color = currentSystem === 'hiragana' ? '#ff9a9e' : '#a18cd1';
        listEl.innerHTML = `<li style="padding:15px; border-left:5px solid ${color}"><div style="font-size:1.4rem;color:${color};font-weight:bold">${wordInfo.j}</div><div>${wordInfo.v}</div></li>`;
    } else {
        listEl.innerHTML = '<li style="padding:15px;text-align:center;color:#999">Chưa có từ vựng gợi ý.</li>';
    }

    modal.classList.add('show');
    speak(char);
}

function closeModal() {
    document.getElementById('charModal').classList.remove('show');
    window.speechSynthesis.cancel();
}
window.onclick = function(e) {
    if(e.target === document.getElementById('charModal')) closeModal();
}

/* --- THAY THẾ HÀM speak CŨ BẰNG HÀM NÀY --- */

let voices = [];
// Load danh sách giọng khi trình duyệt sẵn sàng
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
    };
}

function speak(text, gender = 'female') {
    if (!('speechSynthesis' in window)) return;

    // --- CẬP NHẬT MỚI: Xóa nội dung trong ngoặc đơn (...) ---
    // /\(.*?\)/g : Tìm tất cả ký tự nằm giữa ( và )
    // .replace(..., '') : Thay thế chúng bằng chuỗi rỗng
    // .trim() : Xóa khoảng trắng thừa ở đầu/cuối câu sau khi cắt
    const cleanText = text.replace(/\(.*?\)/g, '').trim();

    // Nếu sau khi xóa mà không còn từ nào thì dừng lại, không đọc
    if (!cleanText) return;

    window.speechSynthesis.cancel(); // Dừng câu đang nói dở
    
    // Khởi tạo giọng nói với văn bản đã được làm sạch
    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'ja-JP';
    
    // Cập nhật lại danh sách giọng nếu chưa có
    if (voices.length === 0) {
        voices = window.speechSynthesis.getVoices();
    }

    // Lọc ra các giọng tiếng Nhật
    const jaVoices = voices.filter(v => v.lang.includes('ja'));

    if (jaVoices.length > 0) {
        // Mặc định chọn giọng đầu tiên tìm thấy
        let selectedVoice = jaVoices[0];

        // LOGIC CHỌN GIỌNG (Heuristic)
        if (gender === 'male') {
            // Cố tìm giọng có tên "Ichiro", "Kenji", "Male"...
            const maleVoice = jaVoices.find(v => 
                v.name.includes('Ichiro') || 
                v.name.includes('Kenji') || 
                v.name.includes('Male') ||
                v.name.includes('Otoya')
            );
            if (maleVoice) selectedVoice = maleVoice;
            
            // Tinh chỉnh âm thanh cho Nam (Trầm hơn)
            u.pitch = 0.8; 
            u.rate = 0.9;  // Nói chậm hơn chút cho giống đàn ông
        } else {
            // Cố tìm giọng có tên "Ayumi", "Haruka", "Kyoko", "Female"...
            const femaleVoice = jaVoices.find(v => 
                v.name.includes('Ayumi') || 
                v.name.includes('Haruka') || 
                v.name.includes('Kyoko') ||
                v.name.includes('Female')
            );
            if (femaleVoice) selectedVoice = femaleVoice;

            // Tinh chỉnh âm thanh cho Nữ (Thanh hơn)
            u.pitch = 1.1; 
            u.rate = 1.0;
        }

        u.voice = selectedVoice;
    }

    window.speechSynthesis.speak(u);
}

/* =========================================
   7. GAME ENGINE
   ========================================= */
/* --- Thay thế hàm getGameData cũ bằng hàm này --- */
function getGameData(key) {
    let rawData = [];
    
    // 1. Minna & Saiba
    if (key.startsWith('minna_') || key.startsWith('extra_')) {
        let list = [];
        if (key.startsWith('minna_')) list = minnaData[key.split('_')[1]];
        if (key.startsWith('extra_')) list = extraData[key.split('_')[1]];
        
        if (list) {
            return list.map(i => ({ 
                front: (i.k===i.r?i.r:`${i.r}\n(${i.k})`), // Ưu tiên Kana to
                back: i.m, read: i.r, type:'vocab' 
            }));
        }
    }
    
    // 2. Kanji N5
    if (key === 'n5_kanji') {
        return n5KanjiData.map(i => ({ front: i.c, back: `${i.h} - ${i.m}`, read: i.kun!=='-'?i.kun:i.on, type:'kanji' }));
    }

    // 3. KANA & MIX (Logic mới)
    // Kiểm tra các từ khóa
    const isHira = key.includes('hira');
    const isKata = key.includes('kata');
    const isMix  = key.includes('mix'); // Mới

    if (isHira || isKata || isMix) {
        let rows = [];
        
        // Logic chọn hàng dữ liệu
        if (key.includes('basic')) rows = basicRows;
        else if (key.includes('daku')) rows = dakutenRows;
        else if (key.includes('yoon')) rows = yoonRows;
        else if (key.includes('full')) rows = [...basicRows, ...dakutenRows, ...yoonRows];
        
        // Hàm Helper để push dữ liệu
        const addData = (system, rowList) => {
            const map = charMaps[system];
            rowList.forEach(r => {
                r.forEach(romaji => {
                    if(romaji) {
                        rawData.push({ 
                            front: map[romaji], 
                            back: romaji.replace('_d',''), 
                            read: map[romaji], 
                            type: 'kana' 
                        });
                    }
                });
            });
        };

        // Thực thi dựa trên loại bảng
        if (isHira) addData('hiragana', rows);
        if (isKata) addData('katakana', rows);
        if (isMix) {
            // Nếu là Mix thì mặc định lấy Full (hoặc tùy biến nếu muốn)
            // Ở đây ta giả định Mix là lấy Full cả 2 bảng
            const fullRows = [...basicRows, ...dakutenRows, ...yoonRows];
            addData('hiragana', fullRows);
            addData('katakana', fullRows);
        }

        return rawData;
    }
    return [];
}

// --- Flashcard Logic ---
let fcList = [], fcIndex = 0, isFlipped = false;
function switchGameTab(tab, event) {
    document.getElementById('gameFlashcardArea').style.display = (tab === 'flashcard') ? 'block' : 'none';
    document.getElementById('gameQuizArea').style.display = (tab === 'quiz') ? 'block' : 'none';
    document.querySelectorAll('#gameSection .tab-btn').forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');
    if(tab === 'flashcard') initFlashcards();
}

function initFlashcards() {
    const key = document.getElementById('flashcardDeck').value;
    let raw = getGameData(key);
    fcList = raw.sort(() => 0.5 - Math.random()); // Shuffle
    fcIndex = 0;
    renderCard();
}

function renderCard() {
    if(fcList.length === 0) return;
    const item = fcList[fcIndex];
    const card = document.querySelector('.flashcard');
    card.classList.remove('flipped');
    isFlipped = false;

    setTimeout(() => {
        const parts = item.front.split('\n');
        document.getElementById('fcFrontMain').innerText = parts[0];
        document.getElementById('fcFrontSub').innerText = parts[1] || '';
        document.getElementById('fcBackMean').innerText = item.back;
        document.getElementById('fcCounter').innerText = `${fcIndex+1} / ${fcList.length}`;
    }, 200);
}

function flipCard() {
    const card = document.querySelector('.flashcard');
    card.classList.toggle('flipped');
    isFlipped = !isFlipped;
}
function nextCard() { if(fcIndex < fcList.length-1) { fcIndex++; renderCard(); } }
function prevCard() { if(fcIndex > 0) { fcIndex--; renderCard(); } }
function playFlashcardAudio(e) { e.stopPropagation(); speak(fcList[fcIndex].read); }


// --- Quiz Logic ---
let quizList = [], quizIdx = 0, quizScore = 0, quizTimer;
let quizConfig = {time:10, count:10, opts:4};
let quizHistory = [];

function startQuiz() {
    const topic = document.getElementById('quizTopic').value;
    quizConfig.count = parseInt(document.getElementById('quizCount').value);
    quizConfig.time = parseInt(document.getElementById('quizTime').value);
    quizConfig.opts = parseInt(document.getElementById('quizOptionsCount').value);

    const full = getGameData(topic);
    if(full.length < 4) { alert('Không đủ dữ liệu!'); return; }
    quizList = full.sort(() => 0.5 - Math.random()).slice(0, quizConfig.count);
    
    quizIdx = 0; quizScore = 0; quizHistory = [];
    document.getElementById('quizScoreLive').innerText = 0;
    document.getElementById('quizTotal').innerText = quizList.length;
    
    document.getElementById('quizSetup').style.display = 'none';
    document.getElementById('quizPlay').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    loadQuestion();
}

function loadQuestion() {
    if(quizIdx >= quizList.length) { finishQuiz(); return; }
    const q = quizList[quizIdx];
    document.getElementById('quizCurrent').innerText = quizIdx+1;
    
    // Hiển thị Kanji/Kana tách dòng
    const qEl = document.getElementById('quizQuestion');
    if(q.front.includes('\n')) {
        const p = q.front.split('\n');
        qEl.innerHTML = `<div style="font-size:3rem;line-height:1.1">${p[0]}</div><div style="font-size:1.5rem;color:var(--primary);margin-top:5px">${p[1]}</div>`;
    } else {
        qEl.innerText = q.front;
    }

    // Tạo đáp án
    const grid = document.getElementById('quizOptions');
    grid.innerHTML = '';
    let opts = [q];
    const full = getGameData(document.getElementById('quizTopic').value);
    while(opts.length < quizConfig.opts) {
        const rand = full[Math.floor(Math.random()*full.length)];
        if(!opts.includes(rand) && rand.front !== q.front) opts.push(rand);
    }
    opts.sort(() => 0.5 - Math.random());

    opts.forEach(o => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.innerText = o.back;
        btn.onclick = () => checkAnswer(o, q, btn);
        grid.appendChild(btn);
    });

    runTimer();
}

function runTimer() {
    const bar = document.getElementById('timerBar');
    bar.style.transition = 'none'; bar.style.width = '100%';
    void bar.offsetWidth; // Force reflow
    bar.style.transition = `width ${quizConfig.time}s linear`;
    bar.style.width = '0%';
    
    clearInterval(quizTimer);
    quizTimer = setTimeout(() => recordResult(null, false), quizConfig.time * 1000);
}

function checkAnswer(sel, cor, btn) {
    clearInterval(quizTimer);
    const isRight = (sel.front === cor.front);
    if(isRight) {
        btn.classList.add('correct'); quizScore += 10; speak('ピンポン');
    } else {
        btn.classList.add('wrong'); speak('ブブー');
        document.querySelectorAll('.quiz-option').forEach(b => {
            if(b.innerText === cor.back) b.classList.add('correct');
        });
    }
    document.querySelectorAll('.quiz-option').forEach(b => b.onclick = null);
    document.getElementById('quizScoreLive').innerText = quizScore;
    setTimeout(() => recordResult(sel, isRight), 1500);
}

function recordResult(sel, isRight) {
    const q = quizList[quizIdx];
    quizHistory.push({
        q: q.front.split('\n')[0],
        correct: q.back,
        user: sel ? sel.back : (sel === null ? 'Hết giờ' : 'Chưa làm'),
        isRight: isRight
    });
    quizIdx++;
    loadQuestion();
}

function endQuizEarly() {
    if(!confirm('Nộp bài ngay?')) return;
    clearInterval(quizTimer);
    for(let i=quizIdx; i<quizList.length; i++) {
        const q = quizList[i];
        quizHistory.push({q:q.front.split('\n')[0], correct:q.back, user:'Chưa làm', isRight:false});
    }
    finishQuiz();
}

function finishQuiz() {
    document.getElementById('quizPlay').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('finalScore').innerText = `${quizScore}đ`;
    
    const list = document.getElementById('resultDetailsList');
    list.innerHTML = '';
    quizHistory.forEach((h,i) => {
        let cls = 'r-wrong';
        if(h.isRight) cls = 'r-correct';
        if(h.user === 'Chưa làm') cls = 'r-skipped';
        
        const item = document.createElement('div');
        item.className = `result-item ${cls}`;
        item.innerHTML = `<div class="r-q-text">Câu ${i+1}: ${h.q}</div>
                          <div class="r-info"><span class="r-user-ans">Bạn: ${h.user}</span>
                          ${!h.isRight ? `<span class="r-right-ans">Đúng: ${h.correct}</span>` : ''}</div>`;
        list.appendChild(item);
    });
}
function resetQuizInfo() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizSetup').style.display = 'block';
}

// KHỞI TẠO MẶC ĐỊNH
window.onload = function() {
    // Không làm gì cả, chờ người dùng bấm menu
};

/* =========================================
   8. LOGIC NGỮ PHÁP (GRAMMAR)
   ========================================= */


function switchGrammarTab(lessonId, event) {
    // Đổi màu nút
    const btns = document.querySelectorAll('#grammarSection .tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    renderGrammar(lessonId);
}

function renderGrammar(lessonId) {
    const container = document.getElementById('grammarListContainer');
    container.innerHTML = ''; // Xóa cũ

    const list = grammarData[lessonId];
    if (!list) return;

    list.forEach(item => {
        // Tạo HTML cho từng ví dụ
        let examplesHTML = '';
        item.ex.forEach(e => {
            examplesHTML += `
                <div class="gp-ex-item">
                    <div class="ex-jp"><i class="fas fa-caret-right" style="color:var(--primary)"></i> ${e.j}</div>
                    <div class="ex-vn">${e.v}</div>
                </div>
            `;
        });

        // Tạo thẻ Card
        const card = document.createElement('div');
        card.className = 'grammar-card';
        card.innerHTML = `
            <div class="gp-title">${item.title}</div>
            <div class="gp-mean">${item.mean}</div>
            <div class="gp-note">${item.note}</div>
            <div class="gp-examples">
                ${examplesHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

/* =========================================
   9. LOGIC BÀI TẬP (EXERCISES)
   ========================================= */

let currentExerciseList = [];


// Hàm di chuyển từ giữa 2 hộp
function moveWord(btn) {
    const parent = btn.parentElement;
    const itemContainer = btn.closest('.scramble-item');
    const answerBox = itemContainer.querySelector('.scramble-answer-box');
    const sourceBox = itemContainer.querySelector('.scramble-source-box');

    // Nếu đang ở source -> chuyển sang answer
    if (parent === sourceBox) {
        answerBox.appendChild(btn);
    } 
    // Nếu đang ở answer -> chuyển về source
    else {
        sourceBox.appendChild(btn);
    }
    
    // Xóa trạng thái đúng/sai nếu sửa lại
    answerBox.classList.remove('correct', 'wrong');
    const feedback = itemContainer.querySelector('.scramble-feedback');
    if(feedback) feedback.innerText = "";
}

function formatText(text) {
    // Tìm đoạn văn bản dạng "abc(xyz)" và bọc "xyz" vào thẻ span màu xám
    return text.replace(/\(([^)]+)\)/g, '<span style="color:#2f14e0; font-size:0.9em; font-weight:normal">($1)</span>');
}

function renderExercises(lessonId) {
    const container = document.getElementById('exerciseContainer');
    container.innerHTML = ""; 
    document.getElementById('exerciseScore').innerHTML = ""; 

    // --- PHẦN : NGHE HIỂU (CHOUKAI) - HỖ TRỢ NHIỀU BÀI NGHE ---
    const listenDataList = (typeof exerciseListeningData !== 'undefined') ? exerciseListeningData[lessonId] : null;
    
    if (listenDataList && Array.isArray(listenDataList)) {
        let html = `<h3 class="part-title" style="margin-top:40px; border-top:2px dashed #ddd; padding-top:20px;">I. Nghe hiểu (mỗi câu đúng được 10 PTS)</h3>`;
        
        // Lặp qua từng bài nghe con (Mondai 1, Mondai 2...)
        listenDataList.forEach((listenItem, subIndex) => {
            // Tiêu đề nhỏ cho từng bài nghe
            html += `<h4 style="margin: 20px 0 10px 0; color: #a18cd1;">${listenItem.title}</h4>`;

            // Player riêng cho bài nghe này
            html += `
                <div class="audio-exercise-box">
                    <audio controls src="${listenItem.audio}" style="width:100%"></audio>
                    <p style="margin-top:10px; color:#666; font-size:0.9rem;">
                        <i class="fas fa-headphones"></i> Bấm nghe và trả lời
                    </p>
                </div>
            `;

            // Danh sách câu hỏi của bài nghe này
            listenItem.questions.forEach((qItem, qIndex) => {
                let opts = "";
                qItem.opts.forEach((opt, i) => {
                    // Tạo ID duy nhất để không bị trùng nút khi chọn
                    // Ví dụ: ex-listen-0-0-1 (Bài nghe 0, Câu 0, Đáp án 1)
                    opts += `<button class="exercise-opt-btn" onclick="selectOption(this, ${i})">${opt}</button>`;
                });

                html += `
                <div class="exercise-item">
                    <p><strong>Câu ${subIndex + 1}.${qIndex + 1}:</strong> ${qItem.q}</p>
                    <div class="exercise-options" data-correct="${qItem.ans}">
                        ${opts}
                    </div>
                </div>`;
            });
        });
        
        container.innerHTML += html;
    }
    // --- PHẦN : TRẮC NGHIỆM ĐIỀN TỪ ---
    const fillData = exercisesData[lessonId]; 
    if (fillData) {
        let html = `<h3 class="part-title">II. Chọn đáp án đúng (mỗi câu đúng được 10 PTS)</h3>`;
        fillData.forEach((item, index) => {
            let optionsHtml = '';
            item.opts.forEach((opt, i) => {
                optionsHtml += `<button class="exercise-opt-btn" onclick="selectOption(this, ${i})">${formatText(opt)}</button>`;
            });

            html += `
                <div class="exercise-item">
                    <p class="exercise-question-text" ><strong>${index + 1}.</strong> ${formatText(item.q)}</p>
                    <div class="exercise-options" id="opts-${index}" data-correct="${item.ans}">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });
        container.innerHTML += html;
        currentExerciseList = fillData; 
    }

    // --- PHẦN : SẮP XẾP CÂU  ---
    const scrambleData = exerciseScrambleData[lessonId];
    if (scrambleData) {
        let html = `<h3 class="part-title" style="margin-top:30px; border-top:1px dashed #ccc; padding-top:20px;">III. Sắp xếp thành câu hoàn chỉnh (mỗi câu đúng được 20 PTS)</h3>`;
        scrambleData.forEach((item, index) => {
            const qID = `scramble-${lessonId}-${index}`;
            let shuffled = [...item.parts].sort(() => Math.random() - 0.5);
            let buttonsHtml = shuffled.map(word => 
                `<button class="word-btn" onclick="moveWord(this)">${word}</button>`
            ).join('');

            const correctAnswerStr = JSON.stringify(item.correct).replace(/"/g, '&quot;');

            html += `
                <div class="scramble-item" id="${qID}">
                    <p class="scramble-question"><strong>${index + 1}.</strong> ${formatText(item.question)}</p>
                    <div class="scramble-answer-box" id="${qID}-ans" data-correct="${correctAnswerStr}"></div>
                    <div class="scramble-source-box" id="${qID}-src">${buttonsHtml}</div>
                    <div class="scramble-feedback" style="margin-top:5px; font-weight:bold;"></div>
                </div>
            `;
        });
        container.innerHTML += html;
    }
    
    
}

function selectOption(btn, optionIndex) {
    const parent = btn.parentElement;
    
    const allBtns = parent.querySelectorAll('.exercise-opt-btn');
    allBtns.forEach(b => {
        b.classList.remove('selected');
        b.style.background = '#ffffff'; 
        b.style.color = '#555';         
        b.style.borderColor = '#e0e0e0'; 
    });

    btn.classList.add('selected');
    
    btn.style.background = '#f3e5f5'; 
    btn.style.color = '#8e44ad';
    btn.style.borderColor = '#8e44ad';


    parent.setAttribute('data-selected', optionIndex);
}

function switchExerciseTab(lessonId, event) {
    const btn1 = document.getElementById('btn-bai-1');
    const btn2 = document.getElementById('btn-bai-2');
    
    if(btn1) btn1.className = 'tab-btn'; 
    if(btn2) btn2.className = 'tab-btn';

    if (lessonId === '1' && btn1) {
        btn1.className = 'tab-btn active';
    } else if (lessonId === '2' && btn2) {
        btn2.className = 'tab-btn active';
    }
    renderExercises(lessonId);
}

//* --- HÀM CHẤM ĐIỂM (CẬP NHẬT TÊN CLASS & FIX ĐẾM SỐ CÂU) --- */
function checkExerciseResult() {
    let score = 0;
    let total = 0;

    // 1. Chấm Trắc nghiệm (Tìm class mới: exercise-options)
    const allMultipleChoice = document.querySelectorAll('.exercise-options');
    
    // Debug để xem tìm thấy bao nhiêu câu
    console.log("Số câu trắc nghiệm tìm thấy:", allMultipleChoice.length);

    allMultipleChoice.forEach(div => {
        total++;
        const correctAns = parseInt(div.getAttribute('data-correct'));
        const selectedBtn = div.querySelector('.selected');
        
        // Tìm nút con với class mới: exercise-opt-btn
        const allBtns = div.querySelectorAll('.exercise-opt-btn');

        // Reset màu
        allBtns.forEach(b => b.classList.remove('correct', 'wrong'));
        
        // Hiện đáp án đúng
        if(allBtns[correctAns]) allBtns[correctAns].classList.add('correct');

        if (selectedBtn) {
            const userIndex = Array.from(allBtns).indexOf(selectedBtn);
            if (userIndex === correctAns) {
                score++;
            } else {
                selectedBtn.classList.add('wrong');
            }
        }
    });

    // 2. Chấm Sắp xếp câu (Giữ nguyên)
    const scrambleBoxes = document.querySelectorAll('.scramble-answer-box');
    console.log("Số câu sắp xếp tìm thấy:", scrambleBoxes.length);

    scrambleBoxes.forEach(box => {
        total++;
        const userWords = Array.from(box.querySelectorAll('.word-btn')).map(btn => btn.innerText);
        const correctWords = JSON.parse(box.getAttribute('data-correct'));
        const feedbackDiv = box.parentElement.querySelector('.scramble-feedback');

        if (JSON.stringify(userWords) === JSON.stringify(correctWords)) {
            score++;
            box.classList.add('correct');
            box.classList.remove('wrong');
            feedbackDiv.innerHTML = '<span style="color:#2ecc71"><i class="fas fa-check"></i> Chính xác!</span>';
        } else {
            box.classList.add('wrong');
            box.classList.remove('correct');
            feedbackDiv.innerHTML = '<span style="color:#e74c3c"><i class="fas fa-times"></i> Sai rồi</span>';
        }
    });

    // Hiển thị kết quả
    const resultDiv = document.getElementById('exerciseScore');
    resultDiv.innerHTML = `Kết quả: <strong>${score}/${total}</strong> câu đúng`;
    
    if (typeof addScore === 'function' && score > 0) {
        addScore(score * 10); 
    }
    if(score === total && total > 0) {
        resultDiv.innerHTML += " <br>🎉 Tuyệt vời! Bạn đã hoàn thành xuất sắc!";
    }
}


/* =========================================
   10. LOGIC HỘI THOẠI (KAIWA)
   ========================================= */

let currentKaiwaLesson = '1';

// 1. Hàm chuyển Tab bài học (Bài 1, Bài 2)
function switchKaiwaTab(lessonId, event) {
    // Đổi màu nút Tab bài học
    const btns = document.querySelectorAll('#kaiwaSection > .kana-tabs .tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    // Nếu có sự kiện click thì dùng target, nếu không (gọi tự động) thì tìm nút tương ứng
    if(event) {
        event.target.classList.add('active');
    } else {
        const index = parseInt(lessonId) - 1; 
        if(btns[index]) btns[index].classList.add('active');
    }
    
    currentKaiwaLesson = lessonId;
    
    renderKaiwaSubNav(lessonId);
}

// 2. Hàm tạo Menu con (Kaiwa Chính, Renshuu C...)
function renderKaiwaSubNav(lessonId) {
    const dataList = kaiwaData[lessonId];
    const navContainer = document.getElementById('kaiwaSubNav');
    navContainer.innerHTML = ''; // Xóa nút cũ

    if (!dataList || dataList.length === 0) {
        document.getElementById('kaiwaContainer').innerHTML = 'Chưa có dữ liệu.';
        return;
    }

    // Tạo các nút con
    dataList.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-sub-kaiwa';
        btn.innerText = item.name; 
        btn.onclick = () => renderKaiwaContent(lessonId, index);
        navContainer.appendChild(btn);
    });

    // === QUAN TRỌNG: TỰ ĐỘNG LOAD CÁI ĐẦU TIÊN ===
    // Ngay sau khi tạo nút xong, gọi luôn hàm hiển thị nội dung số 0
    renderKaiwaContent(lessonId, 0);
}

// 3. Hàm hiển thị nội dung chat
function renderKaiwaContent(lessonId, index) {
    // Highlight nút sub-nav đang chọn
    const btns = document.querySelectorAll('.btn-sub-kaiwa');
    btns.forEach(b => b.classList.remove('active'));
    if(btns[index]) btns[index].classList.add('active');

    // Lấy dữ liệu
    const data = kaiwaData[lessonId][index];
    const container = document.getElementById('kaiwaContainer');
    const imgEl = document.getElementById('kaiwaImage');

    // Cập nhật ảnh
    if(data.img) imgEl.src = data.img;
    
    const audioWrapper = document.getElementById('kaiwaAudioPlayer');
    const audioEl = document.getElementById('kaiwaAudio');
    const btnIcon = document.getElementById('kaiwaAudioIcon');
    const btnText = document.getElementById('kaiwaAudioText');
    const btnMain = document.getElementById('btnKaiwaAudio');

    // Reset trạng thái
    if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
    }
    if (btnIcon) btnIcon.className = 'fas fa-play';
    if (btnText) btnText.innerText = 'Nghe CD';
    if (btnMain) btnMain.classList.remove('playing');

    // Nạp file nhạc mới (Lấy từ data con)
    if (audioWrapper && audioEl) {
        if (data.audio && data.audio !== "") {
            audioEl.src = data.audio;
            audioWrapper.style.display = 'flex'; // Hiện nút
        } else {
            audioWrapper.style.display = 'none'; // Ẩn nút nếu bài này (vd: Renshuu C) không có tiếng
        }
    }

    container.innerHTML = ''; // Xóa chat cũ

    // Render từng dòng chat
    data.dialogue.forEach(line => {
        const row = document.createElement('div');
        
        const isRight = (line.side === 'right');
        // ==============================
        
        row.className = `chat-row ${isRight ? 'right' : 'left'}`;
        
        row.innerHTML = `
            <img src="${line.icon}" class="chat-avatar" alt="${line.name}">
            <div class="chat-bubble">
                <div class="chat-name">${line.name}</div>
                <div class="chat-jp">
                    ${formatText(line.text.replace(/\n/g, '<br>'))} 
                    
                    <i class="fas fa-volume-up btn-chat-audio" 
                    onclick="speak('${line.text.replace(/\n/g, ' ')}', '${line.gender || 'female'}')">
                    </i>

                </div>
                <div class="chat-vn">${line.mean}</div>
            </div>
        `;
        container.appendChild(row);
    });
}

/* --- LOGIC AUDIO KAIWA --- */
function toggleKaiwaAudio() {
    const audio = document.getElementById('kaiwaAudio');
    const btn = document.getElementById('btnKaiwaAudio');
    const icon = document.getElementById('kaiwaAudioIcon');
    const text = document.getElementById('kaiwaAudioText');

    if (audio.paused) {
        // Đang dừng -> Bấm để phát
        audio.play();
        btn.classList.add('playing');
        icon.className = 'fas fa-pause';
        text.innerText = "Đang phát...";
    } else {
        // Đang phát -> Bấm để dừng
        audio.pause();
        btn.classList.remove('playing');
        icon.className = 'fas fa-play';
        text.innerText = "Nghe CD";
    }
}

// Khi nhạc chạy hết thì tự động reset nút về ban đầu
document.getElementById('kaiwaAudio').addEventListener('ended', function() {
    const btn = document.getElementById('btnKaiwaAudio');
    const icon = document.getElementById('kaiwaAudioIcon');
    const text = document.getElementById('kaiwaAudioText');
    
    btn.classList.remove('playing');
    icon.className = 'fas fa-play';
    text.innerText = "Nghe lại";
});


/* =========================================
   11. GAME PHẢN XẠ (REFLEX)
   ========================================= */

let reflexTimer = null;
let reflexDataList = [];

function switchGameTab(tab, event) {
    // 1. Ẩn tất cả các khu vực game
    document.getElementById('gameFlashcardArea').style.display = 'none';
    document.getElementById('gameQuizArea').style.display = 'none';
    document.getElementById('gameReflexArea').style.display = 'none';
    
    // 2. Hiển thị khu vực được chọn
    if (tab === 'flashcard') document.getElementById('gameFlashcardArea').style.display = 'block';
    if (tab === 'quiz') document.getElementById('gameQuizArea').style.display = 'block';
    if (tab === 'reflex') document.getElementById('gameReflexArea').style.display = 'block';

    // 3. Đổi màu nút Tab
    document.querySelectorAll('#gameSection .tab-btn').forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');
    
    // Dừng game phản xạ nếu đang chạy mà chuyển tab
    if (tab !== 'reflex') stopReflexGame();
    if (tab === 'flashcard') initFlashcards();
}

function startReflexGame() {
    const topic = document.getElementById('reflexTopic').value;
    const speed = parseInt(document.getElementById('reflexSpeed').value);
    
    // Lấy dữ liệu
    reflexDataList = getGameData(topic);
    
    if (reflexDataList.length === 0) {
        alert("Chưa có dữ liệu!");
        return;
    }

    // Chuyển giao diện
    document.getElementById('reflexSetup').style.display = 'none';
    document.getElementById('reflexPlay').style.display = 'block';

    // Bắt đầu vòng lặp
    runReflexLoop(speed);
}

function runReflexLoop(speed) {
    // Hiển thị chữ đầu tiên ngay lập tức
    showRandomReflexChar();

    // Cài đặt lặp lại
    reflexTimer = setInterval(() => {
        showRandomReflexChar();
    }, speed);
}

function showRandomReflexChar() {
    const charEl = document.getElementById('reflexChar');
    const romajiEl = document.getElementById('reflexRomaji');
    
    // Lấy ngẫu nhiên
    const randomItem = reflexDataList[Math.floor(Math.random() * reflexDataList.length)];
    
    // Gán nội dung
    charEl.innerText = randomItem.front;
    romajiEl.innerText = randomItem.back; // Romaji
    
    // Thêm hiệu ứng animation
    charEl.classList.remove('animate-pop');
    void charEl.offsetWidth; // Trigger reflow để chạy lại animation
    charEl.classList.add('animate-pop');
    
    // Đổi màu ngẫu nhiên cho sinh động (Optional)
    const colors = ['#ff9a9e', '#a18cd1', '#333', '#fbc2eb', '#4facfe'];
    charEl.style.color = colors[Math.floor(Math.random() * colors.length)];
}

function stopReflexGame() {
    clearInterval(reflexTimer);
    document.getElementById('reflexSetup').style.display = 'flex'; // Flex để căn giữa do CSS cũ
    document.getElementById('reflexPlay').style.display = 'none';
}

/* =========================================
   LOGIC BẢNG XẾP HẠNG (LEADERBOARD)
   ========================================= */

// 1. Danh sách Bot Anime (Điểm số giả lập)
const botsData = [
    { name: "Conan", score: 500, avatar: "🕵️‍♂️" },
    { name: "Doraemon", score: 420, avatar: "🐱" },
    { name: "Naruto", score: 350, avatar: "🍥" },
    { name: "Luffy", score: 280, avatar: "👒" },
    { name: "Suneo", score: 150, avatar: "🦊" },
    { name: "Nobita", score: 10, avatar: "👓" }
];

// 2. Hàm mở Bảng xếp hạng
function openLeaderboard() {
    // Gọi hàm mở giao diện chung (để ẩn các cái khác)
    openSection('leaderboardSection');

    // Lấy điểm hiện tại của người dùng từ bộ nhớ
    // Nếu chưa có thì mặc định là 0
    let myScore = parseInt(localStorage.getItem('nihongoScore')) || 0;
    let myName = "Bạn (Me)";

    // Cập nhật thẻ hiển thị điểm cá nhân
    document.getElementById('myTotalScore').innerText = myScore;
    document.getElementById('myRankName').innerText = getRankTitle(myScore);

    // Gộp danh sách Bot và Người chơi
    let allPlayers = [
        ...botsData,
        { name: myName, score: myScore, avatar: "🐰", isMe: true }
    ];

    // Sắp xếp điểm từ cao xuống thấp
    allPlayers.sort((a, b) => b.score - a.score);

    // Render ra HTML
    const listContainer = document.getElementById('rankingList');
    listContainer.innerHTML = "";

    allPlayers.forEach((player, index) => {
        const rank = index + 1;
        const isMeClass = player.isMe ? "is-me" : "";
        
        const html = `
            <div class="ranking-item ${isMeClass}">
                <div class="rank-number">#${rank}</div>
                <div class="rank-user-info">
                    <span style="font-size:1.2rem">${player.avatar}</span>
                    <span>${player.name}</span>
                </div>
                <div class="rank-points">${player.score} pts</div>
            </div>
        `;
        listContainer.innerHTML += html;
    });
}

// 3. Hàm lấy danh hiệu dựa trên điểm số
function getRankTitle(score) {
    if (score < 100) return "Thỏ Tập Sự 🌱";
    if (score < 300) return "Thỏ Chăm Chỉ 📚";
    if (score < 500) return "Thỏ Tài Giỏi 🎖";
    if (score < 700) return "Thỏ Thông Thái 🎓";
    if (score < 1000) return "Thỏ Thiên Tài 🧩";
    return "Thỏ Thần Thánh 🌟";
}

// 4. Hàm CỘNG ĐIỂM (Dùng để gọi khi làm bài tập xong)
function addScore(points) {
    let current = parseInt(localStorage.getItem('nihongoScore')) || 0;
    let newScore = current + points;
    localStorage.setItem('nihongoScore', newScore);
    
    // Hiệu ứng thông báo nhỏ (Console hoặc Alert tùy bạn)
    console.log(`Đã cộng ${points} điểm! Tổng: ${newScore}`);
}
/* --- HÀM RESET ĐIỂM --- */
function resetMyScore() {
    // 1. Hỏi xác nhận để tránh bấm nhầm
    const confirmAction = confirm("Bạn có chắc muốn xóa toàn bộ điểm về 0 không?");
    
    if (confirmAction) {
        // 2. Đặt điểm về 0 trong bộ nhớ
        localStorage.setItem('nihongoScore', 0);
        
        // 3. Thông báo
        alert("Đã xóa điểm thành công! Cày lại từ đầu nhé! 🐰");
        
        // 4. Tải lại bảng xếp hạng để cập nhật giao diện ngay lập tức
        openLeaderboard();
    }
}