'use strict';

const MINE = '💣';
const FLAG = '🚩';

var gBoard = [];
var gGame = {};
var gTime = 0;
var gStartTime;
var gInterval;
var gMine = [];
var gLevel;
var gClicksCounter;
var gIsVictory = false;
var gliveCount;
var gMarkedMineCount = 0;
var gSafeClick;
// var gValidLocations = [];

// TODO - Merge init and start new game 
function init() {
    console.log('Starting init');
    gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 };
    gliveCount = 3;
    renderLifeCount();
    gSafeClick = 3;
    renderSafeClick();
    gClicksCounter = 0;
    clearInterval(gInterval);
    resrTimer();
    gStartTime = 0;
    gSafeClick = 3;
    // gValidLocations = getValidlocations();

    // Change to 2!
    gLevel = { size: 4, mines: 2 };
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard, '.board-container')
    newGameUpdateDOM();
    smileyHandler(1);
    console.log('Finish init');
}

function startNewGame(level) {
    console.log('Starting new Game');
    gLevel = level;
    gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 };
    gliveCount = 3;
    renderLifeCount();
    gSafeClick = 3;
    renderSafeClick();
    gClicksCounter = 0;
    clearInterval(gInterval);
    resrTimer();
    gStartTime = 0;
    gSafeClick = 3;
    gBoard = buildBoard(level.size);
    renderBoard(gBoard, '.board-container')
    newGameUpdateDOM();
    smileyHandler(1);
    console.log('Finish start over');
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell();
        }
    }
    return board;
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

// Perform setMinesNegsCountCell for the entire board
function setMinesNegsCountBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            setMinesNegsCountCell(board, i, j);
        }
    }
    renderBoard(board, '.board-container')

}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCountCell(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                (j < 0 || j > board.length - 1)) continue;
            var cell = board[i][j];
            if (cell.isMine === true) {
                count++;
                board[rowIdx][colIdx].minesAroundCount = count;
            }
        }
    }
    return count;
}

function leftCellClicked(elCell, i, j,) {
    if (gliveCount < 1) return;
    if (!gGame.isOn) return;
    console.log('Left cell clicked');

    if (gClicksCounter === 0) {   // If this is the first click
        console.log('first left click');
        startTimer();
        gClicksCounter = 1;
        gMine = addMines(gBoard, gLevel.mines);
        setMinesNegsCountBoard(gBoard);
        renderBoard(gBoard, '.board-container');
        renderMineAndMarkedCount();
    } else {

        var currCell = gBoard[i][j];
        if (currCell.isShown) return;
        // Left click on a number >> reveal only that cell 
        if (currCell.minesAroundCount > 0 && !currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;
            elCell.classList.remove('hide');
        }
        // Left click on zero >> reveal the cell and 1st degree neighbors
        if (currCell.minesAroundCount === 0 && !currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;
            elCell.classList.remove('hide');
            expandShown(gBoard, i, j);
        }
        // Left click on marked cell does nothing
        if (currCell.isMarked) return;
        // left click all a mine >> reveal all other mines
        if (currCell.isMine) {
            currCell.isShown = true;
            gGame.shownCount++;
            if (gliveCount >= 2) {
                gliveCount--;
                renderLifeCount();
                console.log('1 Lives count is:', gliveCount);
                smileyHandler(2);
                setTimeout(function () { smileyHandler(1); }, 2000);
                elCell.classList.remove('hide');
                setTimeout(function () {
                    elCell.classList.add('hide');
                    currCell.isShown = false;
                }, 2000);

            }

            else if (gliveCount === 1) {
                gliveCount--;
                renderLifeCount();
                console.log('2 Lives count is:', gliveCount);
                smileyHandler(2);
                for (var i = 0; i < gMine.length; i++) {
                    var currMine = gMine[i];
                    var elCell = document.querySelector(`.cell-${currMine.i}-${currMine.j}`);
                    elCell.classList.remove('hide');
                    console.log('game over');
                    gameOver();
                }

            }
        }
    }
    checkWin();

}
// TODO Fic left click on Mine
// right cell clicked
function cellMarked(elCell) {
    event.preventDefault(); // Disable menue
    if (!gGame.isOn) return;
    console.log('Right cell clicked');

    if (gClicksCounter === 0) {  // If this is the first click
        console.log('first right click');
        startTimer();
        gClicksCounter = 1;
        gMine = addMines(gBoard, gLevel.mines);
        setMinesNegsCountBoard(gBoard);
        renderBoard(gBoard, '.board-container')
        renderMineAndMarkedCount();
    }
    var flagCoord = getCellCoord(elCell.id); // {i:2, j:3}
    var currCell = gBoard[flagCoord.i][flagCoord.j];

    if (currCell.isMarked && !currCell.isShown) {
        // Right click on already marked >> Unmark it
        currCell.isMarked = false;
        gGame.markedCount--;
        var value = '';
        if (currCell.isMine) {
            value = MINE;
        } else value = currCell.minesAroundCount;

        renderCell(flagCoord, value); // Dup code
        var elCell = document.querySelector(`.cell-${flagCoord.i}-${flagCoord.j}`);
        elCell.classList.add('hide');
        renderMineAndMarkedCount();

    } else if (!currCell.isMarked && !currCell.isShown) {
        // Right click on a cell >> Mark it
        currCell.isMarked = true;
        gGame.markedCount++;
        console.log('gGame.markedCount:', gGame.markedCount);
        renderCell(flagCoord, FLAG); // Dup code
        var elCell = document.querySelector(`.cell-${flagCoord.i}-${flagCoord.j}`);
        elCell.classList.remove('hide');
        renderMineAndMarkedCount();
    }
    checkWin();
    return gBoard, gGame.markedCount;
}

// Reval 1st degree neighbors
function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                (j < 0 || j > board.length - 1)) continue;
            var cell = board[i][j];
            if (cell.isMine === false && cell.isShown === false) {
                cell.isShown = true;
                gGame.shownCount++;
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.classList.remove('hide');
            }
        }
    }
}


// Add mines randomly
function addMines(board, mineNum) {
    var mines = [];
    for (var idx = 0; idx < mineNum; idx++) {
        var i = getRandomIntInclusive(0, board.length - 1);
        var j = getRandomIntInclusive(0, board.length - 1);
        board[i][j].isMine = true;
        mines.push({ i, j });
        renderCell(mines[idx], MINE);
        console.log('Mine' + idx + 'is added');
    }
    return mines;
}

function safeClicked() {
    if (!gGame.isOn) return;
    if (gSafeClick === 0) return;
    console.log('Safe click clicked');
    gSafeClick--;
    renderSafeClick();
    var validLocation = getValidlocations();
    console.log(validLocation);
    markCell(validLocation);
}

function getValidlocations() {
    var currLocation = []; // [{i:2, j:3}]

    for (var idx = 0; idx < gBoard.length; idx++) {
        var i = getRandomIntInclusive(0, gBoard.length - 1);
        var j = getRandomIntInclusive(0, gBoard.length - 1);
        var currCell = gBoard[i][j];
        console.log(currCell);

        if (!currCell.isMine
            && !currCell.isShown
            && !currCell.isMarked) {
            currLocation = { i: i, j: j };
        } 
    }
    return currLocation;
}

function markCell(currLocation) {

    var elCell = document.querySelector(`.cell-${currLocation.i}-${currLocation.j}`);
    elCell.classList.add('mark');
    setTimeout(function () {
        elCell.classList.remove('mark');
    }, 1000);
}