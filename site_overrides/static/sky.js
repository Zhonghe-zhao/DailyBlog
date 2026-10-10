(() => {
  // The landing page already owns a full-screen particle scene. Running this
  // secondary canvas there creates a second animation loop with no visual gain.
  if (document.querySelector(".personal-hero")) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stellarTones = ["255,255,255", "232,239,244", "205,216,224", "244,246,247"];
  const daylightTones = ["69,85,103", "87,102,118", "48,112,214", "41,154,181", "216,101,76", "205,151,35"];
  const dark = () => document.documentElement.dataset.theme !== "light";
  const rand = (n = 1) => Math.random() * n;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const tone = () => (rand() > .96 ? "255,170,120" : rand() > .9 ? "132,213,255" : pick(stellarTones));
  const jobs = [];
  let running = false;
  let epoch = 0;

  function canvasBox(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    return { ctx, width: rect.width, height: rect.height };
  }

  function starAt(x, y) {
    return {
      x, y, homeX: x, homeY: y, seed: rand(Math.PI * 2),
      radius: .34 + Math.pow(rand(), 4.2) * 1.5,
      depth: .7 + rand(.3),
      phase: rand(Math.PI * 2),
      sparkle: rand(),
      luminosity: Math.pow(rand(), 6.5),
      flare: rand() > .985,
      color: tone(),
      light: pick(daylightTones),
      pushX: 0,
      pushY: 0,
      ready: false,
    };
  }

  function paintStar(ctx, star, time, alphaScale, interaction, bright, size) {
    const twinkle = .84 + Math.sin(time * (.0008 + star.sparkle * .0009) + star.phase) * .16;
    const color = bright || dark() ? star.color : star.light;
    const alpha = Math.min(1, ((dark() ? .62 : .4) * star.depth * twinkle + interaction * .28 + star.luminosity * .4) * alphaScale);
    if (alpha < .02) return;
    const radius = Math.max(.45, (star.radius * (1 + interaction * .2) + star.luminosity * 1.5) * (size || 1));
    if (star.luminosity > .42 || interaction > .35) {
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius * 7);
      glow.addColorStop(0, `rgba(${color},${dark() ? .28 : .12})`);
      glow.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(star.x, star.y, radius * 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (dark() && star.luminosity > .72) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, Math.max(.4, radius * .35), 0, Math.PI * 2);
      ctx.fill();
    }
    if (star.flare && alphaScale > .4) {
      ctx.strokeStyle = `rgba(${color},${alpha * .55})`;
      ctx.lineWidth = .6;
      ctx.beginPath();
      ctx.moveTo(star.x - radius * 5, star.y);
      ctx.lineTo(star.x + radius * 5, star.y);
      ctx.moveTo(star.x, star.y - radius * 5);
      ctx.lineTo(star.x, star.y + radius * 5);
      ctx.stroke();
    }
  }

  function nudge(star, px, py) {
    if (px == null) return 0;
    const dx = star.x - px;
    const dy = star.y - py;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > 90) return 0;
    const force = 1 - dist / 90;
    star.pushX += (dx / dist) * force * 10;
    star.pushY += (dy / dist) * force * 8;
    return force;
  }

  function settlePush(star) {
    star.pushX *= .86;
    star.pushY *= .86;
    star.x += star.pushX * .08;
    star.y += star.pushY * .08;
  }

  function mount(parent, className) {
    const canvas = document.createElement("canvas");
    canvas.className = className;
    canvas.setAttribute("aria-hidden", "true");
    parent.prepend(canvas);
    return canvas;
  }

  function bindNav(header) {
    const nav = header.querySelector(".site-nav");
    if (!nav) return;
    const canvas = document.createElement("canvas");
    canvas.className = "nav-sky";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    const stars = Array.from({ length: 36 }, () => starAt(0, 0));
    let hot = null;
    let pointer = null;
    let presence = 0;
    let lastTime = 0;
    const wide = window.matchMedia("(min-width: 1001px)");
    const padX = 56;
    const padY = 26;
    const underLink = (event) => {
      const link = event.target.closest?.("a");
      return link && nav.contains(link) ? link : null;
    };
    nav.addEventListener("pointerover", (event) => { hot = underLink(event) || hot; });
    nav.addEventListener("pointermove", (event) => {
      hot = underLink(event);
      const rect = canvas.getBoundingClientRect();
      pointer = hot ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : null;
    });
    nav.addEventListener("pointerleave", () => { hot = null; pointer = null; });
    jobs.push((time) => {
      const delta = Math.min(.05, lastTime ? (time - lastTime) / 1000 : .016);
      lastTime = time;
      const follow = 1 - Math.exp(-delta * 16);
      if (!wide.matches) {
        if (canvas.width) canvas.width = 0;
        return;
      }
      const navBox = nav.getBoundingClientRect();
      if (navBox.width < 20) return;
      canvas.style.left = `${navBox.left - padX}px`;
      canvas.style.top = `${navBox.top - padY}px`;
      canvas.style.width = `${navBox.width + padX * 2}px`;
      canvas.style.height = `${navBox.height + padY * 2}px`;
      presence += ((hot ? 1 : 0) - presence) * follow;
      if (!hot && presence < .02) {
        if (canvas.width) canvas.width = 0;
        stars.forEach((star) => { star.ready = false; });
        return;
      }
      const { ctx } = canvasBox(canvas);
      const host = canvas.getBoundingClientRect();
      const box = (hot || stars[0].link)?.getBoundingClientRect();
      if (!box || box.width < 1) return;
      const cx = box.left - host.left + box.width / 2;
      const cy = box.top - host.top + box.height / 2;
      const rx = Math.max(26, box.width * .62 + 6);
      const ry = 13;
      const haze = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
      haze.addColorStop(0, dark() ? "rgba(226,238,246,.14)" : "rgba(90,110,130,.08)");
      haze.addColorStop(1, dark() ? "rgba(226,238,246,0)" : "rgba(90,110,130,0)");
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry + 8, 0, 0, Math.PI * 2);
      ctx.fill();
      stars.forEach((star) => {
        if (!star.ready || star.epoch !== epoch || star.link !== hot) {
          star.epoch = epoch;
          star.link = hot;
          star.x = cx + Math.cos(star.seed) * rx;
          star.y = cy + Math.sin(star.seed) * ry;
          star.ready = true;
        }
        const angle = star.seed + time * .0009;
        const breathe = .92 + Math.sin(star.phase) * .08;
        star.x += (cx + Math.cos(angle) * rx * breathe - star.x) * follow;
        star.y += (cy + Math.sin(angle) * ry * breathe - star.y) * follow;
        const interaction = nudge(star, pointer?.x, pointer?.y);
        settlePush(star);
        paintStar(ctx, star, time, presence, interaction);
      });
    });
  }

  function bindList(list, rowSelector) {
    const canvas = mount(list, "sky-list");
    const stars = Array.from({ length: 68 }, () => starAt(0, 0));
    let hot = null;
    let pointer = null;
    let presence = 0;
    let bandY = 0;
    let bandH = 48;
    let bandReady = false;
    let lastTime = 0;
    const place = (event) => {
      const row = event.target.closest(rowSelector);
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      hot = row && list.contains(row) && !row.hidden ? row : null;
    };
    const releaseTouch = (event) => {
      if (event.pointerType === "mouse") return;
      hot = null;
      pointer = null;
    };
    list.addEventListener("pointermove", place);
    list.addEventListener("pointerleave", () => { hot = null; pointer = null; });
    list.addEventListener("pointerup", releaseTouch);
    list.addEventListener("pointercancel", releaseTouch);
    jobs.push((time) => {
      const delta = Math.min(.05, lastTime ? (time - lastTime) / 1000 : .016);
      lastTime = time;
      const glide = 1 - Math.exp(-delta * 9);
      const drift = 1 - Math.exp(-delta * 4.6);
      if (hot?.hidden) hot = null;
      const target = hot ? 1 : 0;
      presence += (target - presence) * glide;
      if (!hot && presence < .02) {
        if (canvas.width) canvas.width = 0;
        bandReady = false;
        stars.forEach((star) => { star.ready = false; });
        return;
      }
      const { ctx, width, height } = canvasBox(canvas);
      if (width < 8 || height < 8) return;
      const host = canvas.getBoundingClientRect();
      if (hot) {
        const row = hot.getBoundingClientRect();
        const goalY = row.top - host.top;
        const goalH = row.height;
        if (!bandReady) {
          bandY = goalY;
          bandH = goalH;
          bandReady = true;
        } else {
          bandY += (goalY - bandY) * glide;
          bandH += (goalH - bandH) * glide;
        }
      }
      const cy = bandY + bandH * .42;
      const spreadX = Math.min(width * .7, Math.max(240, bandH * 2.6));
      const spreadY = Math.max(72, bandH * .9);
      if (!dark()) {
        const wash = ctx.createRadialGradient(width * .46, cy, 0, width * .46, cy, spreadY * 1.6);
        wash.addColorStop(0, `rgba(90,104,116,${.04 * presence})`);
        wash.addColorStop(1, "rgba(90,104,116,0)");
        ctx.fillStyle = wash;
        ctx.beginPath();
        ctx.ellipse(width * .46, cy, spreadX * .55, spreadY, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      stars.forEach((star) => {
        if (!star.ready || star.epoch !== epoch) {
          star.epoch = epoch;
          const u = Math.max(1e-4, rand());
          const v = rand();
          const span = Math.sqrt(-2 * Math.log(u));
          star.slotX = Math.max(-2.2, Math.min(2.2, span * Math.cos(Math.PI * 2 * v)));
          star.slotY = Math.max(-2.2, Math.min(2.2, span * Math.sin(Math.PI * 2 * v)));
          star.x = width * .46;
          star.y = cy;
          star.ready = true;
        }
        const tx = width * .46 + star.slotX * spreadX * .34 + Math.sin(time * .00032 + star.phase) * 11;
        const ty = cy + star.slotY * spreadY * .42 + Math.cos(time * .00027 + star.phase) * 8;
        star.x += (tx - star.x) * drift;
        star.y += (ty - star.y) * drift;
        const interaction = nudge(star, pointer?.x, pointer?.y);
        settlePush(star);
        const nx = (star.x - width * .46) / (spreadX * .5);
        const ny = (star.y - cy) / (spreadY * .62);
        const falloff = Math.exp(-(nx * nx + ny * ny) * 1.05);
        paintStar(ctx, star, time, presence * (.22 + falloff * .78), interaction);
      });
    });
  }

  function sampleGlyphs(text, font, letterSpacing, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(width));
    canvas.height = Math.max(1, Math.ceil(height));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.font = font;
    ctx.letterSpacing = letterSpacing || "0px";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, 0, canvas.height / 2);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const points = [];
    for (let y = 0; y < canvas.height; y += 3) {
      for (let x = 0; x < canvas.width; x += 3) {
        if (data[(y * canvas.width + x) * 4 + 3] > 150) points.push({ x, y });
      }
    }
    return points;
  }

  function bindTitle(head) {
    const title = head.querySelector("h1");
    if (!title) return;
    const hugText = head.classList.contains("posts-page__head");
    const showOrbit = hugText || head.classList.contains("term-head");
    const orbit = showOrbit ? mount(head, "sky-orbit") : null;
    const ink = document.createElement("canvas");
    const probe = document.createElement("canvas").getContext("2d");
    if (!hugText) {
      ink.className = "sky-ink";
      ink.setAttribute("aria-hidden", "true");
      title.append(ink);
    }
    const mask = document.createElement("canvas");
    let glyphs = [];
    let orbits = Array.from({ length: hugText ? 86 : 140 }, () => starAt(0, 0));
    let sampled = "";
    let pointer = null;
    head.addEventListener("pointermove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
    });
    head.addEventListener("pointerleave", () => { pointer = null; });

    jobs.push((time) => {
      const text = title.textContent.trim();
      const box = title.getBoundingClientRect();
      if (box.width < 8) return;
      const style = getComputedStyle(title);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const letterSpacing = style.letterSpacing || "0px";
      probe.font = font;
      probe.letterSpacing = letterSpacing;
      const textWidth = Math.min(box.width, probe.measureText(text).width || box.width);
      if (!hugText && sampled !== `${text}:${epoch}:${letterSpacing}:${Math.round(box.width)}:${Math.round(box.height)}`) {
        const points = sampleGlyphs(text, font, letterSpacing, box.width, box.height);
        glyphs = Array.from({ length: Math.min(420, points.length) }, () => {
          const point = points[Math.floor(rand(points.length))] || { x: 8, y: 8 };
          return starAt(point.x, point.y);
        });
        sampled = `${text}:${epoch}:${letterSpacing}:${Math.round(box.width)}:${Math.round(box.height)}`;
      }
      if (hugText) {
        /* Stars stay outside the strokes; the glyph mask was pinning them to the letters. */
      } else {
      const word = canvasBox(ink);
      const maskCtx = mask.getContext("2d");
      if (mask.width !== ink.width || mask.height !== ink.height) {
        mask.width = ink.width;
        mask.height = ink.height;
      }
      maskCtx.setTransform(word.ctx.getTransform());
      maskCtx.clearRect(0, 0, word.width, word.height);
      glyphs.forEach((star) => {
        star.x = star.homeX + Math.sin(time * .0006 + star.phase) * 1.1;
        star.y = star.homeY + Math.cos(time * .0005 + star.phase) * .8;
        paintStar(maskCtx, star, time, dark() ? .8 : .72, 0, true);
      });
      maskCtx.globalCompositeOperation = "destination-in";
      maskCtx.font = font;
      maskCtx.letterSpacing = letterSpacing;
      maskCtx.textBaseline = "middle";
      maskCtx.fillStyle = "#fff";
      maskCtx.fillText(text, 0, word.height / 2);
      maskCtx.globalCompositeOperation = "source-over";
      word.ctx.save();
      word.ctx.globalCompositeOperation = dark() ? "screen" : "source-over";
      word.ctx.globalAlpha = dark() ? 1 : .9;
      word.ctx.drawImage(mask, 0, 0, word.width, word.height);
      word.ctx.restore();
      }

      if (!orbit) return;
      const headBox = head.getBoundingClientRect();
      const desiredRx = hugText ? textWidth * .48 + 78 : Math.max(160, textWidth * 1.2);
      const fitRx = box.left + textWidth / 2 - 16;
      const rx = hugText ? Math.max(36, Math.min(desiredRx, fitRx)) : desiredRx;
      const ry = hugText ? Math.min(76, Math.max(52, rx * .72)) : Math.min(72, Math.max(32, box.height * .38));
      const padLeft = hugText ? Math.max(0, Math.ceil(rx + 10 - textWidth / 2)) : 0;
      const padRight = padLeft;
      const padX = padLeft;
      const padTop = hugText ? Math.ceil(ry + 12) : 0;
      const padBottom = hugText ? Math.ceil(ry * .82) : 0;
      if (hugText) {
        const left = Math.round(box.left - headBox.left - padLeft);
        const top = Math.round(box.top - headBox.top - padTop);
        const orbitWidth = Math.ceil(padLeft + textWidth + padRight);
        const orbitHeight = Math.ceil(box.height + padTop + padBottom);
        const place = `${left}|${top}|${orbitWidth}|${orbitHeight}`;
        if (orbit.dataset.place !== place) {
          orbit.dataset.place = place;
          orbit.style.left = `${left}px`;
          orbit.style.top = `${top}px`;
          orbit.style.width = `${orbitWidth}px`;
          orbit.style.height = `${orbitHeight}px`;
        }
      }
      const field = canvasBox(orbit);
      const host = orbit.getBoundingClientRect();
      const cx = hugText ? padX + textWidth / 2 : box.left - host.left + textWidth * .55;
      const cy = hugText ? padTop + box.height / 2 : box.top - host.top + box.height * .55;
      if (dark() && !hugText) {
        const haze = field.ctx.createRadialGradient(cx, cy, 8, cx, cy, rx * .65);
        haze.addColorStop(0, "rgba(226,238,246,.07)");
        haze.addColorStop(1, "rgba(226,238,246,0)");
        field.ctx.fillStyle = haze;
        field.ctx.beginPath();
        field.ctx.ellipse(cx, cy, rx * .65, ry, 0, 0, Math.PI * 2);
        field.ctx.fill();
      }
      const localPointer = pointer ? { x: pointer.x - host.left, y: pointer.y - host.top } : null;
      orbits.forEach((star, index) => {
        const progress = (index / orbits.length + time * .00002) % 1;
        const angle = hugText
          ? star.seed + time * .00016
          : progress * Math.PI * 2.3 + (index % 3) * .4;
        const reach = hugText ? .56 + (star.phase / (Math.PI * 2)) * .44 : .42 + progress * .85;
        star.x = cx + Math.cos(angle) * rx * reach;
        star.y = cy + Math.sin(angle) * ry * reach;
        const interaction = nudge(star, localPointer?.x, localPointer?.y);
        settlePush(star);
        if (star.x < -12 || star.x > field.width + 12 || star.y < -12 || star.y > field.height + 12) return;
        const starSize = hugText ? (headBox.width < 720 ? 1.05 : 1.7) : 1;
        paintStar(field.ctx, star, time, hugText ? 1 : .5, interaction, false, starSize);
      });
    });
  }

  function bindArticle() {
    const article = document.querySelector(".article");
    if (!article) return;
    const canvas = mount(document.body, "article-sky");
    const stars = Array.from({ length: 160 }, () => starAt(rand(1200), rand(800)));
    jobs.push((time) => {
      const { ctx, width, height } = canvasBox(canvas);
      const host = canvas.getBoundingClientRect();
      const columns = [...article.querySelectorAll(".article-head__main, .article-column")]
        .map((node) => node.getBoundingClientRect())
        .filter((rect) => rect.width > 0);
      if (dark()) {
        const haze = ctx.createRadialGradient(width * .58, 150, 20, width * .58, 150, 420);
        haze.addColorStop(0, "rgba(226,238,246,.08)");
        haze.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, width, height);
      }
      stars.forEach((star) => {
        if (!star.ready || star.epoch !== epoch) {
          star.epoch = epoch;
          star.x = rand(width);
          star.y = rand(height);
          star.ready = true;
        }
        star.x += Math.sin(time * .00015 + star.phase) * .08;
        star.y += Math.cos(time * .00012 + star.phase) * .05;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
        if (star.y < 86) return;
        const overText = columns.some((rect) => (
          star.x > rect.left - host.left - 12
          && star.x < rect.right - host.left + 12
          && star.y > rect.top - host.top
          && star.y < rect.bottom - host.top
        ));
        paintStar(ctx, star, time, overText ? .1 : .46, 0);
      });
    });
  }

  function wake() {
    if (running) return;
    running = true;
    window.requestAnimationFrame(frame);
  }

  function frame(time) {
    jobs.forEach((job) => job(reduced ? 8000 : time));
    running = false;
    if (!document.hidden) wake();
  }

  const header = document.querySelector(".site-header");
  if (header) bindNav(header);
  document.querySelectorAll(".posts-list").forEach((list) => bindList(list, ".posts-row"));
  document.querySelectorAll(".archive-list").forEach((list) => bindList(list, "article"));
  document.querySelectorAll(".term-head, .posts-page__head").forEach(bindTitle);
  bindArticle();
  if (!jobs.length) return;

  document.fonts.ready.then(() => { epoch += 1; wake(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wake(); });
  window.addEventListener("resize", () => {
    epoch += 1;
    document.querySelectorAll(".nav-sky, .sky-list, .sky-orbit, .sky-ink, .article-sky").forEach((canvas) => {
      canvas.width = 0;
    });
    wake();
  }, { passive: true });
})();
