/* ============================================================
   HIBIOL — Логика финала (Цветок обещания)
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const formWrap = document.getElementById("promiseFormWrap");
    const form = document.getElementById("promiseForm");
    const input = document.getElementById("promiseInput");
    const result = document.getElementById("promiseResult");
    const userText = document.getElementById("promiseUserText");
    const btnReset = document.getElementById("promiseReset");
    const particlesContainer = document.getElementById("finaleParticles");

    if (!form || !result) return;

    // --- Генератор частиц ---
    function spawnParticles() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (particlesContainer.children.length > 0) return; // Уже созданы

      const count = 25;
      const frag = document.createDocumentFragment();

      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.className = "glow-particle";
        p.style.left = `${Math.random() * 100}%`;
        p.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
        p.style.setProperty("--delay", `${Math.random() * 5}s`);
        // Случайный размер
        const size = 2 + Math.random() * 4;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        frag.appendChild(p);
      }
      particlesContainer.appendChild(frag);
    }

    // --- Запуск "цветения" ---
    function bloomPromise(text) {
      // 1. Скрываем форму
      formWrap.classList.add("is-hidden");

      // 2. Заполняем текст
      userText.textContent = `«${text}»`;

      // 3. Показываем результат (с небольшой задержкой для анимации)
      setTimeout(() => {
        result.classList.add("is-visible");
        result.setAttribute("aria-hidden", "false");
        spawnParticles();
      }, 300);
    }

    // --- Сброс формы ---
    function resetPromise() {
      result.classList.remove("is-visible");
      result.setAttribute("aria-hidden", "true");

      setTimeout(() => {
        formWrap.classList.remove("is-hidden");
        input.value = "";
        input.focus();

        // Очищаем частицы, чтобы не копились
        particlesContainer.innerHTML = "";
      }, 500);
    }

    // --- Обработка формы ---
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      // Сохраняем в LocalStorage (для будущего "виртуального сада")
      try {
        const existing =
          JSON.parse(localStorage.getItem("hibiol_promises")) || [];
        existing.push({ text, date: new Date().toISOString() });
        localStorage.setItem("hibiol_promises", JSON.stringify(existing));
      } catch (err) {
        console.warn("Не удалось сохранить послание в LocalStorage:", err);
      }

      bloomPromise(text);
    });

    // --- Обработка кнопки сброса ---
    if (btnReset) {
      btnReset.addEventListener("click", resetPromise);
    }

    // --- Проверка LocalStorage при загрузке (опционально) ---
    // Если хочешь, чтобы последнее послание показывалось при заходе на сайт
    /*
    try {
      const existing = JSON.parse(localStorage.getItem('hibiol_promises'));
      if (existing && existing.length > 0) {
        // Можно автоматически показывать последнее послание
        // bloomPromise(existing[existing.length - 1].text);
      }
    } catch (e) {}
    */
  });
})();
