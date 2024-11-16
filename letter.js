// Game variables
let score = 0;
let timer = 60; // Game duration in seconds
let gameInterval;
let itemInterval;
let gameRunning = true;

// Elements
const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');

// Player control
let basketPosition = 50; // Initial position (center)
let touchStartX = 0;

// Update score display
function updateScore() {
    scoreDisplay.innerText = "Score: " + score;
}

// Update timer display
function updateTimer() {
    timerDisplay.innerText = "Time: " + timer;
}

// Timer function
function countdownTimer() {
    if (timer > 0) {
        timer--;
        updateTimer();
    } else {
        endGame();
    }
}

// Game over logic
function endGame() {
    clearInterval(gameInterval);
    clearInterval(itemInterval);
    gameRunning = false;
    finalScoreDisplay.innerText = score;
    gameOverScreen.style.display = 'block';
}

// Restart the game
function restartGame() {
    score = 0;
    timer = 60;
    gameRunning = true;
    updateScore();
    updateTimer();
    gameOverScreen.style.display = 'none';
    startGame();
}

// Basket movement for desktop (Arrow keys)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && basketPosition > 0) {
        basketPosition -= 5;
        basket.style.left = basketPosition + '%';
    }
    if (e.key === 'ArrowRight' && basketPosition < 100) {
        basketPosition += 5;
        basket.style.left = basketPosition + '%';
    }
});

// Basket movement for mobile (Touch swipe)
gameArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

gameArea.addEventListener('touchmove', (e) => {
    if (gameRunning) {
        const touchMoveX = e.touches[0].clientX;
        const deltaX = touchMoveX - touchStartX;

        // Move basket based on swipe distance
        if (deltaX > 20 && basketPosition < 100) {
            basketPosition += 1;  // Move right
        } else if (deltaX < -20 && basketPosition > 0) {
            basketPosition -= 1;  // Move left
        }

        basket.style.left = basketPosition + '%';
        touchStartX = touchMoveX;
    }
});

// Create falling items
function createFallingItem() {
    if (!gameRunning) return;
    const fallingItem = document.createElement('div');
    fallingItem.classList.add('fallingItem');
    fallingItem.style.left = Math.random() * 100 + '%';
    gameArea.appendChild(fallingItem);

    // Detect item falling off screen
    fallingItem.addEventListener('animationiteration', () => {
        fallingItem.remove();
        if (gameRunning) createFallingItem(); // Spawn a new item
    });

    // Check for collisions with basket
    const checkCatch = setInterval(() => {
        const itemRect = fallingItem.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
            itemRect.bottom >= basketRect.top &&
            itemRect.left + itemRect.width > basketRect.left &&
            itemRect.left < basketRect.left + basketRect.width
        ) {
            score++; // Increase score
            updateScore();
            fallingItem.remove(); // Remove item after catch
            clearInterval(checkCatch); // Stop checking for collision
        }
    }, 10);
}

// Start game logic
function startGame() {
    gameInterval = setInterval(countdownTimer, 1000); // Countdown timer
    itemInterval = setInterval(createFallingItem, 2000); // Create items every 2 seconds
}

// Initialize the game
startGame();
