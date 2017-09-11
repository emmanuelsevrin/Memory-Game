/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//key variables 
let card_deck = ["fa fa-diamond","fa fa-leaf", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-bicycle", "fa fa-bomb", "fa fa-paper-plane-o",
"fa fa-diamond","fa fa-leaf", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-bicycle", "fa fa-bomb", "fa fa-paper-plane-o"]; // list of all cards
let open_cards = []; //path to the opened cards (never more than 2 cards opened at the same time)
let open_items = []; //name of the items in the opened card 
let cursor_iterations = 0 // number of time the gamer played
let rating = "three stars";
let two_star_limit = 30; // number of moves that downgrade you to 2 stars
let one_star_limit = 50; // number of moves that downgrade you to 1 stay
let minutes = 00; // minutes of the timer
let seconds = 00; // seconds of the timer
let Interval;
/*

 Functions linked to game preparation: gamestart, shuffle

*/

function gamestart(){
	card_deck = shuffle(card_deck);
	$(".item").attr("class", "item");
	for(i = 0; i < card_deck.length; i++){
		$(".item").eq(i).addClass(card_deck[i]);
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*

 Functions linked to turning cards and checking they're the same: turncard, storecardtype, lock_cards_up, put_cards_back_down

*/

function turncard(card) {
	$(card).toggleClass("open");
	$(card).toggleClass("show");
}

function storecardtype(path) {
	open_cards.push(path)
	var card_classes = $(path).children()[0].className;
	open_items.push(card_classes.slice(6));
}

function lock_cards_up(){
	$(".open").addClass("correct_card")
	setTimeout(function() {
	for (const card of open_cards) {
		$(card).removeClass("open");
		$(card).removeClass("show");
		$(card).addClass("match");
	}
	open_cards = [];
	open_items = [];
	}
	,800)
}

function put_cards_back_down(){
	$(".open").addClass("wrong_card");
	setTimeout(function() {
		for (const card of open_cards){
			$(card).removeClass("open");
			$(card).removeClass("show");
			$(card).removeClass("wrong_card");
			}
		open_cards = [];
		open_items = [];
		}
	,1000)
}

/*

 Functions linked to the game performance (star ratings, numebr of moves etc): update_star_rating, check_victory

*/

function update_star_rating(){
	console.log("updating star rating");
	if (rating === "three stars" & cursor_iterations > two_star_limit){
		rating = "two stars";
		$(".stars").children().eq(0).remove();
		console.log(rating);
		}
	if(rating === "two stars" & cursor_iterations > one_star_limit){
		rating = "one star";
		$(".stars").children().eq(0).remove();
		console.log(rating);
	}
}

function increase_cursor(){
	cursor_iterations++;
	$(".moves").text(cursor_iterations);
}

function check_victory(){
	setTimeout(function(){
			if ($(".match").length == 16) {
				clearInterval(Interval); // stop timer
				const victory_text = `Congratulations! You won! With a ${rating} rating (${cursor_iterations} iterations) and in ${minutes}min:${seconds}s. Do you want to play again?`
				ask_if_replay = window.confirm(victory_text)
				if (ask_if_replay){
					gamestart();
					restart();
				}
				}
			}
		,1000)
}

/*

 Functions linked to game reinitialization (i.e., when player hit restart): restart; reinitialise_stars

*/

function restart(){
    open_cards = [];
    open_items = []; 
    cursor_iterations = 0; 
    reinitialise_stars();

    seconds = 0;
    minutes = 0;
    $(".seconds").text("0" + seconds);
	$(".minutes").text("0" + minutes);
    
    gamestart();
    $(".moves").text(cursor_iterations);
    $(".deck").children().attr("class", "card");
    clearInterval(Interval); // stop timer


}

function reinitialise_stars(){
	rating = "three stars";
	$(".stars").children().remove();
	$(".stars").append("<li><i class=\"fa fa-star\"></i></li>");
	$(".stars").append("<li><i class=\"fa fa-star\"></i></li>");
	$(".stars").append("<li><i class=\"fa fa-star\"></i></li>");
}

//Timer functions: startTimer, runTimer


function startTimer(){
	Interval = setInterval(runTimer, 1000);
}

function runTimer () {
seconds++; 

	if(seconds < 9){
	  $(".seconds").text("0" + seconds);
	}

	if (seconds > 9){
	  $(".seconds").text(seconds);
	} 
	if (seconds > 59) {
	 console.log("minutes");
	 minutes++;
	 seconds = 0;
	 $(".seconds").text("0" + seconds);
	 $(".minutes").text("0" + minutes);
	}

	if (minutes > 9){
	$(".minutes").text(minutes);
	}

}

//Events listeners

$(".fa-repeat").on("click", function(){
		console.log("restarting");
		restart();
		}
	)

$(".card").on("click", function(){
		
		//checks if the class already has the "open" element. Only do the rest of the function if not 
		if(!$(this).hasClass("open") & !$(this).hasClass("match")){
		
			turncard(this);
			storecardtype(this);
			
			//check if deck has >2 cards, and if so analyze if they're matching or not
			if(open_cards.length >= 2){
				if(open_items[0] === open_items[1]){
					lock_cards_up();
				}
				else{
					put_cards_back_down();
				}
			}
			if(cursor_iterations === 0){
				startTimer();
				}
			increase_cursor();
			update_star_rating();
			check_victory();
	}
}
)

// get the game ready
gamestart();


