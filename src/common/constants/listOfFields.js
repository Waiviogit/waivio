export const objectFields = {
  name: 'name',
  address: 'address',
  map: 'map',
  link: 'link',
  htmlContent: 'htmlContent',
  avatar: 'avatar',
  background: 'background',
  contentView: 'contentView',
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
  widget: 'widget',
  newsFeed: 'newsFeed',
  departments: 'departments',
  features: 'features',
  objectName: 'objectName',
  manufacturer: 'manufacturer',
  brand: 'brand',
  merchant: 'merchant',
  pin: 'pin',
  remove: 'remove',
  shopFilter: 'shopFilter',
  menuItem: 'menuItem',
  related: 'related',
  addOn: 'addOn',
  similar: 'similar',
  affiliate: 'affiliate',
  affiliateButton: 'affiliateButton',
  affiliateProductIdTypes: 'affiliateProductIdTypes',
  affiliateGeoArea: 'affiliateGeoArea',
  affiliateUrlTemplate: 'affiliateUrlTemplate',
  affiliateCode: 'affiliateCode',
  affiliateContext: 'affiliateContext',
  webpage: 'webpage',
  mapObjectsList: 'mapObjectsList',
  mapDesktopView: 'mapDesktopView',
  mapMobileView: 'mapMobileView',
  mapObjectTypes: 'mapObjectTypes',
  mapObjectTags: 'mapObjectTags',
  mapRectangles: 'mapRectangles',
  delegation: 'delegation',
  walletAddress: 'walletAddress',
  url: 'url',
  recipe: 'recipe',
  calories: 'calories',
  budget: 'budget',
  cookingTime: 'cookingTime',
  recipeIngredients: 'recipeIngredients',
  groupExpertise: 'groupExpertise',
  groupFollowers: 'groupFollowers',
  groupFollowing: 'groupFollowing',
  groupAdd: 'groupAdd',
  groupExclude: 'groupExclude',
  groupLastActivity: 'groupLastActivity',
  promotion: 'promotion',
  featured: 'featured',
  nutrition: 'nutrition',
  sale: 'sale',
  compareAtPrice: 'compareAtPrice',
};
export const walletAddressFields = {
  walletTitle: 'walletTitle',
  cryptocurrency: 'cryptocurrency',
  walletAddress: 'walletAddress',
};
export const recipeFields = {
  calories: 'calories',
  budget: 'budget',
  cookingTime: 'cookingTime',
  recipeIngredients: 'recipeIngredients',
  nutrition: 'nutrition',
};
export const mapObjectTypeFields = {
  mapObjectsList: 'mapObjectsList',
  mapDesktopView: 'mapDesktopView',
  mapMobileView: 'mapMobileView',
  mapObjectTypes: 'mapObjectTypes',
  mapObjectTags: 'mapObjectTags',
  mapRectangles: 'mapRectangles',
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
export const menuItemFields = {
  menuItemTitle: 'menuItemTitle',
  menuItemStyle: 'menuItemStyle',
  menuItemImage: 'menuItemImage',
  linkToObject: 'linkToObject',
  linkToWeb: 'linkToWeb',
  isNewTab: 'isNewTab',
};
export const addressFields = {
  accommodation: 'accommodation',
  address: 'address',
  street: 'street',
  city: 'city',
  postalCode: 'postalCode',
  state: 'state',
  country: 'country',
};

export const shopFilterFields = {};
export const pinPostFields = {
  postAuthor: 'postAuthor',
  postPermlink: 'postPermlink',
};
export const removePostFields = {
  postAuthor: 'postAuthor',
  postPermlink: 'postPermlink',
};

export const authorsFields = {
  name: 'name',
  author: 'author',
};
export const promotionFields = {
  promotionSite: 'promotionSite',
  promotionFrom: 'promotionFrom',
  promotionTill: 'promotionTill',
};

export const saleFields = {
  saleFrom: 'saleFrom',
  saleTill: 'saleTill',
};
export const manufacturerFields = {
  manufacturer: 'manufacturer',
  manufacturerName: 'manufacturerName',
};
export const brandFields = {
  brand: 'brand',
  brandName: 'brandName',
};
export const merchantFields = {
  merchant: 'merchant',
  merchantName: 'merchantName',
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
  linkTikTok: 'linkTikTok',
  linkReddit: 'linkReddit',
  linkLinkedIn: 'linkLinkedIn',
  linkTelegram: 'linkTelegram',
  linkWhatsApp: 'linkWhatsApp',
  linkPinterest: 'linkPinterest',
  linkTwitch: 'linkTwitch',
  linkHive: 'linkHive',
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
export const featuresFields = {
  featuresName: 'featuresName',
  featuresValue: 'featuresValue',
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
  fullScreen: 'Full Screen',
  newTab: 'New Tab',
};
export const formFormFields = {
  link: 'Link',
  widget: 'Widget',
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
  { id: 'tiktok', icon: 'tiktok', color: 'black', name: 'TikTok' },
  { id: 'snapchat', icon: 'snapchat', color: 'yellow', name: 'Snapchat' },
  { id: 'hive', icon: 'hive', color: 'red', name: 'Hive' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
  { id: 'reddit', icon: 'reddit', color: 'black', name: 'Reddit' },
  { id: 'telegram', icon: 'telegram', color: 'black', name: 'Telegram' },
  { id: 'whatsapp', icon: 'whatsapp', color: 'black', name: 'WhatsApp' },
  { id: 'pinterest', icon: 'pinterest', color: 'black', name: 'Pinterest' },
  { id: 'twitch', icon: 'twitch', color: 'black', name: 'Twitch' },
  { id: 'linkedin', icon: 'linkedin', color: '#007bb6', name: 'LinkedIn' },
];

export const cryptocurrenciesList = [
  { name: 'Bitcoin (BTC)', abbreviation: 'BTC', shortName: 'Bitcoin', icon: 'bitcoin.png' },
  { name: 'Litecoin (LTC)', abbreviation: 'LTC', shortName: 'Litecoin', icon: 'litecoin.png' },
  { name: 'Ethereum (ETH)', abbreviation: 'ETH', shortName: 'Ethereum', icon: 'ethereum.png' },
  {
    name: 'Lightning Bitcoin (LBTC)',
    abbreviation: 'LBTC',
    shortName: 'Lightning Bitcoin',
    icon: 'lightning_bitcoin.png',
  },
  { name: 'HIVE', abbreviation: 'HIVE', shortName: 'HIVE', icon: 'hive.png' },
  { name: 'HBD', abbreviation: 'HBD', shortName: 'HBD', icon: 'hbd.png' },
  { name: 'WAIV', abbreviation: 'WAIV', shortName: 'WAIV', icon: 'waiv.png' },
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
  [objectFields.name]: [objectFields.objectName],
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
  [objectFields.groupId]: [objectFields.groupId],
  [objectFields.options]: [optionsFields.category, optionsFields.value, optionsFields.value],
  [objectFields.features]: [featuresFields.featuresName, featuresFields.featuresValue],
  [objectFields.publisher]: [publisherFields.publisher, publisherFields.publisherName],
  [objectFields.manufacturer]: [
    manufacturerFields.manufacturer,
    manufacturerFields.manufacturerName,
  ],
  [objectFields.brand]: [brandFields.brand, brandFields.brandName],
  [objectFields.merchant]: [merchantFields.merchant, merchantFields.merchantName],
  [objectFields.menuItem]: [menuItemFields.menuItemTitle, menuItemFields.menuItemImage],
  [recipeFields.recipeIngredients]: [recipeFields.recipeIngredients],
  [objectFields.groupLastActivity]: [objectFields.groupLastActivity],
  [objectFields.promotion]: [promotionFields.promotionSite],
};

export default null;
