/* root2.in — the only script.
   1) Reveal .fade / .rise elements on scroll (respects reduced motion).
   2) Toggle the mobile nav menu.
   3) Filter the writings list by topic. */
(function () {
  "use strict";

  // ---- scroll reveal ----
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealers = document.querySelectorAll(".fade, .rise");

  if (reduce || !("IntersectionObserver" in window)) {
    revealers.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealers.forEach(function (el) {
      io.observe(el);
    });
  }

  // ---- mobile nav ----
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---- topic filters (writings page) ----
  var chips = document.querySelectorAll(".chip");
  var items = document.querySelectorAll("[data-topic]");
  var emptyMsg = document.querySelector(".empty");

  function applyFilter(topic) {
    var shown = 0;
    items.forEach(function (item) {
      var match = topic === "all" || item.getAttribute("data-topic") === topic;
      item.hidden = !match;
      if (match) shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown !== 0;
  }

  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        applyFilter(chip.getAttribute("data-filter"));
      });
    });
  }
})();
