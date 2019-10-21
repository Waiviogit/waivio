export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const prepareForecastsData = forecasts => {
  const forecastData = {
    labels: [],
    counts: [],
    colors: [],
  };
  forecasts.forEach(forecast => {
    forecastData.labels.push(forecast.forecastName);
    forecastData.counts.push(forecast.count);
    forecastData.colors.push(getRandomColor());
  });
  return forecastData;
};
