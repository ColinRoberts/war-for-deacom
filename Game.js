function Game(gameInterface, numberOfPlayers) {
	
	// Set a reference to the game interface
	this.gameInterface = gameInterface
	
	// Create an array for the players in the game
	this.players = [];
	
	// Start the game
	this.restartGame(numberOfPlayers);
	
}

// Public
// This function will advance the game one round
Game.prototype.playRound = function() {
	
	// Remove a card from the game interface for each player's hand
	
	// Pop a card off of each player's hand
	var userCard = this.userHand.shift();
	var computerCard = this.computerHand.shift();
	
	// 
	var userWonThisRound = userCard.getValue() > computerCard.getValue();
	
	
}

// Public
// This function will restart the game with a new shuffled deck
Game.prototype.restartGame = function(numberOfPlayers) {
	
	// Need to maintain a reference to "this" game, because the Javascript "this" keyword is a pain
	var thisGame = this;
	
	// Empty the winning pots of each player
	this.players.forEach(function(player) {
		player.emptyPot();
	});
	
	// Generate a new shuffled deck and give each player an equal portion (Note: there may be leftover cards depending on the number of players)
	var deck = this.generateShuffledDeck();
	var playerHandSize = Math.floor(52 / this.players.length);
	for (var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		var deckPortion = deck.splice(0, playerHandSize);
	}
	
	// Append cards to the game interface
	
	
	// Show the gameplay controls, hide the finished controls and add click listeners
	this.gameInterface.find("#gameplay_controls").show();
	this.gameInterface.find("#finished_controls").hide();
	this.gameInterface.find("#next_round").click(function() {
		thisGame.playRound();
	});
	this.gameInterface.find("#gameplay_controls .restart_game").click(function() {
		thisGame.restartGame();
	});
	
}

// Private
// This function will end the game, declare a winner, and update the interface
Game.prototype.finishGame = function() {
	
	// Hide the gameplay controls, show the finished controls and add click listeners
	this.gameInterface.find("#gameplay_controls").hide();
	this.gameInterface.find("#finished_controls").show();
	this.gameInterface.find("#finished_controls .restart_game").click(function() {
		thisGame.restartGame();
	});
	
}

// Static function
Game.prototype.generateShuffledDeck = function() {
	
	var deck = [];
	
	// Generate all cards
	validSuits.forEach(function(suit) {
		validNumbers.forEach(function(type) {
			deck.push(new Card(suit, type));
		});
		nonNumericCards.forEach(function(type) {
			deck.push(new Card(suit, type));
		});
	});
	
	// Shuffle all cards
	for (var i = deck.length - 1; i > 0; i--) {
		var swapIndex = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[swapIndex]] = [deck[swapIndex], deck[i]];
	}
	
	return deck;
}