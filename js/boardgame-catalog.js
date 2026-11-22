const LS_Key = 'boardGamesData';
const DB_Name = 'catalogDB';
const DB_Ver = 1;
const STORE_Name = 'games';
const LS_Migrated_Key = 'boardGamesMigrated';

function saveToLocalStorage(items) {
    localStorage.setItem(LS_Key, JSON.stringify(items))
}

function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(LS_Key);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Пошкоджені дані в localStorage:', error);
        return [];
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('IndexedDB не підтримується у цьому браузері або режимі.'));
            return;
        }

        const request = indexedDB.open(DB_Name, DB_Ver);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_Name)) {
                db.createObjectStore(STORE_Name, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Реалізовано CRUD-операції
async function getAllItems() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_Name, 'readonly');
        const request = tx.objectStore(STORE_Name).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function addItem(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_Name, 'readwrite');
        tx.objectStore(STORE_Name).put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function deleteItem(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_Name, 'readwrite');
        tx.objectStore(STORE_Name).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function GameCard({ id, title, minPlayers, maxPlayers, genre, played, image, filter, onTogglePlayed, onDelete, isFeatured, isAnimationPaused}) {
    const cardClass = [
        "game_card",
        isFeatured ? "game_card--featured" : "",
        isFeatured && isAnimationPaused ? "game_card--paused" : ""
    ].filter(Boolean).join(" ");

    return (
        <article className={cardClass}>
            {isFeatured && <span className="featured_badge">⭐ Гра дня</span>}
            <h3 className="game_title">Настільна гра "{title}"</h3>
            <span className="player_badge">👥 {minPlayers}-{maxPlayers} гравці</span>
            <p className="game_genre" onClick={() => filter(genre)}>Жанр: {genre}</p>
            <img className="game_img" src={image} alt={`Обкладинка настільної гри ${title}`}/>
            <div style={{ marginTop: "10px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" className="filter_button" onClick={() => onTogglePlayed(id)}>
                    {played ? "✅ Вже зіграно" : "⏳ Ще не зіграно"}
                </button>
                <button type="button" className="filter_button" onClick={() => onDelete(id)}>
                    Видалити
                </button>
            </div>
        </article>
    );
}

function App() {
    const games = [
        { id: 1, title: "Фростпанк", minPlayers:1, maxPlayers:4, genre: "Стратегії", played: false, image: "assets/img/FrostPunkBoardGame.jpg" },
        { id: 2, title: "Тераформування Марса", minPlayers: 1, maxPlayers: 5, genre: "Стратегії", played: false, image: "assets/img/TerraformingMars.jpg" },
        { id: 3, title: "Монополія", minPlayers: 2, maxPlayers: 6, genre: "Стратегії", played: false, image: "assets/img/MonopolyBoardGame.jpg" },
        { id: 4, title: "Catan", minPlayers: 3, maxPlayers: 4, genre: "Стратегії", played: false, image: "assets/img/KATANBoardGame.jpg" },
        { id: 5, title: "Коса", minPlayers: 1, maxPlayers: 5, genre: "Фентезі", played: false, image: "assets/img/KosaBoardGame.jpg" },
        { id: 6, title: "Володар Перснів", minPlayers: 2, maxPlayers: 5, genre: "Фентезі", played: false, image:"assets/img/LotR.jpg"},
        { id: 7, title: "Відьмак", minPlayers: 1, maxPlayers: 6, genre: "Фентезі", played: false, image:"assets/img/TheWitcherBoardGame.jpg" },
        { id: 8, title: "DARKTIDE", minPlayers: 2, maxPlayers: 4, genre: "Фентезі", played: false, image:"assets/img/DARKTIDEBoardGame.jpg" }
    ];

    const [items, setItems] = React.useState([]);
    const [dbError, setDbError] = React.useState("");

    // Стани 12 практикум
    const [isFiltering, setIsFiltering] = React.useState(false);
    const [isAnimationPaused, setIsAnimationPaused] = React.useState(false);
    const filterTimerRef = React.useRef(null);

    React.useEffect(() => {
        async function loadData() {
            try {
                let dbData = await getAllItems();
                const isMigrated = localStorage.getItem(LS_Migrated_Key) === 'true';

                if (dbData.length === 0 && !isMigrated) {
                    let localData = loadFromLocalStorage()

                    if (!localData || localData.length === 0) {
                        localData = games;
                    }

                    for (const game of localData) {
                        await addItem(game);
                    }
                    saveToLocalStorage(localData);
                    localStorage.setItem(LS_Migrated_Key, 'true');

                    dbData = localData;
                } else if (!isMigrated) {
                    localStorage.setItem(LS_Migrated_Key, 'true');
                }

                setItems(dbData);
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
                setDbError("Не вдалося відкрити IndexedDB (можливо, увімкнено приватний режим). Показано дані з localStorage.");
                setItems(loadFromLocalStorage());
            }
        }

        loadData();
    }, []);

    // Динамічний вибір «Гри дня» з реальних даних каталогу
    function getGameOfTheDayId(list) {
        if (!list || list.length === 0) return null;
        const unplayed = list.filter(game => !game.played);
        const pool = unplayed.length > 0 ? unplayed : list;
        const dayIndex = new Date().getDate() % pool.length;
        return pool[dayIndex].id;
    }

    // Плавний CSS transition при зміні фільтра списку
    function updateListWithTransition(newList) {
        if (filterTimerRef.current) {
            clearTimeout(filterTimerRef.current);
        }
        setIsFiltering(true);
        filterTimerRef.current = setTimeout(() => {
            setItems(newList);
            setIsFiltering(false);
        }, 220);
    }

    async function filterByGenre(selectedGenre) {
        try {
            const allDbGames = await getAllItems();
            const filtered = allDbGames.filter(game => game.genre === selectedGenre);
            updateListWithTransition(filtered);
        } catch (error) {
            setDbError("Помилка читання даних із IndexedDB.");
        }
    }

    async function showAllGenres() {
        try {
            const allDbGames = await getAllItems();
            updateListWithTransition(allDbGames);
        } catch (error) {
            setDbError("Помилка читання даних із IndexedDB.");
        }
    }

    async function togglePlayed(selectedId) {
        try {
            const allDbGames = await getAllItems();
            const targetGame = allDbGames.find(game => game.id === selectedId);
            if (!targetGame) {
                return;
            }

            const updatedGame = { ...targetGame, played: !targetGame.played };
            await addItem(updatedGame);

            const newList = allDbGames.map(game => game.id === selectedId ? updatedGame : game);
            setItems(newList);
            saveToLocalStorage(newList);
        } catch (error) {
            setDbError("Не вдалося оновити статус гри в IndexedDB.");
        }
    }

    async function deleteGame(id) {
        try {
            await deleteItem(id);

            const allDbGames = await getAllItems();
            setItems(allDbGames);
            saveToLocalStorage(allDbGames);
        } catch (error) {
            setDbError("Не вдалося видалити гру з IndexedDB.");
        }
    }

    async function addGame(add) {
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
            played: false,
            image: "assets/img/Placeholder.jpg"
        };

        try {
            await addItem(newGame);
            const allDbGames = await getAllItems();
            setItems(allDbGames);
            saveToLocalStorage(allDbGames);
            form.reset();
        } catch (error) {
            setDbError("Не вдалося зберегти нову гру в IndexedDB.");
        }
    }

    const featuredGameId = getGameOfTheDayId(items);

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
                {dbError && (
                    <p className="error_message" style={{ textAlign: "center", marginBottom: "15px" }} role="alert">
                        {dbError}
                    </p>
                )}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "15px" }}>
                    <button type="button" className="filter_button" onClick={showAllGenres}>
                        Показати всі жанри
                    </button>
                    <button
                        type="button"
                        className="filter_button"
                        onClick={() => setIsAnimationPaused(prev => !prev)}
                    >
                        {isAnimationPaused ? "▶ Відновити анімацію" : "⏸ Пауза анімації"}
                    </button>
                </div>
                <div id="games-list" className={`game_grid ${isFiltering ? "game_grid--filtering" : ""}`}>
                    {items.map(item => (
                        <GameCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            minPlayers={item.minPlayers}
                            maxPlayers={item.maxPlayers}
                            genre={item.genre}
                            played={item.played}
                            image={item.image}
                            filter={filterByGenre}
                            onTogglePlayed={togglePlayed}
                            onDelete={deleteGame}
                            isFeatured={item.id === featuredGameId}
                            isAnimationPaused={isAnimationPaused}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

ReactDOM.createRoot(document.getElementById('main-section')).render(<App/>);