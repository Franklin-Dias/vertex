(() => {
  const initHeader = () => {
    const header = document.querySelector(".container-header");
    if (!header) return;

    const mobile = window.matchMedia("(max-width: 768px)");
    const menuButton = header.querySelector("#btn-menu-mobile");
    const menu = header.querySelector("#menu");

    if (menuButton && menu) {
      const setMenuOpen = (open) => {
        const expanded = mobile.matches && open;
        menu.classList.toggle("aberto", expanded);
        menuButton.setAttribute("aria-expanded", String(expanded));
        menuButton.setAttribute("aria-label", expanded ? "Fechar menu" : "Abrir menu");
      };

      setMenuOpen(false);
      menuButton.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
      });
      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenuOpen(false);
      });
      document.addEventListener("click", (event) => {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
          setMenuOpen(false);
        }
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
          setMenuOpen(false);
          menuButton.focus();
        }
      });
      mobile.addEventListener("change", () => setMenuOpen(false));
    }
    const updateHeader = () => {
      const scrollTop = Math.max(
        window.scrollY || 0,
        document.scrollingElement?.scrollTop || 0
      );
      header.classList.toggle("is-scrolled", scrollTop > (mobile.matches ? 8 : 40));
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("pageshow", updateHeader);
    mobile.addEventListener("change", updateHeader);
  };

  // O script com defer ja encontra o HTML pronto, sem esperar outros recursos.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader, { once: true });
  } else {
    initHeader();
  }
})();
