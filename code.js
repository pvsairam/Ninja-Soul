// game.js

let game; // To hold the Phaser game instance
let player; // To hold our ninja player sprite
let cursors; // To handle keyboard input
let ground; // To hold the ground platform

const gameConfig = {
    type: Phaser.AUTO, // Phaser will decide whether to use WebGL or Canvas
    width: 800,        // Game width in pixels
    height: 600,       // Game height in pixels
    parent: 'game-container', // ID of the div to inject the canvas into
    backgroundColor: '#1a1a2e', // Match body for seamlessness if canvas doesn't fill
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 }, // Gravity pulling things down
            debug: false // Set to true to see physics bodies/velocities
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// --- PRELOAD SCENE ---
// Used to load assets like images, sounds, etc.
function preload() {
    // For now, let's create a simple placeholder for our ninja and ground
    // We'll use basic graphics until we have art assets.
    // Create a 32x48 blue rectangle texture for the player
    let playerData = new Phaser.Display.Color(0, 0, 255); // Blue
    this.textures.generate('playerPlaceholder', { data: playerData.rgba, width: 32, height: 48 });

    // Create a 800x32 green rectangle texture for the ground
    let groundData = new Phaser.Display.Color(0, 255, 0); // Green
    this.textures.generate('groundPlaceholder', { data: groundData.rgba, width: 800, height: 32 });
}

// --- CREATE SCENE ---
// Called once after preload, used to set up game objects, physics, etc.
function create() {
    // Add the ground
    // A static physics body doesn't react to gravity or forces
    ground = this.physics.add.staticImage(gameConfig.width / 2, gameConfig.height - 16, 'groundPlaceholder');

    // Add the player
    // An arcade sprite is a dynamic physics body
    player = this.physics.add.sprite(100, gameConfig.height - 150, 'playerPlaceholder');
    player.setBounce(0.1); // A little bounce on landing
    player.setCollideWorldBounds(true); // Don't let player fall out of the world (except bottom)

    // Make the player collide with the ground
    this.physics.add.collider(player, ground);

    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    // We'll also listen for spacebar specifically for jump
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

// --- UPDATE SCENE ---
// Called every frame, used for game logic, input handling, etc.
function update() {
    // Player movement (for now, just jump)
    // `isDown` checks if the key is currently being pressed
    // `Phaser.Input.Keyboard.JustDown` checks if it was just pressed this frame (better for jumps)
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && player.body.touching.down) {
        player.setVelocityY(-550); // Apply an upward velocity (jump force)
    }

    // Simple horizontal movement for testing (we'll make this auto-run later)
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        // player.anims.play('left', true); // We'll add animations later
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        // player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        // player.anims.play('turn');
    }
}

// Initialize the game when the window loads
window.onload = function() {
    game = new Phaser.Game(gameConfig);
};