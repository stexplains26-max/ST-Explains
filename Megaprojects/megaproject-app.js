document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('#primary-navigation'); // use id now

  if (!menuBtn || !menuLinks) return;

  menuBtn.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    this.classList.toggle('is-active');  // for animated bars if you add CSS
    menuLinks.classList.toggle('active'); // show/hide mobile menu (your existing CSS expects .active)
  });

  // optional: close menu when a link clicked
  menuLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('navbar__links')) {
      menuLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('is-active');
    }
  });
});

/* -------------------------
   ELEMENTS
-------------------------- */
const tocWrapper = document.querySelector(".toc-wrapper");
const tocOverlay = document.querySelector(".toc-overlay");

// LINKS
const microLinks = document.querySelectorAll(".toc-panel--micro a");
const macroLinks = document.querySelectorAll(".toc-panel--macro a");

// HEADINGS
const h2Sections = document.querySelectorAll("h2[id]");
const h3Sections = document.querySelectorAll("h3[id]");

// BUTTONS
const leftBtn = document.getElementById("toc-left");
const rightBtn = document.getElementById("toc-right");

const NAV_OFFSET = 120;


/* -------------------------
   AUTO-SCROLL HELPER
-------------------------- */
function scrollActiveIntoView(container, activeEl) {
    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    const offset = 20;

    if (elRect.top < containerRect.top + offset) {
        container.scrollBy({
            top: elRect.top - containerRect.top - offset,
            behavior: "smooth"
        });
    } else if (elRect.bottom > containerRect.bottom - offset) {
        container.scrollBy({
            top: elRect.bottom - containerRect.bottom + offset,
            behavior: "smooth"
        });
    }
}

/* prevent jitter */
let lastActiveId = "";

function handleActiveScroll(currentId, activeLink) {
    if (!currentId || currentId === lastActiveId) return;

    lastActiveId = currentId;

    const microPanel = document.querySelector(".toc-panel--micro");
    scrollActiveIntoView(microPanel, activeLink);
}


/* -------------------------
   SCROLL SPY (MICRO ONLY)
-------------------------- */
window.addEventListener("scroll", () => {
    let currentH2 = "";
    let currentH3 = "";

    const scrollY = window.scrollY;

    /* FIND CURRENT H2 */
    h2Sections.forEach((section, index) => {
        const top = section.offsetTop - NAV_OFFSET;
        const next = h2Sections[index + 1];
        const bottom = next
            ? next.offsetTop - NAV_OFFSET
            : document.body.scrollHeight;

        if (scrollY >= top && scrollY < bottom) {
            currentH2 = section.id;

            const nextH2Top = bottom;

            /* FIND H3 INSIDE H2 */
            const h3sInSection = Array.from(h3Sections).filter(h3 => {
                return (
                    h3.offsetTop > section.offsetTop &&
                    h3.offsetTop < nextH2Top
                );
            });

            h3sInSection.forEach((h3, i) => {
                const top = h3.offsetTop - NAV_OFFSET;
                const next = h3sInSection[i + 1];
                const bottom = next
                    ? next.offsetTop - NAV_OFFSET
                    : nextH2Top;

                if (scrollY >= top && scrollY < bottom) {
                    currentH3 = h3.id;
                }
            });
        }
    });

    /* APPLY ACTIVE */
    let activeLink = null;

    microLinks.forEach(link => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (
            href === "#" + currentH2 ||
            href === "#" + currentH3
        ) {
            link.classList.add("active");
            activeLink = link;
        }
    });

    /* AUTO-SCROLL */
    if (activeLink) {
        handleActiveScroll(currentH3 || currentH2, activeLink);
    }
});


/* -------------------------
   PANEL SWITCHING (WORKS FOR BOTH DESKTOP + MOBILE)
-------------------------- */
function showMacro() {
    tocWrapper?.classList.add("show-macro");
    tocWrapper?.classList.remove("show-micro");
}

function showMicro() {
    tocWrapper?.classList.add("show-micro");
    tocWrapper?.classList.remove("show-macro");
}


/* -------------------------
   BUTTON BEHAVIOR
-------------------------- */
if (leftBtn && rightBtn) {

    leftBtn.addEventListener("click", () => {
        if (window.innerWidth <= 1200) {
            openTOC();
            showMacro();   // ✅ THIS WAS MISSING
        } else {
            showMacro();
        }
    });

    rightBtn.addEventListener("click", () => {
        if (window.innerWidth <= 1200) {
            openTOC();
            showMicro();   // ✅ THIS WAS MISSING
        } else {
            showMicro();
        }
    });
}


/* -------------------------
   MOBILE OPEN / CLOSE
-------------------------- */
function openTOC() {
    tocWrapper?.classList.add("open");
    tocOverlay?.classList.add("active");
}

function closeTOC() {
    tocWrapper?.classList.remove("open");
    tocOverlay?.classList.remove("active");
}

/* overlay click */
tocOverlay?.addEventListener("click", closeTOC);


/* -------------------------
   MOBILE BUTTON (OPTIONAL)
-------------------------- */
const tocMobileBtn = document.getElementById("toc-mobile-btn");

tocMobileBtn?.addEventListener("click", () => {
    if (!tocWrapper) return;

    const isOpen = tocWrapper.classList.contains("open");

    if (isOpen) {
        closeTOC();
    } else {
        openTOC();
    }
});


/* -------------------------
   DEFAULT STATE
-------------------------- */
if (tocWrapper) {
    showMacro();
}


/* -------------------------
   MACRO ACTIVE (PAGE-BASED)
-------------------------- */
let currentPage = window.location.pathname
    .split("/")
    .pop()
    .split("?")[0]
    .split("#")[0];

if (!currentPage || currentPage === "") {
    currentPage = "GHIB.html";
}

macroLinks.forEach(link => {
    const linkPage = link
        .getAttribute("href")
        .split("?")[0]
        .split("#")[0];

    if (
        decodeURIComponent(linkPage) ===
        decodeURIComponent(currentPage)
    ) {
        link.classList.add("active");
    }
});