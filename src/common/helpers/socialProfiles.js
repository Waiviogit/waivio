import { uniq } from 'lodash';

const socialTransformers = {
  facebook: id => `https://facebook.com/${id}`,
  twitter: id => `https://twitter.com/${id}`,
  linkedin: id => `https://www.linkedin.com/in/${id}`,
  youtube: id => `https://www.youtube.com/channel/${id}`,
  instagram: id => `https://instagram.com/${id}`,
  github: id => `https://github.com/${id}`,
  bitcoin: id => `https://blockchain.info/address/${id}`,
  ethereum: id => `https://etherscan.io/address/${id}`,
};

export const socialWallets = [
  {
    name: 'Bitcoin (BTC)',
    abbreviation: 'BTC',
    shortName: 'Bitcoin',
    id: 'bitcoin',
    icon: 'bitcoin.png',
  },
  {
    name: 'Litecoin (LTC)',
    abbreviation: 'LTC',
    shortName: 'Litecoin',
    id: 'litecoin',
    icon: 'litecoin.png',
  },
  {
    name: 'Ethereum (ETH)',
    abbreviation: 'ETH',
    shortName: 'Ethereum',
    id: 'ethereum',
    icon: 'ethereum.png',
  },
  {
    name: 'Lightning Bitcoin (LBTC)',
    abbreviation: 'LBTC',
    shortName: 'Lightning Bitcoin',
    id: 'lightningBitcoin',
    icon: 'lightning_bitcoin.png',
  },
  { name: 'HIVE', abbreviation: 'HIVE', shortName: 'HIVE', id: 'hive', icon: 'hive.png' },
  { name: 'HBD', abbreviation: 'HBD', shortName: 'HBD', id: 'hbd', icon: 'hbd.png' },
];

export const transform = (socialId, id) => socialTransformers[socialId](id);

export const getFacebookShareURL = url => `https://facebook.com/sharer.php?u=${url}`;
export const getTwitterShareURL = (text, url, hashtag) =>
  `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${uniq(hashtag)}`;

export default [
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'linkedin', icon: 'linkedin', color: '#007bb6', name: 'LinkedIn' },
  { id: 'youtube', icon: 'youtube', color: '#ff0202', name: 'YouTube' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
  // { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin', shortName: 'BTC' },
  // { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum', shortName: 'ETH' },
];
