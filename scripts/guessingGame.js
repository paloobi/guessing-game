/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

var playersGuess,
  winningNumber,
  playersGuesses,
  guessCount;

function clearScreen() {
  $('.guessCount span').html(guessCount);
  $('.hintContent').css({'display': 'none'});
  $('.guessResult').css({'visibility': 'hidden'});  
  $('#playersGuesses span').text('None yet');
  $('#guessValue').val("");
}

function newGame() {
  playersGuess = null;
  winningNumber = generateRandomNumber();
  playersGuesses = [];
  guessCount = 5;
  clearScreen();
}

// Start a new game when the page loads
$(document).ready(newGame);

/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateRandomNumber(){
  // returns a random number between 1 and 100
  return Math.floor(Math.random() * 100);
}

// Fetch the Players Guess

function playersGuessSubmission(){
  playersGuess = $('input#guessValue').val();
  if (playersGuess != null) {
    playersGuess = parseInt(playersGuess);
  }
  $('input#guessValue').val("");
}

// Determine if the guess was too high or too low
function lowerOrHigher(){
  if (playersGuess > winningNumber) {
    result = "higher"
  } else if (playersGuess < winningNumber) {
    result = "lower";
  }
  return result;
}

// determine how many digits away the guess is from the answer
function digitsDiff() {
  var diff = Math.abs(playersGuess - winningNumber);
  if (diff <= 5) {
    diff = 5;
  } else {
    diff = Math.ceil(diff/10) * 10;
  }
  return diff;
}

function toggleModal() {
  var modal = $('.gameOver')
  if (modal.css('top') == '20px') {
    modal.animate({'top': '-1000px'}, 'slow')
  } else {
    modal.animate({'top': '20px'}, 'slow')
  }
}

function gameOver(result) {
  var text, color;
  if (result == 'win') {
    text = "You Win!";
    color = 'green';
  } else if (result == 'lose') {
    text = "You Lost!";
    color = 'red';
  }

  // add game over text for win or lose
  $('.gameOver h2').html(text);
  $('.gameOver p').html("The number was: " + winningNumber);
  $('.gameOver').css({'border-color': color});
  toggleModal();


  // clicking outside the modal will close it
  $('html').click(function() {
    toggleModal();
  });
  $('.gameOver').click(function(event){
      event.stopPropagation();
  });

}

// Check if the Player's Guess is the winning number
// and add appropriate message to DOM

function checkGuess(){

  $('.guessResult').css({'visibility': 'visible'});
  var message;

  if (!playersGuess) {
    message = "Please enter a number.";
  } else if (playersGuess == winningNumber) {
    gameOver('win');
    message = 'You win! The number was ' + winningNumber + '!';
  } else if (playersGuesses.indexOf(playersGuess) > -1) {
    message = "You already guessed " + playersGuess + "!";
  } else {
    playersGuesses.push(playersGuess);
    guessCount -= 1;
    message = "Your guess, " + playersGuess + ", is <strong>" + lowerOrHigher() + "</strong> than the answer and <strong>within " + digitsDiff() + " digits</strong> of the winning number.";
    $('.guessCount span').html(guessCount);
  }

  if (guessCount <= 0) {
    gameOver('lose');
    message = "You lost! Try again?";
  }

  if (playersGuesses.length > 0) {
    $('#playersGuesses span').text(playersGuesses.join(", "))
  }

  $('.guessResult p').html(message);

}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint(){
  
  var hints = [];
  var i = 0;
  while ( i < 2 ) {
    hints.push(generateRandomNumber());
    i++;
  }
  hints.push(winningNumber);

  function sortNumber(a,b) {
      return a - b;
  }
  hints.sort(sortNumber);

  $('.hintContent').css({'display': 'block'});
  $('.hint p').text("One of these is the winning number: " + hints.join(", ") + ".");

}

/* **** Event Listeners/Handlers ****  */

// When the guess button is clicked, the guess is saved
$('button#guess').click(function(e) {
  e.preventDefault();
  playersGuessSubmission();
  checkGuess();
});

$(document).keypress(function(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    playersGuessSubmission();
    checkGuess();
  }
});

$('.hint button').click(function(e) {
  e.preventDefault();
  if ($('.hintContent').css('display') != 'block') {
    provideHint();
  }
});

$('button.playAgain').click(function(e) {
  e.preventDefault();
  toggleModal();
  newGame();
});

$('button#giveUp').click(function(e) {
  e.preventDefault();
  e.stopPropagation();
  gameOver('lose');
});
