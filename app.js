'use strict';
const WALL = '#'
const MINE = '💣';


var gBoard = [];
var gTime = 0;
var gInterval;
var gMines = [];

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gLevel = {
    size: 4,
    mines: 2
};


// addMines should be removed from init and exe after first click - TODO
function init() {
    console.log('Starting init');

    gBoard = buildBoard();
    console.log('This is the board created in buildBoard:', gBoard);
    console.table(gBoard);
    renderBoard(gBoard, '.board-container')
    addMines(gBoard);
    setMinesNegsCountBoard(gBoard);
    // renderBoard(gBoard, '.board-container')

    console.log('Finish init');
}

function buildBoard() {
    var board = [];
    var size = gLevel.size;
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
// 4. Click on a marked cell - Done
function cellClicked(elCell, i, j, ev) {
    console.log('Cell clicked');
    console.log(ev);

    var currCell = gBoard[i][j];
    if (currCell.minesAroundCount >= 0) {
        currCell.isShown = true;
        elCell.classList.remove('hide');
    }

    if (currCell.isMarked) return;

    // if (currCell.isMine)  TODO

}



// Add mines randomly
// Change the word idx - TODO
// Change default 2 to a number according to the game level - TODO
function addMines(board) {
    var mines = [];
    for (var idx = 0; idx < 2; idx++) {
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



