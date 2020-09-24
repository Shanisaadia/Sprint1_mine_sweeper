
'use strict';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gMarkedMineCount = 0;

function checkLevel(size) {
    if (size === 4) {
        var mineNum = 2;
    } else if (size === 8) {
        var mineNum = 12;
    } else var mineNum = 30;

    var level = {
        size,
        mines: mineNum
    }
    return level, startNewGame(level);
}

function resrTimer() {
    gStartTime = 0;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';
}

function startTimer() {
    var elTimer = document.querySelector('.timer');
    var timeStart = new Date().getTime();
    gInterval = setInterval(function () {
        var now = new Date().getTime();
        var distance = now - timeStart;
        var x = new Date();
        x.setTime(distance);
        var minutes = x.getMinutes();
        var seconds = x.getSeconds();
        gGame.timePassed = `00:0${minutes}:${seconds}`;
        elTimer.innerText = gGame.timePassed;
    }, 1000);
}

// TODO - Remove uplicate code for display (none and block) elements for win/loose
function gameOver() {
    console.log('Clicked on a mine, game over');
    gGame.isOn = false;
    clearInterval(gInterval);

    var elgameOver = document.querySelector('.game-over');
    elgameOver.style.display = 'block';
    var elRestart = document.querySelector('.restart');
    elRestart.style.display = 'block';
}

function checkWin() {
    var showenCellCount = 0;
    gMarkedMineCount = countMarkedMines();
    var totalCell = gLevel.size ** 2;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isShown) showenCellCount++;
        }
    }

    if (gMarkedMineCount === gMine.length &&
        showenCellCount === (totalCell - gMine.length)) {
        gGame.isOn = false;
        var elVictory = document.querySelector('.victory');
        elVictory.style.display = 'block';
        smileyHandler(3);
        clearInterval(gInterval);
        var elRestart = document.querySelector('.restart');
        elRestart.style.display = 'block';
    }
}


