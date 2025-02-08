let currentGame = '';
let scores = {
    memory: 0,
    spelling: 0,
    math: 0
};

// Load high scores from localStorage
const highScores = JSON.parse(localStorage.getItem('highScores')) || {
    memory: 0,
    spelling: 0,
    math: 0
};

function showGame(gameName) {
    currentGame = gameName;
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${gameName}-game`).classList.add('active');
    
    if (gameName === 'memory') initMemoryGame();
    if (gameName === 'spelling') initSpellingGame();
    if (gameName === 'math') initMathGame();
}

// Memory Game Logic
const memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame(difficulty = 'easy') {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    matchedPairs = 0;
    
    const pairs = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
    const symbols = 'QWERTYUIOP'.slice(0, pairs).split('');
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(this)) return;
    
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        scores.memory += 10;
        showFeedback('Match found!', 'success');
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        scores.memory = Math.max(0, scores.memory - 1);
    }
    
    flippedCards = [];
    updateScores();
}

// Spelling Game Logic
const wordLists = {
    easy: ['cat', 'dog', 'hat', 'run', 'jump'],
    medium: ['elephant', 'giraffe', 'bicycle', 'computer'],
    hard: ['extraordinary', 'pneumonia', 'encyclopedia']
};
let currentWord = '';

function initSpellingGame(difficulty = 'easy') {
    currentWord = wordLists[difficulty][Math.floor(Math.random() * wordLists[difficulty].length)];
}

function speakWord() {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    window.speechSynthesis.speak(utterance);
}

function checkSpelling() {
    const input = document.getElementById('spelling-input');
    const userAnswer = input.value.toLowerCase().trim();
    
    if (userAnswer === currentWord) {
        scores.spelling += 10;
        showFeedback('Correct spelling!', 'success');
    } else {
        scores.spelling = Math.max(0, scores.spelling - 5);
        showFeedback(`Incorrect. The word was: ${currentWord}`, 'error');
    }
    
    input.value = '';
    updateScores();
    initSpellingGame();
}

// Math Game Logic
let currentProblem = {};

function initMathGame(difficulty = 'easy') {
    const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
    const operations = difficulty === 'easy' ? ['+', '-'] : ['+', '-', '*'];
    
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    currentProblem = {
        num1,
        num2,
        operation,
        answer: eval(`${num1} ${operation} ${num2}`)
    };
    
    document.getElementById('math-problem').textContent = 
        `${num1} ${operation} ${num2} = ?`;
}

function checkMathAnswer() {
    const input = document.getElementById('math-input');
    const userAnswer = parseFloat(input.value);
    
    if (userAnswer === currentProblem.answer) {
        scores.math += 10;
        showFeedback('Correct answer!', 'success');
    } else {
        scores.math = Math.max(0, scores.math - 5);
        showFeedback('Incorrect answer. Try again!', 'error');
    }
    
    input.value = '';
    updateScores();
    initMathGame();
}

// Utility Functions
function setDifficulty(game, level) {
    if (game === 'memory') initMemoryGame(level);
    if (game === 'spelling') initSpellingGame(level);
    if (game === 'math') initMathGame(level);
}

function updateScores() {
    document.getElementById('memory-score').textContent = scores.memory;
    document.getElementById('spelling-score').textContent = scores.spelling;
    document.getElementById('math-score').textContent = scores.math;
    document.getElementById('totalScore').textContent = 
        scores.memory + scores.spelling + scores.math;
    
    // Update high scores
    Object.keys(scores).forEach(game => {
        if (scores[game] > highScores[game]) {
            highScores[game] = scores[game];
            localStorage.setItem('highScores', JSON.stringify(highScores));
        }
    });
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    
    setTimeout(() => {
        feedback.className = 'feedback';
    }, 2000);
}

// Initialize the first game
showGame('memory');

