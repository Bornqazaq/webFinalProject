const publicPages = ["login.html", "signup.html", "index.html"];
const currentPage = window.location.pathname.split("/").pop().toLowerCase();

if (!publicPages.includes(currentPage) && !currentPage.endsWith(".html")) {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "./login.html";
  }
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");
    const successMsg = document.getElementById("successMsg");

    errorEmail.textContent = "";
    errorPassword.textContent = "";
    successMsg.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let valid = true;
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!email) {
      errorEmail.textContent = "Please enter your email.";
      valid = false;
    } else if (!emailPattern.test(email)) {
      errorEmail.textContent = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      errorPassword.textContent = "Please enter your password.";
      valid = false;
    } else if (password.length < 8) {
      errorPassword.textContent = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!valid) return;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      errorEmail.textContent = "No account found. Please sign up first.";
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      successMsg.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      errorPassword.textContent = "Incorrect email or password.";
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    const errorName = document.getElementById("errorName");
    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");
    const errorConfirm = document.getElementById("errorConfirm");
    const successMsg = document.getElementById("successMsg");

    errorName.textContent = "";
    errorEmail.textContent = "";
    errorPassword.textContent = "";
    errorConfirm.textContent = "";
    successMsg.textContent = "";

    let valid = true;
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!name) {
      errorName.textContent = "Full name is required.";
      valid = false;
    }

    if (!email) {
      errorEmail.textContent = "Email is required.";
      valid = false;
    } else if (!emailPattern.test(email)) {
      errorEmail.textContent = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      errorPassword.textContent = "Password is required.";
      valid = false;
    } else if (password.length < 8) {
      errorPassword.textContent = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!confirmPassword) {
      errorConfirm.textContent = "Please confirm your password.";
      valid = false;
    } else if (password !== confirmPassword) {
      errorConfirm.textContent = "Passwords do not match.";
      valid = false;
    }

    if (!valid) return;

    localStorage.setItem("user", JSON.stringify({ name, email, password }));

    successMsg.textContent = "Account created successfully!";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
}

window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const toggle = document.getElementById("themeToggle");
if (toggle) {
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
  } else {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }

  const currentTheme = html.getAttribute("data-theme");
  toggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  toggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}

const menuContainer = document.querySelector(".menu-container");
const menuList = document.getElementById("menuList");

if (menuContainer && menuList) {
  let hideTimeout;

  menuContainer.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    menuList.classList.add("active");
    menuContainer.classList.add("active");
  });

  menuContainer.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
      menuList.classList.remove("active");
      menuContainer.classList.remove("active");
    }, 200);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("allMoviesGrid");
  if (!grid) return;

  const cards = [...grid.querySelectorAll(".movie-card")];
  const genreSelect = document.getElementById("genreFilter");
  const searchInput = document.getElementById("movieSearch");
  const clearBtn = document.getElementById("clearFilters");

  function applyFilters() {
    const g = (genreSelect?.value || "all").toLowerCase();
    const q = (searchInput?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const title = card.querySelector("h5")?.textContent.toLowerCase() || "";
      const cg = (card.dataset.genre || "").toLowerCase();

      const okG = g === "all" || cg === g;
      const okQ = title.includes(q);

      card.style.display = okG && okQ ? "" : "none";
    });
  }

  if (genreSelect) genreSelect.addEventListener("change", applyFilters);
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      genreSelect.value = "all";
      searchInput.value = "";
      applyFilters();
    });
  }

  const gParam = new URL(location.href).searchParams.get("genre");
  if (gParam) {
    genreSelect.value = gParam.toLowerCase();
  }

  applyFilters();
});

const urlParams = new URLSearchParams(window.location.search);
const genreFromUrl = urlParams.get("genre");

const genreSelect = document.getElementById("genreFilter");
const cards = document.querySelectorAll(".movie-card");

if (genreFromUrl) {
  genreSelect.value = genreFromUrl;
  filterMovies();
}

function filterMovies() {
  const genre = genreSelect.value.toLowerCase();
  const searchInput = document.getElementById("movieSearch");
  const query = searchInput.value.toLowerCase();

  cards.forEach((card) => {
    const title = card.querySelector("h5").textContent.toLowerCase();
    const cardGenre = card.dataset.genre;
    const matchGenre = genre === "all" || cardGenre === genre;
    const matchSearch = title.includes(query);
    card.style.display = matchGenre && matchSearch ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("heroTop5");
  if (!hero) return;

  const slides = [...hero.querySelectorAll(".hero-slide")];
  if (!slides.length) return;

  let index = +localStorage.getItem("heroSlideIndex") || 0;
  if (index >= slides.length) index = 0;

  const show = (i) => {
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    localStorage.setItem("heroSlideIndex", i);
  };

  show(index);

  setInterval(() => {
    index = (index + 1) % slides.length;
    show(index);
  }, 6000);
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("movieSearch");
  const allMovies = document.querySelectorAll(".movie-card");

  if (!searchInput || !allMovies.length) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    allMovies.forEach((card) => {
      const title = card.querySelector("h5")?.textContent.toLowerCase() || "";
      card.style.display = title.includes(query) ? "" : "none";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("movieSearch");
  const suggestionsBox = document.getElementById("searchSuggestions");

  const allMoviesList = [
    "Joker: Folie à Deux",
    "Deadpool & Wolverine",
    "Dune: Part Two",
    "Inside Out 2",
    "Oppenheimer",
    "The Substance",
    "The Lincoln Lawyer",
    "The Wolf of Wall Street",
    "The Hangover",
    "Fury",
    "Nobody",
    "Forrest Gump",
    "Scary Movie",
    "The Intouchables",
  ];

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if (!query) {
      suggestionsBox.style.display = "none";
      return;
    }

    const matches = allMoviesList.filter((title) =>
      title.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    matches.forEach((title) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.textContent = title;

      div.addEventListener("click", () => {
        localStorage.setItem("searchQuery", title);
        window.location.href = "allmovies.html";
      });

      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "flex";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
      suggestionsBox.style.display = "none";
    }
  });

  const savedQuery = localStorage.getItem("searchQuery");
  if (savedQuery && document.querySelectorAll(".movie-card").length) {
    searchInput.value = savedQuery.toLowerCase();
    const cards = document.querySelectorAll(".movie-card");
    cards.forEach((card) => {
      const title = card.querySelector("h5")?.textContent.toLowerCase();
      card.style.display = title.includes(savedQuery.toLowerCase())
        ? ""
        : "none";
    });
    localStorage.removeItem("searchQuery");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title =
        card.querySelector("h5")?.textContent.trim() || "Unknown Movie";
      localStorage.setItem("selectedMovie", title);
      window.location.href = "movie.html";
    });
  });

  const movieTitle = document.getElementById("movieTitle");
  if (movieTitle) {
    const savedTitle = localStorage.getItem("selectedMovie");
    movieTitle.textContent = savedTitle ? savedTitle : "Unknown Movie";
  }

  const settingsBtn = document.getElementById("settingsBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const settingsMenu = document.getElementById("settingsMenu");
  const playerBox = document.getElementById("playerBox");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      settingsMenu.classList.toggle("active");
    });
  }

  if (fullscreenBtn && playerBox) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        playerBox.requestFullscreen().catch((err) => console.log(err));
        fullscreenBtn.classList.replace("bi-fullscreen", "bi-fullscreen-exit");
      } else {
        document.exitFullscreen();
        fullscreenBtn.classList.replace("bi-fullscreen-exit", "bi-fullscreen");
      }
    });
  }
});
