// ==========================================
// 🎮 Study Quest - JavaScriptゲームロジック
// ==========================================


// ==========================================
// 📊 基本データ
// ==========================================

// 現在の合計EXP
let totalExp = 0;

// 現在のレベル
let currentLevel = 1;

// タイマーの秒数
let seconds = 0;

// タイマーを管理する変数
let timerInterval = null;

// 現在表示している画面
let currentView = 'home';

// 苦手問題を保存する配列
let nigateLogs = [];


// ==========================================
// 🏆 アチーブメントデータ
// ==========================================

// 解除済みアチーブメント
let unlockedAchievements = {};

// ==========================================
// ⚙️ 設定データ
// ==========================================

// プレイヤー名
let playerName = "名無し";

// ランキング参加状態
let rankingEnabled = false;

// 効果音ON/OFF
let soundEnabled = true;

// ==========================================
// ❓ デフォルトクイズ
// ==========================================

const defaultQuizList = [
    {
        q: "英単語『study』の意味は？",
        a: "勉強する"
    },
    {
        q: "かけ算： 7 × 8 ＝ ？",
        a: "56"
    },
    {
        q: "理科：水の化学式は？",
        a: "H2O"
    },
    {
        q: "英単語『obvious』の意味は？",
        a: "明らかな"
    },
    {
        q: "歴史：日本で最初の幕府は？",
        a: "鎌倉幕府"
    }
];


// 現在使用するクイズリスト
let activeQuizList = [...defaultQuizList];


// 現在の問題番号
let currentQuizIndex = 0;

// ==========================================
// 🖥️ 画面切り替え
// ==========================================

function showView(viewName) {

    currentView = viewName;

    const cards = {
        timer: document.getElementById('card-timer'),
        weakness: document.getElementById('card-weakness'),
        review: document.getElementById('card-review'),
        achievement: document.getElementById('card-achievement'),
        settings: document.getElementById('card-settings')
    };


    // ==========================================
    // 🏠 ホーム画面
    // ==========================================

    if (viewName === 'home') {

        document.body.className = 'view-home';

        for (const key in cards) {

            if (!cards[key]) {
                continue;
            }

            if (key === 'settings') {

                cards[key].classList.add('hidden');

            } else {

                cards[key].classList.remove('hidden');

            }

        }

        clearSidebarActive();

        return;
    }


    // ==========================================
    // 📄 個別画面
    // ==========================================

    document.body.className = 'view-single';

    for (const key in cards) {

        if (!cards[key]) {
            continue;
        }

        if (key === viewName) {

            cards[key].classList.remove('hidden');

        } else {

            cards[key].classList.add('hidden');

        }

    }


    updateSidebarActive(viewName);


    // ==========================================
    // ⏱️ タイマー
    // ==========================================

    if (viewName === 'timer') {

        unlockAchievement(
            '最初の一歩',
            'badge1'
        );

    }


    // ==========================================
    // ⚙️ 設定
    // ==========================================

    if (viewName === 'settings') {

        updateSettingsDisplay();

    }

}


    // ======================================
    // 🏠 ホーム画面の場合
    // ======================================

    if (viewName === 'home') {

        document.body.className =
            "view-home";


        // 設定以外のカードを表示
        for (let key in cards) {

            if (key === 'settings') {

                cards[key].classList.add('hidden');

            } else {

                cards[key].classList.remove('hidden');

            }

        }


        clearSidebarActive();

    }


    // ======================================
    // 📱 各機能を開く場合
    // ======================================

    else {

        document.body.className =
            "view-single";


        // 選択したカードだけ表示
        for (let key in cards) {

            if (key === viewName) {

                cards[key].classList.remove('hidden');

            } else {

                cards[key].classList.add('hidden');

            }

        }


        // サイドバーの選択状態を更新
        updateSidebarActive(viewName);


        // タイマーを初めて開いた場合
        if (viewName === 'timer') {

            unlockAchievement(
                '最初の一歩',
                'badge1'
            );

        }


        // ⚙️ 設定を開いた場合
        if (viewName === 'settings') {

            updateSettingsDisplay();

        }

    };


    // ホーム画面の場合
    if (viewName === 'home') {

        document.body.className = "view-home";


        for (let key in cards) {

            if (cards[key]) {

                cards[key].classList.remove('hidden');

            }

        }


        clearSidebarActive();

    }


    // 個別画面の場合
    else {

        document.body.className = "view-single";


        for (let key in cards) {

            if (!cards[key]) continue;


            if (key === viewName) {

                cards[key].classList.remove('hidden');

            }

            else {

                cards[key].classList.add('hidden');

            }

        }


        updateSidebarActive(viewName);


        // タイマー画面を開いたら
        if (viewName === 'timer') {

            unlockAchievement(
                '最初の一歩',
                'badge1'
            );

        }

    }





// ==========================================
// 🖱️ カードクリック
// ==========================================

function handleCardClick(cardName) {

    if (currentView === 'home') {

        showView(cardName);

    }

}



// ==========================================
// 🏠 ホームに戻る
// ==========================================

function goBackToHome(event) {

    event.stopPropagation();

    showView('home');

}



// ==========================================
// 📌 サイドバー
// ==========================================

function clearSidebarActive() {

    const items =
        document.querySelectorAll('.sidebar-item');


    items.forEach(item => {

        item.classList.remove('active');

    });

}


function updateSidebarActive(viewName) {

    clearSidebarActive();


    const activeItem =
        document.getElementById(
            `menu-${viewName}`
        );


    if (activeItem) {

        activeItem.classList.add('active');

    }

}



// ==========================================
// ⏱️ タイマー開始
// ==========================================

function startTimer(event) {

    event.stopPropagation();


    // すでにタイマーが動いている場合は停止
    if (timerInterval) {

        return;

    }


    document.getElementById(
        'startBtn'
    ).style.display = 'none';


    document.getElementById(
        'stopBtn'
    ).style.display = 'inline-block';


    timerInterval = setInterval(() => {

        seconds++;

        updateTimerDisplay();

    }, 1000);

}



// ==========================================
// ⏹️ タイマー停止
// ==========================================

function stopTimer(event) {

    event.stopPropagation();


    clearInterval(timerInterval);

    timerInterval = null;


    // 1秒 = 5EXP
    const earnedExp = seconds * 5;


    // EXPを追加
    totalExp += earnedExp;


    document.getElementById(
        'startBtn'
    ).style.display = 'inline-block';


    document.getElementById(
        'stopBtn'
    ).style.display = 'none';


    // レベルアップ確認
    checkLevelUp();


    // 1秒以上勉強したら実績
    if (seconds > 0) {

        unlockAchievement(
            '集中マスター',
            'badge2'
        );

    }


    // データ保存
    saveData();


    // タイマーをリセット
    seconds = 0;

    updateTimerDisplay();

}



// ==========================================
// ⏰ タイマー表示更新
// ==========================================

function updateTimerDisplay() {

    const min =
        Math.floor(seconds / 60);


    const sec =
        seconds % 60;


    document.getElementById(
        'timerDisplay'
    ).innerText =

        String(min).padStart(2, '0')

        + ":"

        + String(sec).padStart(2, '0');

}



// ==========================================
// ⭐ レベルアップ判定
// ==========================================

function checkLevelUp() {

    let levelUp = false;


    // 必要EXPを超えている間、
    // レベルを上げ続ける
    while (
        totalExp >= currentLevel * 100
    ) {

        currentLevel++;

        levelUp = true;

    }


    // レベルアップした場合
    if (levelUp) {

        unlockAchievement(
            '伝説の勇者',
            'badge3'
        );

    }


    // 画面更新
    updateGameDisplay();


    // データ保存
    saveData();

}



// ==========================================
// 📊 レベル・EXP表示更新
// ==========================================

function updateGameDisplay() {

    const levelDisplay =
        document.getElementById(
            'levelDisplay'
        );


    const expText =
        document.getElementById(
            'expText'
        );


    const expFill =
        document.getElementById(
            'expFill'
        );


    // 次のレベルに必要なEXP
    const nextThreshold =
        currentLevel * 100;


    // レベル表示
    if (levelDisplay) {

        levelDisplay.innerText =
            "Lv. " + currentLevel;

    }


    // EXP表示
    if (expText) {

        expText.innerText =
            `${totalExp} / ${nextThreshold} XP`;

    }


    // EXPバー
    if (expFill) {

        const previousThreshold =
            (currentLevel - 1) * 100;


        const neededExp =
            nextThreshold - previousThreshold;


        const currentExpInLevel =
            totalExp - previousThreshold;


        let progress =
            (currentExpInLevel / neededExp)
            * 100;


        // 0〜100%の範囲に制限
        progress =
            Math.max(
                0,
                Math.min(100, progress)
            );


        expFill.style.width =
            progress + "%";

    }

}



// ==========================================
// 📝 苦手問題を追加
// ==========================================

function addWeakness(event) {

    event.stopPropagation();


    const input =
        document.getElementById(
            'weaknessInput'
        );


    const value =
        input.value.trim();


    // 空の場合は何もしない
    if (value === "") {

        return;

    }


    // 苦手問題を保存
    nigateLogs.unshift(value);


    // 画面を更新
    renderWeaknessList();


    // 入力欄を空にする
    input.value = "";


    // アチーブメント
    unlockAchievement(
        '最初の一歩',
        'badge1'
    );


    // データ保存
    saveData();

}



// ==========================================
// 👾 苦手問題をデータに追加
// ==========================================

function insertWeaknessToList(value) {

    // 同じ問題が何度も追加されないようにする
    if (!nigateLogs.includes(value)) {

        nigateLogs.unshift(value);

    }


    // 画面更新
    renderWeaknessList();


    // 保存
    saveData();

}



// ==========================================
// 📋 苦手問題一覧を表示
// ==========================================

function renderWeaknessList() {

    const list =
        document.getElementById(
            'weaknessList'
        );


    if (!list) {

        return;

    }


    // 一度画面を空にする
    list.innerHTML = "";


    // 苦手問題がない場合
    if (nigateLogs.length === 0) {

        list.innerHTML = `

            <div class="empty-message">
                まだ苦手問題はありません！
            </div>

        `;


        return;

    }


    // 保存されている問題を表示
    nigateLogs.forEach(value => {

        const item =
            document.createElement('div');


        item.className =
            'log-item';


        item.innerHTML =
            `<span>👾 ${value}</span>`;


        list.appendChild(item);

    });

}



// ==========================================
// 🔄 復習機能
// ==========================================

window.addEventListener(
    'load',
    () => {

        loadQuizQuestion();

    }
);



// ==========================================
// ❓ クイズ読み込み
// ==========================================

function loadQuizQuestion() {

    if (
        activeQuizList.length === 0
    ) {

        document.getElementById(
            'quizQuestionText'
        ).innerText =
            "クイズがありませんピヨ！";


        document.getElementById(
            'quizAnswerText'
        ).innerText = "";


        document.getElementById(
            'showAnswerBtn'
        ).style.display =
            'none';


        return;

    }


    const currentQuiz =
        activeQuizList[currentQuizIndex];


    document.getElementById(
        'quizQuestionText'
    ).innerText =
        currentQuiz.q;


    document.getElementById(
        'quizAnswerText'
    ).innerText =
        "?????";


    document.getElementById(
        'showAnswerBtn'
    ).style.display =
        'block';


    document.getElementById(
        'verifyButtons'
    ).style.display =
        'none';

}



// ==========================================
// 👀 答えを表示
// ==========================================

function revealQuizAnswer(event) {

    event.stopPropagation();


    const currentQuiz =
        activeQuizList[currentQuizIndex];


    const answerDisplay =
        document.getElementById(
            'quizAnswerText'
        );


    answerDisplay.innerText =
        "＝ " + currentQuiz.a;


    document.getElementById(
        'showAnswerBtn'
    ).style.display =
        'none';


    document.getElementById(
        'verifyButtons'
    ).style.display =
        'flex';

}



// ==========================================
// ⭕❌ クイズ判定
// ==========================================

function evaluateQuiz(
    isCorrect,
    event
) {

    event.stopPropagation();


    const currentQuiz =
        activeQuizList[currentQuizIndex];


    // 正解の場合
    if (isCorrect) {

        totalExp += 20;


        checkLevelUp();

    }


    // 不正解の場合
    else {

        insertWeaknessToList(

            currentQuiz.q

            + " (答: "

            + currentQuiz.a

            + ")"

        );

    }


    // 保存
    saveData();


    // 次の問題へ
    currentQuizIndex =

        (
            currentQuizIndex + 1
        )

        % activeQuizList.length;


    loadQuizQuestion();

}



// ==========================================
// ➕ 問題追加フォーム
// ==========================================

function toggleQuizForm(event) {

    event.stopPropagation();


    const form =
        document.getElementById(
            'quizFormContainer'
        );


    form.style.display =

        (
            form.style.display === 'block'
        )

        ? 'none'

        : 'block';

}



// ==========================================
// ➕ オリジナル問題追加
// ==========================================

function addCustomQuiz(event) {

    event.stopPropagation();


    const qInput =
        document.getElementById(
            'customQuestion'
        );


    const aInput =
        document.getElementById(
            'customAnswer'
        );


    const qValue =
        qInput.value.trim();


    const aValue =
        aInput.value.trim();


    // 空欄チェック
    if (
        qValue === ""
        ||
        aValue === ""
    ) {

        return;

    }


    // 問題リストに追加
    activeQuizList.unshift({

        q: qValue,

        a: aValue

    });


    currentQuizIndex = 0;


    // 入力欄を空にする
    qInput.value = "";

    aInput.value = "";


    toggleQuizForm(event);


    loadQuizQuestion();

}



// ==========================================
// 🏆 アチーブメント解除
// ==========================================

function unlockAchievement(
    name,
    badgeId
) {

    // すでに解除済みなら終了
    if (
        unlockedAchievements[name]
    ) {

        return;

    }


    // 解除状態にする
    unlockedAchievements[name] = true;


    const badge =
        document.getElementById(
            badgeId
        );


    if (badge) {

        badge.classList.add(
            'unlocked'
        );

    }


    // データ保存
    saveData();


    // サウンド再生
    if (soundEnabled) {

    playAchievementSound();

}


    // トースト取得
    const toast =
        document.getElementById(
            'steamToast'
        );


    const nameDisplay =
        document.getElementById(
            'steamBadgeName'
        );


    // 要素が存在する場合だけ表示
    if (
        toast
        &&
        nameDisplay
    ) {

        nameDisplay.innerText =
            name;


        toast.classList.add(
            'show'
        );


        setTimeout(() => {

            toast.classList.remove(
                'show'
            );

        }, 4000);

    }

}



// ==========================================
// 🔊 アチーブメント音
// ==========================================

function playAchievementSound() {

    try {

        const audioCtx =

            new (

                window.AudioContext
                ||
                window.webkitAudioContext

            )();


        const osc1 =
            audioCtx.createOscillator();


        const gain1 =
            audioCtx.createGain();


        osc1.type = 'sine';


        osc1.frequency.setValueAtTime(

            523.25,

            audioCtx.currentTime

        );


        osc1.connect(gain1);

        gain1.connect(
            audioCtx.destination
        );


        gain1.gain.setValueAtTime(

            0.1,

            audioCtx.currentTime

        );


        gain1.gain.exponentialRampToValueAtTime(

            0.01,

            audioCtx.currentTime + 0.3

        );


        const osc2 =
            audioCtx.createOscillator();


        const gain2 =
            audioCtx.createGain();


        osc2.type = 'triangle';


        osc2.frequency.setValueAtTime(

            880,

            audioCtx.currentTime + 0.1

        );


        osc2.connect(gain2);

        gain2.connect(
            audioCtx.destination
        );


        gain2.gain.setValueAtTime(

            0,

            audioCtx.currentTime

        );


        gain2.gain.setValueAtTime(

            0.12,

            audioCtx.currentTime + 0.1

        );


        gain2.gain.exponentialRampToValueAtTime(

            0.01,

            audioCtx.currentTime + 0.5

        );


        osc1.start();

        osc1.stop(
            audioCtx.currentTime + 0.3
        );


        osc2.start(
            audioCtx.currentTime + 0.1
        );


        osc2.stop(
            audioCtx.currentTime + 0.5
        );

    }

    catch (e) {

        console.log(
            "Audio exception: " + e
        );

    }

}



// ==========================================
// 🧪 アチーブメントテスト
// ==========================================

function triggerSteamTest(type) {

    if (type === 'first') {

        unlockedAchievements[
            '最初の一歩'
        ] = false;


        unlockAchievement(
            '最初の一歩',
            'badge1'
        );

    }


    else if (type === 'timer') {

        unlockedAchievements[
            '集中マスター'
        ] = false;


        unlockAchievement(
            '集中マスター',
            'badge2'
        );

    }


    else if (type === 'hero') {

        unlockedAchievements[
            '伝説の勇者'
        ] = false;


        unlockAchievement(
            '伝説の勇者',
            'badge3'
        );

    }

}

// ==========================================
// 💾 データ保存
// ==========================================

function saveData() {

    const gameState = {

        // レベル
        level: currentLevel,

        // EXP
        exp: totalExp,

        // 苦手問題
        logs: nigateLogs,

        // アチーブメント
        achievements: unlockedAchievements,

        // ニックネーム
        playerName: playerName,

        // ランキング参加
        rankingEnabled: rankingEnabled,

        // 効果音
        soundEnabled: soundEnabled

    };


    try {

        localStorage.setItem(
            'studyQuestData',
            JSON.stringify(gameState)
        );

        console.log(
            'Study Quest：データ保存成功',
            gameState
        );

        return true;

    }

    catch (error) {

        console.error(
            'Study Quest：データ保存失敗',
            error
        );

        alert(
            'データの保存に失敗しました。'
        );

        return false;

    }

}

// ==========================================
// 📂 データ読み込み
// ==========================================

function loadData() {

    const savedData = localStorage.getItem(
        'studyQuestData'
    );


    // ==========================================
    // 保存データがない場合
    // ==========================================

    if (!savedData) {

        console.log(
            'Study Quest：保存データはありません'
        );

        updateGameDisplay();
        renderWeaknessList();
        updateSettingsDisplay();

        return;
    }


    // ==========================================
    // 保存データを読み込む
    // ==========================================

    try {

        const gameState =
            JSON.parse(savedData);


        // ==========================================
        // レベル
        // ==========================================

        if (
            gameState.level !== undefined
        ) {

            currentLevel =
                gameState.level;

        }


        // ==========================================
        // EXP
        // ==========================================

        if (
            gameState.exp !== undefined
        ) {

            totalExp =
                gameState.exp;

        }


        // ==========================================
        // 苦手問題
        // ==========================================

        if (
            Array.isArray(gameState.logs)
        ) {

            nigateLogs =
                gameState.logs;

        }


        // ==========================================
        // 🏆 アチーブメント
        // ==========================================

        if (
            gameState.achievements
            &&
            typeof gameState.achievements === 'object'
        ) {

            unlockedAchievements =
                gameState.achievements;

        }


        // ==========================================
        // 画面を更新
        // ==========================================

        updateGameDisplay();

        renderWeaknessList();

        restoreAchievements();

        updateSettingsDisplay();


        console.log(
            'Study Quest：データ読み込み成功',
            gameState
        );

    }

    catch (error) {

        console.error(
            'Study Quest：データ読み込みエラー',
            error
        );

    }

}

// ==========================================
// 🏆 アチーブメント表示を復元
// ==========================================

function restoreAchievements() {

    const achievementMap = {

        '最初の一歩': 'badge1',

        '集中マスター': 'badge2',

        '伝説の勇者': 'badge3'

    };


    // まず全部ロック状態に戻す
    for (const achievementName in achievementMap) {

        const badgeId =
            achievementMap[achievementName];

        const badge =
            document.getElementById(badgeId);

        if (badge) {

            badge.classList.remove(
                'unlocked'
            );

        }

    }


    // 保存されている解除済みだけ解除
    for (
        const achievementName
        in unlockedAchievements
    ) {

        if (
            unlockedAchievements[
                achievementName
            ] !== true
        ) {

            continue;

        }


        const badgeId =
            achievementMap[
                achievementName
            ];


        if (!badgeId) {

            continue;

        }


        const badge =
            document.getElementById(
                badgeId
            );


        if (badge) {

            badge.classList.add(
                'unlocked'
            );

        }

    }

}

// ==========================================
// ⚙️ プレイヤー名を保存
// ==========================================

function savePlayerName(event) {

    if (event) {
        event.stopPropagation();
    }


    const input =
        document.getElementById(
            'playerNameInput'
        );


    if (!input) {

        console.error(
            'playerNameInput が見つかりません'
        );

        return;

    }


    const value =
        input.value.trim();


    if (value === '') {

        playerName = '名無し';

    } else {

        playerName = value;

    }


    input.value =
        playerName;


    // 保存
    saveData();


    alert(
        'ニックネームを保存しました！'
    );

}

// ==========================================
// 🏆 ランキング参加設定
// ==========================================

function setRankingParticipation(
    isEnabled,
    event
) {

    if (event) {
        event.stopPropagation();
    }


    rankingEnabled =
        Boolean(isEnabled);


    // 保存
    saveData();


    // 表示更新
    updateSettingsDisplay();


    if (rankingEnabled) {

        alert(
            'ランキングへの参加をONにしました！'
        );

    } else {

        alert(
            'ランキングへの参加をOFFにしました。'
        );

    }

}

// ==========================================
// 🔊 効果音設定
// ==========================================

function setSoundEnabled(
    isEnabled,
    event
) {

    if (event) {
        event.stopPropagation();
    }


    soundEnabled =
        Boolean(isEnabled);


    // 保存
    saveData();


    // 表示更新
    updateSettingsDisplay();

}

// ==========================================
// ⚙️ 設定画面表示更新
// ==========================================

function updateSettingsDisplay() {

    // ==========================================
    // 👤 ニックネーム
    // ==========================================

    const playerNameInput =
        document.getElementById(
            'playerNameInput'
        );


    if (playerNameInput) {

        playerNameInput.value =
            playerName;

    }


    // ==========================================
    // 🏆 ランキング
    // ==========================================

    const rankingStatus =
        document.getElementById(
            'rankingStatus'
        );


    if (rankingStatus) {

        if (rankingEnabled) {

            rankingStatus.innerText =
                '現在：ランキングに参加しています 🏆';

        } else {

            rankingStatus.innerText =
                '現在：ランキングに参加していません';

        }

    }


    // ==========================================
    // 🔊 効果音
    // ==========================================

    const soundStatus =
        document.getElementById(
            'soundStatus'
        );


    if (soundStatus) {

        if (soundEnabled) {

            soundStatus.innerText =
                '現在：ON 🔊';

        } else {

            soundStatus.innerText =
                '現在：OFF 🔇';

        }

    }

}



// ==========================================
// 🗑️ データリセット
// ==========================================

function resetGameData(event) {

    event.stopPropagation();


    const result =
        confirm(
            "本当にすべてのデータを削除しますか？\nこの操作は元に戻せません。"
        );


    if (!result) {

        return;

    }


    // localStorageから削除
    localStorage.removeItem(
        'studyQuestData'
    );


    // ページを再読み込み
    location.reload();

}

// ==========================================
// 🚀 ページ読み込み時
// ==========================================

window.addEventListener(
    'DOMContentLoaded',
    () => {

        // 保存データを読み込む
        loadData();

        // クイズを表示
        loadQuizQuestion();

        // 最初はホーム
        showView('home');

    }
);
