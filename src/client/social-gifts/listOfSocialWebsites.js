export const listOfSocialWebsites = [
  'https://socialgifts.pp.ua/',
  'socialgifts.pp.ua',
  'www.socialgifts.pp.ua',
  'www.social.gifts',
  'social.gifts',
];

export const socialDomens = ['socialgifts', 'social.gifts'];

export const isCustomDomain = hostname =>
  !(
    socialDomens.some(item => hostname.includes(item)) ||
    hostname.includes('dining') ||
    hostname.includes('waivio')
  );

export default null;
