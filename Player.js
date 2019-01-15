function Player(id, $playerHandContainer, $playerTableContainer) {
	
	this.hand = [];
	this.pot = new Set();
	this.id = id;
	this.$playerHandContainer = $playerHandContainer;
	this.$playerTableContainer = $playerTableContainer;
	
}

// Public
// This function sets the hand for the player with the given cards
Player.prototype.setHand = function(cards) {
	
	var thisPlayer = this;
	
	this.hand = cards;
	
	// Add cards to this player's container
	this.$playerHandContainer.find(".player_hand").empty();
	cards.forEach(function(card) {
		thisPlayer.$playerHandContainer.find(".player_hand").append(card.generateReverseView());
	});
	
}

// Public
// This function gets a card to be played by this player
Player.prototype.getCard = function() {
	
	// Remove a card from the hand section for this player's container
	this.$playerHandContainer.find(".player_hand .card_container").first().remove();
	
	// Get the top card in this player's card stack
	var cardToBePlayed = this.hand.shift();
	
	// Add a removed card to the player's table "played cards" interface
	this.$playerTableContainer.find(".player_cards_played").append(cardToBePlayed.generateView());
	
	// Return the card to be played
	return cardToBePlayed;
	
}

// Public
// This function clears this player's cards from the table
Player.prototype.clearPlayedCards = function() {
	this.$playerTableContainer.find(".player_cards_played").empty();
}

// Public
// Boolean for whether or not this player has cards left to play
Player.prototype.hasCardsLeft = function() {
	
	return this.hand.length > 0;
	
}

// Public
// Returns this players ID
Player.prototype.getID = function() {
	return this.id;
}

// Public
// Adds cards to player's pot
Player.prototype.addToPot = function(cards) {
	
	var thisPlayer = this;
	
	// Essentially function overloading for single card vs array of cards
	if (!Array.isArray(cards)) {
		cards = [cards];
	}
	
	cards.forEach(function(card) {
		
		// Add the card to this players pot
		thisPlayer.pot.add(card);
		
		// Add the card component to this player's container
		thisPlayer.$playerHandContainer.find(".player_pot").append(card.generateView());
		
	});
}

// Public
// Adds cards to player's hand
Player.prototype.addToHand = function(cards) {
	
	var thisPlayer = this;
	
	// Essentially function overloading for single card vs array of cards
	if (!Array.isArray(cards)) {
		cards = [cards];
	}
	
	cards.forEach(function(card) {
		
		// Add the card to this players pot
		thisPlayer.hand.push(card);
		
		// Add the card component to this player's container
		thisPlayer.$playerHandContainer.find(".player_hand").append(card.generateReverseView());
		
	});
}

// Public
// Returns the size of this player's pot
Player.prototype.getPotSize = function() {
	return this.pot.size;
}

// Public
// This function empties the player's pot (used to reset the game)
Player.prototype.emptyPot = function() {
	
	// Empty the pot set
	this.pot = new Set();
	
	// Empty the pot section for this player's container
	this.$playerHandContainer.find(".player_pot").empty();
	
}