#!/usr/bin/env node
var readline = require('readline'),
    optimist = require('optimist'),
    emoji = require('node-emoji'),
    initArray = require('init-array'),
    WorldmapGenerator = require('worldmap-generator');
    
require('colors');


var gameIterationLength = 100;
switch(optimist.argv.difficulty) {
    case 2: gameIterationLength = 65; break;
    case 'nightmare':
    case 3: gameIterationLength = 25; break;
    default:
    case 1: gameIterationLength = 100; break;
}

var enableEmoji = true;
if (optimist.argv.emoji !== undefined) {
    enableEmoji = optimist.argv.emoji ? true : false;
}

var sprites = {
    player: enableEmoji ? emoji.get('sheep') : '@'.white.bold,
    enemy: enableEmoji ? emoji.get('crocodile') : '#'.red.bold,
    grass: enableEmoji ? emoji.get('seedling') : ' ',
    water: enableEmoji ? emoji.get('wavy_dash') : '~'.cyan,
    food: enableEmoji ? emoji.get('four_leaf_clover') : '$'.bgYellow
}

const width = 20, height = 20;

var playerX, playerY;
var enemyX, enemyY;
var foodX, foodY;
var score;
var display;
var map;

function generateMap() {
    map = initArray([width, height], 0);

    var world = new WorldmapGenerator({
        size: {
            width: width,
            height: height
        },
        tileTypes: [
            {
                name: 'grass',
                connections: {'grass': 100, 'water': 1}
            },
            {
                name: 'water',
                connections: {'water': 15, 'grass': 1}
            }
        ]
    });

    world.generate();


    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            map[x][y] = world.map[x][y].name;
        }
    }

}
function nextEnemyTurn() {
    var turnX = 0, 
        turnY = 0;
    if (enemyX < playerX) {
        turnX = 1;
    }
    if (enemyY < playerY) {
        turnY = 1;
    }
    if (enemyX > playerX) {
        turnX = -1;
    }
    if (enemyY > playerY) {
        turnY = -1;
    }
    if (Math.round(Math.random())) {
        enemyX += turnX;
    } else {
        enemyY += turnY;
    }
}
function placeNewFood() {
    foodY = Math.round(Math.random() * (height - 1));
    foodX = Math.round(Math.random() * (width - 1));
    while (map[foodX][foodY] != 'grass') {
        foodY = Math.round(Math.random() * (height - 1));
        foodX = Math.round(Math.random() * (width - 1));
    }
}
function processKeypress() {
    if (!pressedKey) return;

    var playerTurnY = 0;
    var playerTurnX = 0; 
    switch (pressedKey.name) {
        case 'w':
        case 'up': playerTurnY--; break;
        case 's':
        case 'down': playerTurnY++; break;
        case 'a':
        case 'left': playerTurnX--; break;
        case 'd':
        case 'right': playerTurnX++; break;
    }
    if (playerY + playerTurnY < 0) {
        playerY = 0;
    }
    if (playerX + playerTurnX < 0) {
        playerX = 0;
    }
    if (playerY + playerTurnY >= height) {
        playerY = height - 1;
    }
    if (playerX + playerTurnX >= width) {
        playerX = width - 1;
    }
    if (map[playerX + playerTurnX] && map[playerX + playerTurnX][playerY + playerTurnY] == 'grass') {
        playerX += playerTurnX;
        playerY += playerTurnY;
    }
    pressedKey = null;
}
function initGame() {
    generateMap();
    placeNewFood();

    playerX = Math.round(Math.random() * (width - 1));
    playerY = Math.round(Math.random() * (height - 1));
    while (map[playerX][playerY] != 'grass') {
        playerX = Math.round(Math.random() * (width - 1));
        playerY = Math.round(Math.random() * (height - 1));
    }

    enemyX = Math.round(Math.random() * (width - 1));
    enemyY = Math.round(Math.random() * (height - 1));

    score = 0;
    display = initArray([width, height], sprites.grass);
    display[playerX][playerY] = sprites.player;
    display[foodX][foodY] = sprites.food;
}
function processScreen() {
    nextEnemyTurn();
    if (playerX == foodX && playerY == foodY) {
        score++;
        placeNewFood();
    }
    
    // map
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            switch(map[x][y]) {
                case 'grass': display[x][y] = sprites.grass.bgGreen; break;
                case 'water': display[x][y] = sprites.water.bgBlue; break;
            }
        }
    }

    // sheep
    switch(map[playerX][playerY]) {
        case 'grass': display[playerX][playerY] = sprites.player.bgGreen; break;
        case 'water': display[playerX][playerY] = sprites.player.bgBlue; break;
    }

    // food
    switch(map[foodX][foodY]) {
        case 'grass': display[foodX][foodY] = sprites.food.bgGreen; break;
        case 'water': display[foodX][foodY] = sprites.food.bgBlue; break;
    }
    
    // enemy
    switch(map[enemyX][enemyY]) {
        case 'grass': display[enemyX][enemyY] = sprites.enemy.bgGreen; break;
        case 'water': display[enemyX][enemyY] = sprites.enemy.bgBlue; break;
    }

    if (playerX == enemyX && playerY == enemyY) {
        display[enemyX][enemyY] = sprites.enemy.bgRed;
        endGame('dead');
    }
}
function renderScreen(noReturn = false) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Score: '.green + score.toString().green.bold);
    for (let y = 0; y < height; y++) {
        process.stdout.write('\n');
        process.stdout.cursorTo(0);
        for (let x = 0; x < width; x++) {
            process.stdout.write(display[x][y]);
        }
    }
    if (!noReturn) {
        process.stdout.moveCursor(-width, -height);
    }
}
function endGame(reason = 'exit') {
    renderScreen(true);
    console.log('\n');
    switch(reason) {
        case 'dead': 
            console.log('YOU DIED.'.red.bold);
            break;
        case 'exit': 
            console.log('SUICIDE'.red.bold);
            break;
    }
    console.log('Final score: '.green + score.toString().green.bold);
    process.stdin.removeListener("keypress", keypress_handler);
    process.exit(0);
}

// Keypress logger
var pressedKey = null;
readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.emitKeypressEvents(process.stdin);
var keypress_handler = function (str, key) {
    pressedKey = key;
    if (key.name == 'q') {
        endGame('exit');
    }
};
process.stdin.on('keypress', keypress_handler);

// Game cycle
initGame();
setInterval(() => {
    processScreen();
    renderScreen();
    processKeypress();
}, gameIterationLength);