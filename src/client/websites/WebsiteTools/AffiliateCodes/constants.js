// eslint-disable-next-line import/prefer-default-export
export const AMAZON_LINKS_BY_COUNTRY = {
  US: 'amazon.com',
  CA: 'amazon.ca',
  MX: 'amazon.com.mx',
  BR: 'amazon.com.br',
  GB: 'amazon.co.uk',
  FR: 'amazon.fr',
  IT: 'amazon.it',
  ES: 'amazon.es',
  DE: 'amazon.de',
  NL: 'amazon.nl',
  SE: 'amazon.se',
  PL: 'amazon.pl',
  IN: 'amazon.in',
  AE: 'amazon.ae',
  SA: 'amazon.sa',
  SG: 'amazon.sg',
  JP: 'amazon.co.jp',
  AU: 'amazon.com.au',
};

export const affiliateCodesConfig = [
  {
    title: 'Amazon',
    descriptionIntl: {
      id: 'amazon_website_serving',
      defaultMessage:
        'A distinct Associate ID is necessary for every Amazon website serving a specific region. The system will automatically link affiliate codes to the geographical location of users, subject to certain limitations.',
    },
    linksByCountry: AMAZON_LINKS_BY_COUNTRY,
  },
  // {
  //   title: 'Wallmart',
  //   descriptionIntl: {
  //     id: 'walmart_description',
  //     defaultMessage:
  //       'Each regional Walmart website has its own affiliate program and requires a unique ID, managed by different companies. The system will automatically utilize the code that is most suitable for the user\'s geographical location, subject to some restrictions.',
  //   },
  //   linksByCountry: {}
  // },
];
