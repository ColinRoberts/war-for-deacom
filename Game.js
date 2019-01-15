function Game(gameInterface, numberOfPlayers, numberOfCardsPlayedDuringWar, addPotCardsToHand) {
	
	// Set a reference to the game interface
	this.gameInterface = gameInterface;
	
	// Create a list for the players in the game
	this.players = [];
	
	// Define how many cards should be played during war
	this.numberOfCardsPlayedDuringWar = numberOfCardsPlayedDuringWar;
	
	// Define boolean for whether we should treat a player's pot like its hand
	this.addPotCardsToHand = addPotCardsToHand;
	
	// Start the game
	this.restartGame(numberOfPlayers);
	
}

// Public
// This function will advance the game one round
Game.prototype.playRound = function() {
	
	this.clearTable();
	
	// Draw one card per player
	var winningPlayerAndCardsUsed = this.drawCards(this.players, 1);
	
	// Add the cards used in this round to the winning player's pot
	var winningPlayer = winningPlayerAndCardsUsed.winner;
	var cardsWon = winningPlayerAndCardsUsed.cards;
	
	// Decide where to put the won cards depending on if we addPotCardsToHand
	if (this.addPotCardsToHand) {
		winningPlayer.addToHand(cardsWon);
	} else {
		winningPlayer.addToPot(cardsWon);
	}
	
	// Update the table interface to display the winner
	this.gameInterface.find("#round_winner").html("Player "+winningPlayer.getID()+" wins this round.");
	
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
				lastPlayer.addToPot([lastPlayer.getCard()]);
			}
		}
		
		// End the game
		this.finishGame();
		
	}
		
}

// Private
// Returns the winning player and the cards used during war
Game.prototype.drawCards = function(players, numberOfCardsPerPlayer) {
	
	// Draw numberOfCardsPerPlayer cards for this player
	var playerIndexToCardArrayMap = {};
	var cardsUsedInThisSessionOfWar = [];
	for (var i = 0; i < players.length; i++) {
		
		var player = players[i];
		
		// Declare list of cards used by each player during war
		playerIndexToCardArrayMap[i] = [];
		
		// Add cards to the above list
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
		
		// Display the WAR overlay on the game interface
		this.gameInterface.find("#war_overlay").show();
				
		// Initiate war between players with the max card
		var winningPlayerAndCardsUsedDuringWar = this.drawCards(playersWithTheMaxCard, this.numberOfCardsPlayedDuringWar);
		
		// Add cards used during this session of war to the cards used in the recursive call of war
		winningPlayerAndCardsUsedDuringWar.cards = winningPlayerAndCardsUsedDuringWar.cards.concat(cardsUsedInThisSessionOfWar);
		
		return winningPlayerAndCardsUsedDuringWar; 
		
	} else if (playersWithTheMaxCard.length == 1) {
		
		// Hide the WAR overlay on the game interface
		this.gameInterface.find("#war_overlay").hide();
				
		// There were no ties, there was one winner, add all cards in play to the winning player
		var winningPlayer = playersWithTheMaxCard[0];

		return {winner: winningPlayer, cards: cardsUsedInThisSessionOfWar};
		
	} else {
		
		// Hide the WAR overlay on the game interface
		this.gameInterface.find("#war_overlay").hide();
				
		// There were no winners (all warring players didn't have enough cards)
		// I can't find any set of rules that specifies what should happen here, so I'll just say the first player is the winner
		
		var winningPlayer = players[0];
		
		return {winner: winningPlayer, cards: cardsUsedInThisSessionOfWar};
		
	}
	
	
}

// Private
// This function clears all player's played cards from the table
Game.prototype.clearTable = function() {
	// Clear each player's table section
	this.players.forEach(function(player) {
		player.clearPlayedCards();
	});
}

// Public
// This function will restart the game with a new shuffled deck
Game.prototype.restartGame = function(numberOfPlayers) {
	
	// If the number of players to start the game with have already been initialized, then just reset their stats, otherwise recreate new players
	if (this.players.length == numberOfPlayers || numberOfPlayers == undefined) {
		
		// Empty the winning pots of each player
		this.players.forEach(function(player) {
			player.emptyPot();
		});
				
	} else {
		this.gameInterface.find("#players_container").empty();
		for (var i = 0; i < numberOfPlayers; i++) {
			
			var newPlayerID = i+1;
			
			// Create player container DIVs and give them the appropriate width
			var $playerHandContainer = $('<div class="player_hand_container"><div class="player_name">Player '+newPlayerID+' Hand</div><div class="player_hand"></div><div class="player_pot"></div></div>');
			var $playerTableContainer = $('<div class="player_table_container"><div class="player_name">Player '+newPlayerID+' played</div><div class="player_cards_played"></div></div></div>');
			var percentWidth = (100 / numberOfPlayers)+"%";
			$playerHandContainer.css({width: percentWidth});
			$playerTableContainer.css({width: percentWidth});
			this.gameInterface.find("#player_hand_containers").append($playerHandContainer);
			this.gameInterface.find("#player_table_containers").append($playerTableContainer);
			
			// Add new player to this game
			this.players.push(new Player(newPlayerID, $playerHandContainer, $playerTableContainer));
			
		}
	}
	
	// Make sure the table is cleared
	this.clearTable();
	
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
	this.gameInterface.find("#game_winner").hide();
	this.gameInterface.find("#game_winner").empty();
	this.gameInterface.find("#round_winner").empty();
	
}

// Private
// This function will end the game, declare a winner, and update the interface
Game.prototype.finishGame = function() {
		
	// Hide the gameplay controls, show the finished controls and add click listeners
	this.gameInterface.find("#gameplay_controls").hide();
	this.gameInterface.find("#finished_controls").show();
	this.gameInterface.find("#game_winner").show();
		
	// Check for winner (and ties)
	var winningPlayers = [];
	var maxPotSize = 0;
	this.players.forEach(function(player) {
		
		if (player.getPotSize() > maxPotSize) {
			
			// Reset the winning players list if a new maximum is encountered
			winningPlayers = [player];
			maxPotSize = player.getPotSize();
			
		} else if (player.getPotSize() == maxPotSize) {
			
			// Add to the winning players list if this player also has the max pot size
			winningPlayers.push(player);
			
		}
		
	});
	
	// Display the winning player(s)
	if (winningPlayers.length == 1) {
		this.gameInterface.find("#game_winner").html("Player "+winningPlayers[0].getID()+" won!");
	} else {
		var winMessage = "Players ";
		winningPlayers.forEach(function(player) {
			winMessage += player.getID() + ", ";
		});
		winMessage = winMessage.slice(0, -2) + " won!";
		this.gameInterface.find("#game_winner").html(winMessage);
	}
	
}

// Static function
// This function creates a new deck with all 52 cards, shuffled
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