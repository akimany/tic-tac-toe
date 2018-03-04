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

      p2(
        player,
        pattern,
        changeState,
        returnSingleTd,
        tdList,
        singleTd,
        timeIntervals,
        table,
        checkIfPlayerWon,
        messageTurnTally,
        turn,
        messages,
        playerTally,
        setNextPlayer,
        displayNextPlayer
      )
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

function p2(
  player,
  pattern,
  changeState,
  returnSingleTd,
  tdList,
  singleTd,
  timeIntervals,
  table,
  checkIfPlayerWon,
  messageTurnTally,
  turn,
  messages,
  playerTally,
  setNextPlayer,
  displayNextPlayer
) {
  player = setNextPlayer(player)
  pattern = definePatternForCurrentPlayer(player)
  changeState(returnSingleTd(tdList, singleTd), pattern)
  countMoves(player)
  printAverageTime(timeIntervals)

  if (checkIfPlayerWon(table, pattern, player)) {
    messageTurnTally(turn, messages, player, playerTally)
  } else {
    player = setNextPlayer(player)
    displayNextPlayer(turn, player)
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
