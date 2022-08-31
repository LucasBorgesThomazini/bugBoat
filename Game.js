class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.upKeyActive = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    barco1 = createSprite(width, height / 2);
    barco1.addImage("barco1", barco1_img);
    barco1.scale = 0.5;

    barco2 = createSprite(width, height / 2);
    barco2.addImage("barco2", barco2_img);
    barco2.scale = 0.5;

    barcos = [barco1, barco2];
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) 
  { for (var i = 0; i < numberOfSprites; i++) 
    { var x, y; 
      //C41 //SA 
      if (positions.length > 0) 
      { x = positions[i].x; y = positions[i].y; 
        spriteImage = positions[i].image; } 
        else { x = random(width / 2 + 150, width / 2 - 150); 
        y = random(-height * 4.5, height - 400); } 
        var sprite = createSprite(x, y); 
        sprite.addImage("sprite", spriteImage); 
        sprite.scale = scale; 
        spriteGroup.add(sprite); } }

  handleElements() {
    form.hide();

    //C39
    this.resetTitle.html("Reiniciar");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {

      this.showLeaderboard();

      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;


        barcos[index - 1].position.x = x;
        barcos[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);


          //alterar a posição da câmera na direção y
          camera.position.x = barcos[index - 1].position.x;
        }
      }

      if (this.playerMoving) {
        player.positionX += 5;
        player.update();
      }

      //manipulando eventos de teclado
      this.handlePlayerControls();

      //Linha de chegada
      const finshLine = height * 6 - 100;

      if (player.positionX > finshLine) {
        gameState = 2;
        player.rank += 1;
        player.updateBarcosAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        barcosAtEnd: 0
      });
      window.location.reload();
    });
  }

  
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(LEFT_ARROW)) {
      this.playerMoving = true;
      player.positionX += 10;
      player.update();
    }

    if (keyIsDown(UP_ARROW) && player.positionX > height / 3 - 50) {
      this.upKeyActive = true;
      player.positionY -= 5;
      player.update();
    }

    if (keyIsDown(DOWN_ARROW) && player.positionX < height / 2 + 300) {
      this.upKeyActive = false;
      player.positionY += 5;
      player.update();
    }
  }



  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
}
