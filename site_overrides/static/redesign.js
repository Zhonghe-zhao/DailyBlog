(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  menu?.setAttribute("aria-expanded", "false");
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menu.textContent = open ? "关闭" : "菜单";
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    nav.classList.remove("is-open");
    menu.textContent = "菜单";
    menu.setAttribute("aria-expanded", "false");
  });

  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;
  const count = document.querySelector(".gallery-count");
  const empty = document.querySelector(".gallery-empty");
  const dialog = document.querySelector(".lightbox");
  const lightboxImage = dialog?.querySelector("img");
  const lightboxTitle = dialog?.querySelector("strong");
  const lightboxDate = dialog?.querySelector("figcaption span");
  const lightboxLink = dialog?.querySelector("figcaption a");

  const show = (item) => {
    lightboxImage.src = item.src; lightboxImage.alt = item.alt;
    lightboxTitle.textContent = item.title; lightboxDate.textContent = item.date;
    lightboxLink.href = item.href; dialog.showModal();
  };

  fetch(gallery.dataset.source)
    .then((response) => { if (!response.ok) throw new Error(response.statusText); return response.json(); })
    .then((items) => {
      count.textContent = `${String(items.length).padStart(2, "0")} IMAGES IN ARCHIVE`;
      empty.hidden = items.length > 0;
      items.forEach((item, index) => {
        const figure = document.createElement("figure"); figure.className = "gallery-item"; figure.tabIndex = 0;
        const image = document.createElement("img"); image.src = item.src; image.alt = item.alt; image.loading = index < 6 ? "eager" : "lazy";
        const caption = document.createElement("figcaption");
        const title = document.createElement("span"); title.textContent = item.title;
        const date = document.createElement("time"); date.textContent = item.date;
        caption.append(title, date); figure.append(image, caption);
        figure.addEventListener("click", () => show(item));
        figure.addEventListener("keydown", (event) => { if (event.key === "Enter") show(item); });
        gallery.append(figure);
      });
    })
    .catch(() => { count.textContent = "影像载入失败"; empty.hidden = false; });

  dialog?.querySelector(".lightbox__close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
