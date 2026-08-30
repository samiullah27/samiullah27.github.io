const buttons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");
const diagrams = document.querySelectorAll(".diagram-card");
const yearNode = document.getElementById("year");
const backdrop = document.getElementById("cardBackdrop");
const backBtn = document.getElementById("lightboxBack");

const menuToggle = document.getElementById("menuToggle");
const sideNav = document.getElementById("sideNav");
const sideNavClose = document.getElementById("sideNavClose");
const sidenavBackdrop = document.getElementById("sidenavBackdrop");
const sideNavLinks = document.querySelectorAll(".side-nav a");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

/* Side navigation: open/close via hamburger button, backdrop, close button,
   Escape key, and clicking a link. */
function openSideNav() {
  sideNav.classList.add("is-open");
  sidenavBackdrop.classList.add("is-active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("lightbox-open");
}

function closeSideNav() {
  sideNav.classList.remove("is-open");
  sidenavBackdrop.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("lightbox-open");
}

menuToggle.addEventListener("click", () => {
  if (sideNav.classList.contains("is-open")) {
    closeSideNav();
  } else {
    openSideNav();
  }
});

sideNavClose.addEventListener("click", closeSideNav);
sidenavBackdrop.addEventListener("click", closeSideNav);

sideNavLinks.forEach((link) => {
  link.addEventListener("click", closeSideNav);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sideNav.classList.contains("is-open")) {
    closeSideNav();
  }
});

/* Highlight the current section's link in the side navigation while scrolling */
const navSections = document.querySelectorAll("main .section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      sideNavLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

navSections.forEach((section) => navObserver.observe(section));

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;
    cards.forEach((card) => {
      if (selected === "all") {
        card.classList.remove("is-hidden");
        return;
      }

      const tags = card.dataset.tags || "";
      const show = tags.split(" ").includes(selected);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

/* Scroll-reveal animation: project cards fade/slide in as they enter view */
cards.forEach((card) => card.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

cards.forEach((card) => revealObserver.observe(card));

/* Scroll-reveal animation for every section, plus a subtle staggered
   reveal for their internal items (timeline entries, skills groups, etc.) */
const sections = document.querySelectorAll(".reveal-section");

const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      const items = entry.target.querySelectorAll(".reveal-item");
      items.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index, 6) * 90}ms`;
        item.classList.add("is-visible");
      });

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* Lightbox: expand a project card or a diagram, blur the rest, allow going back */
let activeElement = null;
let activePlaceholder = null;

function closeLightbox() {
  if (!activeElement) {
    return;
  }

  activeElement.classList.remove("is-expanded");
  if (activePlaceholder) {
    activePlaceholder.replaceWith(activeElement);
  }

  backdrop.classList.remove("is-active");
  backBtn.classList.remove("is-active");
  document.body.classList.remove("lightbox-open");

  activeElement = null;
  activePlaceholder = null;
}

function openLightbox(element) {
  if (activeElement === element) {
    return;
  }

  if (activeElement) {
    closeLightbox();
  }

  activePlaceholder = document.createComment("lightbox-placeholder");
  element.replaceWith(activePlaceholder);
  document.body.appendChild(element);

  // Force reflow so the pop-in animation replays each time it opens.
  element.classList.remove("is-expanded");
  void element.offsetWidth;
  element.classList.add("is-expanded");

  backdrop.classList.add("is-active");
  backBtn.classList.add("is-active");
  document.body.classList.add("lightbox-open");

  activeElement = element;
}

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    // Ignore clicks on links/buttons inside the card, and clicks that
    // originated from an architecture diagram (handled separately below).
    if (event.target.closest("a, button, .diagram-card")) {
      return;
    }

    if (card.classList.contains("is-expanded")) {
      return;
    }

    openLightbox(card);
  });
});

diagrams.forEach((diagram) => {
  diagram.addEventListener("click", (event) => {
    event.stopPropagation();

    if (diagram.classList.contains("is-expanded")) {
      return;
    }

    openLightbox(diagram);
  });
});

backdrop.addEventListener("click", closeLightbox);
backBtn.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
