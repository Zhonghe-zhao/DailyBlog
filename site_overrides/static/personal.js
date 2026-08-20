(() => {
  const rain = document.querySelector(".color-rain");
  if (!rain) return;
  const colors = ["#4285f4", "#ea4335", "#fbbc05", "#34a853", "#5bd8f6"];
  const drops = [
    [8, 14, 0], [17, 9, 5], [25, 12, 10], [33, 7, 2], [41, 11, 8],
    [48, 8, 13], [54, 13, 4], [62, 9, 11], [70, 12, 6], [78, 8, 1],
    [86, 10, 9], [93, 7, 15], [13, 8, 12], [29, 9, 16], [58, 7, 18], [82, 11, 14]
  ];
  drops.forEach(([left, size, delay], index) => {
    const drop = document.createElement("i");
    drop.style.setProperty("--left", `${left}%`);
    drop.style.setProperty("--size", `${size}px`);
    drop.style.setProperty("--delay", `-${delay}s`);
    drop.style.setProperty("--duration", `${18 + (index % 5) * 3}s`);
    drop.style.setProperty("--color", colors[index % colors.length]);
    rain.append(drop);
  });
})();
