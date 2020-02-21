const mapProvider = (x, y, z) => {
  const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2;
  return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}${
    retina ? '@2x' : ''
  }.png`;
};

export default mapProvider;
