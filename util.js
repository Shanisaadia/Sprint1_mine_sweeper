
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
            var className = 'cell hide cell' + i + '-' + j;

            var cell = (board[i][j].isMine) ? MINE : minesAroundCount;
            // var tdId = `cell-${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j}, event)" </td>`;
            strHTML += cell;
            strHTML += '</td>';
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function startTimer() {
    var timer = document.querySelector('.timer');
    gInterval = setInterval(function () {
        gTime++
        timer.innerText = gTime
    }, 1000)
}



// function resrTimer() {

//     gStartTime = 0;
//     var elTimer = document.querySelector('.timer');
//     elTimer.innerText = '';
// }



