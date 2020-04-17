export const getChartLocale = locale => {
  switch (locale) {
    case 'en-US':
      return 'en';
    case 'ru-RU':
      return 'ru';
    default:
      return 'en';
  }
};
