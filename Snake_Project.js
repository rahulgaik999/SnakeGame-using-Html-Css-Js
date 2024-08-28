// Game variables
let directions = { x: 0, y: 0 }; // Direction in which the snake is moving
let foodSound = new Audio("food.mp3"); // Sound played when food is eaten
let moveSound = new Audio("move.mp3"); // Sound played on snake movement
let gameOverSound = new Audio("gameover.mp3"); // Sound played on game over
let musicSound = new Audio("music.mp3"); // Background music for the game
let speed = 6.5; // Speed of the snake, controls the game difficulty
let LastPaintTime = 0; // Last time the game was rendered
let score = 0; // Game score
let inputDir = { x: 0, y: 0 }; // Initial direction of snake (stationary)

// Snake starting position
let snakeArray = [
    { x: 13, y: 15 }
];
// Initial food position
let food = { x: 6, y: 7 };

// Reference to the game board element
let board = document.getElementById('board');

// Main game loop, called recursively to update the game state
function main(ctime) {
    window.requestAnimationFrame(main);

    // Throttle the frame rate based on speed
    if ((ctime - LastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    LastPaintTime = ctime;
    gameEngine(); // Update the game state
}
// Function to check if the snake has collided with the wall or itself
function isCollide(snakeArray) {
    // Collision with walls
    if (snakeArray[0].x >= 18 || snakeArray[0].x <= 0 || snakeArray[0].y >= 18 || snakeArray[0].y <= 0) {
        return true;
    }
    // Collision with itself
    for (let i = 1; i < snakeArray.length; i++) {
        if (snakeArray[i].x === snakeArray[0].x && snakeArray[i].y === snakeArray[0].y) {
            return true;
        }
    }
    return false;
}
// Core game logic: handling movement, collisions, and rendering
function gameEngine() {
    // Check for collisions
    if (isCollide(snakeArray)) {
        gameOverSound.play(); // Play game over sound
        musicSound.pause(); // Pause background music
        inputDir = { x: 0, y: 0 }; // Reset direction
        alert("Game over. Press any key to restart."); // Alert the player
        snakeArray = [{ x: 13, y: 15 }]; // Reset snake position
        score = 0; // Reset score
    }

    // Check if the snake has eaten the food
    if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
        foodSound.play(); // Play food sound
        score += 1; // Increment score
        scoreBox.innerHTML = "score : " + score; // Update score display
        // Extend the snake by adding a new segment
        snakeArray.unshift({ x: snakeArray[0].x + inputDir.x, y: snakeArray[0].y + inputDir.y });
        // Generate new food position
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move the snake forward
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] };
    }
    // Update the position of the snake's head
    snakeArray[0].x += inputDir.x;
    snakeArray[0].y += inputDir.y;

    // Clear the board and re-render the snake and food
    board.innerHTML = "";
    snakeArray.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head"); // Add head style to the first element
        } else {
            snakeElement.classList.add("snake"); // Add body style to other elements
        }
        board.appendChild(snakeElement);
    });

    // Render the food element
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}
// Start the game loop
window.requestAnimationFrame(main);

// Listen for key presses to change direction
window.addEventListener("keydown", e => {
    moveSound.play(); // Play move sound
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1; // Move up
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1; // Move down
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0; // Move right
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0; // Move left
            break;
        default:
            break;
    }
});

