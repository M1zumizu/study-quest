// ==========================================
// 🎮 Study Quest - JavaScriptゲームロジック
// ==========================================

let totalExp = 0;
let currentLevel = 1;
let seconds = 0;
let timerInterval = null;
let currentView = 'home';

const defaultQuizList = [
    { q: "英単語『study』の意味は？", a: "勉強する" },
    { q: "かけ算： 7 × 8 ＝ ？", a: "56" },
    { q: "理科：水の化学式は？", a: "H2O" },
    { q: "英単語『obvious』の意味は？", a: "明らかな" },
    { q: "歴史：日本で最初の幕府は？", a: "鎌倉幕府" }
];

let activeQuizList = [...defaultQuizList]; 
let currentQuizIndex = 0; 

// 画面切り替え
function showView(viewName) {
    currentView = viewName;
    const cards = {
        timer: document.getElementById('card-timer'),
        weakness: document.getElementById('card-weakness'),
        review: document.getElementById('card-review'),
        achievement: document.getElementById('card-achievement')
    };

    if (viewName === 'home') {
        document.body.className = "view-home";
        for (let key in cards) {
            cards[key].classList.remove('hidden');
        }
        clearSidebarActive();
    } else {
        document.body.className = "view-single";
        for (let key in cards) {
            if (key === viewName) {
                cards[key].classList.remove('hidden');
            } else {
                cards[key].classList.add('hidden');
            }
        }
        updateSidebarActive(viewName);

        if (viewName === 'timer') {
            unlockAchievement('最初の一歩', 'badge1');
        }
    }
}

function handleCardClick(cardName) {
    if (currentView === 'home') {
        showView(cardName);
    }
}

function goBackToHome(event) {
    event.stopPropagation();
    showView('home');
}

function clearSidebarActive() {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => item.classList.remove('active'));
}

function updateSidebarActive(viewName) {
    clearSidebarActive();
    const activeItem = document.getElementById(`menu-${viewName}`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// ⏱️ タイマー機能
function startTimer(event) {
    event.stopPropagation();
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer(event) {
    event.stopPropagation();
    clearInterval(timerInterval);
    
    const earnedExp = seconds * 5;
    totalExp += earnedExp;

    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('stopBtn').style.display = 'none';

    checkLevelUp(earnedExp);

    if (seconds > 0) {
        unlockAchievement('集中マスター', 'badge2');
    }

    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    document.getElementById('timerDisplay').innerText = 
        String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}

function checkLevelUp(exp) {
    const nextThreshold = currentLevel * 100;
    let levelUp = false;

    if (totalExp >= nextThreshold) {
        currentLevel++;
        levelUp = true;
    }

    updateUI(levelUp, exp, nextThreshold);
}

function updateUI(isLevelUp, exp, nextThreshold) {
    document.getElementById('levelDisplay').innerText = "Lv. " + currentLevel;
    document.getElementById('expText').innerText = `${totalExp} / ${nextThreshold} XP`;

    const progress = (totalExp % nextThreshold) / nextThreshold * 100;
    document.getElementById('expFill').style.width = (isLevelUp ? 0 : progress) + "%";

    if (isLevelUp) {
        unlockAchievement('伝説の勇者', 'badge3');
    }
}

// 📝 苦手問題ログ
function addWeakness(event) {
    event.stopPropagation();
    const input = document.getElementById('weaknessInput');
    const value = input.value.trim();

    if (value === "") return;

    insertWeaknessToList(value);
    input.value = ""; 
    unlockAchievement('最初の一歩', 'badge1');
}

function insertWeaknessToList(value) {
    const list = document.getElementById('weaknessList');
    const emptyMsg = list.querySelector('.empty-message');
    if (emptyMsg) {
        list.innerHTML = "";
    }

    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `<span>👾 ${value}</span>`;
    
    list.insertBefore(item, list.firstChild);
}

// 🔄 復習機能
window.addEventListener('load', () => {
    loadQuizQuestion();
});

function loadQuizQuestion() {
    if (activeQuizList.length === 0) {
        document.getElementById('quizQuestionText').innerText = "クイズがありませんピヨ！";
        document.getElementById('quizAnswerText').innerText = "";
        document.getElementById('showAnswerBtn').style.display = 'none';
        return;
    }

    const currentQuiz = activeQuizList[currentQuizIndex];
    document.getElementById('quizQuestionText').innerText = currentQuiz.q;
    document.getElementById('quizAnswerText').innerText = "?????";
    
    document.getElementById('showAnswerBtn').style.display = 'block';
    document.getElementById('verifyButtons').style.display = 'none';
}

function revealQuizAnswer(event) {
    event.stopPropagation();
    const currentQuiz = activeQuizList[currentQuizIndex];
    const answerDisplay = document.getElementById('quizAnswerText');
    
    answerDisplay.innerText = "＝ " + currentQuiz.a;

    document.getElementById('showAnswerBtn').style.display = 'none';
    document.getElementById('verifyButtons').style.display = 'flex';
}

function evaluateQuiz(isCorrect, event) {
    event.stopPropagation();
    const currentQuiz = activeQuizList[currentQuizIndex];

    if (isCorrect) {
        totalExp += 20;
        checkLevelUp(0); 
    } else {
        insertWeaknessToList(currentQuiz.q + " (答: " + currentQuiz.a + ")");
    }

    currentQuizIndex = (currentQuizIndex + 1) % activeQuizList.length;
    loadQuizQuestion();
}

function toggleQuizForm(event) {
    event.stopPropagation();
    const form = document.getElementById('quizFormContainer');
    form.style.display = (form.style.display === 'block') ? 'none' : 'block';
}

function addCustomQuiz(event) {
    event.stopPropagation();
    const qInput = document.getElementById('customQuestion');
    const aInput = document.getElementById('customAnswer');
    const qValue = qInput.value.trim();
    const aValue = aInput.value.trim();

    if (qValue === "" || aValue === "") return;

    activeQuizList.unshift({ q: qValue, a: aValue });
    currentQuizIndex = 0; 
    
    qInput.value = "";
    aInput.value = "";
    toggleQuizForm(event); 
    
    loadQuizQuestion(); 
}

// 🏆 Steam風アチーブメント＆音
let unlockedAchievements = {};

function unlockAchievement(name, badgeId) {
    if (unlockedAchievements[name]) return;
    unlockedAchievements[name] = true;

    const badge = document.getElementById(badgeId);
    if (badge) {
        badge.classList.add('unlocked');
    }

    playAchievementSound();

    const toast = document.getElementById('steamToast');
    const nameDisplay = document.getElementById('steamBadgeName');
    
    nameDisplay.innerText = name;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function playAchievementSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        gain2.gain.setValueAtTime(0, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.3);
        
        osc2.start(audioCtx.currentTime + 0.1);
        osc2.stop(audioCtx.currentTime + 0.5);
    } catch(e) {
        console.log("Audio exception: " + e);
    }
}

function triggerSteamTest(type) {
    if (type === 'first') {
        unlockedAchievements['最初の一歩'] = false;
        unlockAchievement('最初の一歩', 'badge1');
    } else if (type === 'timer') {
        unlockedAchievements['集中マスター'] = false;
        unlockAchievement('集中マスター', 'badge2');
    } else if (type === 'hero') {
        unlockedAchievements['伝説の勇者'] = false;
        unlockAchievement('伝説の勇者', 'badge3');
    }
}

// データをブラウザ（localStorage）に保存する関数
function saveData() {
    const gameState = {
        level: currentLevel, // お使いのレベル変数名に変更してください
        logs: nigateLogs     // お使いのログ変数名に変更してください
    };
    localStorage.setItem('studyQuestData', JSON.stringify(gameState));
}

// 保存されたデータを読み込んで復元する関数
function loadData() {
    const savedData = localStorage.getItem('studyQuestData');
    if (savedData) {
        const gameState = JSON.parse(savedData);
        currentLevel = gameState.level;
        nigateLogs = gameState.logs;
        // 画面上のレベル表示やログ一覧を更新する関数をここで実行
        updateUI(); 
    }
}

// ページを開いたときに読み込みを実行
window.addEventListener('DOMContentLoaded', () => {
    loadData();
});