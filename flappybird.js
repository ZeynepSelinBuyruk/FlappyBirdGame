//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//physics
let velocityY = 0; //bird jump speed
let gravity = 0.4;

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game loop
let gameRunning = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //load image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    //start game
    gameRunning = true;
    requestAnimationFrame(update);
}

//update function
function update() {
    if (!gameRunning) return;

    //clear canvas
    context.clearRect(0, 0, board.width, board.height);

    //apply gravity
    velocityY += gravity;
    bird.y += velocityY;

    //draw bird
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += -2; //move left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
        }

        //collision
        if (detectCollision(bird, pipe)) {
            gameRunning = false;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //spawn pipes
    if (pipeArray.length == 0 || pipeArray[pipeArray.length - 1].x < boardWidth - 200) {
        createPipe();
    }

    //check boundaries
    if (bird.y + bird.height >= boardHeight || bird.y <= 0) {
        gameRunning = false;
    }

    requestAnimationFrame(update);
}

//jump function
function jump() {
    if (!gameRunning) {
        gameRunning = true;
        requestAnimationFrame(update);
    }
    velocityY = -8; //jump up
}

//pipe functions
function createPipe() {
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardHeight / 4;

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

