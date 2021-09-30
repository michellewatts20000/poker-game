var fs = require('fs')

var player1 = 0;
var player2 = 0;
var player1Hands = [];
var player2Hands = [];
const order = "23456789TJQKA"

const init = () => {
    // read the poker-hands.txt file and split into lines and hands
    try {
        var data = fs.readFileSync('poker-hands.txt', 'utf8')
        var rows = data.split('\n');
        for (let i = 0; i < rows.length; i++) {
            var games = rows[i].length / 2
            var readytopush = rows[i].slice(0, games);
            var readytopush2 = rows[i].slice(games + 1, games * 2);
            player1Hands.push(readytopush);
            player2Hands.push(readytopush2);
            // player one vs player two

            compareHands(player1Hands[i], player2Hands[i])
        }
        console.log("Player 1:", player1, "Player 2:", player2)
        if (player1 > player2) {
            console.log(`Congratulations Player 1!`)
        } else if (player2 > player1) {
            console.log(`Congratulations Player 2!`)
        } else {
            console.log(`It's a Draw`)
        }

    } catch (err) {
        console.error(err)
    }
};

init();

function getHandDetails(hand) {
    const cards = hand.split(" ")
    const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a[0])])).sort()
    const suits = cards.map(a => a[1]).sort()
    const counts = faces.reduce(count, {})
    const duplicates = Object.values(counts).reduce(count, {})
    const flush = suits[0] === suits[4]
    const first = faces[0].charCodeAt(0)
    const lowStraight = faces.join("") === "JKLMN"
    faces[0] = lowStraight ? "N" : faces[0]
    const straight = lowStraight || faces.every((f, index) => f.charCodeAt(0) - first === index)

    let rank =
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) || 9

    return {
        rank,
        value: faces.sort(byCountFirst).join("")
    }

    function byCountFirst(a, b) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a]
        if (countDiff) return countDiff // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1
    }

    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}

function compareHands(h1, h2) {
    let d1 = getHandDetails(h1)
    let d2 = getHandDetails(h2)
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {

            return ++player1
        } else if (d1.value > d2.value) {

            return ++player2
        } else {
            return "DRAW"
        }
    }
    return d1.rank < d2.rank ? `${++player1}` : `${++player2}`
}