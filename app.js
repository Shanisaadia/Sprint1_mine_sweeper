'use strict';
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';



var gBoard = [];
var gTime = 0;
var gInterval;
var gMine = [];
var gLevel;
var gComplex = 4;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};



// addMines should be removed from init and exe after first click - TODO
function init() {
    console.log('Starting init');
    // gGame = resetGame();
    gLevel = { size: 4, mines: 2 }
    gBoard = buildBoard(gLevel.size);
    console.log('This is the board created in buildBoard:', gBoard);
    console.table(gBoard);
    renderBoard(gBoard, '.board-container')
    gMine = addMines(gBoard, gLevel.mines);
    setMinesNegsCountBoard(gBoard);
    // renderBoard(gBoard, '.board-container')

    console.log('Finish init');
}

function startNewGame(level) {
    console.log('Starting new Game');
    // gGame = resetGame();
    gBoard = buildBoard(level.size);
    console.log('This is the board created in buildBoard:', gBoard);
    console.table(gBoard);
    renderBoard(gBoard, '.board-container')
    gMine = addMines(gBoard, level.mines);
    setMinesNegsCountBoard(gBoard);
    // renderBoard(gBoard, '.board-container')

    console.log('Finish start over');


}


function buildBoard(size) {
    var board = [];
    // var size = gLevel.size;
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
// Do not show count of 0 - TODO
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

// cell click options:
// 1. First click run the timer - TODO
// 2. Click on empty - TODO
// 3. Click on a mine - TODO
// 4. Click on a marked cell - TODO
function leftCellClicked(elCell, i, j, event) {
    console.log('Left cell clicked');
    console.log(event);
    var currCell = gBoard[i][j];
    if (currCell.minesAroundCount >= 0 && !currCell.isMine) {
        currCell.isShown = true; // hererrere
        elCell.classList.remove('hide');
        revealNeg(gBoard, i, j);
    }
    if (currCell.isMarked) return;

    if (currCell.isMine) {
        for (var i = 0; i < gMine.length; i++) {
            var currMine = gMine[i];
            console.log('ss', currMine);
            var elCell = document.querySelector(`.cell-${currMine.i}-${currMine.j}`);
            elCell.classList.remove('hide');
        }
    }
}


function rightCellClicked(ev) {
    ev.preventDefault();
    console.log('Right cell clicked');
    var flagCoord = getCellCoord(ev.target.className);
    var currCell = gBoard[flagCoord.i][flagCoord.j];

    if (currCell.isMarked) {

        currCell.isMarked = false;
        var value = currCell.minesAroundCount;
        // Update the DOM
        renderCell(flagCoord, value);
        var elCell = document.querySelector(`.cell-${flagCoord.i}-${flagCoord.j}`);
        elCell.classList.add('hide');


        // Update the model - TODO How??
    } else {
        currCell.isMarked = true;
        // Update the DOM
        renderCell(flagCoord, FLAG);
        var elCell = document.querySelector(`.cell-${flagCoord.i}-${flagCoord.j}`);
        elCell.classList.remove('hide');

        // Update the model - TODO How??
    }
    console.table(gBoard);

    return gBoard;
}

// Add mines randomly
// Change the word idx - TODO
// Change default 2 to a number according to the game level - TODO
function addMines(board, mineNum) {
    var mines = [];
    for (var idx = 0; idx < mineNum; idx++) {
        var i = getRandomIntInclusive(0, board.length - 1);
        var j = getRandomIntInclusive(0, board.length - 1);
        board[i][j].isMine = true;
        board[i][j].isShown = false;
        mines.push({ i, j });
        renderCell(mines[idx], MINE);
        console.log('Mine' + idx + 'is added');
    }
    return mines;
}

