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

function array_to_txt(array){ //Adapted from my sudokunator
	var card= array["card"];
	var r= '';
    for (var y = 0; y < array["height"]; y++) { //U: Separates each cell with three spaces
		for (var x = 0; x < array["width"]; x++) {
			r+= "   " + (card[y * array["height"] + x]);
		}
		r+= "\n";
    }
    return r
} //XXX: Doesn't work for height>width arrays

function txt_to_array(txt){
    var r = txt.split(/(?:\s*|\n*)/);
	r.shift(); //U: The first item will be empty
	r.pop();
    return r;
}

//*****************
//S: Browser things

var uiTxtTurns;
var uiTxtCell;
var uiTxtHeight;
var uiTxtWidth;
var uiCard;
var uiBtn1;
var uiBtn2;
var turn;

function browser_start(){
	turn = 0;
	uiTxtCell = document.getElementById("text_over_card");
	uiTxtHeight = document.getElementById("card_height");
	uiTxtWidth = document.getElementById("card_width");
	
	uiCard = document.getElementById("card");
	
	uiBtn1 = document.getElementById("next_turn");
	uiBtn1.onclick = function(){
		var input= {};
		if(isNaN(uiTxtWidth.value)){ //XXX: Doesn't account for empty textarea
			input["width"]= 9;
		} else {
			input["width"]= uiTxtWidth.value;
		}
		if(isNaN(uiTxtHeight.value)){
			input["height"]= 9;
		} else {
			input["height"]= uiTxtHeight.value;
		}
		input["card"]= txt_to_array(uiCard.value);
		
		uiCard.cols= input["width"] + input["width"] * 3 + 3;
		uiCard.rows= input["height"] + 1;
		
		if(input["card"].length < 3){ //U: There is no card (3 is an arbitrary number)
			delete input.card;
			var out= oneturn_t_automaton(input);
			uiCard.value= array_to_txt(out);
		} else {
			turn += 1;
			var out= oneturn_t_automaton(input, turn);
			uiCard.value= array_to_txt(out);
		}
		uiTxtCell.innerHTML= "This is turn " + (turn+1);
		uiBtn1.innerHTML= "Next Turn";
	}
	
	uiBtn2 = document.getElementById("clear");
	uiBtn2.onclick = function(){
		uiTxtCell.innerHTML= "Press the button to start"
		uiBtn1.innerHTML= "First Turn";
		uiCard.value = "";
		turn = 0;
	}
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

		if(card[n] != 1 && card[n] != 0) {
			alert("This game only takes 1 or 0 in the cells, you have a " + card[n] + " on position " + (n+1));
			return cardInfo
		} else {
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
	}
	return nextCard
}

function oneturn_t_automaton(cardInfo, t = 0){ //U: Processes one turn
	if(!cardInfo["card"]){
		var nextCard= generator(cardInfo["width"], cardInfo["height"]);
	} else {
		console.log("Input", cardInfo);
		var nextCard= t_automaton(cardInfo);
	}
	console.log("Output for turn", t+1, nextCard);
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