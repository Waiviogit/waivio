const tagNamesList = {
  hbd: 'HBD',
  ukraine: 'Ukraine',
  usa: 'USA',
  'hive-139531': 'HiveDevs',
  canada: 'Canada',
  steemfest: 'Steem Fest',
  spendhbd: 'spendHBD',
  'hive-101690': 'Sports Talk Social',
  uk: 'UK',
  bbq: 'BBQ',
  buddhism: 'Buddhism',
  unitedstates: 'United States',
  unitedkingdom: 'United Kingdom',
  un: 'UN',
  http: 'HTTP',
  'jgo-4crwjd-june-s-journey': "June's Journey",
  'ygo-pikabu': 'pikabu',
  'ocv-4hkaqa-tiktokfollowersgenerator': 'tiktokfollowersgenerator',
  'cnt-bestplace': 'best_place',
  'nft-marketplace': 'nft_marketplace',
  'ugh-kaguya': 'kaguya',
  'bir-technology': 'technology',
  'qok-olla': 'Olla',
  'xxq-traveling': 'traveling',
  'nyk-9gag': '9GAG',
  'ise-hashbrowns': 'Hashbrowns',
  'ovn-power': 'power',
  'eqd-cats-power': 'Cats Power',
  'sfw-cronavirus': 'cronavirus',
  'yuf-hello': 'Hello',
  'cva-zveme-chumbacasino': 'ChumbaCasino',
  'hxf-4yfmyd-chumbacasinocoins': 'ChumbaCasinocoins',
  'pvo-5tk6e7-robloxfreerobux': 'robloxfreerobux ',
  'thp-5atr4o-dragonballzdokkanbattlecheats': 'dragonballzdokkanbattlecheats',
  'orl-67n52v-paypalmoneyadder': 'PaypalMoneyAdder',
  'ctl-5mgmkb-tiktoktiktokfollowers': 'tiktoktiktokfollowers',
  'edl-3pelef-fate-grand-order': 'fate grand order',
  'pxt-5o4cau-high-school-story': 'High School Story',
  'bvf-vegetarianoptions': 'vegetarianoptions',
  'knt-gkggn-userfeeds': 'userfeeds',
  'pjs-4m6fnq-dollar': 'Dollar',
  'green-apple': 'green_apple',
  cuba: 'Cuba',
};
const capitalizeFirstLetter = string => {
  if (string.length === 0) return string;

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTagName = tag => tagNamesList[tag] || capitalizeFirstLetter(tag);

export default tagNamesList;
