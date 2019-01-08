function Player() {
	
	this.hand = [];
	this.pot = new Set();
	
}

Player.prototype.getCard = function() {
	this.hand.shift()
}

Player.prototype.addToPot = function(cards) {
	cards.forEach(function(card) {
		this.pot.add(card);
	});
}

Player.prototype.emptyPot = function() {
	this.pot = new Set();
}