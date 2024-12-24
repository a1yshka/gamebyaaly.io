const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize = 20;
let tileCount = 20;
let tileSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = null; // Начальное направление отсутствует
let gameSpeed = 140;

// Загружаем изображение яблока и фонв
const appleImage = new Image();
appleImage.src = './img/apple.png'; // Укажите путь к изображению яблока

const backgroundImage = new Image();
backgroundImage.src = './img/background.jpg'; // Укажите путь к изображению фона

const appleScaleFactor = 1.5;

function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.width = canvas.height = Math.floor(size / gridSize) * gridSize;
    tileSize = canvas.width / tileCount;
}

function drawGame() {
    // Очистка экрана
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка фона
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Рисуем фон по всему размеру канваса

    // Отрисовка еды (яблока) как увеличенного изображения
    ctx.drawImage(
        appleImage,
        food.x * tileSize - (tileSize * appleScaleFactor - tileSize) / 1.5, // Центрируем изображение по клетке
        food.y * tileSize - (tileSize * appleScaleFactor - tileSize) / 1.5, // Центрируем изображение по клетке
        tileSize * appleScaleFactor, // Увеличиваем размер изображения яблока
        tileSize * appleScaleFactor  // Увеличиваем размер изображения яблока
    );


    // Отрисовка полосатой змейки
    snake.forEach((segment, index) => {
    // Устанавливаем цвет в зависимости от индекса сегмента
    if (index % 2 === 0) {
        ctx.fillStyle = 'lightgreen'; // Зеленый для четных сегментов
    } else {
        ctx.fillStyle = 'green'; // Желтый для нечетных сегментов
    }
    ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });


    // Движение змейки
    if (direction) {
        const head = { ...snake[0] };
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        // Проверка на столкновения
        if (
            head.x < 0 || head.y < 0 ||
            head.x >= tileCount || head.y >= tileCount ||
            snake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            setTimeout(() => {
                alert('Игра окончена!');
                resetGame();
            }, 500); // Задержка в 1 секунду
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
        } else {
            snake.pop();
        }
    }

    setTimeout(drawGame, gameSpeed);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = null;
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    drawGame()
}

function changeDirection(event) {
    const keyMap = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
    };
    const newDirection = keyMap[event.key];
    if (newDirection) {
        // Исключаем движение в противоположном направлении
        if (
            (direction === 'UP' && newDirection !== 'DOWN') ||
            (direction === 'DOWN' && newDirection !== 'UP') ||
            (direction === 'LEFT' && newDirection !== 'RIGHT') ||
            (direction === 'RIGHT' && newDirection !== 'LEFT') ||
            direction === null
        ) {
            direction = newDirection;
        }
    }
}

function setupTouchControls() {
    document.getElementById('up').addEventListener('click', () => {
        if (direction !== 'DOWN') direction = 'UP';
    });
    document.getElementById('down').addEventListener('click', () => {
        if (direction !== 'UP') direction = 'DOWN';
    });
    document.getElementById('left').addEventListener('click', () => {
        if (direction !== 'RIGHT') direction = 'LEFT';
    });
    document.getElementById('right').addEventListener('click', () => {
        if (direction !== 'LEFT') direction = 'RIGHT';
    });
}

window.addEventListener('keydown', changeDirection);
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
setupTouchControls();
drawGame();
