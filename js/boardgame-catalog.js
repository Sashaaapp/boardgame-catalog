// Масив ігор
// import React from "react";
//
// const games = [
//     { title: "Фростпанк", minPlayers:1, maxPlayers:4, genre: "Стратегії", image: "assets/img/FrostPunkBoardGame.jpg" },
//     { title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5, genre: "Стратегії", image: "assets/img/TerraformingMars.jpg" },
//     { title: "Монополія", minPlayers: 2, maxPlayers: 6, genre: "Стратегії", image: "assets/img/MonopolyBoardGame.jpg" },
//     { title: "Catan", minPlayers: 3, maxPlayers: 4, genre: "Стратегії", image: "assets/img/KATANBoardGame.jpg" }
// ]
//
// // Додання контейнерів
// const listContainer = document.querySelector("#games-list");
// const countContainer = document.querySelector("#games-count");
//
// // Видалення статичної карти-заглушки
// const staticPlaceholder = document.querySelector("#games-list .game_card");
// if (staticPlaceholder) {
//     staticPlaceholder.remove();
// }
//
// // Стрілкова функція, що перевіряє входження в діапазон гравців
// const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;
//
// // Знаходження ігор, що підходять для заданої кількості гравців
// function playerCount(gamesArray, targetPlayers){
//
//     let count = 0;
//     for (let i = 0; i < gamesArray.length; i++) {
//         const currentGame = gamesArray[i];
//         // if else конструкція, з використанням функції fitsPlayers
//         if (fitsPlayers(currentGame, targetPlayers)) {
//             console.log(gamesArray[i]);
//             count++;
//         }
//         else {
//             console.log(`${currentGame.title} не підходить за фільтром`);
//         }
//
//     }
//     console.log(`${count} - ігри, що підходять критеріям`);
//
// }
//
// console.log(fitsPlayers(games[0], 5));
//
// playerCount(games, 2);
//
// // Функція рендерингу секції з іграми
// function renderGames(games){
//     listContainer.innerHTML = '';
//
//     games.forEach(game => {
//         const card = document.createElement('article');
//         const title = document.createElement('h3');
//         const players = document.createElement('p');
//         const img = document.createElement('img');
//
//         title.textContent = game.title;
//         players.textContent = `👥${game.minPlayers}-${game.maxPlayers} гравці`;
//         card.dataset.players = `${game.minPlayers}-${game.maxPlayers}`;
//         img.src = game.image;
//
//         card.classList.add("game_card");
//         title.classList.add("game_title");
//         players.classList.add("player_badge");
//         img.classList.add("game_img");
//
//
//         if (fitsPlayers(game, 4)) {
//             card.classList.add('fits');
//         }
//         card.append(title);
//         card.append(players);
//         card.append(img);
//
//         if (game.completed !== undefined) {
//             const status = document.createElement('p');
//             status.textContent = game.completed ? "✅ Вже зіграно" : "⏳ Ще не зіграно";
//             card.append(status);
//         }
//
//         listContainer.append(card);
//     })
//     countContainer.textContent = `Кількість ігор у списку: ${games.length}`;
// }
//
// renderGames(games);
//
// // Вибір елементів форми та фільтра
// const addGameForm = document.querySelector("#add-game-form");
// const titleInput = document.querySelector("#game-title");
// const minPlayersInput = document.querySelector("#min-players");
// const maxPlayersInput = document.querySelector("#max-players");
// const genreSelect = document.querySelector("#game-genre");
// const formError = document.querySelector("#form-error");
// const playerFilterSelect = document.querySelector("#player-filter");
//
// addGameForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//
//     // Зчитуємо значення полів
//     const title = titleInput.value.trim();
//     const minPlayers = Number(minPlayersInput.value);
//     const maxPlayers = Number(maxPlayersInput.value);
//     const genre = genreSelect.value;
//
//     if (minPlayers > maxPlayers) {
//         formError.textContent = "Мінімальна кількість гравців не може перевищувати максимальну!";
//         return;
//     }
//     formError.textContent = "";
//
//     // Додаємо нову гру в масив
//     games.push({
//         title: title,
//         minPlayers: minPlayers,
//         maxPlayers: maxPlayers,
//         genre: genre,
//         image: "assets/img/Placeholder.jpg"
//     });
//
//     // Перемальовуємо список і очищуємо форму
//     const selected = playerFilterSelect.value;
//     if (selected === "all") {
//         renderGames(games);
//     } else {
//         const filtered = games.filter(game => fitsPlayers(game, Number(selected)));
//         renderGames(filtered);
//     }
//     addGameForm.reset();
// });
//
// // Фільтрація за кількістю гравців
// playerFilterSelect.addEventListener("change", () => {
//     const selected = playerFilterSelect.value;
//
//     if (selected === "all") {
//         renderGames(games);
//     } else {
//         const filtered = games.filter(game => fitsPlayers(game, Number(selected)));
//         renderGames(filtered);
//     }
// });
//
// // Оголошення посилання на API, та елементи інтерфейсу
// const API_URL = "https://jsonplaceholder.typicode.com/todos?userId=1";
// const reloadApiBtn = document.querySelector("#reload-api-btn");
// const loadingStatus = document.querySelector("#loading-status");
// const apiError = document.querySelector("#api-error");
//
// // Функція отримання даних з JSON за посиланням
// async function loadData() {
//     loadingStatus.style.display = "block";
//     reloadApiBtn.disabled = true;
//     apiError.textContent = "";
//
//     // Спроба отримання даних з JSON
//     try {
//         const response = await fetch(API_URL)
//
//         // Перевірка відповіді, якщо отримана помилка, відбувається її виведення
//         if (!response.ok) {
//             throw new Error(`Помилка HTTP: статус ${response.status}`)
//         }
//
//         const data = await response.json()
//         console.log("Дані з API:", data);
//
//         // Адаптування отриманих даних під структуру каталогу (Додані тільки перші 6 для зручності)
//         const apiGames = data.slice(0, 20).map(item => ({
//             title: item.title,
//             completed: item.completed,
//             minPlayers: 1,
//             maxPlayers: 4,
//             genre: "Стратегії",
//             image: "assets/img/Placeholder.jpg"
//         }));
//
//         // Оновлення масиву games
//         games.length = 0;
//         games.push(...apiGames);
//         renderGames(games);
//
//     } catch (error) {
//         // Обробка помилки
//         apiError.textContent = "Не вдалося завантажити каталог ігор. Перевірте інтернет-з'єднання та спробуйте ще раз.";
//         console.error("Помилка під час запиту до API:", error);
//     } finally {
//         loadingStatus.style.display = "none";
//         reloadApiBtn.disabled = false;
//     }
// }
//
// reloadApiBtn.addEventListener("click", loadData);
//
// loadData();


function GameCard({ title, minPlayers, maxPlayers, genre, image, filter}) {
    return (
        <article className="game_card">
            <h3 className="game_title">Настільна гра "{title}"</h3>
            <span className="player_badge">👥 {minPlayers}-{maxPlayers} гравці</span>
            <p className="game_genre" onClick={() => filter(genre)}>Жанр: {genre}</p>
            <img className="game_img" src={image} alt={`Обкладинка настільної гри ${title}`}/>
        </article>
    );
}

function App() {
    const games = [
        { id: 1, title: "Фростпанк", minPlayers:1, maxPlayers:4, genre: "Стратегії", image: "assets/img/FrostPunkBoardGame.jpg" },
        { id: 2, title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5, genre: "Стратегії", image: "assets/img/TerraformingMars.jpg" },
        { id: 3, title: "Монополія", minPlayers: 2, maxPlayers: 6, genre: "Стратегії", image: "assets/img/MonopolyBoardGame.jpg" },
        { id: 4, title: "Catan", minPlayers: 3, maxPlayers: 4, genre: "Стратегії", image: "assets/img/KATANBoardGame.jpg" },
        { id: 5, title: "Коса", minPlayers: 1, maxPlayers: 5, genre: "Фентезі", image: "assets/img/KosaBoardGame.jpg" },
        { id: 6, title: "Володар Перснів", minPlayers: 2, maxPlayers: 5, genre: "Фентезі", image:"assets/img/LotR.jpg"},
        { id: 7, title: "Відьмак", minPlayers: 1, maxPlayers: 6, genre: "Фентезі", image:"assets/img/TheWitcherBoardGame.jpg" },
        { id: 8, title: "DARKTIDE", minPlayers: 2, maxPlayers: 4, genre: "Фентезі", image:"assets/img/DARKTIDEBoardGame.jpg" }
    ];

    const [items, setItems] = React.useState(games);

    function filterByGenre(selectedGenre) {
        const filtered = games.filter(game => game.genre === selectedGenre);
        setItems(filtered)
    }

    function addGame(add) {
        add.preventDefault();
        const form = add.target;

        const title = form.elements.title.value.trim();
        const minPlayers = Number(form.elements.minPlayers.value);
        const maxPlayers = Number(form.elements.maxPlayers.value);
        const genre = form.elements.genre.value;

        if (minPlayers > maxPlayers) {
            alert("Мінімальна кількість гравців не може перевищувати максимальну!");
            return;
        }

        const newGame = {
            id: Date.now(),
            title: title,
            minPlayers: minPlayers,
            maxPlayers: maxPlayers,
            genre: genre,
            image: "assets/img/Placeholder.jpg"
        };

        setItems([...items, newGame]);

        form.reset();
    }

    return (
        <>
            <section className="filters">
                <h2 className="filter_title">Додавання ігор</h2>
                <form id="add-game-form" className="filter_form" onSubmit={addGame}>
                    <div className="form_group">
                        <label className="filter_label" htmlFor="game-title">Назва гри:</label>
                        <input className="filter_input" type="text" id="game-title" name="title" placeholder="Напр. Дюна" required/>
                    </div>

                    <div className="form_group">
                        <label className="filter_label" htmlFor="min-players">Мін. гравців:</label>
                        <input className="filter_input" type="number" id="min-players" name="minPlayers" min="1" max="20" placeholder="1" required/>
                    </div>

                    <div className="form_group">
                        <label className="filter_label" htmlFor="max-players">Макс. гравців:</label>
                        <input className="filter_input" type="number" id="max-players" name="maxPlayers" min="1" max="20" placeholder="4" required/>
                    </div>

                    <div className="form_group">
                        <label className="filter_label" htmlFor="game-genre">Жанр:</label>
                        <select className="filter_input" id="game-genre" name="genre" required>
                            <option value="Стратегії">Стратегії</option>
                            <option value="Фентезі">Фентезі</option>
                            <option value="Сімейні">Сімейні</option>
                        </select>
                    </div>

                    <button type="submit" className="filter_button">Додати гру</button>
                    <p id="form-error" className="error_message" aria-live="polite"></p>
                </form>
            </section>

            <section id="games-catalog" className="category_section">
                <h2 className="category_title">Каталог</h2>
                <div id="games-list" className="game_grid">
                    {items.map(item => (
                        <GameCard
                            key={item.id}
                            title={item.title}
                            minPlayers={item.minPlayers}
                            maxPlayers={item.maxPlayers}
                            genre={item.genre}
                            image={item.image}
                            filter={filterByGenre}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

ReactDOM.createRoot(document.getElementById('main-section')).render(<App/>);