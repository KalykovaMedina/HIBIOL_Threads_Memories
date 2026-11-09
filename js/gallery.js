/* ============================================================
   HIBIOL — Галерея и Лайтбокс
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const items = Array.from(document.querySelectorAll(".gallery-item"));
    const lightbox = document.getElementById("lightbox");
    const lightboxWrap = document.getElementById("lightboxImgWrap");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const btnClose = document.getElementById("lightboxClose");
    const btnPrev = document.getElementById("lightboxPrev");
    const btnNext = document.getElementById("lightboxNext");

    if (!items.length || !lightbox) return;

    let currentIndex = 0;
    let startX = 0; // Для свайпов на мобильных

    // --- Открытие ---
    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        currentIndex = index;
        openLightbox();
      });
    });

    function openLightbox() {
      updateLightboxContent();
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    // --- Обновление контента в лайтбоксе ---
    function updateLightboxContent() {
      const item = items[currentIndex];

      // Получаем заглушку или картинку
      const img = item.querySelector("img");
      const placeholder = item.querySelector(".gallery-placeholder");

      // Очищаем обертку
      lightboxWrap.innerHTML = "";

      if (img) {
        // Если есть реальная картинка
        const clone = img.cloneNode();
        lightboxWrap.appendChild(clone);
        lightboxCaption.textContent = img.alt || "";
      } else if (placeholder) {
        // Если заглушка
        const clone = placeholder.cloneNode(true);
        lightboxWrap.appendChild(clone);
        lightboxCaption.textContent =
          placeholder.querySelector("span")?.textContent || "";
      }
    }

    // --- Навигация ---
    function nextImage() {
      currentIndex = (currentIndex + 1) % items.length;
      updateLightboxContent();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateLightboxContent();
    }

    // --- Слушатели событий ---
    btnClose.addEventListener("click", closeLightbox);
    btnNext.addEventListener("click", nextImage);
    btnPrev.addEventListener("click", prevImage);

    // Клик мимо картинки (по фону) закрывает
    lightbox.addEventListener("click", (e) => {
      if (
        e.target === lightbox ||
        e.target.classList.contains("lightbox-content")
      ) {
        closeLightbox();
      }
    });

    // Клавиатура
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });

    // --- Свайпы для мобильных ---
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );

    lightbox.addEventListener(
      "touchend",
      (e) => {
        if (!startX) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (diff > 50)
          nextImage(); // Свайп влево
        else if (diff < -50) prevImage(); // Свайп вправо

        startX = 0;
      },
      { passive: true },
    );
  });
})();
