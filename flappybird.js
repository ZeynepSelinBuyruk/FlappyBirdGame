//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 2;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//physics
let velocityY = -2; //bird jump speed, start with slight upward
let gravity = 0.24; //much slower fall

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let startButton;

//game loop
let gameRunning = false;
let gameOver = false;
let gameStarted = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    startButton = document.getElementById("start-button");

    //load image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    //draw initial start screen once images are ready
    birdImg.onload = function() {
        drawStartScreen();
        setStartButtonVisible(true, "start");
    }

    startButton.addEventListener("click", function(e) {
        e.stopPropagation();
        jump();
    });
}

//update function
function update() {
    if (gameOver) {
        //draw game over
        context.fillStyle = "red";
        context.font = "45px Courier";
        context.fillText("Game Over", boardWidth / 2 - 100, boardHeight / 2);
        setStartButtonVisible(true, "gameover");
        return;
    }

    //clear canvas
    context.clearRect(0, 0, board.width, board.height);

    //draw score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 30);

    //apply gravity with a fall speed cap
    velocityY = Math.min(velocityY + gravity, 6);
    bird.y += velocityY;

    //draw bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //label under bird
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.fillText("şakir", bird.x + bird.width / 2, bird.y + bird.height + 18);
    context.textAlign = "left";

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += -1.1; //slower pipe movement
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
            if (pipe.img == topPipeImg) {
                score++; //increase score when bird passes a top pipe (every pipe pair)
            }
        }

        //collision
        if (detectCollision(bird, pipe)) {
            gameRunning = false;
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //spawn pipes
    if (pipeArray.length == 0 || pipeArray[pipeArray.length - 1].x < boardWidth - 250) {
        createPipe();
    }

    //check boundaries
    if (bird.y + bird.height >= boardHeight || bird.y <= 0) {
        gameRunning = false;
        gameOver = true;
    }

    requestAnimationFrame(update);
}

//start screen renderer
function drawStartScreen() {
    context.clearRect(0, 0, board.width, board.height);
    bird.x = birdX;
    bird.y = birdY;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.fillText("şakir", bird.x + bird.width / 2, bird.y + bird.height + 18);
    context.textAlign = "left"; //reset for in-game use
}

//jump function
function jump() {
    if (!gameStarted || gameOver) {
        startGame();
    }
    if (!gameRunning) {
        return; //guard if startGame failed for some reason
    }
    velocityY = -7; //moderate jump
}

function startGame() {
    if (gameRunning) {
        return;
    }
    gameStarted = true;
    gameOver = false;
    score = 0;
    pipeArray = [];
    bird.x = birdX;
    bird.y = birdY;
    velocityY = 0;
    gameRunning = true;
    setStartButtonVisible(false);
    requestAnimationFrame(update);
}

function setStartButtonVisible(visible, mode = "start") {
    if (!startButton) return;
    if (!visible) {
        startButton.style.display = "none";
        return;
    }
    startButton.textContent = "Start";
    startButton.style.display = "block";
    startButton.style.top = mode === "gameover" ? "60%" : "50%";
}

//pipe functions
function createPipe() {
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight * 0.48; //much wider gap between pipes

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

//event listeners
document.addEventListener("keydown", function(e) {
    if (e.code == "Space") {
        jump();
    }
});

document.addEventListener("click", function() {
    jump();
});

