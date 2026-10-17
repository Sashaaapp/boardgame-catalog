// Масив ігор
const games = [
    { title: "Фростпанк", minPlayers:1, maxPlayers:4 },
    { title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5 },
    { title: "Монополія", minPlayers: 2, maxPlayers: 6 },
    { title: "Catan", minPlayers: 3, maxPlayers: 4 }
]

// Стрілкова функція, що перевіряє входження в діапазон гравців
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

// Знаходження ігор, що підходять для заданої кількості гравців
function playerCount(gamesArray, targetPlayers){
    let count = 0;

    for (let i = 0; i < gamesArray.length; i++) {
        const currentGame = gamesArray[i];
        // if else конструкція, з використанням функції fitsPlayers
        if (fitsPlayers(currentGame, targetPlayers)) {
            console.log(gamesArray[i]);
            count++;
        }
        else {
            console.log(`${currentGame.title} не підходить за фільтром`);
        }
    }

    console.log(`${count} - ігри, що підходять критеріям`);
}

console.log(fitsPlayers(games[0], 5));

playerCount(games, 2);
