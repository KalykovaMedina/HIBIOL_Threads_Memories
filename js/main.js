/* ============================================================
   HIBIOL — Главный контроллер
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("js-ready");

    // Проверка поддержки современных функций
    if (!window.IntersectionObserver) {
      console.warn(
        "Ваш браузер может не поддерживать некоторые анимации появления.",
      );
      // В этом случае CSS уже должен показывать контент (мы использовали progressive enhancement)
    }

    if (!localStorage) {
      console.warn("LocalStorage недоступен. Послания не будут сохраняться.");
    }

    console.log("🌸 HIBIOL готов. Нити воспоминаний сплетены.");
  });
})();
