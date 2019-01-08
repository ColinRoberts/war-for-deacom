function Player($playerContainer) {
	
	this.hand = [];
	this.pot = new Set();
	this.$playerContainer = $playerContainer;
	
}

Player.prototype.setHand = function(cards) {
	
	var thisPlayer = this;
	
	this.hand = cards;
	
	// Add cards to this player's container
	this.$playerContainer.find(".player_hand").empty();
	cards.forEach(function(card) {
		thisPlayer.$playerContainer.find(".player_hand").append(card.generateReverseView());
	});
	
}

Player.prototype.getCard = function() {
	
	// Remove a card from the hand section for this player's container
	this.$playerContainer.find(".player_hand .card").first().remove();
	
	// Return the top card in this player's card stack
	return this.hand.shift();
	
}

Player.prototype.hasCardsLeft = function() {
	
	return this.hand.length > 0;
	
}

Player.prototype.addToPot = function(cards) {
	
	var thisPlayer = this;
	
	cards.forEach(function(card) {
		
		// Add the card to this players pot
		thisPlayer.pot.add(card);
		
		// Add the card component to this player's container
		thisPlayer.$playerContainer.find(".player_pot").append(card.generateView());
		
	});
}

Player.prototype.emptyPot = function() {
	
	// Empty the pot set
	this.pot = new Set();
	
	// Empty the pot section for this player's container
	this.$playerContainer.find(".player_pot").empty();
	
}