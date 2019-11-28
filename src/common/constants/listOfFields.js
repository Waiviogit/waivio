import OBJECT_TYPE from '../../client/object/const/objectTypes';

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
  tagCloud: 'tagCloud',
  newsFilter: 'newsFilter',
  button: 'button',
  workTime: 'workTime',
  pageContent: 'pageContent',
  status: 'status',
  galleryItem: 'galleryItem',
  galleryAlbum: 'galleryAlbum',
  category: 'tagCategory',
};

export const TYPES_OF_MENU_ITEM = {
  LIST: 'menuList',
  PAGE: 'menuPage',
  BUTTON: 'menuButton',
  NEWS: 'menuNews',
};
export const objMenuTypes = Object.values(TYPES_OF_MENU_ITEM);

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

export const getAllowedFieldsByObjType = objectType => {
  switch (objectType) {
    case OBJECT_TYPE.PAGE:
      return [
        objectFields.name,
        objectFields.pageContent,
        objectFields.title,
        objectFields.avatar,
        objectFields.background,
        objectFields.parent,
        objectFields.galleryItem,
        objectFields.galleryAlbum,
        objectFields.category,
      ];
    case OBJECT_TYPE.LIST:
      return [
        objectFields.name,
        objectFields.title,
        objectFields.avatar,
        objectFields.background,
        objectFields.listItem,
        objectFields.sorting,
        objectFields.parent,
        objectFields.galleryItem,
        objectFields.galleryAlbum,
        objectFields.category,
      ];
    default: {
      const excludeFields = [objectFields.listItem, objectFields.pageContent];
      const includeFields = [TYPES_OF_MENU_ITEM.PAGE, TYPES_OF_MENU_ITEM.LIST];
      return [...supportedObjectFields, ...includeFields].filter(
        field => !excludeFields.includes(field),
      );
    }
  }
};

export default null;
