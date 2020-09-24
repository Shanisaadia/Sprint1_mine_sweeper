
'use strict';

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderBoard(board, selector) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {
            var minesAroundCount = (board[i][j].minesAroundCount);
            var className = getClassName({ i, j });
            var cell = (board[i][j].isMine) ? MINE : minesAroundCount;
            if (cell === 0) cell = '';
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" onclick="leftCellClicked(this,${i},${j}, event)" oncontextmenu="cellMarked(this)" class="${className}">${cell}</td>`;

            strHTML += '</td>';
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;
}

function getClassName(location) {
    var className = `cell cell-${location.i}-${location.j} hide`;
    return className;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getCellCoord(strClassName) {
    var parts = strClassName.split('-');
    var coord = {
        i: +parts[1],
        j: +parts[2],
    };
    return coord;
}

function smileyHandler(value) {
    var elSmiley = document.querySelector('.smiley')
    if (value == '1') elSmiley.innerText = ('😀');
    if (value == '2') elSmiley.innerText = ('😡');
    if (value == '3') elSmiley.innerText = ('😎');
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

function newGameUpdateDOM() {
    // Hide Game over element
    var elgameOver = document.querySelector('.game-over');
    elgameOver.style.display = 'none';
    // Hide restart button
    var elRestart = document.querySelector('.restart');
    elRestart.style.display = 'none';
    // Hide victory announcement
    var elVictory = document.querySelector('.victory');
    elVictory.style.display = 'none';
}