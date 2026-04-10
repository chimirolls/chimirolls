document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("rolls-container");

  const res = await fetch("data.json");
  const data = await res.json();

  const allItems = [...data.rolls, ...data.sets, ...data.salats];

  let items;
  const isFavoritesPage = window.location.pathname.includes("favorites");
  const isSetsPage = window.location.pathname.includes("sets");
  const isSalatsPage = window.location.pathname.includes("other");

  if (isFavoritesPage) {
  items = allItems;
} else if (isSetsPage) {
  items = data.sets;
} else if (isSalatsPage) {
  items = data.salats; 
} else {
  items = data.rolls;
}

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const emptyBlock = document.getElementById("empty-favorites");
  const summary = document.querySelector(".favorites-summary");
  const top = document.querySelector(".favorites-top");

  function updateTotal() {
  if (!isFavoritesPage) return;

  let total = 0;

  document.querySelectorAll(".card-small").forEach(card => {
    const count = Number(card.querySelector(".count").textContent);
    const item = allItems.find(i => i.id === card.dataset.id);

    if (item) {
      total += Number(item.price) * count;
    }
  });

  const totalEl = document.getElementById("total-price");
  if (totalEl) {
    totalEl.textContent = total + " ₴";
  }
}

  function toggleFavoritesState() {
    if (!isFavoritesPage) return;

    if (favorites.length === 0) {
      if (container) container.style.display = "none";
      if (emptyBlock) emptyBlock.style.display = "block";

      if (summary) summary.style.display = "none";
      if (top) top.style.display = "none";
    } else {
      if (container) container.style.display = "block";
      if (emptyBlock) emptyBlock.style.display = "none";

      if (summary) summary.style.display = "block";
      if (top) top.style.display = "flex";
    }
  }

  function renderCards(list, targetContainer) {
  targetContainer.innerHTML = "";

  list.forEach(item => {
    if (isFavoritesPage && !favorites.some(f => String(f.id) === String(item.id))) return;

    const card = document.createElement("div");
    card.dataset.id = item.id;

    if (isFavoritesPage) {
      card.className = "card-small";
      card.innerHTML = `
        <img src="${item.img}" class="card-small-img">

        <div class="card-small-content">

          <div class="info">
            <h3 class="title">${item.name}</h3>
            <span class="weight">${item.weight}</span>
            <span class="price">${item.price} ₴</span>
          </div>

          <div class="actions">
            <div class="counter">
              <button class="minus">−</button>
              <span class="count">1</span>
              <button class="plus">+</button>
            </div>

          </div>

        </div>
      `;
    } else {
      card.className = "card";
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${item.img}" class="card-img" alt="${item.name}">

          <button class="like-btn" type="button">
            <img class="heart-icon" src="icons/shop.png" alt="cart">
          </button>
        </div>

        <div class="card-content">
          <div class="top-row">
            <h3>${item.name}</h3>
            <span class="price">${item.price} ₴</span>
          </div>

          <div class="bottom-row">
            <p>${item.desc}</p>
            <span class="weight">${item.weight}</span>
          </div>
        </div>
      `;
    }

    targetContainer.appendChild(card);
  });

  attachLikeHandlers();
  attachCounterHandlers();
}

  function attachLikeHandlers() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    const card = btn.closest("[data-id]");
    const id = card.dataset.id;

    if (favorites.some(f => f.id === id)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

    btn.onclick = () => {
      if (favorites.some(f => String(f.id) === String(id))) {
        favorites = favorites.filter(f => String(f.id) !== String(id));
        btn.classList.remove("active");

        if (isFavoritesPage) {
          card.remove();
        }
      } else {
        favorites.push({
          id: id,
          type: isSetsPage ? "sets" : isSalatsPage ? "salats" : "rolls",
          quantity: 1
        });
        btn.classList.add("active");

        triggerFavAnimation();
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));

      updateFavCount();
      updateTotal();
      toggleFavoritesState();
    };
  });
}

  // КНОПКА ОЧИСТИТИ
  const clearBtn = document.getElementById("clear-favorites");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      favorites = [];
      localStorage.removeItem("favorites");

      if (container) container.innerHTML = "";

      updateTotal();
      toggleFavoritesState(); 
    });
  }

  // --- РЕНДЕР ---
  if (container) {
    renderCards(items, container);
    updateTotal();
  }

  updateTotal();
  toggleFavoritesState(); 

  // --- ПОШУК ---
  const searchInput = document.getElementById("searchInput");
  const searchContainer = document.getElementById("search-results");

  if (searchInput && searchContainer) {
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase().trim();

      if (!value) {
        searchContainer.innerHTML = "";
        return;
      }

      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(value) ||
        item.desc.toLowerCase().includes(value)
      );

      if (filtered.length === 0) {
        searchContainer.classList.add("empty");

        searchContainer.innerHTML = `
          <div class="no-results">
            <img src="icons/no-data.png">
            <p>Упс... Нічого не знайдено :(</p>
          </div>
        `;
        return;
      }

      renderCards(filtered, searchContainer);
    });
  }

/*Лічильник товарів в обраному*/
function attachCounterHandlers() {
  document.querySelectorAll(".card-small").forEach(card => {
    const minus = card.querySelector(".minus");
    const plus = card.querySelector(".plus");
    const countEl = card.querySelector(".count");
    const priceEl = card.querySelector(".price");

    if (!minus || !plus) return;

    const id = card.dataset.id;

    const item = allItems.find(i => i.id === id);
    let basePrice = Number(item.price);

    let favItem = favorites.find(f => f.id === id);

    let count = favItem ? favItem.quantity : 1;
    countEl.textContent = count;
    priceEl.textContent = (basePrice * count) + " ₴";

    // ➕ PLUS
    plus.onclick = () => {
      count++;

      const favItem = favorites.find(f => f.id === id);
      if (favItem) {
        favItem.quantity = count;
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));

      countEl.textContent = count;
      priceEl.textContent = (basePrice * count) + " ₴";

      updateTotal();
    };

    // ➖ MINUS
    minus.onclick = () => {
      count--;

      if (count <= 0) {
        favorites = favorites.filter(f => f.id !== id);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        card.remove();
        updateTotal();
        toggleFavoritesState();
        return;
      }

      const favItem = favorites.find(f => f.id === id);
      if (favItem) {
        favItem.quantity = count;
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));

      countEl.textContent = count;
      priceEl.textContent = (basePrice * count) + " ₴";

      updateTotal();
    };
  });
}

});





/*Хедер фіксується при скролінгу*/
const header = document.querySelector(".app-header");
const topBar = document.getElementById("topBar");

let lastScroll = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  const height = topBar.offsetHeight;

  if (current > lastScroll && current > 50) {
    header.style.transform = `translateY(-${height}px)`;
  } else {
    header.style.transform = `translateY(0)`;
  }

  lastScroll = current;
});




/* Кнопка "Очистити"*/
const clearBtn = document.getElementById("clear-favorites");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("favorites");
    const container = document.getElementById("rolls-container");
    if (container) {
      container.innerHTML = "";
    }
    const totalEl = document.getElementById("total-price");
    if (totalEl) {
      totalEl.textContent = "0 ₴";
    }
  });
}



/*Лічильник обраного*/
function updateFavCount() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const countEl = document.querySelector(".fav-count");

  if (!countEl) return; // 🔥 ОСЬ ЦЕ ГОЛОВНЕ

  countEl.textContent = favs.length;

  if (favs.length === 0) {
    countEl.style.display = "none";
  } else {
    countEl.style.display = "flex";
  }
}


// виклик при загрузці
updateFavCount();

function triggerFavAnimation() {
  const fab = document.querySelector(".favorites-fab");

  const wave = document.createElement("span");
  wave.classList.add("fav-wave");

  fab.appendChild(wave);

  // видаляємо після анімації
  setTimeout(() => {
    wave.remove();
  }, 600);
}

