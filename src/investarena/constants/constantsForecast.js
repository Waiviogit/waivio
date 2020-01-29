export const minForecastMinutes = 15;
export const maxForecastDay = 140;

export const forecastDateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.000\\Z';

export const forecastComments = (obj, permlink) => [
  `Hi! I liked your forecast for [${obj}](https://investarena.com/object/${permlink}), I voted for it on [Forecast](https://investarena.com/quickforecast)`,
  `Great post about [${obj}], I vote for it on [Forecast](https://investarena.com/quickforecast), I like you`,
  `Hello, I vote for your post forecast about [${obj}](https://investarena.com/object/${permlink}) on [Forecast](https://investarena.com/quickforecast)`,
  `Good post on [${obj}](https://investarena.com/object/${permlink}), made [Forecast](https://investarena.com/quickforecast)`,
  `Hello, supported your post on [${obj}](https://investarena.com/object/${permlink}) on [Forecast](https://investarena.com/quickforecast) `,
  `Hi, I made a [Forecast](https://investarena.com/quickforecast) for your post about [${obj}](https://investarena.com/object/${permlink}) like you`,
];
