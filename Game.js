function Game(gameInterface, numberOfPlayers, numberOfCardsPlayedDuringWar) {
	
	// Set a reference to the game interface
	this.gameInterface = gameInterface;
	
	// Create a list for the players in the game
	this.players = [];
	
	// Define how many cards should be played during war
	this.numberOfCardsPlayedDuringWar = numberOfCardsPlayedDuringWar;
	
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
	
	// Initiate war between players with the max card
	var winningPlayerAndCardsUsed = this.drawCards(this.players, 1);
	
	var winningPlayer = winningPlayerAndCardsUsed.winner;
	var cardsWon = winningPlayerAndCardsUsed.cards;
	
	winningPlayer.addToPot(cardsWon);
	
	/*
	// Pop a card off of each player's hand
	var playerIndexToCardMap = {};
	for (var i = 0; i < this.players.length; i++) {
		
		var player = this.players[i];
		
		if (player.hasCardsLeft()) {
			
			playerIndexToCardMap[i] = player.getCard();
			
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
			playersWithTheMaxCard = [this.players[playerIndex]];
			
		} else if (cardValue == maxCardValue) {
			
			// If this player also has the max card value, add this player to playersWithTheMaxCard list
			playersWithTheMaxCard.push(this.players[playerIndex]);
			
		}
		
	}
	
	// Check for ties
	if (playersWithTheMaxCard.length > 1) {
		alert("WARRR");
		
		// Initiate war between players with the max card
		var winningPlayerAndCardsUsedDuringWar = this.drawCards(playersWithTheMaxCard);
		
		var winningPlayer = winningPlayerAndCardsUsedDuringWar.winner;
		var cardsWon = winningPlayerAndCardsUsedDuringWar.cards;
		
		winningPlayer.addToPot(cardsWon);
		
	} else {
		
		// There were no ties, add all cards in play to the winning player
		var winningPlayer = playersWithTheMaxCard[0];
		var cardsWon = [];
		
		for (var playerIndex in playerIndexToCardMap) {
			cardsWon.push(playerIndexToCardMap[playerIndex]);
		}
		
		winningPlayer.addToPot(cardsWon);
		
	}
	*/
	
	// Calculate how many players have cards remaining, and who they are
	var playersWithCardsRemaining = [];
	for (var i = 0; i < this.players.length; i++) {
		
		var player = this.players[i];
		
		if (player.hasCardsLeft()) {
			
			playersWithCardsRemaining.push(player);
			
		}
	}
	
	// End the game if there are less than 2 players with cards remaining
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

// Private
// Returns the winning player and the cards used during war
Game.prototype.drawCards = function(players, numberOfCardsPerPlayer) {
	
	// Draw 2 cards for this player
	var playerIndexToCardArrayMap = {};
	var cardsUsedInThisSessionOfWar = [];
	for (var i = 0; i < players.length; i++) {
		
		var player = players[i];
		
		// Declare list of cards used by each player during war
		playerIndexToCardArrayMap[i] = [];
		
		// Add 2 cards to the above list
		for (var j = 0; j < numberOfCardsPerPlayer; j++) {
			if (player.hasCardsLeft()) {
				var cardUsed = player.getCard();
				playerIndexToCardArrayMap[i].push(cardUsed);
				cardsUsedInThisSessionOfWar.push(cardUsed);
			}
		}
	}
		
	// Find the winning player(s)
	var playersWithTheMaxCard = [];
	var maxCardValue = 0;
	for (var playerIndex in playerIndexToCardArrayMap) {
				
		// Make sure this player had enough cards to actually compete
		if (playerIndexToCardArrayMap[playerIndex].length == numberOfCardsPerPlayer) {
						
			var cardValue = playerIndexToCardArrayMap[playerIndex][numberOfCardsPerPlayer - 1].getValue();
			
			if (cardValue > maxCardValue) {
				
				// If this is a new max, empty the playersWithTheMaxCard list, add this player, and redefine the maxCardValue
				maxCardValue = cardValue;
				playersWithTheMaxCard = [players[playerIndex]];
								
			} else if (cardValue == maxCardValue) {
				
				// If this player also has the max card value, add this player to playersWithTheMaxCard list
				playersWithTheMaxCard.push(players[playerIndex]);
				
			}
			
		}
		
	}
	
	// Check for ties
	if (playersWithTheMaxCard.length > 1) {
		
		alert("WARRR");
				
		// Initiate war between players with the max card
		var winningPlayerAndCardsUsedDuringWar = this.drawCards(playersWithTheMaxCard, this.numberOfCardsPlayedDuringWar);
		
		// Add cards used during this session of war to the cards used in the recursive call of war
		winningPlayerAndCardsUsedDuringWar.cards = winningPlayerAndCardsUsedDuringWar.cards.concat(cardsUsedInThisSessionOfWar);
		
		return winningPlayerAndCardsUsedDuringWar; 
		
	} else if (playersWithTheMaxCard.length == 1) {
				
		// There were no ties, there was one winner, add all cards in play to the winning player
		var winningPlayer = playersWithTheMaxCard[0];

		return {winner: winningPlayer, cards: cardsUsedInThisSessionOfWar};
		
	} else {
				
		// There were no winners (all warring players didn't have enough cards)
		// I can't find any set of rules that specifies what should happen here, so I'll just say the first player is the winner
		
		var winningPlayer = players[0];
		
		return {winner: winningPlayer, cards: cardsUsedInThisSessionOfWar};
		
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
	
	// Generate a new shuffled deck and give each player an equal portion
	// (Note: there may be leftover cards depending on the number of players)
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