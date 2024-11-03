import React, { useEffect } from 'react';
import Phaser from 'phaser';

const Game = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: 0,
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png'); // Colorful space background
      this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
      this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
      this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.audio('jump', 'https://labs.phaser.io/assets/audio/sfx/jump.wav'); // Jump sound
      this.load.audio('coin', 'https://labs.phaser.io/assets/audio/sfx/coin.wav'); // Coin collection sound
      this.load.image('particle', 'https://labs.phaser.io/assets/sprites/particle.png'); // Particle effect
    }

    let player;
    let stars;
    let platforms;
    let cursors;
    let score = 0;
    let scoreText;
    let jumpSound;
    let coinSound;
    let particles;

    function create() {
      this.add.image(400, 300, 'sky');

      platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, 'ground').setScale(2).refreshBody();

      player = this.physics.add.sprite(100, 450, 'dude').setTint(0xffcc00); // Gold tint for player
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.physics.add.collider(player, platforms);

      stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      stars.children.iterate((star) => {
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff',
      });

      cursors = this.input.keyboard.createCursorKeys();

      // Sound effects
      jumpSound = this.sound.add('jump');
      coinSound = this.sound.add('coin');

      // Particle system
      particles = this.add.particles('particle');
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        jumpSound.play(); // Play jump sound
      }
    }

    function collectStar(player, star) {
      star.disableBody(true, true);
      score += 10;
      scoreText.setText('Score: ' + score);
      coinSound.play(); // Play coin sound

      // Particle effect when collecting a coin
      const emitter = particles.createEmitter({
        speed: 100,
        lifespan: 2000,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
      });
      emitter.emitParticle(5, star.x, star.y); // Emit particles at the coin's position

      if (stars.countActive(true) === 0) {
        stars.children.iterate((star) => {
          star.enableBody(true, star.x, 0, true, true);
        });
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game" />;
};

export default Game;
