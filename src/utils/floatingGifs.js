function generateRandomPositionWithSpacing(existingPositions) {
  const minDistance = 15;
  let position, tooClose;
  do {
    position = { top: `${Math.random() * 90}vh`, left: `${Math.random() * 90}vw` };
    tooClose = existingPositions.some((p) => {
      const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
      const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });
  } while (tooClose);
  return position;
}

// A scattered set of 12 copies of a gif with non-overlapping random
// positions and slightly randomized float animations.
export function createFloatingGifs(gifSrc, idPrefix) {
  const gifs = [], positions = [];
  for (let i = 0; i < 12; i++) {
    const pos = generateRandomPositionWithSpacing(positions);
    positions.push(pos);
    gifs.push({ id: `${idPrefix}-${i}`, src: gifSrc, style: { ...pos, animationDuration: `${Math.random() * 2 + 1}s`, animationDelay: `${Math.random() * 0.5}s` } });
  }
  return gifs;
}
