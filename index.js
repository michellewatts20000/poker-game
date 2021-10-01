const fs = require('fs')

let player1 = 0;
let player2 = 0;
let player1Hands = [];
let player2Hands = [];
const scale = "23456789TJQKA"

const init = () => {
    try {
        // read the poker-hands.txt file
        let data = fs.readFileSync('poker-hands-short.txt', 'utf8')
        //  turn rows from poker-hands.txt into strings
        let rows = data.split('\n');
        // Loop through every row and split each row into 2 equal strings that represent player1 and player2 hands 
        for (let i = 0; i < rows.length; i++) {
            // get number of characters when a row is divided by 2
            let games = rows[i].length / 2
            // slice the row by 14 characters aka "games" and store in new variable
            let readytopush = rows[i].slice(0, games);
            let readytopush2 = rows[i].slice(games + 1, games * 2);
            // push to "player1" and "player2" variables
            player1Hands.push(readytopush);
            player2Hands.push(readytopush2);
            // call the function winningHand using the parameters for "player1" and "player2" 
            winningHand(player1Hands[i], player2Hands[i])
        }
        // display the # of wins each player has had after all the rounds are played in poker-hands.txt
        console.log("Player 1:", player1)
        console.log("Player 2:", player2)

        // print the winner to the console
        if (player1 > player2) {
            console.log(`Congratulations Player 1!`)
        } else if (player2 > player1) {
            console.log(`Congratulations Player 2!`)
        } else {
            console.log(`It's a draw.`)
        }

    } catch (err) {
        console.error(err)
    }
};


const winningHand = (h1, h2) => {
    // call the function getHandDetails on both players hands
    let deal1 = getHandDetails(h1)
    let deal2 = getHandDetails(h2)

    // if player1 and player2 are equal in rank run the outer if statment
    if (deal1.rank === deal2.rank) {
        // if player1 and player2 are not equal in rank, but player1 has a lower value add +1 to player1 variable
        if (deal1.value < deal2.value) {
            return ++player1
            // if player1 and player2 are not equal in rank, but player2 has a lower value add +1 to player2 variable
        } else if (deal1.value > deal2.value) {
            return ++player2
        } else {
            // if player1 and player2 are not equal in rank, and player1 is equal to player2 return a draw
            return "Draw"
        }
    }
    // if player 1 has a lower rank than player 2 using a ternary operator add +1 to player1 if not add +1 to player2
    return deal1.rank < deal2.rank ? `${++player1}` : `${++player2}`
}

const getHandDetails = (hand) => {
    // split each hand into card strings e.g "TD", "TC", "6C", "KD", "2H"
    const cards = hand.split(" ")
    // make a new array from cards, assign a value using UTF-16 to the first character in the string to identify duplicates... calling on the "scale" variable to determine how valuable the card is
    const newOrder = cards.map(a => String.fromCharCode([77 - scale.indexOf(a[0])])).sort()

    // find if there are any duplicates by using the reduce method and calling the count function
    const counts = newOrder.reduce(count, {})
console.log(counts)
    // takes the values in the counts object and runs the reduce method returning an object that shows how many muliple cards a player has  
    const multiples = Object.values(counts).reduce(count, {})

    // make a new array containing all the suits, sort them so the 1st item in the object needs to match the 5th
    const suits = cards.map(a => a[1]).sort()
    // it's a flush if the 1st and the 5th suit in the array are the same
    const flush = suits[0] === suits[4]

    // take the first item in the newOrder array and give it a character code to compare its value
    const firstUnicode = newOrder[0].charCodeAt(0)
 
    // for every item in the newOrder array check it against the firstUnicode to see if they are going up incrementally by one and therefore is a straight
    const straight = newOrder.every((f, index) => f.charCodeAt(0) - firstUnicode === index)
   
    // give the players hand a rank
    let rank =
        (flush && straight && 1) ||
        (multiples[4] && 2) ||
        (multiples[3] && multiples[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (multiples[3] && 6) ||
        (multiples[2] > 1 && 7) ||
        (multiples[2] && 8) || 9
    return {
        rank,
        value: newOrder.sort(byCountFirst).join("")
    }

    function byCountFirst(a, b) {
        const countDiff = counts[b] - counts[a]
        if (countDiff) return countDiff
        return b > a ? -1 : b === a ? 0 : 1
    }

    // the function used in the reduce method returning a new object that shows if there are 1 or many of the same number card or K, J, Q
    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}


// initialise the first function
init();