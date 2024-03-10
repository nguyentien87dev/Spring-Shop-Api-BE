// khung canvas 500*500
let canvas = document.getElementById("game");
let context = canvas.getContext("2d");

let backgroundImage = new Image();
backgroundImage.src = "image.jpg";
const brickSound = new Audio();
brickSound.src = "brick-sound.wav";
let backgroundMusic = new Audio();
backgroundMusic.src = "music.mp3";
// let imgBall = new Image();
// imgBall.src = "imageball.jpg."

let ball = {    //quả bóng
    x: 10,
    y: 470,
    dx: 5,
    dy: 2,
    radius: 10,
    
};

let paddle = {  //thanh chắn
    width: 80,
    height: 10,
    x: 0,
    y: canvas.height - 20,
    speed: 10,

    isMovingLeft: false,
    isMovingRight: false,
};

let BrickConfig = {  //viên gạch
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 4,
    totalCol: 5,
};

let isGameOver = false;
let isGameWin = false;
let userScore = 0;   //lưu điểm chơi
let maxScore = BrickConfig.totalCol * BrickConfig.totalRow * 2;  //điểm tối đa 2điểm/viên

let BrickList = []; //danh sách viên gạch
for (let i = 0; i < BrickConfig.totalRow; i++) {
    for (let j = 0; j < BrickConfig.totalCol; j++) {
        BrickList.push({
            x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false  //xác minh viên gạch nguyên hay bị phá vỡ
        });
    }
}

document.addEventListener("keyup", function (event) {   //bắt sự kiện thả phím.
    console.log("KEY UP");
    console.log(event);

    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = false;
    }
});

document.addEventListener("keydown", function (event) { //bắt sự kiện nhấn phím.
    console.log("KEY DOWN");
    console.log(event);

    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = true;
    }
});

function drawBall() {   //vẽ quả bóng
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
}

function drawPaddle() {   //vẽ thanh chắn
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
}

//  2 * ofset + 5 * width + 4 * margin = 500
//  ofset = margin = 25
//  => 70
//  row 3
//  col 4

function drawBricks() {  //đặt hàm vẽ gạch
    BrickList.forEach(function (b) {   //đi qua từng phần tử và kiểm tra thuộc tính isBroken 
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
            context.fillStyle = "green";
            context.fill();
            context.closePath();
        }
    });
}

function handleBallCollideBounds() {    //quả bóng va điểm giới hạn
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollidePaddle() { //quả bóng va thanh chắn
    if (ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollideBricks() {  //quả bóng va gạch
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                brickSound.play();
                userScore += 2;
                if (userScore >= maxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
                document.getElementById("score").innerHTML = "Score: " + userScore; // hiển thị số điểm trên HTML
            }
        }
    });
}

function updateBallPosition() {   //di chuyển quả bóng
    ball.x += ball.dx;
    ball.y += ball.dy;
}
function updatePaddleBallPosition() {   //thanh chắn di chuyển 
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function checGameOver() {  //điều kiện kết thúc game
    if (ball.y > paddle.y) {
        isGameOver = true;
        backgroundMusic.pause();
    }
}

function handleGameOver() { //thông báo kết thúc game
    if (isGameWin) {
        alert("YOU WIN");

    } else {
        alert("GAME OVER");
    }

}
function draw() {   //di chuyển quả bóng
    if (!isGameOver) {

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(backgroundImage, 0, 0, 500, 500);

        drawBall();   //quả bóng
        drawPaddle(); //thanh chắn
        drawBricks(); //gạch

        handleBallCollideBounds();//quả bóng va chạm điểm
        handleBallCollidePaddle();//quả bóng va thanh chắn
        handleBallCollideBricks();//quả bóng va gạch

        updateBallPosition();        //di chuyển bóng
        updatePaddleBallPosition();  //di chuyển thanh chắn


        checGameOver();  //điều kiện kết thúc game

        requestAnimationFrame(draw);
    } else {
        handleGameOver();  //thông báo kết thúc game
    }
}

function playGame() {
    draw();
    backgroundMusic.play();
}
document.getElementById("start-game").addEventListener("click", playGame);
