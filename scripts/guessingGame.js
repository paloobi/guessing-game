/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

/* **** Guessing Game Constructor **** */

function GuessingGame() {

  // create initial variables for the game
  this.playersGuess = null;
  this.winningNumber = this.generateRandomNumber();
  this.playersGuesses = [];
  this.guessCount = 5;

  // new guessing game starting DOM
  $('.guessCount span').html(this.guessCount);
  $('.hintContent').css({'display': 'none'});
  $('.guessResult').css({'visibility': 'hidden'});  
  $('#playersGuesses span').text('None yet');
  $('#guessValue').val("");

}

/* **** Guessing Game Prototype with Functions **** */

// Generate the Winning Number, between 1 and 100
GuessingGame.prototype.generateRandomNumber = function(){
  return Math.floor(Math.random() * 100);
}

// get a guess from the player
GuessingGame.prototype.playersGuessSubmission = function() {
  var playersGuess = $('input#guessValue').val();
  if (playersGuess != null) {
    this.playersGuess = parseInt(playersGuess);
  }
  $('input#guessValue').val("");
}

// Create a provide hint button that provides additional clues to the "Player"
GuessingGame.prototype.provideHint = function() {

  // create list of numbers for the hint
  var hints = [];
  var i = 0;
  while ( i < 2 ) {
    hints.push(this.generateRandomNumber());
    i++;
  }
  hints.push(this.winningNumber);

  // numerically sort the list of numbers for the hint
  function sortNumber(a,b) { return a - b; }
  hints.sort(sortNumber);

  // display the hint
  $('.hintContent').css({'display': 'block'});
  $('.hint p').text("One of these is the winning number: " + hints.join(", ") + ".");
}


// helper function to determine # of digits guess is from answer
GuessingGame.prototype.digitsDiff = function() {
  var diff = Math.abs(this.playersGuess - this.winningNumber);
  if (diff <= 5) {
    diff = 5;
  } else {
    diff = Math.ceil(diff/10) * 10;
  }
  return diff;
}

// helper function to determine if the guess was too high or too low
GuessingGame.prototype.lowerOrHigher = function() {
  var result;
  if (this.playersGuess > this.winningNumber) {
    result = "higher"
  } else if (this.playersGuess < this.winningNumber) {
    result = "lower";
  }
  return result;
}

// Check if the Player's Guess is the winning number
// and add appropriate message to DOM
GuessingGame.prototype.checkGuess = function() {

  // instantiate the message var. that will be used to show Guess result
  var message;

  // create the message to display
  if (!this.playersGuess) {
    message = "Please enter a number.";
  } else if (this.playersGuess == this.winningNumber) {
    this.gameOver('win');
    message = 'You win! The number was ' + this.winningNumber + '!';
  } else if (this.playersGuesses.indexOf(this.playersGuess) > -1) {
    message = "You already guessed " + this.playersGuess + "!";
  } else {
    // add to list of guesses made
    this.playersGuesses.push(this.playersGuess);
    // reduce guesses left
    this.guessCount -= 1;
    message = "Your guess, " + this.playersGuess + ", is <strong>" + this.lowerOrHigher() + "</strong> than the answer and <strong>within " + this.digitsDiff() + " digits</strong> of the winning number.";
    // update number of guesses left in DOM
    $('.guessCount span').html(this.guessCount);
  }

  // if player is out of guesses, the game ends
  if (this.guessCount <= 0) {
    this.gameOver('lose');
    message = "You lost! Try again?";
  }

  // display guesses made in the DOM
  if (this.playersGuesses.length > 0) {
    $('#playersGuesses span').text(this.playersGuesses.join(", "))
  }

  // display the Guess Result in the DOM
  $('.guessResult').css({'visibility': 'visible'});
  $('.guessResult p').html(message);

}

// Add or remove the gameover modal
GuessingGame.prototype.toggleModal = function() {
  // grab modal from DOM
  var modal = $('.gameOver');

  // if modal is on screen, move it off screen 
  if (modal.css('top') == '20px') {
    modal.animate({'top': '-1000px'}, 500);
    $('.behindModal').fadeOut();

  // otherwise, move the modal onscreen
  } else {
    modal.animate({'top': '20px'}, 500)
    $('.behindModal').fadeIn();
  }
}

// define action to take for win or lose
GuessingGame.prototype.gameOver = function(result) {
  var text, color;

  // define text and border color to display in modal
  if (result == 'win') {
    text = "You Win!";
    color = 'green';
  } else if (result == 'lose') {
    text = "You Lost!";
    color = 'red';
  }

  // add game over text for win or lose
  $('.gameOver h2').html(text);
  $('.gameOver p').html("The number was: " + this.winningNumber);
  $('.gameOver').css({'border-color': color});
  this.toggleModal();

  var that = this;
  // clicking outside the modal will remove the modal
  $('.behindModal').click(function() {
    that.toggleModal();
  });

}

/* *** start a new game when the page is loaded *** */

$(document).ready( function() {
  game = new GuessingGame();

  /* **** Event Listeners/Handlers ****  */

  // When the guess button is clicked, the guess is saved
  $('button#guess').click(function(e) {
    e.preventDefault();
    game.playersGuessSubmission();
    game.checkGuess();
  });

  $(document).keypress(function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      game.playersGuessSubmission();
      game.checkGuess();
    }
  });

  $('.hint button').click(function(e) {
    e.preventDefault();
    if ($('.hintContent').css('display') != 'block') {
      game.provideHint();
    }
  });

  $('button.playAgain').click(function(e) {
    e.preventDefault();
    game = new GuessingGame();
  });

  $('button#giveUp').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    game.gameOver('lose');
  });

});
