// Масив ігор
const games = [
    { title: "Фростпанк", minPlayers:1, maxPlayers:4, image: "assets/img/FrostPunkBoardGame.jpg" },
    { title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5, image: "assets/img/TerraformingMars.jpg" },
    { title: "Монополія", minPlayers: 2, maxPlayers: 6, image: "assets/img/MonopolyBoardGame.jpg" },
    { title: "Catan", minPlayers: 3, maxPlayers: 4, image: "assets/img/KATANBoardGame.jpg" }
]

// Додання контейнерів
const listContainer = document.querySelector("#games-list");
const countContainer = document.querySelector("#games-count");

// Видалення статичної карти-заглушки
const staticPlaceholder = document.querySelector("#games-list .game_card");
if (staticPlaceholder) {
    staticPlaceholder.remove();
}

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

// Функція рендерингу секції з іграми
function renderGames(games){
    listContainer.innerHTML = '';

    games.forEach(game => {
        const card = document.createElement('article');
        const title = document.createElement('h3');
        const players = document.createElement('p');
        const img = document.createElement('img');

        title.textContent = game.title;
        players.textContent = `👥${game.minPlayers}-${game.maxPlayers} гравці`;
        card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
        img.src = game.image;

        card.classList.add("game_card");
        title.classList.add("game_title");
        players.classList.add("player_badge");
        img.classList.add("game_img");


        if (fitsPlayers(game, 4)) {
            card.classList.add('fits');
        }
        card.append(title);
        card.append(players);
        card.append(img);

        listContainer.append(card);
    })
    countContainer.textContent = `Кількість ігор у списку: ${games.length}`;
}

renderGames(games);