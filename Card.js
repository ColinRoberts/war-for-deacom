// Public final static values
// Note: If this were implemented in a better object oriented language, I would make each suit a public static final variable
var validSuits = new Set(["spades", "hearts", "diamonds", "clubs"]);
var nonNumericCards = new Set(["ace", "jack", "queen", "king"]);
var validNumbers = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);

function Card(suit, type) {
	
	// Throw errors for invalid cards
	if (!validSuits.has(suit)) {
		throw "Error: The given suit is not valid.";
	}
	if (!validNumbers.has(type) && !nonNumericCards.has(type)) {
		throw "Error: The given card-type/number is not valid."
	}
	
	// Private variables
	// Note: These are not actually protected/private in Javascript, but I would implement them as private in a better OOP language
	this.suit = suit;
	this.type = type;
	this.value;
	
	// Define card value based on the card type
	if (nonNumericCards.has(type)) {
		
		// Assign card value based on the non-numeric type
		switch(type) {
			case "ace":
				this.value = 1;
				break;
			case "jack":
				this.value = 11;
				break;
			case "queen":
				this.value = 12;
				break;
			case "king":
				this.value = 13;
				break;
			default:
				throw "Error: Unknown card type";
		}
		
	} else {
		
		// If this card is numeric, its value is just its number
		this.value = type;
		
	}
	
}

Card.prototype.getType = function() {
	return this.type;
}

Card.prototype.getSuit = function() {
	return this.suit;
}

Card.prototype.getValue = function() {
	return this.value;
}

Card.prototype.generateView = function() {
	// Generate a jQuery object to append to the game interface for this card
	
	
}

// Static function
Card.prototype.generateReverseView = function() {
	// Generate a jQuery object to append to the game interface for the backside of a card
}
