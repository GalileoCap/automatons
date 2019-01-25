//************
//S: Utilities

function generator(width = 9, height = 9){ //U: Creates a two dimensional card
	var cardInfo = {};
	cardInfo["width"]= width;
	cardInfo["height"]= height;
	cardInfo["card"]= [];

	for(var n = 0; n < width*height; n++){
		cardInfo["card"].push(Math.round(Math.random())); //U: Either one or zero
	}
	return cardInfo
}

//*****************************************************
//S: Two dimensional automaton (Connway's Game of Life)

function t_automaton(cardInfo){ //U: Processes the card
	var card= cardInfo["card"];
	
	var nextCard= {};
	nextCard["width"]= cardInfo["width"];
	nextCard["height"]= cardInfo["height"];
	nextCard["card"]= [];
	nextCard["changes"]= 0;

	for (var n = 0; n < card.length; n++){ //U: Checks each cell
		var neighbours= [];
		var alive_cells= 0;

		for (var i = (-1); i < 2; i++){ //U: Checks the neighbours
			neighbours.push(card[n-(cardInfo["width"]-i)]) //U: The three on top
			neighbours.push(card[n+(cardInfo["width"]-i)]) //U: The three under
		}
		neighbours.push(card[n-1]);
		neighbours.push(card[n+1]);
		
		//console.log("Neighbours", neighbours);
		
		for (var j = 0; j < neighbours.length; j++){
			if(neighbours[j] == 1){ //U: undefined neighbours (out of bounds) count as zeroes
				alive_cells += 1;
			}
		}
		
		if (card[n] == 1){ //U: If the cell was alive
			if (alive_cells < 2){ //U: If it has less than two neighbours
				nextCard["card"].push(0);
			} else if (alive_cells > 3){ //U: If it has more than three neighbours
				nextCard["card"].push(0);
			} else {
				nextCard["card"].push(1);
			}
		} else if (alive_cells == 3){ //U: If the cell was dead but has exactly three neighbours
			nextCard["card"].push(1);
		} else {
			nextCard["card"].push(0);
		}
		
		if (card[n] != nextCard["card"][n]){
			nextCard["changes"] += 1;
		}
	}
	return nextCard
}

function oneturn_t_automaton(cardInfo, t = 0){ //U: Processes one turn
	console.log("Previos", cardInfo);
	
	var nextCard = t_automaton(cardInfo);
	
	console.log("Turn", t+1, "card", nextCard);
	return nextCard
}

function multipleturn_t_automaton(turns, width = 9, height = 9){ //U: Processes the amout of turns you want of your card
	var cardInfo= generator(width, height);
	console.log("Initial card", cardInfo);

	for(t = 0; t < turns; t++){
		cardInfo = oneturn_t_automaton(cardInfo, t);
	}
	console.log("End of the process. Final card:", cardInfo);
}