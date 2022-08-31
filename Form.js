class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite Seu Nome");
    this.playButton = createButton("Jogar");
    this.greeting = createElement("h2");
  }

  setElementsPosition() {
    this.input.position(width / 2 - 168, height / 2 - 80);
    this.playButton.position(width / 2 - 150, height / 2 - 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
  }

  setElementsStyle() {
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      var message = `
      Olá ${this.input.value()}
      </br>espere o outro jogador entrar...`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
}
