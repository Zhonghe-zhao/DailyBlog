(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const modes = ["auto", "light", "dark"];

  if (toggle) {
    const labels = { auto: "跟随系统", light: "浅色", dark: "深色" };
    const refreshLabel = () => {
      const mode = root.dataset.theme || "auto";
      toggle.title = `当前：${labels[mode]}；点击切换`;
      toggle.setAttribute("aria-label", toggle.title);
    };
    refreshLabel();
    toggle.addEventListener("click", () => {
      const current = root.dataset.theme || "auto";
      const next = modes[(modes.indexOf(current) + 1) % modes.length];
      root.dataset.theme = next;
      localStorage.setItem("blog-theme", next);
      refreshLabel();
    });
  }

  const progress = document.querySelector(".reading-progress span");
  if (progress && document.querySelector(".article")) {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0;
      progress.style.width = `${percentage}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
  }

  document.querySelectorAll("pre").forEach((block) => {
    const button = document.createElement("button");
    button.className = "copy-code";
    button.type = "button";
    button.textContent = "复制";
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(block.innerText);
      button.textContent = "已复制";
      window.setTimeout(() => { button.textContent = "复制"; }, 1400);
    });
    block.appendChild(button);
  });

  const randomButton = document.querySelector(".random-post");
  if (randomButton) {
    const links = [...document.querySelectorAll(".post-card h2 a")];
    randomButton.addEventListener("click", () => {
      if (links.length) window.location.href = links[Math.floor(Math.random() * links.length)].href;
    });
  }
})();
