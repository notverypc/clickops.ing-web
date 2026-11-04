const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function updateToggleLabel() {
  themeToggle.textContent = root.classList.contains("dark") ? "Light mode" : "Dark mode";
}

themeToggle.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    // Storage can be blocked; the theme still applies for this page.
  }
  updateToggleLabel();
});

updateToggleLabel();
