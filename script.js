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
      video
        .play()
        .then(() => {
          if (!shouldPlay()) video.pause();
        })
        .catch(() => {
          // Uma interacao pode tentar novamente se o navegador bloquear o autoplay.
        })
        .finally(() => {
          playPending = false;
        });
    }
  };

  video.muted = true;

  const observer = new IntersectionObserver(
    ([entry]) => {
      videoVisible = entry.isIntersecting;
      updatePlayback();
    },
    { threshold: 0 },
  );
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
  if (window.matchMedia("(prefers-reduced-motion)").matches) {
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

const mm = gsap.matchMedia();

mm.add(
  {
    motion: "(prefers-reduced-motion: no-preference)",
    mobile: "(max-width: 768px)",
    desktop: "(min-width: 769px)",
  },
  (context) => {
    if (!context.conditions.motion) return;
    const { mobile } = context.conditions;
    const viewport = document.querySelector(".servicos-viewport");
    const grid = viewport?.querySelector(".container-servicos-itens");
    if (!grid) return;

    const serviceCards = gsap.utils.toArray(".container-itens", grid);
    const header = document.querySelector(".container-header");
    const topOffset = () => (header?.offsetHeight || 0) + 16;
    if (mobile) {
      // O empilhamento nativo preserva o espaco das secoes seguintes.
      const updateStackOffset = () => {
        viewport.style.setProperty("--service-stack-top", `${topOffset()}px`);
      };
      viewport.classList.add("is-stacked");
      updateStackOffset();
      window.addEventListener("resize", updateStackOffset);
      serviceCards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1 });
      });
      return () => {
        window.removeEventListener("resize", updateStackOffset);
        viewport.classList.remove("is-stacked");
        viewport.style.removeProperty("--service-stack-top");
      };
    }
    const measure = () => {
      if (mobile) {
        viewport.style.setProperty("--service-card-height", `${Math.max(1, window.innerHeight - topOffset() - 40)}px`);
      }
      viewport.style.height = `${Math.min(grid.offsetHeight, Math.max(1, window.innerHeight - topOffset() - 16))}px`;
    };
    const distance = () => Math.max(0, grid.offsetHeight - viewport.clientHeight);

    viewport.classList.add("is-pinned");
    if (mobile) viewport.classList.add("is-stacked");
    measure();

    const servicesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: viewport,
        start: () => `top ${topOffset()}px`,
        end: () => `+=${mobile ? window.innerHeight * (serviceCards.length - 1) * 0.85 : distance() * 1.25 + window.innerHeight * 1.3}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
      },
    });

    if (mobile) {
      serviceCards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1 });
        if (index === 0) return;

        const position = index - 1;
        servicesTimeline.fromTo(card, {
          y: () => viewport.clientHeight + 32,
        }, {
          y: 0,
          duration: 1,
          ease: "power1.inOut",
        }, position);
        servicesTimeline.to(serviceCards[index - 1], {
          scale: 0.95,
          y: -8,
          duration: 1,
          ease: "power1.inOut",
        }, position);
      });
    } else {
      servicesTimeline.from(serviceCards, {
      autoAlpha: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power1.inOut",
    });
    servicesTimeline.to(grid, {
      y: () => -distance(),
      duration: () => Math.max(1, distance() / window.innerHeight * 2),
      ease: "none",
    });
    }
    // Reserva um trecho para ler o ultimo card antes de liberar a pagina.
    servicesTimeline.to({}, { duration: 0.4 });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

    return () => {
      viewport.classList.remove("is-pinned");
      viewport.classList.remove("is-stacked");
      viewport.style.removeProperty("--service-card-height");
      viewport.style.removeProperty("height");
    };
  },
);

gsap.registerPlugin(ScrollTrigger);

mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
const secao = document.querySelector(".etapas");
const cards = gsap.utils.toArray(".etapa", secao);

const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: secao,
    start: "top 160px",

    // Distância de rolagem reservada para a animação
    end: () => `+=${window.innerHeight * 1.9}`,

    pin: true,
    pinSpacing: true,
    scrub: true,
    invalidateOnRefresh: true,
  },
});

timeline.fromTo(
  cards,
  {
    autoAlpha: 0,
    y: 60,
  },
  {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    stagger: 1,
    ease: "none",
  },
);

// Mantém todos visíveis por um trecho antes de liberar a seção
timeline.to({}, { duration: 0.3 });
});

document.querySelectorAll(".fa-brands").forEach((icon) =>{
  const animation = gsap.to(icon, {
    "--angulo": "360deg",
    duration: 1.5,
    repeat: -1,
    ease: "none",
    paused: true,
  });
   icon.addEventListener("mouseenter", () => animation.play());
   icon.addEventListener("mouseleave", () => animation.pause());
});
