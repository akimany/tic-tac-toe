/********************************************/
/* @author : Pauline Ghiazza                */
/* @author site : www.paulineghiazza.fr     */
/********************************************/

var playerMoves = 0
var player2 = 0
var movesDiv = $('.countMoves')
var userTimeDiv = $('.printAverageTime')
var intervals = []
var modalWinPlayer1 = $('.modalWinPlayer1')
var modalWinPlayer2 = $('.modalWinPlayer2')
var modalLosePlayer1 = $('.modalLosePlayer1')
var modalLosePlayer2 = $('.modalLosePlayer2')

$(function() {
  var player = 1
  var table = $('.ticTable')
  var messages = $('.messages')
  var turn = $('.turn')
  var tdList = $('td[class*="item"]')
  var timeIntervals = []
  var playerTally = {
    player1: { wins: 0, losses: 0 },
    player2: { wins: 0, losses: 0 }
  }
  var singleTd
  var playerMove = []

  displayNextPlayer(turn, player)

  $('.ticTable td').click(function() {
    td = $(this)
    var state = getState(td)
    if (!state) {
      countMoves(player)
      addUserTime(timeIntervals)
      var pattern = definePatternForCurrentPlayer(player)
      changeState(td, pattern)

      if (checkIfPlayerWon(table, pattern, player)) {
        messageTurnTally(turn, messages, player, playerTally)
      }
      player = setNextPlayer(player)
      pattern = definePatternForCurrentPlayer(player)
      var p2Td = returnSingleTd(tdList)
      blockPlayer(td, p2Td, pattern, playerMove)
      countMoves(player)
      printAverageTime(timeIntervals)

      if (checkIfPlayerWon(table, pattern, player)) {
        messageTurnTally(turn, messages, player, playerTally)
      } else {
        player = setNextPlayer(player)
        displayNextPlayer(turn, player)
      }
    } else {
      messages.html('This box is already checked.')
    }
  })

  $('.reset').click(function() {
    player = 1
    messages.html('')
    reset(table)
    displayNextPlayer(turn, player)
    playerMoves = 0
    movesDiv.html('')
    userTimeDiv.html('')
    tdList = $('td[class*="item"]')
    tdList.removeClass('completed')
  })
})

function blockPlayer(currentPlayerMove, p2Td, pattern, playerMove) {
  var holdArrays = [],
    blockSelector = [],
    uniq,
    blockTd,
    boardCombinations = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [3, 5, 7],
      [4, 5, 6],
      [7, 8, 9]
    ]
  // an ongoing array that contains a list of the player moves.
  playerMove.push(currentPlayerMove)
  var playerMoveClasses = playerMove.map(e => {
    return Number(
      $(e)
        .attr('class')
        .replace('item', '')
        .split(' ')[0]
    )
  })

  var blocker = playerMoveClasses.forEach(e => {
    // example: playerMoveClasses [1, 2, 4]
    // example: boardCombinations [1, 2, 3], [1, 5, 9], [1, 4, 7],
    // playerMoveClasses gets built up as the game is played

    for (var i = 0; i < boardCombinations.length; i++) {
      for (var j = 0; j < boardCombinations[i].length; j++) {
        if (boardCombinations[i][j] == e) {
          holdArrays.push(boardCombinations[i])
        }
      }
    }

    uniq = holdArrays.sort()

    var results = []
    for (var i = 0; i < uniq.length - 1; i++) {
      if (uniq[i + 1] == uniq[i]) {
        results.push(uniq[i])
      }
    }

    results.map(e => {
      e.forEach(e => {
        blockSelector.push($('.item' + e + ''))
        return blockSelector
      })
    })

    for (var i = 0; i < blockSelector.length; i++) {
      if (!$(blockSelector[i]).hasClass('cross')) {
        if (!$(blockSelector[i]).hasClass('circle')) {
          blockTd = $(blockSelector[i])
        }
      }
    }
  })

  if (
    // tic tac toe technique to block the first player
    $(currentPlayerMove).is('.item1, .item3, .item7, .item9') &&
    !$('.item5').hasClass('circle') &&
    playerMove.length === 1
  ) {
    changeState($('.item5'), pattern)
  } else if (blockTd) {
    changeState(blockTd, pattern)
  } else {
    changeState(p2Td, pattern)
  }
}

function returnSingleTd(tdList) {
  tdList = $(tdList).filter(function(i, e) {
    if (!$(e).hasClass('cross') && !$(e).hasClass('circle')) {
      return e
    }
  })
  singleTd = $(tdList[getRandomNumber(tdList.length)])
  return singleTd
}

function messageTurnTally(turn, messages, player, playerTally) {
  messages.html('Player ' + player + ' has won.')
  turn.html('')
  countPlayerTally(player, playerTally)
}

function countPlayerTally(player, playerTally) {
  if (player === 1) {
    playerTally.player1.wins++
    playerTally.player2.losses++
    modalWinPlayer1.html(playerTally.player1.wins)
    modalLosePlayer2.html(playerTally.player2.losses)
  } else if (player === 2) {
    playerTally.player2.wins++
    playerTally.player1.losses++
    modalWinPlayer2.html(playerTally.player2.wins)
    modalLosePlayer1.html(playerTally.player1.losses)
  }
}

function addUserTime(timeIntervals) {
  var currentTime = Math.round(new Date().getTime() / 1000)
  timeIntervals.push(currentTime)
}

function printAverageTime(timeIntervals) {
  for (i = 0; i < timeIntervals.length - 1; i++) {
    intervals[i] = timeIntervals[i + 1] - timeIntervals[i]
  }
  var combined = intervals.reduce(function(accumulator, current) {
    return current + accumulator
  }, 0)

  var average = Math.floor(combined / intervals.length)
  $(userTimeDiv).html(average)
  return average
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getState(td) {
  if (td.hasClass('cross') || td.hasClass('circle')) {
    return 1
  } else {
    return 0
  }
}

function changeState(td, pattern) {
  return td.addClass(pattern)
}

function definePatternForCurrentPlayer(player) {
  if (player == 1) {
    return 'cross'
  } else {
    return 'circle'
  }
}

function setNextPlayer(player) {
  if (player == 1) {
    return (player = 2)
  } else {
    return (player = 1)
  }
}

function countMoves(player) {
  if (player === 1) {
    playerMoves++
    $(movesDiv).html(playerMoves)
  }
}

function displayNextPlayer(turn, player) {
  turn.html('Player turn : ' + player)
}

function checkIfPlayerWon(table, pattern, player) {
  var won = 0

  if (
    table.find('.item1').hasClass(pattern) &&
    table.find('.item2').hasClass(pattern) &&
    table.find('.item3').hasClass(pattern)
  ) {
    won = 1
    $('.item1, .item2, .item3').addClass('completed')
  } else if (
    table.find('.item1').hasClass(pattern) &&
    table.find('.item4').hasClass(pattern) &&
    table.find('.item7').hasClass(pattern)
  ) {
    won = 1
    $('.item1, .item4, .item7').addClass('completed')
  } else if (
    table.find('.item1').hasClass(pattern) &&
    table.find('.item5').hasClass(pattern) &&
    table.find('.item9').hasClass(pattern)
  ) {
    won = 1
    $('.item1, .item5, .item9').addClass('completed')
  } else if (
    table.find('.item4').hasClass(pattern) &&
    table.find('.item5').hasClass(pattern) &&
    table.find('.item6').hasClass(pattern)
  ) {
    won = 1
    $('.item4, .item5, .item6').addClass('completed')
  } else if (
    table.find('.item7').hasClass(pattern) &&
    table.find('.item8').hasClass(pattern) &&
    table.find('.item9').hasClass(pattern)
  ) {
    won = 1
    $('.item7, .item8, .item9').addClass('completed')
  } else if (
    table.find('.item2').hasClass(pattern) &&
    table.find('.item5').hasClass(pattern) &&
    table.find('.item8').hasClass(pattern)
  ) {
    won = 1
    $('.item2, .item5, .item8').addClass('completed')
  } else if (
    table.find('.item3').hasClass(pattern) &&
    table.find('.item6').hasClass(pattern) &&
    table.find('.item9').hasClass(pattern)
  ) {
    won = 1
    $('.item3, .item6, .item9').addClass('completed')
  } else if (
    table.find('.item3').hasClass(pattern) &&
    table.find('.item5').hasClass(pattern) &&
    table.find('.item7').hasClass(pattern)
  ) {
    won = 1
    $('.item3, .item5, .item7').addClass('completed')
  }
  return won
}

function reset(table) {
  table.find('td').each(function() {
    $(this)
      .removeClass('circle')
      .removeClass('cross')
  })
}
