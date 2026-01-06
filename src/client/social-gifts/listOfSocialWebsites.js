export const listOfSocialWebsites = [
  'https://socialgifts.pp.ua/',
  'socialgifts.pp.ua',
  'www.socialgifts.pp.ua',
  'www.social.gifts',
  'social.gifts',
];
export const listOfWaivioSites = ['https://waivio.com', 'https://waiviodev.com', 'localhost'];

export const socialDomens = ['socialgifts', 'social.gifts'];
export const notCustomDomains = ['dining', 'waivio', 'webcache.googleusercontent'];

export const isCustomDomain = hostname =>
  !(
    (hostname && socialDomens.some(item => hostname.includes(item))) ||
    (hostname && notCustomDomains.some(item => hostname.includes(item)))
  );

export default null;
