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
}

function newGame() {
  playersGuess = null;
  winningNumber = generateRandomNumber();
  playersGuesses = [];
  guessCount = 5;
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
    playersGuess = parseInt(playersGuess)
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

// Check if the Player's Guess is the winning number
// and add appropriate message to DOM

function checkGuess(){
  $('.guessResult').css({'visibility': 'visible'});

  if (!playersGuess) {
    var message = "Please enter a number.";
  } else if (playersGuess == winningNumber) {
    var message = 'You win! The number was ' + winningNumber + '!';
  } else if (playersGuesses.indexOf(playersGuess) > -1) {
    var message = "You already guessed " + playersGuess + "!";
  } else {
    playersGuesses.push(playersGuess);
    guessCount -= 1;
    $('.guessCount span').html(guessCount);
    var message = "Your guess, " + playersGuess + ", is " + lowerOrHigher() + " than the answer and within " + digitsDiff() + " digits of the winning number.";
  }

  if (guessCount <= 0) {
    var message = "You lost! Try again?";
  }

  if (playersGuesses.length > 0) {
    $('#playersGuesses').css({'display': 'inline'});
    $('#playersGuesses span').text(playersGuesses.join(", "))
  }

  $('.guessResult p').text(message);

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

// Allow the "Player" to Play Again

function playAgain(){
  newGame();

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
  provideHint();
});

$('button#playAgain').click(function(e) {
  e.preventDefault();
  playAgain();
  clearScreen();
})

$('button#giveUp').click(function(e) {
  e.preventDefault();
  clearScreen();
  $('.guessResult p').text("The number was: " + winningNumber)
  playAgain();
})
