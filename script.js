const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Tamanho de cada célula
const tileCount = canvas.width / gridSize; // Número de células em uma linha

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = gridSize; // Direção inicial para a direita
let dy = 0;
let score = 0;
let gameActive = true;

const drawSnake = () => {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
};

const drawFood = () => {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
};

const drawScore = () => {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, canvas.height - 10);
};

const moveSnake = () => {
    const head = { x: snake[0].x + dx / gridSize, y: snake[0].y + dy / gridSize };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
    } else {
        snake.pop();
    }
};

const placeFood = () => {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Certifique-se de que a comida não apareça onde a cobra já está
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
        }
    });
};

const checkCollision = () => {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
};

const updateGame = () => {
    if (!gameActive) return;

    moveSnake();

    if (checkCollision()) {
        gameActive = false;
        document.getElementById('status').textContent = `Game Over! Pontuação final: ${score}`;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
};

const changeDirection = (event) => {
    const key = event.code;

    switch (key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -gridSize;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = gridSize;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -gridSize;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = gridSize;
                dy = 0;
            }
            break;
    }
};

const resetGame = () => {
    snake = [{ x: 10, y: 10 }];
    dx = gridSize;
    dy = 0;
    score = 0;
    gameActive = true;
    document.getElementById('status').textContent = '';
    placeFood();
};

document.addEventListener('keydown', changeDirection);
document.getElementById('reset').addEventListener('click', resetGame);

placeFood();
setInterval(updateGame, 100);
