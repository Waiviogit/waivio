export const objectFields = {
  name: 'name',
  title: 'title',
  description: 'description',
  address: 'address',
  map: 'map',
  link: 'link',
  avatar: 'avatar',
  background: 'background',
  website: 'website',
  phone: 'phone',
  email: 'email',
  sorting: 'sortCustom',
  rating: 'rating',
  listItem: 'listItem',
  price: 'price',
  parent: 'parent',
  newsFilter: 'newsFilter',
  button: 'button',
  workTime: 'workTime',
  pageContent: 'pageContent',
  status: 'status',
  galleryItem: 'galleryItem',
  galleryAlbum: 'galleryAlbum',
  tagCategory: 'tagCategory',
  menuItems: 'menuItems',
  categoryItem: 'categoryItem',
  authority: 'authority',
  pageLink: 'pageLink',
  tag: 'tag',
};

export const TYPES_OF_MENU_ITEM = {
  LIST: 'menuList',
  PAGE: 'menuPage',
  BUTTON: 'menuButton',
  NEWS: 'menuNews',
};

export const objMenuTypes = Object.values(TYPES_OF_MENU_ITEM);

export const sortingMenuName = {
  menuList: TYPES_OF_MENU_ITEM.LIST,
  menuPage: TYPES_OF_MENU_ITEM.PAGE,
};

export const objectFieldsWithInnerData = [
  'newsFilter',
  'address',
  'map',
  'link',
  'button',
  'website',
  'status',
  'phone',
  'email',
  'rating',
];

export const addressFields = {
  accommodation: 'accommodation',
  address: 'address',
  street: 'street',
  city: 'city',
  postalCode: 'postalCode',
  state: 'state',
  country: 'country',
};

export const mapFields = {
  latitude: 'latitude',
  longitude: 'longitude',
};

export const linkFields = {
  linkFacebook: 'linkFacebook',
  linkTwitter: 'linkTwitter',
  linkYouTube: 'linkYouTube',
  linkInstagram: 'linkInstagram',
  linkGitHub: 'linkGitHub',
};

export const websiteFields = {
  title: 'title',
  link: 'link',
};

export const statusFields = {
  title: 'title',
  link: 'link',
};

export const buttonFields = {
  title: 'title',
  link: 'link',
};

export const phoneFields = {
  name: 'name',
  number: 'number',
};

export const ratingFields = {
  category: 'category',
  rate: 'rate',
};

export const ratePercent = [2, 4, 6, 8, 10];

export const socialObjectFields = [
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'youtube', icon: 'youtube', color: '#ff0202', name: 'YouTube' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
];

export const supportedObjectFields = Object.values(objectFields);

export const objectImageFields = ['avatar', 'background'];

export const statusNoVisibleItem = ['unavailable', 'relisted'];

export default null;
