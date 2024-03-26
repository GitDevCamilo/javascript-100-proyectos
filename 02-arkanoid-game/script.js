const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

canvas.width = 448;
canvas.height = 400;

//variables de la pelota
const ballRadius = 4;
//posicion de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;

//velocidad de la pelota
let dx = 2;
let dy = -2;

//variables de la paleta
const paddleHeight = 10;
const paddleWidth = 50;
const PADDLE_SENSITIVITY = 7;

let rightPressed = false;
let leftPressed = false;

//posición de la paleta
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

//variables de los ladrillos
const bricksRowCount = 6;
const bricksColumnCount = 13;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 2;
const bricksOffsetTop = 80;
const bricksOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < bricksColumnCount; c++) {
  bricks[c] = []; //inicializamos con un array vacio
  for (let r = 0; r < bricksRowCount; r++) {
    //calculamos la posicion del ladrillo en la pantalla
    const brickX = c * (brickWidth + brickPadding) + bricksOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + bricksOffsetTop;
    //asignar un color random a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    //guardamos la informacion de cada ladrillo
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  //contexto
  ctx.beginPath(); //inciando el trazado
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath(); //terminando el trazado
}

function drawPaddle() {
  ctx.drawImage(
    $sprite, // imagen
    29, // clipX: coordenadas de recorte
    174, // clipY: coordenadas de recorte
    paddleWidth, // el tamaño del recorte
    paddleHeight, // tamaño del recorte
    paddleX, // posición X del dibujo
    paddleY, // posición Y del dibujo
    paddleWidth, // ancho del dibujo
    paddleHeight // alto del dibujo
  );
}

function drawBricks() {
  for (let c = 0; c < bricksColumnCount; c++) {
    for (let r = 0; r < bricksRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;
      ctx.drawImage(
        $bricks,
        clipX,
        0,
        31,
        14,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      );
    }
  }
}

function drawScore() {}

function collisionDetection() {
  for (let c = 0; c < bricksColumnCount; c++) {
    for (let r = 0; r < bricksRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        x > currentBrick.x && x < currentBrick.x + brickWidth;

      const isBallSameYAsBrick =
        y > currentBrick.y && y < currentBrick.y + brickHeight;

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
  }
}

function ballMovement() {
  //limites en las coliciones laterales
  if (
    x + dx > canvas.width - ballRadius || //la pared derecha
    x + dx < ballRadius //la pared izquierda
  ) {
    dx = -dx;
  }

  //limites en la colicion de arriba
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

  const isBallTouchingPaddle = y + dy > paddleY;
  //la pelota toca la pala
  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // Reiniciar la posición de la pelota
    x = canvas.width / 2;
    y = canvas.height - 30;

    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 10;
    // Reiniciar la dirección de la pelota
    dx = 2;
    dy = -2;
  }

  x += dx;
  y += dy;
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  console.log(rightPressed, leftPressed);
  cleanCanvas();
  //dibujos y checks de colisiones.
  //dibujar elementos
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();

  //colisiones y movimientos
  collisionDetection();
  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}

draw();
initEvents();
