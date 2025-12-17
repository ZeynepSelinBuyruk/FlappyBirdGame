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

//event listeners
document.addEventListener("keydown", function(e) {
    if (e.code == "Space") {
        jump();
    }
});

document.addEventListener("click", function() {
    jump();
});

