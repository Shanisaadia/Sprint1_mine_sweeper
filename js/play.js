'use strict';
const MINE = '💣';
const FLAG = '🚩';

var gBoard = [];
var gTime = 0;
var gInterval;
var gMine = [];
var gLevel;
var gClicksCounter;
var gStartTime;
var gIsVictory = false;

// TODO - Merge init and start new game 
function init() {
    console.log('Starting init');
    gGame.isOn = true;
    gClicksCounter = 0;
    clearInterval(gInterval);
    resrTimer();
    gStartTime = 0;
    gLevel = { size: 4, mines: 1 }
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard, '.board-container')
    newGameUpdateDOM();
    smileyHandler(1);
    console.log('Finish init');
}

function startNewGame(level) {
    console.log('Starting new Game');
    gLevel = level;
    gGame.isOn = true;
    gClicksCounter = 0;
    clearInterval(gInterval);
    resrTimer();
    gStartTime = 0;
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
    console.log('Left cell clicked');

    if (!gGame.isOn) return;
    if (gClicksCounter === 0) {   // If this is the first click
        console.log('first left click');
        startTimer();
        gClicksCounter = 1;
        gMine = addMines(gBoard, gLevel.mines);
        setMinesNegsCountBoard(gBoard);
        renderBoard(gBoard, '.board-container')
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
            smileyHandler(2);
            for (var i = 0; i < gMine.length; i++) {
                var currMine = gMine[i];
                var elCell = document.querySelector(`.cell-${currMine.i}-${currMine.j}`);
                elCell.classList.remove('hide');
            }
            gameOver();
        }
        checkWin();
    }
}

// right cell clicked
function cellMarked(elCell) {
    event.preventDefault(); // Disable menue
    console.log('Right cell clicked');
    if (!gGame.isOn) return;

    if (gClicksCounter === 0) {  // If this is the first click
        console.log('first right click');
        startTimer();
        gClicksCounter = 1;
        gMine = addMines(gBoard, gLevel.mines);
        setMinesNegsCountBoard(gBoard);
        renderBoard(gBoard, '.board-container')
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
    } else if (!currCell.isMarked && !currCell.isShown) {
        // Right click on a cell >> Mark it
        currCell.isMarked = true;
        gGame.markedCount++;
        console.log('gGame.markedCount:', gGame.markedCount);
        renderCell(flagCoord, FLAG); // Dup code
        var elCell = document.querySelector(`.cell-${flagCoord.i}-${flagCoord.j}`);
        elCell.classList.remove('hide');
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
            if (cell.isMine === false && cell.isShown === false) { // write short
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