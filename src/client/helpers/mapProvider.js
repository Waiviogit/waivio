const mapProvider = (x, y, z) => {
  const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2;
  return `https://b.tile.openstreetmap.org/${z}/${x}/${y}${retina ? '@2x' : ''}.png`;
};

export default mapProvider;
