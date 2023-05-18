class FlappyBirdGame {
  constructor() {
    this.cvs = document.getElementById("canvas");
    this.ctx = this.cvs.getContext("2d");

    this.bird = new Image();
    this.bg = new Image();
    this.fg = new Image();
    this.pipeUp = new Image();
    this.pipeBottom = new Image();
    this.heart = new Image();
    this.gameOver = new Image();

    this.bird.src = "./assets/flappy_bird_bird.png";
    this.bg.src = "./assets/flappy_bird_bg.jpg";
    this.fg.src = "./assets/flappy_bird_fg.png";
    this.pipeUp.src = "./assets/flappy_bird_pipeUp.png";
    this.heart.src = "./assets/heart.png";
    this.gameOver.src = "./assets/game-over.png";
    this.pipeBottom.src = "./assets/flappy_bird_pipeBottom.png";

    this.sounds = false;
    this.fly = new Audio();
    this.scoreAudio = new Audio();

    this.fly.src = "./assets/fly.mp3";
    this.scoreAudio.src = "./assets/score.mp3";

    this.xPos = 10;
    this.yPos = 150;
    this.gap = 80;
    this.grav = 1;
    this.pipes = [];
    this.livesCount = 3;
    this.score = 0;
    this.revel = false;
    this.revelTime = 3000;

    this.pipes[0] = {
      x: this.cvs.width,
      y: 0,
    };

    document.addEventListener("keydown", this.birdUp.bind(this));
  }

  birdUp(e) {
    e = e || window.event;
    if (e.keyCode == "38") {
      this.yPos -= 25;
      if (this.sounds) this.fly.play();
    }
    if (e.keyCode == "40") {
      this.yPos += 15;
    }
  }

  draw() {
    this.ctx.drawImage(this.bg, 0, 0); // draw background first of all

    for (let i = 0; i < this.pipes.length; i++) {
      this.ctx.drawImage(this.pipeUp, this.pipes[i].x, this.pipes[i].y);
      this.ctx.drawImage(
        this.pipeBottom,
        this.pipes[i].x,
        this.pipes[i].y + this.pipeUp.height + this.gap
      );
      this.pipes[i].x--;

      if (this.pipes[i].x == 125) {
        this.pipes.push({
          x: this.cvs.width + 80,
          y: Math.floor(Math.random() * this.pipeUp.height) - this.pipeUp.height,
        });
        if (this.sounds) this.scoreAudio.play();
      }
      if (
        this.xPos + this.bird.width >= this.pipes[i].x &&
        this.xPos <= this.pipes[i].x + this.pipeUp.width &&
        (this.yPos <= this.pipes[i].y + this.pipeUp.height ||
          this.yPos + this.bird.height >=
            this.pipes[i].y + this.pipeUp.height + this.gap) ||
        this.yPos + this.bird.height >= this.cvs.height - this.fg.height
      ) {
        this.birdRevel();
      }

      if (this.xPos == this.pipes[i].x + this.pipeUp.width) {
        this.score++;
      }
      if (this.yPos + this.bird.height == this.cvs.height - this.fg.height) {
        this.yPos = this.bird.height - 10;
      }
    }

    this.ctx.drawImage(this.bird, this.xPos, this.yPos);
    this.ctx.drawImage(this.fg, 0, this.cvs.height - this.fg.height);
    this.yPos = this.yPos + this.grav;

    this.drawLives();
    this.drawScore();
    if (this.livesCount > 0) requestAnimationFrame(this.draw.bind(this));
  }

  drawLives() {
    for (let i = 0; i < this.livesCount; i++) {
      this.ctx.drawImage(this.heart, i * 30, 20);
    }
  }

  birdRevel() {
    if (!this.revel) {
      this.revel = true;
      this.livesCount--;
      if (this.livesCount === 0) {
        this.ctx.drawImage(this.gameOver, 100, 150);
      }
      setTimeout(() => {
        this.revel = false;
      }, this.revelTime);
    }
  }

  drawScore() {
    this.ctx.font = "25px serif";
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(this.score, this.cvs.width - 25, 52);
  }
}

const game = new FlappyBirdGame();
game.draw();