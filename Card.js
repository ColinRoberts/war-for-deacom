// Public final static values
// Note: If this were implemented in a better object oriented language, I would make each suit a public static final variable
var regularSuits = new Set(["spades", "hearts", "diamonds", "clubs"]);
var nonNumericSuits = new Set(["ace", "jack", "queen", "king"]);
var validNumbers = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);

function Card(suit, number) {
	
	// Throw errors for invalid cards
	if (!regularSuits.has(suit) && !nonNumericSuits.has(suit)) {
		throw "Error: The given suit is not valid.";
	}
	if (number != undefined && !validNumbers.has(number)) {
		throw "Error: The given card number is not valid."
	}
	if (nonNumericSuits.has(suit) && number != undefined) {
		// The numeric value of this card will be overwritten below, so we only need to log a warning
		console.warn("Warning: Attempting to define a number for a non-numeric suit.");
	}
	
	// Private variables
	// Note: These are not actually protected/private in Javascript, but I would implement them as private in a better OOP language
	this.suit = suit;
	this.number = number;
	
	// Define number values for non-numeric suits
	if () {
		
	}
	
}

Card.prototype.getNumber = function() {
	return this.number;
}

Card.prototype.getSuit = function() {
	
}

Card.prototype.generateView = function() {
	// Generate a jQuery object to append to the game interface for this card
	
	
}
