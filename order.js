document.addEventListener("DOMContentLoaded", function() {
  // Вибір між доставкою та самовивозом
  const deliveryBtn = document.getElementById("delivery-btn");
  const pickupBtn = document.getElementById("pickup-btn");
  const deliveryForm = document.getElementById("delivery-form");
  const pickupForm = document.getElementById("pickup-form");

  // Початково показуємо форму доставки
  deliveryForm.style.display = "block";
  pickupForm.style.display = "none"; // Приховуємо форму самовивозу за замовчуванням
  deliveryBtn.classList.add("active"); // За замовчуванням активна кнопка "Доставка"

  // Обробка вибору кнопки Доставка
  deliveryBtn.addEventListener("click", function() {
    deliveryForm.style.display = "block";
    pickupForm.style.display = "none";
    deliveryBtn.classList.add("active"); // Додаємо клас active
    pickupBtn.classList.remove("active"); // Видаляємо клас active з іншої кнопки
  });

  // Обробка вибору кнопки Самовивіз
  pickupBtn.addEventListener("click", function() {
    deliveryForm.style.display = "none";
    pickupForm.style.display = "block";
    pickupBtn.classList.add("active"); // Додаємо клас active
    deliveryBtn.classList.remove("active"); // Видаляємо клас active з іншої кнопки
  });

  // Обробка зміни села для доставки
  const selectCity = document.getElementById("city");
  const otherCityWrapper = document.getElementById("other-city-wrapper");

  selectCity.addEventListener("change", function() {
    if (selectCity.value === "Інше") {
      otherCityWrapper.style.display = "block";
    } else {
      otherCityWrapper.style.display = "none";
    }
  });

  // Обробка кнопок кількості персон
  const decrementPersonButton = document.querySelector("#person-counter .decrement");
  const incrementPersonButton = document.querySelector("#person-counter .increment");
  const personCountDisplay = document.getElementById("person-count");
  let personCount = parseInt(personCountDisplay.textContent);

  decrementPersonButton.addEventListener("click", function() {
    if (personCount > 1) {
      personCount--;
      personCountDisplay.textContent = personCount;
    }
  });

  incrementPersonButton.addEventListener("click", function() {
    personCount++;
    personCountDisplay.textContent = personCount;
  });

  // Обробка кнопок кількості навчальних паличок
  const decrementStickButton = document.querySelector("#stick-counter .decrement");
  const incrementStickButton = document.querySelector("#stick-counter .increment");
  const stickCountDisplay = document.getElementById("stick-count");
  let stickCount = parseInt(stickCountDisplay.textContent);

  decrementStickButton.addEventListener("click", function() {
    if (stickCount > 0) {
      stickCount--;
      stickCountDisplay.textContent = stickCount;
    }
  });

  incrementStickButton.addEventListener("click", function() {
    stickCount++;
    stickCountDisplay.textContent = stickCount;
  });

  // Обробка відправки форми
  const form = document.getElementById("order-form");
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const loadingModal = document.getElementById("loading-modal");
    loadingModal.style.display = "flex";

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    let city = "";
    let street = "";
    let time = "";

    // В залежності від вибору форми
    if (deliveryForm.style.display === "block") {
      city = document.getElementById("city").value;
      street = document.getElementById("street").value;
      time = document.getElementById("time").value;
    } else {
      time = document.getElementById("pickup-time").value;
    }

    const persons = document.getElementById("person-count").textContent;
    const sticks = document.getElementById("stick-count").textContent;
    const comment = document.getElementById("comment").value;

    // Формуємо повідомлення для Telegram
    const message = `
🛒 НОВЕ ЗАМОВЛЕННЯ

👤 Ім'я: ${name}
📞 Телефон: ${phone}

Тип замовлення: ${deliveryForm.style.display === "block" ? "Доставка" : "Самовивіз"}

${deliveryForm.style.display === "block" ? `
📍 Адреса:
Село: ${city}
Вулиця: ${street}
` : ""}

⏰ Час: ${time}
👥 Кількість персон: ${persons}
🍡 Навчальні палички: ${sticks}

💬 Коментар: ${comment || "-"}
💰 Сума: [Додати суму тут]
`;

    try {
      const response = await fetch("https://chimi-backend.onrender.com/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (response.ok) {
        localStorage.removeItem("favorites");
        window.location.href = "success.html"; // Перехід на сторінку успіху
      } else {
        window.location.href = "error.html"; // Перехід на сторінку помилки
      }
    } catch (err) {
      console.error(err);
      window.location.href = "error.html"; // Перехід на сторінку помилки
    } finally {
      loadingModal.style.display = "none";
    }
  });
});

// Показати поле для іншого села
document.addEventListener("DOMContentLoaded", function() {
  const selectCity = document.getElementById("city");
  const otherCityWrapper = document.getElementById("other-city-wrapper");

  selectCity.addEventListener("change", function() {
    if (selectCity.value === "Інше") {
      // Показуємо поле для іншого села
      otherCityWrapper.style.display = "block";
    } else {
      // Ховаємо поле для іншого села
      otherCityWrapper.style.display = "none";
    }
  });
});

// Кількість персон
document.addEventListener("DOMContentLoaded", function() {
  const decrementPersonButton = document.querySelector("#person-counter .decrement");
  const incrementPersonButton = document.querySelector("#person-counter .increment");
  const personCountDisplay = document.getElementById("person-count");
  
  let personCount = parseInt(personCountDisplay.textContent);

  decrementPersonButton.addEventListener("click", function() {
    if (personCount > 1) {
      personCount--;
      personCountDisplay.textContent = personCount;
    }
  });

  incrementPersonButton.addEventListener("click", function() {
    personCount++;
    personCountDisplay.textContent = personCount;
  });

  // Навчальні палички
  const decrementStickButton = document.querySelector("#stick-counter .decrement");
  const incrementStickButton = document.querySelector("#stick-counter .increment");
  const stickCountDisplay = document.getElementById("stick-count");
  
  let stickCount = parseInt(stickCountDisplay.textContent);

  decrementStickButton.addEventListener("click", function() {
    if (stickCount > 0) {
      stickCount--;
      stickCountDisplay.textContent = stickCount;
    }
  });

  incrementStickButton.addEventListener("click", function() {
    stickCount++;
    stickCountDisplay.textContent = stickCount;
  });
});