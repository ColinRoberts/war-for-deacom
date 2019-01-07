function Game() {
	
	// Declare sets for the user's hand and winnings pot
	this.userHand;
	this.userPot;
	
	// Declare sets for the computer's hand and winnings pot
	this.computerHand;
	this.computerPot;
	
	// Start the game
	this.restart();
	
}

// Public
// This function will advance the game one round
Game.prototype.playRound = function() {
	
}

// Public
// This function will restart the game with a new shuffled deck
Game.prototype.restart = function() {
	
	// Empty the winning pots
	this.userPot = new Set();
	this.computerPot = new Set();
	
	// Generate a new shuffled deck and give each player half
	var deck = this.generateShuffledDeck();
	this.userHand = new Set(deck.splice(0, 26));
	this.computerHand = new Set(deck);
	
}

// Private
// This function will end the game, declare a winner, and update the interface
Game.prototype.finishGame = function() {
	
}

// Static function
Game.prototype.generateShuffledDeck = function() {
	
	var deck = [];
	
	validSuits.forEach(function(suit) {
		validNumbers.forEach(function(type) {
			deck.push(new Card(suit, type));
		});
		nonNumericCards.forEach(function(type) {
			deck.push(new Card(suit, type));
		});
	});
	
	return deck;
}