//************
//S: Utilities

function generator(width = 9, height = 1){ //U: Generates a one dimensional card
	var cardInfo = {};
	cardInfo["width"]= width;
	cardInfo["height"]= height;
	cardInfo["card"]= [];

	for(var n = 0; n < width*height; n++){
		cardInfo["card"].push(Math.round(Math.random())); //U: Either one or zero
	}
	return cardInfo
}

function array_to_txt(array){
    var s = '';
    for (var x = 0; x < array.length; x++) { //U: Separates each cell with two spaces
		s+= "  " + (array[x]);
    }
	//console.log("S:",s);
    return(s)
}

function txt_to_array(txt){
    var r = txt.split(/(?:\s*|\n*)/);
	r.shift();
    return(r);
}

//*****************
//S: Browser things

var uiTxtTurns;
var uiTxtCell;
var uiCard;
var uiBtn1;
var uiBtn2;
var turn;

function browser_start(){
	turn = 0;
	uiTxtCell = document.getElementById("text_over_card");
	
	uiCard = document.getElementById("card");
	
	uiBtn1 = document.getElementById("next_turn");
	uiBtn1.onclick = function(){
		var input= {};
		input["height"]= 1;
		input["card"]= txt_to_array(uiCard.value);
		input["width"]= input["card"].length;
		
		if(input["card"].length < 3){ //U: There is no card
			var out= oneturn_o_automaton();
			uiCard.value= array_to_txt(out["card"]);
		} else {
			turn += 1;
			var out= oneturn_o_automaton(input, turn);
			uiCard.value= array_to_txt(out["card"]);
		}
		uiTxtCell.innerHTML= "This is turn " + (turn+1);
		uiBtn1.innerHTML= "Next Turn";
	}
	
	uiBtn2 = document.getElementById("clear");
	uiBtn2.onclick = function(){
		uiTxtCell.innerHTML= "Press the button to start"
		uiCard.innerHTML = "";
		turn = 0;
	}
}

//***************************************
//S: One dimensional automaton (Rule 110)

function o_automaton(cardInfo){ //U: Processes the card
	var card= cardInfo["card"];
	var cardl= card.length;
	
	var nextCard= {};
	nextCard["width"]= cardInfo["width"];
	nextCard["height"]= cardInfo["height"];
	nextCard["card"]= [];
	nextCard["changes"]= 0;

    for (var n= 0; n < card.length; n++) { //U: Checks each cell
		var previous= card[n-1];
		var current= card[n];
		var next= card[n+1];

		if (current != 1 && current != 0) { //U: Checks for any weird number
			alert("This game only takes 1 or 0 in the cells, you have a " + current + " on position " + (n+1));
		} else {
			if (previous == null){ //U: For the first cell it uses the last cell as the previous one
				previous= card[card.length-1];
			} else if (next == null){ //U: For last cell it uses the first as the next one
				next= card[0];
			}

			if (previous == 1 && current == 0 && next == 0){ //U: Checks for the "100" pattern
				nextCard["card"].push(0);
			} else if (previous == current && current == next) { //U: Checks for "111" or "000"
				nextCard["card"].push(0);
			} else {
				nextCard["card"].push(1);
			}

			if (card[n] != nextCard["card"][n]){
				nextCard["changes"] += 1;
			}
		}
    }
	return nextCard
}

function test_o_automaton(){
	var test= [[1,1,1],[1,1,0],[1,0,1],[1,0,0],[0,1,1],[0,1,0],[0,0,1],[0,0,0]];
	var correct= [[0,0,0],[1,1,1],[1,1,1],[1,0,1],[1,1,1],[1,1,0],[0,1,1],[0,0,0]];

	for (var l in test){
		var result= o_automaton({"heigth":1, "width":3, "card":test[l]});
	
		if(JSON.stringify(result["card"]) === JSON.stringify(correct[l])){
			console.log(l, "works correctly");
		} else {
			console.log("Mistake in", l);
		}
	}
}

function oneturn_o_automaton(cardInfo, t = 0){ //U: Processes one turn
	if(!cardInfo){
		var cardInfo= generator();
	}
	console.log("Input", cardInfo);
	
	var nextCard= o_automaton(cardInfo);
	console.log("Output for turn", t+1, nextCard);
	return nextCard
}

function multipleturn_o_automaton(turns, width = 8){ //U: Processes multiple turns
	var cardInfo = generator(width);
	console.log("Initial card", cardInfo);
	
	for(t = 0; t < turns; t++){
		cardInfo = o_automaton(cardInfo);
		console.log("Turn:", t+1, "; Card:", cardInfo);
	}
	console.log("End of the process. Final card:", cardInfo);
}