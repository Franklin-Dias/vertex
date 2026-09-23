(() => {
  const initHeader = () => {
    const header = document.querySelector(".container-header");
    if (!header) return;

    const mobile = window.matchMedia("(max-width: 768px)");
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
