/*
 * shuffle() function provided by Udacity's starter code
 */

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
};

var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game state variables
var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 5;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};
var low = 15; 
var medium = 20;
var hard = 30;


var modal = $("#win");

// start function, increments timer every second
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

// Resets timer state and restarts timer
function timerReset() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 500);
};

// Randomizes cards on board and updates card HTML
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    timerReset();
};

// toggle win modal on
function showModal() {
    modal.css("display", "block");
};

// Removes last start from remaining stars, updates modal HTML
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

// Restores star 3 stars, update html 
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

// Updates number of moves 
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium || moveCounter === low) {
        removeStar();
    }
};

// Checks if card is a valid move (if it not currently matched or open)
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// Returns whether or not currently open cards match
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

// Returns win condition
function Win() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

// Sets currently open cards to the match state, checks win condition
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (Win()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// Sets currently open cards back to default state
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

/*
 * Event listener functions
 */

// Resets all game state and resets html to default state
var resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    timerReset();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

// onClick Function
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 100);

            } else {
                setTimeout(resetOpen, 300);

            }
        }
    }
};

// Resets game state and toggles win modal display off
var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};

// calling Click

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

$(updateCards);
