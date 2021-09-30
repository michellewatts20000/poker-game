const fs = require('fs')

let player1 = 0;
let player2 = 0;
let player1Hands = [];
let player2Hands = [];
const scale = "23456789TJQKA"

const init = () => {
    try {
        // read the poker-hands.txt file and split into lines and hands
        let data = fs.readFileSync('poker-hands.txt', 'utf8')
        let rows = data.split('\n');
        for (let i = 0; i < rows.length; i++) {
            let games = rows[i].length / 2
            let readytopush = rows[i].slice(0, games);
            let readytopush2 = rows[i].slice(games + 1, games * 2);
            player1Hands.push(readytopush);
            player2Hands.push(readytopush2);
            winningHand(player1Hands[i], player2Hands[i])
        }
        console.log("Player 1:", player1)
        console.log("Player 2:", player2)
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

const getHandDetails = (hand) => {
    const cards = hand.split(" ")
    const newOrder = cards.map(a => String.fromCharCode([77 - scale.indexOf(a[0])])).sort()
    const suits = cards.map(a => a[1]).sort()
    const counts = newOrder.reduce(count, {})
    const multiples = Object.values(counts).reduce(count, {})
    const flush = suits[0] === suits[4]
    const firstUnicode = newOrder[0].charCodeAt(0)
    const straight = newOrder.every((f, index) => f.charCodeAt(0) - firstUnicode === index)
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

    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}

const winningHand = (h1, h2) => {
    let deal1 = getHandDetails(h1)
    let deal2 = getHandDetails(h2)
    if (deal1.rank === deal2.rank) {
        if (deal1.value < deal2.value) {
            return ++player1
        } else if (deal1.value > deal2.value) {
            return ++player2
        } else {
            return "Draw"
        }
    }
    return deal1.rank < deal2.rank ? `${++player1}` : `${++player2}`
}

init();