

gsap.registerPlugin(ScrollTrigger);

const secao = document.querySelector(".container-projetos");
const trilho = secao.querySelector(".trilho");
const cards = Array.from(trilho.querySelectorAll(":scope > .card"));

if (cards.length > 1) {
  const mm = gsap.matchMedia();

  // Celular: cada card sobe por cima do anterior.
  mm.add("(max-width: 768px)", () => {
    cards.forEach((card, indice) => {
      gsap.set(card, {
        zIndex: indice + 1,
        yPercent: indice === 0 ? 0 : 100,
      });
    });

    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: "power1.inOut" },
      scrollTrigger: {
        trigger: secao,
        start: "center center",
        end: () => `+=${Math.max(trilho.offsetHeight * 1.8, window.innerHeight * 0.85) * (cards.length - 1)}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    for (const card of cards.slice(1)) {
      timeline.to(card, { yPercent: 0 });
    }
  });

  // Desktop: a rolagem move o trilho na horizontal.
  mm.add("(min-width: 701px)", () => {
    const distancia = () => trilho.scrollWidth - secao.clientWidth;

    gsap.to(trilho, {
      x: () => -distancia(),
      ease: "none",
      scrollTrigger: {
        trigger: secao,
        start: "center center",
        end: () => `+=${distancia() * 1.5}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (cards.length - 1),
          delay: 0.3,
          duration: { min: 0.5, max: 0.9 },
          ease: "power1.inOut",
        },
      },
    });
  });
}
