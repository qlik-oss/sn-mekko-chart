export default function palettes({ coloring } = {}) {
  const pals = [];

  if (coloring.palette) {
    pals.push({
      key: 'categorical',
      colors: coloring.palette.colors,
    });
  }
  return pals;
}
