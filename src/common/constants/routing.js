import OBJ_TYPE from '../../client/object/const/objectTypes';
import { objMenuTypes, supportedObjectFields } from './listOfFields';

const routeParts = {
  ABOUT: 'about',
  GALLERY: 'gallery',
  UPDATES: 'updates',
  REVIEWS: 'reviews',
  FOLLOWERS: 'followers',
  FEED: 'feed',
  EXPERTISE: 'expertise',
  MENU: 'menu',
  ALBUM: 'album',
  PAGE: OBJ_TYPE.PAGE,
  LIST: OBJ_TYPE.LIST,
};

export default {
  WOBJ: {
    params: {
      type: Object.values(routeParts).join('|'),
      appends: [...supportedObjectFields, ...objMenuTypes, routeParts.ALBUM].join('|'),
    },
  },
  USER: {},
};
