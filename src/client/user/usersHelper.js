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

export const prepareData = forecasts => {
  const forecastData = [['', '']];
  forecasts.forEach(forecast => {
    forecastData.push([forecast.name, forecast.count]);
  });
  return forecastData;
};

export const prepareInstrumentsData = (quotes, statData) => {
  return statData
    .filter(instrument => Boolean(quotes[instrument.quote]))
    .map(instrument => ({
      ...instrument,
      name: quotes[instrument.quote].name,
      wobjData: quotes[instrument.quote].wobjData,
      market: quotes[instrument.quote].market,
    }));
};
