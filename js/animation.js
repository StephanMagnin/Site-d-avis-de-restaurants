gsap.from([".login"], {
  duration: 2,
  x: "-100vw",
  delay: 1,
  ease: "power1.in",
});

gsap.from("header", { duration: 1, y: "-100%", ease: "power2.in" });

gsap.from([".nbr-stars", ".filter"], {
  duration: 1,
  opacity: 0,
  delay: 1,
  stagger: 0.3,
});

gsap.from("#aside", { duration: 2, x: "-100vw", delay: 1, ease: "power2.in" });

gsap.from("#map", { duration: 1, delay: 2, x: "-100vw" });
