document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".video-hero");

  if (!video) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let videoVisible = false;
  let playPending = false;

  const shouldPlay = () =>
    videoVisible && !document.hidden && !reducedMotion.matches;

  const updatePlayback = () => {
    if (!shouldPlay()) {
      video.pause();
      return;
    }

    // Mantem a reproducao continua, sem reiniciar a cada movimento.
    if (video.paused && !playPending) {
      playPending = true;
      video.play().then(() => {
        if (!shouldPlay()) video.pause();
      }).catch(() => {
        // Uma interacao pode tentar novamente se o navegador bloquear o autoplay.
      }).finally(() => {
        playPending = false;
      });
    }
  };

  video.muted = true;

  const observer = new IntersectionObserver(([entry]) => {
    videoVisible = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0 });
  observer.observe(video);

  document.addEventListener("visibilitychange", updatePlayback);
  window.addEventListener("pageshow", updatePlayback);
  window.addEventListener("pointerdown", updatePlayback, { passive: true });
  window.addEventListener("keydown", updatePlayback);
  reducedMotion.addEventListener("change", updatePlayback);
});


// Efeito dos links do menu ao passar o mouse ou navegar pelo teclado.
document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll(".container-list a").forEach((link) => {
    let hovered = false;
    let focused = false;

    const animateLink = () => {
      const active = hovered || focused;

      gsap.to(link, {
        y: active && !reducedMotion.matches ? -3 : 0,
        "--menu-underline": active ? 1 : 0,
        duration: reducedMotion.matches ? 0 : 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    link.addEventListener("mouseenter", () => {
      hovered = true;
      animateLink();
    });
    link.addEventListener("mouseleave", () => {
      hovered = false;
      animateLink();
    });
    link.addEventListener("focus", () => {
      focused = true;
      animateLink();
    });
    link.addEventListener("blur", () => {
      focused = false;
      animateLink();
    });
    reducedMotion.addEventListener("change", animateLink);
  });
});

gsap.registerPlugin(ScrollTrigger, SplitText);
document.fonts.ready.then(() => {
  if(window.matchMedia("(prefers-reduced-motion)").matches){
    return;
  }
  const texto = SplitText.create(".paragrafo-servi", {
    type: "words",
  });
  gsap.from(texto.words, {
    opacity: 0.1,
    y: 25,
    duration: 1,
    stagger: 0.1,
    ease: "none",

    scrollTrigger: {
      trigger: ".paragrafo-servi",
      start: "top 80%",
      end: "bottom 45%",
      scrub: 1,
    },
  });
});

gsap.registerPlugin(ScrollTrigger, SplitText);
document.fonts.ready.then(() => {
  if (window.matchMedia("(prefers-reduced-motion)").matches) {
    return;
  }
  const texto = SplitText.create(".title-hero", {
    type: "chars",
  });
  gsap.from(texto.chars, {
    opacity: 0,
    y: 30,
    duration: 0.2,
    stagger: 0.1,
    ease: "none",

    scrollTrigger: {
      trigger: ".title-hero",
      start: "top 55%",
      end: "bottom 25%",
      scrub: 1,
    },
  });
});

gsap.registerPlugin(ScrollTrigger, SplitText);
document.fonts.ready.then(() => {
  if (window.matchMedia("(prefers-reduced-motion)").matches) {
    return;
  }
  const texto = SplitText.create(".title-servicos", {
    type: "words",
  });
  gsap.from(texto.words, {
    opacity: 0,
    y: 30,
    duration: 0.1,
    stagger: 0.1,
    ease: "none",

    scrollTrigger: {
      trigger: ".title-servicos",
      start: "top 95%",
      end: "bottom 30%",
      scrub: 1,
    },
  });
});

gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray(".container-itens").forEach((card, index) => {
  gsap.from(card, {
    opacity: 0,
    y: 100,
    scale: 0.8,
    rotation: index % 2 === 0 ? -12 : 12,
    ease: "none",

    scrollTrigger: {
      trigger: card,
      start: "top 55%",
      end: "top 10%",
      scrub: 1,
    },
  });
});



