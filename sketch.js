var canvas;
var backgroundImage, barco1_img, barco2_img;
var database, gameState;
var form, player, playerCount;
var allPlayers, barco1, barco2;
var barcos = [];

function preload() {
  backgroundImage = loadImage("./assets/background.gif");
  barco1_img = loadImage("./assets/barco1.png");
  barco2_img = loadImage("./assets/barco2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
