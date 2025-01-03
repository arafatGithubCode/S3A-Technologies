/**
 * Asynchronously loads the header & footer component into the given selector.
 *
 * @async
 * @param {string} selector - CSS selector for the target element.
 * @param {string} file - Path to the HTML file containing the component.
 * @throws {Error} If the fetch request fails.
 */
const loadComponent = async (selector, file) => {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.statusText}`);
    }

    const html = await response.text();
    document.querySelector(selector).innerHTML = html;

    // Call any function that depends on the dynamically loaded content
    if (file.includes("header.html")) {
      await initializeHeaderEvents();

      // set header bg color on scroll
      const header = document.querySelector(".menu");

      window.addEventListener("scroll", () => {
        const isScrolled = window.scrollY > 50;
        header.classList.toggle("menu-fade-down-bg", isScrolled);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Initializes event listeners for the dynamically loaded header, specifically the theme toggle.
 *
 * @async
 */
const initializeHeaderEvents = async () => {
  const themeSwitch = document.getElementById("toggle-theme");
  const menuIconEl = document.querySelector(".menu-icon");

  menuIconEl.addEventListener("click", () => {
    const isExpanded = menuIconEl.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      menuIconEl.setAttribute("aria-expanded", "false");
      menuIconEl.innerHTML =
        '<i class="fa-solid fa-times animate__animated animate__pulse"></i>';
    } else {
      menuIconEl.setAttribute("aria-expanded", "true");
      menuIconEl.innerHTML =
        '<i class="fa-solid fa-bars animate__animated animate__pulse"></i>';
    }
  });

  if (!themeSwitch) {
    console.warn("toggle-theme element not found in header.");
    return;
  }

  const themeKey = "data-bs-theme";

  /**
   * Sets the theme and updates the document's theme attribute.
   *
   * @param {string} theme - The desired theme ("light" or "dark").
   */
  const setTheme = (theme) => {
    localStorage.setItem(themeKey, theme);
    document.documentElement.setAttribute(themeKey, theme);

    // Update the icon based on the theme
    if (theme === "light") {
      themeSwitch.innerHTML = '<i class="fa-solid fa-moon nav-link"></i>';
    } else {
      themeSwitch.innerHTML = '<i class="fa-solid fa-sun nav-link"></i>';
    }
  };

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem(themeKey) || "dark";
  setTheme(savedTheme);

  // Add event listener for the theme toggle
  themeSwitch.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute(themeKey);
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  });
};

// Load header and footer
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#header", "./header.html");
  loadComponent("#footer", "./footer.html");
});

// AOS initialization
AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
  mirror: false,
});
