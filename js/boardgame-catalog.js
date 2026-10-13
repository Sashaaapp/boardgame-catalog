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
function playerCount(gamesArrey, targetPlayers){

    for (i = 0; i < gamesArrey.length; i++) {
        const currentGame = gamesArrey[i];
        // if else конструкція, з використанням функції fitsPlayers
        if (fitsPlayers(currentGame, targetPlayers)) {
            console.log(gamesArrey[i]);
        }
        else {
            console.log(`${currentGame.title} не підходить за фільтром`);
        }
    }
}

console.log(fitsPlayers(games[0], 5));

playerCount(games, 2);
