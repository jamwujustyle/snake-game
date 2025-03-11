"use strict";
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("high-score");
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = generateFood();
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // This is the head - use an image
      const headElement = createSnakeHead();
      setPosition(headElement, segment);
      // Set the proper rotation based on direction
      rotateSnakeHead(headElement, direction);
      board.appendChild(headElement);
    } else {
      // These are body segments - use dots
      const snakeElement = createGameElement("div", "snake");
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    }
  });
}

// Create the snake head with an image
function createSnakeHead() {
  const head = document.createElement("div");
  head.className = "snake-head";

  const headImg = document.createElement("img");
  headImg.src = "snake-head.png"; // Make sure this image exists in your project folder
  headImg.alt = "Snake Head";

  // Set the image size to match the grid
  headImg.style.width = "100%";
  headImg.style.height = "100%";
  headImg.style.display = "block";

  head.appendChild(headImg);
  return head;
}

// Rotate the snake head based on direction
function rotateSnakeHead(headElement, direction) {
  let rotation = 0;
  switch (direction) {
    case "right":
      rotation = 0;
      break;
    case "down":
      rotation = 90;
      break;
    case "left":
      rotation = 180;
      break;
    case "up":
      rotation = 270;
      break;
  }

  headElement.style.transform = `rotate(${rotation}deg)`;
}

// create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set position of the snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);
  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        // Prevent reversing direction
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
    }
  }
}
document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
