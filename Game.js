function Game() {
	
	// Sets for the user's hand and winnings pot
	this.userHand = new Set();
	this.userPot = new Set();
	
	// Sets for the computer's hand and winnings pot
	this.computerHand = new Set();
	this.computerPot = new Set();
	
}

// Public
// This function will advance the game one round
Game.prototype.playRound = function() {
	
}

// Public
// This function will restart the game with a new shuffled deck
Game.prototype.restart = function() {
	
}

// Private
// This function will end the game, declare a winner, and update the interface
Game.prototype.finishGame = function() {
	
}

// Static function
Game.prototype.generateShuffledDeck = function() {
	
}