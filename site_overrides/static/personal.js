(() => {
  const canvas = document.querySelector(".letter-flow");
  const hero = canvas?.closest(".personal-hero");
  const context = canvas?.getContext("2d", { alpha: true });
  const glowCanvas = document.createElement("canvas");
  const glowContext = glowCanvas.getContext("2d", { alpha: true });
  const bloomCanvas = document.createElement("canvas");
  const bloomContext = bloomCanvas.getContext("2d", { alpha: true });
  if (!canvas || !hero || !context || !glowContext || !bloomContext) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stellarTones = ["255,255,255", "232,239,244", "205,216,224", "244,246,247"];
  const daylightNeutrals = ["69,85,103", "87,102,118", "105,116,128"];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let glowRatio = .5;
  let sceneCenterX = 0;
  let sceneCenterY = 0;
  let particles = [];
  let streams = [];
  let trail = [];
  let cuts = [];
  let startedAt = performance.now();
  let animationFrame = 0;
  let lastFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let rotationX = 0;
  let rotationY = 0;
  let rotationTargetX = 0;
  let rotationTargetY = 0;
  let hoverRotationX = 0;
  let hoverRotationY = 0;
  let hoverTargetX = 0;
  let hoverTargetY = 0;
  let dragging = false;
  let heroVisible = true;
  let dragX = 0;
  let dragY = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);
  const isDark = () => document.documentElement.dataset.theme === "dark";
  const pickStellarTone = () => {
    const roll = Math.random();
    if (roll > .976) return "255,170,120";
    if (roll > .92) return "132,213,255";
    return stellarTones[Math.floor(Math.random() * stellarTones.length)];
  };
  const pickDaylightTone = () => {
    const roll = Math.random();
    if (roll < .54) return daylightNeutrals[Math.floor(Math.random() * daylightNeutrals.length)];
    if (roll < .68) return "48,112,214";
    if (roll < .78) return "41,154,181";
    if (roll < .86) return "216,101,76";
    if (roll < .93) return "205,151,35";
    if (roll < .975) return "55,145,96";
    return "123,89,177";
  };

  function makeTargets() {
    const compact = width < 620;
    const avatarBounds = hero.querySelector(".avatar-orbit")?.getBoundingClientRect();
    const heroBounds = hero.getBoundingClientRect();
    sceneCenterX = avatarBounds ? avatarBounds.left - heroBounds.left + avatarBounds.width / 2 : width / 2;
    sceneCenterY = avatarBounds ? avatarBounds.top - heroBounds.top + avatarBounds.height / 2 : height * .32;
    const avatarRadius = avatarBounds ? avatarBounds.width / 2 : compact ? 72 : 95;
    const count = compact ? 780 : 2700;
    const radiusX = compact
      ? Math.min(width * .46, avatarRadius * 2.2)
      : Math.min(width * .29, avatarRadius * 3.8);
    const radiusY = compact ? avatarRadius * 1.55 : avatarRadius * 1.9;
    const targets = [];
    for (let index = 0; index < count; index += 1) {
      const arm = index % 3;
      const progress = Math.random();
      const ambient = Math.random() < .22;
      const baseAngle = ambient
        ? Math.random() * Math.PI * 2
        : progress * Math.PI * 2.25 + arm * Math.PI * 2 / 3;
      const radius = ambient
        ? .54 + Math.random() * .55
        : .5 + progress * .58 + (Math.random() - .5) * .065;
      const angle = baseAngle + (Math.random() - .5) * (ambient ? .16 : .085);
      const edgeFade = .8 + Math.sin(progress * Math.PI) * .2;
      const localX = Math.cos(angle) * radiusX * radius;
      const localY = Math.sin(angle) * radiusY * radius * edgeFade;
      if (localY > avatarRadius * 1.02 && Math.abs(localX) < radiusX * .72) continue;
      const localZ = Math.sin(angle * 1.35 + arm * .8) * (compact ? 42 : 105)
        + (Math.random() - .5) * (compact ? 36 : 74);
      targets.push({
        x: sceneCenterX + localX,
        y: sceneCenterY + localY,
        z: localZ,
      });
    }
    return targets;
  }

  function buildScene() {
    const bounds = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    glowRatio = width < 620 ? .5 : .36;
    glowCanvas.width = Math.round(width * glowRatio);
    glowCanvas.height = Math.round(height * glowRatio);
    bloomCanvas.width = glowCanvas.width;
    bloomCanvas.height = glowCanvas.height;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    glowContext.setTransform(glowRatio, 0, 0, glowRatio, 0, 0);

    const targets = makeTargets();
    particles = targets.map((target, index) => ({
      modelX: target.x - sceneCenterX,
      modelY: target.y - sceneCenterY,
      modelZ: target.z,
      startX: target.x - sceneCenterX + (Math.random() - .5) * 64,
      startY: target.y - sceneCenterY + (Math.random() - .5) * 64,
      startZ: (Math.random() - .5) * 150,
      delay: Math.random() * 520,
      color: pickStellarTone(),
      lightColor: pickDaylightTone(),
      phase: Math.random() * Math.PI * 2,
      radius: .34 + Math.pow(Math.random(), 4.2) * 1.45,
      depth: .72 + Math.random() * .28,
      sparkle: Math.random(),
      luminosity: Math.pow(Math.random(), 8.5),
      flare: Math.random() > .997,
      cutX: 0,
      cutY: 0,
    }));

    const streamCount = width < 620 ? 92 : 280;
    const daylightFields = [
      { x: .14, y: .28, radiusX: .22, radiusY: .18 },
      { x: .86, y: .3, radiusX: .2, radiusY: .2 },
      { x: .2, y: .79, radiusX: .24, radiusY: .17 },
      { x: .8, y: .76, radiusX: .23, radiusY: .19 },
    ];
    streams = Array.from({ length: streamCount }, (_, index) => {
      const field = daylightFields[index % daylightFields.length];
      const clustered = Math.random() < .7;
      const fieldAngle = Math.random() * Math.PI * 2;
      const fieldRadius = Math.pow(Math.random(), .62);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        lightX: clustered
          ? width * (field.x + Math.cos(fieldAngle) * field.radiusX * fieldRadius)
          : Math.random() * width,
        lightY: clustered
          ? height * (field.y + Math.sin(fieldAngle) * field.radiusY * fieldRadius)
          : Math.random() * height,
        alpha: .035 + Math.random() * .14,
        radius: .28 + Math.pow(Math.random(), 3.2) * 1.35,
        depth: .3 + Math.random() * .7,
        color: pickStellarTone(),
        lightColor: pickDaylightTone(),
        luminosity: Math.pow(Math.random(), 7),
        phase: Math.random() * Math.PI * 2,
        drift: 4 + Math.random() * 13,
      };
    });
    trail = [];
    cuts = [];
    startedAt = performance.now();
  }

  function distanceToSegment(x, y, segment) {
    const dx = segment.bx - segment.ax;
    const dy = segment.by - segment.ay;
    const lengthSquared = dx * dx + dy * dy || 1;
    const amount = clamp(((x - segment.ax) * dx + (y - segment.ay) * dy) / lengthSquared);
    const nearestX = segment.ax + dx * amount;
    const nearestY = segment.ay + dy * amount;
    return {
      distance: Math.hypot(x - nearestX, y - nearestY),
      signedDistance: (x - nearestX) * segment.normalX + (y - nearestY) * segment.normalY,
    };
  }

  function interactionAt(x, y) {
    let strength = 0;
    for (const point of trail) {
      const distance = Math.hypot(x - point.x, y - point.y);
      const localStrength = clamp(1 - distance / point.radius) * point.life;
      if (localStrength > strength) strength = localStrength;
    }
    return strength;
  }

  function drawParticle(particle, elapsed, delta, yaw, pitch) {
    const settle = easeOut((elapsed - particle.delay) / 1450);
    const floatX = Math.sin(elapsed * .00055 + particle.phase) * 1.1;
    const floatY = Math.cos(elapsed * .00048 + particle.phase) * .9;
    const localX = particle.startX + (particle.modelX - particle.startX) * settle + floatX;
    const localY = particle.startY + (particle.modelY - particle.startY) * settle + floatY;
    const localZ = particle.startZ + (particle.modelZ - particle.startZ) * settle;

    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const xzX = localX * cosY - localZ * sinY;
    const xzZ = localX * sinY + localZ * cosY;
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    const yzY = localY * cosX - xzZ * sinX;
    const yzZ = localY * sinX + xzZ * cosX;
    const perspective = width < 620 ? 620 : 1050;
    const scale = perspective / Math.max(240, perspective + yzZ);

    let x = sceneCenterX + xzX * scale + parallaxX * particle.depth;
    let y = sceneCenterY + yzY * scale + parallaxY * particle.depth;

    let fieldX = 0;
    let fieldY = 0;
    if (!dragging) {
      for (const cut of cuts) {
        const hit = distanceToSegment(x, y, cut);
        const radius = width < 620 ? 54 : 72;
        if (hit.distance >= radius) continue;
        const normalized = hit.distance / radius;
        const influence = Math.exp(-normalized * normalized * 3.6) * cut.life;
        const side = Math.tanh(hit.signedDistance / 3.5)
          || Math.sin(particle.phase) * .24;
        const texture = .82 + Math.sin(particle.phase * 2.1) * .18;
        const force = Math.min(cut.speed, 34) * influence * texture;
        fieldX += (cut.normalX * side * .62 + cut.tangentX * .09) * force;
        fieldY += (cut.normalY * side * .62 + cut.tangentY * .09) * force;
      }
    }

    const fieldLength = Math.hypot(fieldX, fieldY);
    if (fieldLength > 42) {
      fieldX = fieldX / fieldLength * 42;
      fieldY = fieldY / fieldLength * 42;
    }
    const fieldResponse = 1 - Math.exp(-delta * (fieldLength > 0 ? 26 : 7));
    particle.cutX += (fieldX - particle.cutX) * fieldResponse;
    particle.cutY += (fieldY - particle.cutY) * fieldResponse;

    x += particle.cutX;
    y += particle.cutY;
    const interaction = interactionAt(x, y);
    const twinkle = .86 + Math.sin(elapsed * (.00075 + particle.sparkle * .0008) + particle.phase) * .14;
    const darkMode = isDark();
    const baseAlpha = (darkMode ? .68 : .43) * particle.depth * twinkle;
    const alpha = clamp(baseAlpha * (.28 + settle * .72) + interaction * .07 + particle.luminosity * .22);
    const color = darkMode ? particle.color : particle.lightColor;
    const radius = Math.max(.3, particle.radius * scale * (1 + interaction * .16) + particle.luminosity * 1.75);
    const glowStrength = Math.max(particle.luminosity, interaction * .16);
    if ((darkMode && glowStrength > .12) || (!darkMode && glowStrength > .36)) {
      const glowAlpha = darkMode
        ? Math.min(.95, .16 + glowStrength * .72)
        : Math.min(.32, .025 + glowStrength * .24);
      glowContext.fillStyle = `rgba(${color},${glowAlpha})`;
      glowContext.beginPath();
      glowContext.arc(x, y, radius * (darkMode ? 1.3 + glowStrength * 2.2 : 2.2 + glowStrength * 3.1), 0, Math.PI * 2);
      glowContext.fill();
    }
    context.fillStyle = `rgba(${color},${alpha})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    if (darkMode && particle.luminosity > .48) {
      context.fillStyle = `rgba(255,255,255,${Math.min(1, .5 + particle.luminosity * .5)})`;
      context.beginPath();
      context.arc(x, y, Math.max(.45, radius * .38), 0, Math.PI * 2);
      context.fill();
    }
    if (particle.flare && settle > .92) {
      context.strokeStyle = `rgba(${color},${alpha * .4})`;
      context.lineWidth = .55;
      context.beginPath();
      context.moveTo(x - radius * 5.5, y);
      context.lineTo(x + radius * 5.5, y);
      context.moveTo(x, y - radius * 5.5);
      context.lineTo(x, y + radius * 5.5);
      context.stroke();
    }
  }

  function drawStream(stream, cycleTime) {
    const darkMode = isDark();
    const originX = darkMode ? stream.x : stream.lightX;
    const originY = darkMode ? stream.y : stream.lightY;
    const x = originX + Math.sin(cycleTime * .00023 + stream.phase) * stream.drift + parallaxX * stream.depth * .55;
    const y = originY + Math.cos(cycleTime * .00019 + stream.phase) * stream.drift * .7 + parallaxY * stream.depth * .55;
    const interaction = interactionAt(x, y);
    const alpha = stream.alpha + interaction * .18;
    const color = darkMode ? stream.color : stream.lightColor;
    const radius = stream.radius * (1 + interaction * .15) + stream.luminosity * 1.15;
    if ((darkMode && stream.luminosity > .18) || (!darkMode && stream.luminosity > .42)) {
      glowContext.fillStyle = `rgba(${color},${darkMode ? .12 + stream.luminosity * .55 : .035 + stream.luminosity * .18})`;
      glowContext.beginPath();
      glowContext.arc(x, y, radius * (darkMode ? 1.4 + stream.luminosity * 1.8 : 2.4 + stream.luminosity * 2.2), 0, Math.PI * 2);
      glowContext.fill();
    }
    context.fillStyle = `rgba(${color},${alpha})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function drawTrailGlow() {
    for (const point of trail) {
      const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius);
      const color = isDark() ? "235,242,247" : "55,68,76";
      gradient.addColorStop(0, `rgba(${color},${.032 * point.life})`);
      gradient.addColorStop(.42, `rgba(${color},${.012 * point.life})`);
      gradient.addColorStop(1, `rgba(${color},0)`);
      context.fillStyle = gradient;
      context.fillRect(point.x - point.radius, point.y - point.radius, point.radius * 2, point.radius * 2);
    }
  }

  function drawSpaceHaze() {
    if (!isDark()) return;
    const radius = Math.min(width * .38, height * .46);
    const haze = context.createRadialGradient(sceneCenterX, sceneCenterY, 16, sceneCenterX, sceneCenterY, radius);
    haze.addColorStop(0, "rgba(226,238,246,.09)");
    haze.addColorStop(.18, "rgba(172,195,210,.04)");
    haze.addColorStop(.58, "rgba(90,112,127,.015)");
    haze.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = haze;
    context.fillRect(sceneCenterX - radius, sceneCenterY - radius, radius * 2, radius * 2);
  }

  function compositeGlow() {
    const darkMode = isDark();
    bloomContext.save();
    bloomContext.globalCompositeOperation = darkMode ? "screen" : "source-over";
    bloomContext.globalAlpha = darkMode ? .88 : .62;
    bloomContext.filter = darkMode ? "blur(3px)" : "blur(5px)";
    bloomContext.drawImage(glowCanvas, 0, 0);
    bloomContext.restore();
    context.save();
    context.globalCompositeOperation = darkMode ? "screen" : "source-over";
    context.globalAlpha = darkMode ? 1 : .46;
    context.drawImage(bloomCanvas, 0, 0, width, height);
    context.restore();
  }

  function render(now) {
    animationFrame = 0;
    if (!heroVisible && !reducedMotion.matches) return;
    const delta = Math.min((now - lastFrame) / 1000 || 0, .04);
    lastFrame = now;
    context.clearRect(0, 0, width, height);
    glowContext.clearRect(0, 0, width, height);
    bloomContext.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);

    const elapsed = reducedMotion.matches ? 5000 : now - startedAt;
    const parallaxEase = 1 - Math.exp(-delta * 5.4);
    const rotationEase = 1 - Math.exp(-delta * 8.5);
    const hoverEase = 1 - Math.exp(-delta * 4.2);
    if (!dragging) {
      const memory = Math.exp(-delta * .42);
      rotationTargetX *= memory;
      rotationTargetY *= memory;
    }
    parallaxX += (pointerX - parallaxX) * parallaxEase;
    parallaxY += (pointerY - parallaxY) * parallaxEase;
    rotationX += (rotationTargetX - rotationX) * rotationEase;
    rotationY += (rotationTargetY - rotationY) * rotationEase;
    hoverRotationX += (hoverTargetX - hoverRotationX) * hoverEase;
    hoverRotationY += (hoverTargetY - hoverRotationY) * hoverEase;
    rotationX = clamp(rotationX, -.48, .48);
    const yaw = rotationY + hoverRotationY + (reducedMotion.matches ? 0 : Math.sin(elapsed * .00008) * .007);
    const pitch = rotationX + hoverRotationX + (reducedMotion.matches ? 0 : Math.cos(elapsed * .00007) * .005);
    drawSpaceHaze();
    drawTrailGlow();
    streams.forEach((stream) => drawStream(stream, elapsed));
    particles.forEach((particle) => drawParticle(particle, elapsed, delta, yaw, pitch));
    compositeGlow();

    trail = trail
      .map((point) => ({ ...point, life: point.life - delta * 1.35 }))
      .filter((point) => point.life > 0);
    cuts = cuts
      .map((cut) => ({ ...cut, life: cut.life - delta * 1.8 }))
      .filter((cut) => cut.life > 0);

    if (!reducedMotion.matches && !document.hidden && heroVisible) animationFrame = requestAnimationFrame(render);
  }

  function start() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    lastFrame = performance.now();
    animationFrame = requestAnimationFrame(render);
  }

  let previousPoint = null;
  hero.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, life: 1, time: performance.now() };
    pointerX = ((point.x / Math.max(1, bounds.width)) - .5) * 7;
    pointerY = ((point.y / Math.max(1, bounds.height)) - .5) * 5;
    hoverTargetY = ((point.x / Math.max(1, bounds.width)) - .5) * .085;
    hoverTargetX = -((point.y / Math.max(1, bounds.height)) - .5) * .06;
    if (dragging) {
      const deltaX = event.clientX - dragX;
      const deltaY = event.clientY - dragY;
      rotationTargetY = clamp(rotationTargetY + deltaX * .0021, -.92, .92);
      rotationTargetX = clamp(rotationTargetX + deltaY * .0018, -.34, .34);
      dragX = event.clientX;
      dragY = event.clientY;
      return;
    }
    if (!previousPoint || Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) > 7) {
      const distance = previousPoint ? Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) : 0;
      if (previousPoint) {
        const velocityX = point.x - previousPoint.x;
        const velocityY = point.y - previousPoint.y;
        const duration = Math.max(8, point.time - previousPoint.time);
        const speed = Math.hypot(velocityX, velocityY) / duration * 16.67;
        if (speed > .55) {
          cuts.push({
            ax: previousPoint.x,
            ay: previousPoint.y,
            bx: point.x,
            by: point.y,
            normalX: -velocityY / distance,
            normalY: velocityX / distance,
            tangentX: velocityX / distance,
            tangentY: velocityY / distance,
            speed,
            life: 1,
          });
          if (cuts.length > 36) cuts.shift();
        }
      }
      point.radius = 94 + Math.min(distance, 42) * .45;
      trail.push(point);
      if (trail.length > 34) trail.shift();
      previousPoint = point;
    }
  }, { passive: true });
  hero.addEventListener("pointerdown", (event) => {
    if (reducedMotion.matches || event.target.closest("a, button")) return;
    dragging = true;
    dragX = event.clientX;
    dragY = event.clientY;
    previousPoint = null;
    hero.classList.add("is-dragging");
    hero.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    hero.classList.remove("is-dragging");
    hero.releasePointerCapture?.(event.pointerId);
  };
  hero.addEventListener("pointerup", stopDragging);
  hero.addEventListener("pointercancel", stopDragging);
  hero.addEventListener("pointerleave", () => {
    previousPoint = null;
    cuts = [];
    pointerX = 0;
    pointerY = 0;
    hoverTargetX = 0;
    hoverTargetY = 0;
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { buildScene(); start(); }, 160);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  reducedMotion.addEventListener("change", () => { buildScene(); start(); });
  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0]?.isIntersecting || false;
    if (heroVisible) start();
  }, { rootMargin: "25% 0px" });
  heroObserver.observe(hero);

  buildScene();
  start();
})();

(() => {
  const list = document.querySelector(".posts-list[data-page-size]");
  const pagination = document.querySelector(".posts-pagination");
  if (!list || !pagination) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rows = [...list.querySelectorAll(".posts-row")];
  const pageSize = Math.max(1, Number.parseInt(list.dataset.pageSize || "8", 10));
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const previous = pagination.querySelector(".posts-pagination__previous");
  const next = pagination.querySelector(".posts-pagination__next");
  const pages = pagination.querySelector(".posts-pagination__pages");
  if (!previous || !next || !pages || totalPages <= 1) return;

  const pageHref = (page) => {
    const url = new URL(window.location.href);
    if (page <= 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(page));
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const requestedPage = () => {
    const value = Number.parseInt(new URL(window.location.href).searchParams.get("page") || "1", 10);
    return Math.min(totalPages, Math.max(1, Number.isFinite(value) ? value : 1));
  };

  const pageItems = (current) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const items = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);
    if (start > 2) items.push("ellipsis-start");
    for (let page = start; page <= end; page += 1) items.push(page);
    if (end < totalPages - 1) items.push("ellipsis-end");
    items.push(totalPages);
    return items;
  };

  const updateControl = (control, targetPage, disabled) => {
    control.href = pageHref(targetPage);
    control.dataset.page = String(targetPage);
    control.setAttribute("aria-disabled", disabled ? "true" : "false");
    control.tabIndex = disabled ? -1 : 0;
  };

  const render = (current, updateHistory = false, shouldScroll = false) => {
    const page = Math.min(totalPages, Math.max(1, current));
    const first = (page - 1) * pageSize;
    rows.forEach((row, index) => { row.hidden = index < first || index >= first + pageSize; });
    pages.replaceChildren();
    for (const item of pageItems(page)) {
      if (typeof item !== "number") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "posts-pagination__ellipsis";
        ellipsis.textContent = "…";
        ellipsis.setAttribute("aria-hidden", "true");
        pages.append(ellipsis);
        continue;
      }
      const node = document.createElement(item === page ? "span" : "a");
      node.textContent = String(item);
      if (item === page) node.setAttribute("aria-current", "page");
      else {
        node.href = pageHref(item);
        node.dataset.page = String(item);
        node.setAttribute("aria-label", `第 ${item} 页`);
      }
      pages.append(node);
    }
    updateControl(previous, page - 1, page === 1);
    updateControl(next, page + 1, page === totalPages);
    pagination.hidden = false;
    if (updateHistory) window.history.pushState({ postsPage: page }, "", pageHref(page));
    if (shouldScroll) {
      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
      window.scrollTo({ top: list.getBoundingClientRect().top + window.scrollY - headerHeight - 18, behavior: reducedMotion.matches ? "auto" : "smooth" });
    }
  };

  pagination.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-page]");
    if (!link || link.getAttribute("aria-disabled") === "true") return;
    event.preventDefault();
    render(Number.parseInt(link.dataset.page, 10), true, true);
  });
  window.addEventListener("popstate", () => render(requestedPage()));
  render(requestedPage());
})();
