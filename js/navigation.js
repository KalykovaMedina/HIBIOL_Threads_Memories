/* ============================================================
   Навигация: шапка при скролле, мобильное меню, scroll spy
   ============================================================ */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");

  /* ----- Шапка: меняем стиль при прокрутке ----- */
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Мобильное меню ----- */
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    // Закрываем меню по клику на ссылку
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) setOpen(false);
      });
    });

    // Закрываем по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open"))
        setOpen(false);
    });
  }

  /* ----- Scroll spy: подсветка активного пункта ----- */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const links = Array.from(document.querySelectorAll(".nav-link"));

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`,
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
