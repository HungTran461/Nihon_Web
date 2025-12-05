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
        {k:'私',r:'わたし',m:'Tôi'}, {k:'私たち',r:'わたしたち',m:'Chúng tôi'}, {k:'あなた',r:'あなた',m:'Bạn'},
        {k:'あの人',r:'あのひと',m:'Người kia'}, {k:'あの方',r:'あのかた',m:'Vị kia'}, {k:'先生',r:'せんせい',m:'Giáo viên'},
        {k:'教師',r:'きょうし',m:'Giáo viên (nghề)'}, {k:'学生',r:'がくせい',m:'Học sinh'}, {k:'会社員',r:'かいしゃいん',m:'NV công ty'},
        {k:'社員',r:'しゃいん',m:'NV công ty ~'}, {k:'銀行員',r:'ぎんこういん',m:'NV ngân hàng'}, {k:'医者',r:'いしゃ',m:'Bác sĩ'},
        {k:'研究者',r:'けんきゅうしゃ',m:'Nhà nghiên cứu'}, {k:'エンジニア',r:'エンジニア',m:'Kỹ sư'}, {k:'大学',r:'だいがく',m:'Đại học'},
        {k:'病院',r:'びょういん',m:'Bệnh viện'}, {k:'電気',r:'でんき',m:'Điện'}, {k:'だれ',r:'だれ',m:'Ai?'},
        {k:'どなた',r:'どなた',m:'Vị nào?'}, {k:'歳',r:'～さい',m:'Tuổi'}, {k:'何歳',r:'なんさい',m:'Mấy tuổi?'},
        {k:'はい',r:'はい',m:'Vâng'}, {k:'いいえ',r:'いいえ',m:'Không'}, {k:'初めまして',r:'はじめまして',m:'Chào lần đầu'},
        {k:'日本',r:'にほん',m:'Nhật Bản'}, {k:'ベトナム',r:'ベトナム',m:'Việt Nam'}, {k:'アメリカ',r:'アメリカ',m:'Mỹ'},
        {k:'～さん',r:'～さん',m:'Ông/Bà'}, {k:'～ちゃん',r:'～ちゃん',m:'Bé gái'}, {k:'～くん',r:'～くん',m:'Bé trai'},
        {k:'～人',r:'～じん',m:'Người nước~'}, {k:'失礼ですが',r:'しつれいですが',m:'Xin lỗi...'}, {k:'お名前は？',r:'おなまえは',m:'Tên bạn là?'},
        {k:'～から来ました',r:'～からきました',m:'Đến từ~'}, {k:'どうぞよろしく',r:'どうぞよろしく',m:'Mong giúp đỡ'}
    ],
    '2': [
        {k:'これ',r:'これ',m:'Cái này'}, {k:'それ',r:'それ',m:'Cái đó'}, {k:'あれ',r:'あれ',m:'Cái kia'},
        {k:'この',r:'この',m:'~này'}, {k:'その',r:'その',m:'~đó'}, {k:'あの',r:'あの',m:'~kia'},
        {k:'本',r:'ほん',m:'Sách'}, {k:'辞書',r:'じしょ',m:'Từ điển'}, {k:'雑誌',r:'ざっし',m:'Tạp chí'},
        {k:'新聞',r:'しんぶん',m:'Báo'}, {k:'ノート',r:'ノート',m:'Vở'}, {k:'手帳',r:'てちょう',m:'Sổ tay'},
        {k:'名刺',r:'めいし',m:'Danh thiếp'}, {k:'カード',r:'カード',m:'Thẻ'}, {k:'鉛筆',r:'えんぴつ',m:'Bút chì'},
        {k:'時計',r:'とけい',m:'Đồng hồ'}, {k:'傘',r:'かさ',m:'Ô'}, {k:'鞄',r:'かばん',m:'Cặp'},
        {k:'テレビ',r:'テレビ',m:'Tivi'}, {k:'カメラ',r:'カメラ',m:'Máy ảnh'}, {k:'机',r:'つくえ',m:'Bàn'},
        {k:'椅子',r:'いす',m:'Ghế'}, {k:'コーヒー',r:'コーヒー',m:'Cà phê'}, {k:'英語',r:'えいご',m:'Tiếng Anh'},
        {k:'日本語',r:'にほんご',m:'Tiếng Nhật'}, {k:'何',r:'なん',m:'Cái gì'}, {k:'そうです',r:'そうです',m:'Đúng rồi'}
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
    {c:'一',h:'NHẤT',m:'Một'}, {c:'丨',h:'CỔN',m:'Sổ'}, {c:'丶',h:'CHỦ',m:'Chấm'}, {c:'丿',h:'PHIỆT',m:'Phẩy'},
    {c:'乙',h:'ẤT',m:'Can Ất'}, {c:'亅',h:'QUYẾT',m:'Móc'}, {c:'二',h:'NHỊ',m:'Hai'}, {c:'亠',h:'ĐẦU',m:'Đầu'},
    {c:'人',h:'NHÂN',m:'Người'}, {c:'儿',h:'NHI',m:'Trẻ con'}, {c:'入',h:'NHẬP',m:'Vào'}, {c:'八',h:'BÁT',m:'Tám'},
    {c:'冂',h:'QUYNH',m:'Vùng biên'}, {c:'冖',h:'MỊCH',m:'Trùm'}, {c:'冫',h:'BĂNG',m:'Nước đá'}, {c:'几',h:'KỶ',m:'Ghế'},
    {c:'刀',h:'ĐAO',m:'Dao'}, {c:'力',h:'LỰC',m:'Sức'}, {c:'勹',h:'BAO',m:'Bao bọc'}, {c:'匕',h:'CHỦY',m:'Thìa'},
    {c:'口',h:'KHẨU',m:'Miệng'}, {c:'囗',h:'VI',m:'Vây'}, {c:'土',h:'THỔ',m:'Đất'}, {c:'士',h:'SĨ',m:'Kẻ sĩ'},
    {c:'夂',h:'TRUY',m:'Theo sau'}, {c:'夕',h:'TỊCH',m:'Đêm'}, {c:'大',h:'ĐẠI',m:'To'}, {c:'女',h:'NỮ',m:'Nữ'},
    {c:'子',h:'TỬ',m:'Con'}, {c:'宀',h:'MIÊN',m:'Mái nhà'}, {c:'寸',h:'THỐN',m:'Tấc'}, {c:'小',h:'TIỂU',m:'Nhỏ'},
    {c:'尸',h:'THI',m:'Xác'}, {c:'山',h:'SƠN',m:'Núi'}, {c:'川',h:'XUYÊN',m:'Sông'}, {c:'工',h:'CÔNG',m:'Thợ'},
    {c:'已',h:'KỶ',m:'Bản thân'}, {c:'巾',h:'CÂN',m:'Khăn'}, {c:'干',h:'CAN',m:'Can thiệp'}, {c:'幺',h:'YÊU',m:'Nhỏ'},
    {c:'广',h:'NGHIỄM',m:'Mái nhà'}, {c:'廴',h:'DẪN',m:'Bước dài'}, {c:'廾',h:'CỦNG',m:'Chắp tay'}, {c:'弋',h:'DẶC',m:'Bắn'},
    {c:'弓',h:'CUNG',m:'Cung'}, {c:'彡',h:'SAM',m:'Lông'}, {c:'彳',h:'XÍCH',m:'Bước'}, {c:'心',h:'TÂM',m:'Tim'},
    {c:'戈',h:'QUA',m:'Mác'}, {c:'户',h:'HỘ',m:'Cửa'}, {c:'手',h:'THỦ',m:'Tay'}, {c:'支',h:'CHI',m:'Cành'},
    {c:'攴',h:'PHỘC',m:'Đánh'}, {c:'文',h:'VĂN',m:'Văn'}, {c:'斗',h:'ĐẨU',m:'Đấu'}, {c:'斤',h:'CÂN',m:'Rìu'},
    {c:'方',h:'PHƯƠNG',m:'Vuông'}, {c:'无',h:'VÔ',m:'Không'}, {c:'日',h:'NHẬT',m:'Ngày'}, {c:'曰',h:'VIẾT',m:'Nói'},
    {c:'月',h:'NGUYỆT',m:'Tháng'}, {c:'木',h:'MỘC',m:'Gỗ'}, {c:'欠',h:'KHIẾM',m:'Thiếu'}, {c:'止',h:'CHỈ',m:'Dừng'},
    {c:'歹',h:'ĐÃI',m:'Xấu'}, {c:'殳',h:'THÙ',m:'Binh khí'}, {c:'毋',h:'VÔ',m:'Chớ'}, {c:'比',h:'TỶ',m:'So sánh'},
    {c:'毛',h:'MAO',m:'Lông'}, {c:'氏',h:'THỊ',m:'Họ'}, {c:'气',h:'KHÍ',m:'Khí'}, {c:'水',h:'THỦY',m:'Nước'},
    {c:'火',h:'HỎA',m:'Lửa'}, {c:'爪',h:'TRẢO',m:'Vuốt'}, {c:'父',h:'PHỤ',m:'Cha'}, {c:'爻',h:'HÀO',m:'Hào'},
    {c:'爿',h:'TƯỜNG',m:'Mảnh'}, {c:'片',h:'PHIẾN',m:'Tấm'}, {c:'牛',h:'NGƯU',m:'Trâu'}, {c:'犬',h:'KHUYỂN',m:'Chó'}
];

/* =========================================
   2. TRẠNG THÁI & LOGIC ĐIỀU HƯỚNG
   ========================================= */

let currentSystem = 'hiragana';
let currentKanjiTab = 'radicals';

// Hàm mở Section duy nhất (Quản lý toàn bộ Logic hiển thị)
function openSection(id) {
    // 1. Ẩn giao diện chính
    const mainMenu = document.getElementById('mainMenu');
    const heroSection = document.getElementById('heroSection');
    if (mainMenu) mainMenu.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    
    // 2. Ẩn tất cả section con
    document.querySelectorAll('.section-content').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // 3. Hiện section được chọn
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    }

    // 4. LOGIC KHỞI TẠO DỮ LIỆU
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
        // Reset tab active
        const tabs = document.querySelectorAll('#kanjiSection .tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick').includes(currentKanjiTab));
        if (activeBtn) activeBtn.classList.add('active');
    }
    else if (id === 'gameSection') {
        switchGameTab('flashcard', { target: document.querySelector('#gameSection .tab-btn') });
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
    const list = minnaData[id];
    if (list && list.length > 0) {
        list.forEach(word => {
            const kanjiDisplay = word.k === word.r ? '<span class="no-kanji">-</span>' : word.k;
            const row = document.createElement('div');
            row.className = 'vocab-row';
            row.innerHTML = `
                <div class="cell-kanji">${kanjiDisplay}</div>
                <div class="cell-reading">${word.r}</div>
                <div class="cell-mean">${word.m}</div>
                <div class="cell-audio">
                    <button class="btn-vocab-speak" onclick="speak('${word.r}')"><i class="fas fa-volume-up"></i></button>
                </div>
            `;
            container.appendChild(row);
        });
    } else {
        container.innerHTML = '<div style="text-align:center;padding:20px;">Chưa có dữ liệu.</div>';
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
        if(audioBtn) audioBtn.style.display = 'inline-block';
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
    if(audioBtn) audioBtn.style.display = 'inline-block';

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

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP'; u.rate = 0.8;
        window.speechSynthesis.speak(u);
    }
}
function playAudioFromModal() {
    speak(document.getElementById('modalChar').innerText);
}

/* =========================================
   7. GAME ENGINE (FLASHCARD & QUIZ)
   ========================================= */
function getGameData(key) {
    let rawData = [];
    // Minna (Tự động)
    if (key.startsWith('minna_')) {
        const lesson = key.split('_')[1];
        if (minnaData[lesson]) {
            return minnaData[lesson].map(i => ({ front: (i.k===i.r?i.k:`${i.k}\n(${i.r})`), back: i.m, read: i.r, type:'vocab' }));
        }
    }
    // Kanji
    if (key === 'n5_kanji') {
        return n5KanjiData.map(i => ({ front: i.c, back: `${i.h} - ${i.m}`, read: i.c, type:'kanji' }));
    }
    // Kana (Logic gộp)
    if (key.includes('hira_') || key.includes('kata_')) {
        const sys = key.includes('hira') ? 'hiragana' : 'katakana';
        const map = charMaps[sys];
        let rows = [];
        if (key.includes('basic')) rows = basicRows;
        else if (key.includes('daku')) rows = dakutenRows;
        else if (key.includes('yoon')) rows = yoonRows;
        else if (key.includes('full')) rows = [...basicRows, ...dakutenRows, ...yoonRows];

        rows.forEach(r => {
            r.forEach(romaji => {
                if(romaji) {
                    rawData.push({ front: map[romaji], back: romaji.replace('_d',''), read: map[romaji], type:'kana' });
                }
            });
        });
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