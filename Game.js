function Game(gameInterface, numberOfPlayers) {
	
	// Set a reference to the game interface
	this.gameInterface = gameInterface;
	
	// Create an array for the players in the game
	this.players = [];
	
	// Start the game
	this.restartGame(numberOfPlayers);
	
	// Set event listeners 
	var thisGame = this;
	this.gameInterface.find("#next_round").click(function() {
		thisGame.playRound();
	});
	this.gameInterface.find("#gameplay_controls .restart_game").click(function() {
		thisGame.restartGame();
	});
	this.gameInterface.find("#finished_controls .restart_game").click(function() {
		thisGame.restartGame();
	});
	
}

// Public
// This function will advance the game one round
Game.prototype.playRound = function() {
	
	// Remove a card from the game interface for each player's hand
	console.log("hi");	
	// Pop a card off of each player's hand, and simultaneously check if this is the last round (<2 players have cards left)
	var playerIndexToCardMap = {};
	var playersWithCardsRemaining = [];
	for (var i = 0; i < this.players.length; i++) {
		
		var player = this.players[i];
		
		if (player.hasCardsLeft()) {
			
			playerIndexToCardMap[i] = player.getCard();
			
			// If this player has cards left, add it to playersWithCardsRemaining
			if (player.hasCardsLeft()) {
				playersWithCardsRemaining.push(player)
			}
			
		}
	}
	
	// Find the winning player(s)
	var playersWithTheMaxCard = [];
	var maxCardValue = 0;
	for (var playerIndex in playerIndexToCardMap) {
		
		var cardValue = playerIndexToCardMap[playerIndex].getValue();
		
		if (cardValue > maxCardValue) {
			
			// If this is a new max, empty the playersWithTheMaxCard list, add this player, and redefine the maxCardValue
			maxCardValue = cardValue;
			playersWithTheMaxCard = [playerIndex];
			
		} else if (cardValue == maxCardValue) {
			
			// If this player also has the max card value, add this player to playersWithTheMaxCard list
			playersWithTheMaxCard.push(playerIndex);
			
		}
		
	}
	
	// Check for ties
	if (playersWithTheMaxCard.length > 1) {
		
	} else {
		
		// There were no ties, add all cards in play to the winning player
		var winningPlayer = this.players[playersWithTheMaxCard[0]];
		var cardsWon = [];
		
		for (var playerIndex in playerIndexToCardMap) {
			cardsWon.push(playerIndexToCardMap[playerIndex]);
		}
		
		winningPlayer.addToPot(cardsWon);
		
	}
	
	// Check if no more players have cards, to end the game
	if (playersWithCardsRemaining.length < 2) {
		
		// If there is only 1 player with cards remaining, add their hand to their pot
		if (playersWithCardsRemaining.length == 1) {
			var lastPlayer = playersWithCardsRemaining[0];
			while (lastPlayer.hasCardsLeft()) {
				lastPlayer.addToPot(lastPlayer.getCard());
			}
		}
		
		// End the game
		this.finishGame();
		
	}
		
}

// Public
// This function will restart the game with a new shuffled deck
Game.prototype.restartGame = function(numberOfPlayers) {
	
	// Need to maintain a reference to "this" game, because the Javascript "this" keyword is a pain
	var thisGame = this;
	
	// If the number of players to start the game with have already been initialized, then just reset their stats, otherwise recreate new players
	if (this.players.length == numberOfPlayers || numberOfPlayers == undefined) {
		
		// Empty the winning pots of each player
		this.players.forEach(function(player) {
			player.emptyPot();
		});
				
	} else {
		this.gameInterface.find("#players_container").empty();
		for (var i = 0; i < numberOfPlayers; i++) {
			
			// Create player container DIV and give it the appropriate width
			var $playerContainer = $('<div class="player_container"><div class="player_name">Player '+(i+1)+'</div><div class="player_hand"></div><div class="player_pot"></div></div>');
			$playerContainer.css({width: (100 / numberOfPlayers)+"%"});
			this.gameInterface.find("#player_containers").append($playerContainer);
			
			// Add new player to this game
			this.players.push(new Player($playerContainer));
			
		}
	}
	
	// Generate a new shuffled deck and give each player an equal portion (Note: there may be leftover cards depending on the number of players)
	var deck = this.generateShuffledDeck();
	var playerHandSize = Math.floor(52 / this.players.length);
	for (var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		var deckPortion = deck.splice(0, playerHandSize);
		player.setHand(deckPortion);
	}
	
	// Show the gameplay controls, hide the finished controls and add click listeners
	this.gameInterface.find("#gameplay_controls").show();
	this.gameInterface.find("#finished_controls").hide();
	
}

// Private
// This function will end the game, declare a winner, and update the interface
Game.prototype.finishGame = function() {
	
	var thisGame = this;
	
	// Hide the gameplay controls, show the finished controls and add click listeners
	this.gameInterface.find("#gameplay_controls").hide();
	this.gameInterface.find("#finished_controls").show();
	
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