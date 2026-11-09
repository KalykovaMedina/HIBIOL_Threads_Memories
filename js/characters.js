/* ============================================================
   HIBIOL — Логика модального окна персонажей
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".character-card");
    const modal = document.getElementById("characterModal");
    const modalClose = document.getElementById("modalClose");
    const modalOverlay = document.getElementById("modalOverlay");

    // Элементы внутри модального окна
    const modalName = document.getElementById("modalName");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTraits = document.getElementById("modalTraits");
    const modalSignificance = document.getElementById("modalSignificance");

    if (!cards.length || !modal) return;

    // --- Открытие модального окна ---
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // Получаем данные из data-атрибутов карточки
        const name = card.dataset.name;
        const title = card.dataset.title;
        const desc = card.dataset.desc;
        const traits = card.dataset.traits;
        const significance = card.dataset.significance;
        const theme = card.dataset.theme; // Для цвета акцента

        // Заполняем модалку
        modalName.textContent = name;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalTraits.textContent = traits;
        modalSignificance.textContent = significance;

        // Устанавливаем тему (цвет) для модалки
        modal.setAttribute("data-theme", theme);

        // Показываем
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden"; // Блокируем скролл фона
      });
    });

    // --- Закрытие модального окна ---
    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener("click", closeModal);
    }

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  });
})();
