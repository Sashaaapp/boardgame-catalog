// Масив ігор
const games = [
    { title: "Фростпанк", minPlayers:1, maxPlayers:4, genre: "Стратегії", image: "assets/img/FrostPunkBoardGame.jpg" },
    { title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5, genre: "Стратегії", image: "assets/img/TerraformingMars.jpg" },
    { title: "Монополія", minPlayers: 2, maxPlayers: 6, genre: "Стратегії", image: "assets/img/MonopolyBoardGame.jpg" },
    { title: "Catan", minPlayers: 3, maxPlayers: 4, genre: "Стратегії", image: "assets/img/KATANBoardGame.jpg" }
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

// Вибір елементів форми та фільтра
const addGameForm = document.querySelector("#add-game-form");
const titleInput = document.querySelector("#game-title");
const minPlayersInput = document.querySelector("#min-players");
const maxPlayersInput = document.querySelector("#max-players");
const genreSelect = document.querySelector("#game-genre");
const formError = document.querySelector("#form-error");
const playerFilterSelect = document.querySelector("#player-filter");

addGameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Зчитуємо значення полів
    const title = titleInput.value.trim();
    const minPlayers = Number(minPlayersInput.value);
    const maxPlayers = Number(maxPlayersInput.value);
    const genre = genreSelect.value;

    if (minPlayers > maxPlayers) {
        formError.textContent = "Мінімальна кількість гравців не може перевищувати максимальну!";
        return;
    }
    formError.textContent = "";

    // Додаємо нову гру в масив
    games.push({
        title: title,
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        genre: genre,
        image: "assets/img/Placeholder.jpg"
    });

    // Перемальовуємо список і очищуємо форму
    const selected = playerFilterSelect.value;
    if (selected === "all") {
        renderGames(games);
    } else {
        const filtered = games.filter(game => fitsPlayers(game, Number(selected)));
        renderGames(filtered);
    }
    addGameForm.reset();
});

// Фільтрація за кількістю гравців
playerFilterSelect.addEventListener("change", () => {
    const selected = playerFilterSelect.value;

    if (selected === "all") {
        renderGames(games);
    } else {
        const filtered = games.filter(game => fitsPlayers(game, Number(selected)));
        renderGames(filtered);
    }
});