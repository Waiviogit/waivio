export const objectFields = {
  name: 'name',
  address: 'address',
  map: 'map',
  link: 'link',
  avatar: 'avatar',
  background: 'background',
  companyId: 'companyId',
  companyIdType: 'companyIdType',
  productId: 'productId',
  productIdType: 'productIdType',
  productIdImage: 'productIdImage',
  ageRange: 'ageRange',
  publicationDate: 'publicationDate',
  website: 'website',
  phone: 'phone',
  email: 'email',
  sorting: 'sortCustom',
  rating: 'rating',
  listItem: 'listItem',
  price: 'price',
  parent: 'parent',
  publisher: 'publisher',
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
  blog: 'blog',
  form: 'form',
  description: 'description',
  title: 'title',
  language: 'language',
  printLength: 'printLength',
  dimensions: 'dimensions',
  productWeight: 'productWeight',
  authors: 'authors',
  groupId: 'groupId',
  options: 'options',
};

export const TYPES_OF_MENU_ITEM = {
  LIST: 'menuList',
  PAGE: 'menuPage',
  BUTTON: 'menuButton',
  NEWS: 'menuNews',
  BLOG: 'blog',
  // FORM: 'form',
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

export const authorsFields = {
  name: 'name',
  author: 'author',
};
export const publisherFields = {
  publisher: 'publisher',
  publisherName: 'publisherName',
};

export const addressFieldsForFormatting = [
  'accommodation',
  'address',
  'street',
  'city',
  'state',
  'postalCode',
  'country',
];

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

export const optionsFields = {
  category: 'category',
  value: 'value',
  position: 'position',
  optionsImage: 'optionsImage',
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
export const dimensionsFields = {
  length: 'length',
  width: 'width',
  depth: ' depth',
  unitOfLength: 'unitOfLength',
};

export const ratingFields = {
  category: 'category',
  rate: 'rate',
};

export const blogFields = {
  title: 'blogTitle',
  account: 'blogAccount',
};
export const weightFields = {
  weight: 'weight',
  unitOfWeight: 'unitOfWeight',
};

export const formColumnsField = {
  middle: 'Middle',
  middleRight: 'Middle + Right',
  entire: 'Entire Width',
};

export const formFormFields = {
  link: 'Link',
  widget: 'Widget',
  title: 'formTitle',
};
export const companyIdFields = {
  companyId: 'companyId',
  companyIdType: 'companyIdType',
};
export const productIdFields = {
  productId: 'productId',
  productIdType: 'productIdType',
  productIdImage: 'productIdImage',
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

export const statusWithoutLinkList = ['unavailable', 'flagged', 'nsfw'];

export const errorObjectFields = {
  [objectFields.name]: [objectFields.name],
  [objectFields.description]: [objectFields.description],
  [objectFields.workTime]: [objectFields.workTime],
  [objectFields.ageRange]: [objectFields.ageRange],
  [objectFields.language]: [objectFields.language],
  [objectFields.price]: [objectFields.price],
  [objectFields.companyId]: [companyIdFields.companyIdType, companyIdFields.companyId],
  [objectFields.productId]: [productIdFields.productIdType, productIdFields.productId],
  [objectFields.address]: [
    addressFields.address,
    addressFields.street,
    addressFields.accommodation,
    addressFields.city,
    addressFields.country,
    addressFields.state,
    addressFields.postalCode,
  ],
  [objectFields.website]: [websiteFields.title, websiteFields.link],
  [objectFields.title]: [objectFields.title],
  [objectFields.map]: [mapFields.longitude, mapFields.latitude],
  [objectFields.button]: [buttonFields.title, buttonFields.link],
  [objectFields.phone]: [phoneFields.name, phoneFields.number],
  [objectFields.email]: [objectFields.email],
  [objectFields.rating]: [objectFields.rating],
  [objectFields.tagCategory]: [objectFields.tagCategory],
  [objectFields.categoryItem]: [objectFields.categoryItem],
  [objectFields.blog]: [blogFields.title],
  [objectFields.printLength]: [objectFields.printLength],
  [objectFields.ageRange]: [objectFields.ageRange],
  [objectFields.language]: [objectFields.language],
  [objectFields.publicationDate]: [objectFields.publicationDate],
  [objectFields.form]: [formFormFields.link, formFormFields.widget, formFormFields.title],
  [objectFields.productWeight]: [weightFields.weight, weightFields.unitOfWeight],
  [objectFields.dimensions]: [
    dimensionsFields.length,
    dimensionsFields.depth,
    dimensionsFields.width,
    dimensionsFields.unitOfLength,
  ],
  [objectFields.options]: [optionsFields.category, optionsFields.value, optionsFields.value],
};

export default null;
