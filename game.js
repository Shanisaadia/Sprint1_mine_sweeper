'use strict';

// TODO - Remove uplicate code for display (none and block) elements for win/loose
function gameOver() {
    console.log('Clicked on a mine, game over');
    gGame.isOn = false;

    smileyHandler(2);
    clearInterval(gInterval);

    var elgameOver = document.querySelector('.game-over');
    elgameOver.style.display = 'block';
    var elRestart = document.querySelector('.restart');
    elRestart.style.display = 'block';
}

function checkWin() {
    gMarkedMineCount = countMarkedMines();
    var totalCellMinusMines = ((gLevel.size ** 2) - gMine.length);
    var showenCellCount = 0;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isShown) showenCellCount++;
        }
    }
    if (gMarkedMineCount === gMine.length && // All mines are flagged
        totalCellMinusMines === showenCellCount) { // All other cells are showen
        console.log('win');
        gGame.isOn = false;
        smileyHandler(3);
        clearInterval(gInterval);
        var elVictory = document.querySelector('.victory');
        elVictory.style.display = 'block';
        var elRestart = document.querySelector('.restart');
        elRestart.style.display = 'block';
    }
}

function countMarkedMines() {
    var markedMineCount = 0;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && currCell.isMarked) {
                markedMineCount++;
            }
        }
    }
    return markedMineCount;
}

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
    return level, startDefaultGame(level);
}

function resetTimer() {
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
