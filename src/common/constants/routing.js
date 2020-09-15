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
  SEGMENT: routeParts,
  WOBJ: {
    params: [
      `${[
        routeParts.ABOUT,
        routeParts.GALLERY,
        routeParts.UPDATES,
        routeParts.REVIEWS,
        routeParts.FOLLOWERS,
        routeParts.EXPERTISE,
        routeParts.MENU,
        routeParts.PAGE,
        routeParts.LIST,
      ].join('|')}`,
      `${[...supportedObjectFields, ...objMenuTypes, routeParts.ALBUM].join('|')}`,
    ],
  },
};
