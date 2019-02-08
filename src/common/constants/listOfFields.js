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

export const socialObjectFields = [
  { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
  { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
  { id: 'youtube', icon: 'youtube', color: '#ff0202', name: 'YouTube' },
  { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
  { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
];

export const supportedObjectFields = Object.values(objectFields);

export const objectImageFields = ['avatar', 'background'];

export default null;
