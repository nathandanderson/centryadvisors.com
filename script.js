/* Centry Advisors site behaviour */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear() + " ";

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------- Shadow on the sticky header once scrolled ---------- */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Highlight the section currently in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal blocks as they scroll into view ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(
    ".split__main, .service, .case, .founder__photo, .founder__body, .contact__intro, .contact__form"
  );

  if (!reduced && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });

    revealables.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      revealer.observe(el);
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (!form || !status) return;

  function setError(input, message) {
    var field = input.closest(".field");
    field.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    if (!field.querySelector(".field__error")) {
      var p = document.createElement("p");
      p.className = "field__error";
      p.textContent = message;
      field.appendChild(p);
    }
  }

  function clearError(input) {
    var field = input.closest(".field");
    field.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    var err = field.querySelector(".field__error");
    if (err) err.remove();
  }

  function validate() {
    var ok = true;
    var first = null;

    form.querySelectorAll("input, textarea").forEach(function (input) {
      clearError(input);
      if (!input.required) return;

      var value = input.value.trim();
      if (!value) {
        setError(input, "This field is required.");
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(input, "Please enter a valid email address.");
      } else {
        return;
      }

      ok = false;
      if (!first) first = input;
    });

    if (first) first.focus();
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form__status";
    status.textContent = "";

    if (!validate()) {
      status.classList.add("is-error");
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    var endpoint = form.getAttribute("action");

    // Fail loudly rather than silently dropping the message. The old mailto
    // fallback was removed so no address is exposed to scrapers.
    if (!endpoint) {
      status.classList.add("is-error");
      status.textContent =
        "This form is not configured correctly. Please reach out on LinkedIn instead.";
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        form.reset();
        status.classList.add("is-ok");
        status.textContent = "Thanks, your message is on its way. We'll be in touch within three business days.";
      })
      .catch(function () {
        status.classList.add("is-error");
        status.textContent =
          "Something went wrong. Please try again, or reach out on LinkedIn.";
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
