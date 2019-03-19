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
  hashtag: 'tag',
  phone: 'phone',
  email: 'email',
  sorting: 'sortCustom',
  rating: 'rating',
  listItem: 'listItem',
};

export const addressFields = {
  country: 'country',
  city: 'city',
  street: 'street',
  accommodation: 'accommodation',
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
  switch (objectType && objectType.toLowerCase()) {
    case 'list':
      return [
        objectFields.title,
        objectFields.avatar,
        objectFields.background,
        objectFields.listItem,
        objectFields.sorting,
      ];
    default: {
      const excludeFields = [objectFields.sorting, objectFields.listItem];
      return supportedObjectFields.filter(field => !excludeFields.includes(field));
    }
  }
};

export default null;
