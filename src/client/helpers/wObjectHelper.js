import { get, some, filter, isEmpty, compact } from 'lodash';
import { addressFields, TYPES_OF_MENU_ITEM } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';

export const getObjectName = (wobj = {}) => get(wobj, 'name') || get(wobj, 'default_name');
export const getObjectTitle = (wobj = {}) => wobj.title || '';
export const getObjectAvatar = (wobj = {}) => wobj.avatar || get(wobj, ['parent', 'avatar'], '');

export const accessTypesArr = ['is_extending_open', 'is_posting_open'];

export const haveAccess = (wobj, userName, accessType) =>
  wobj[accessType] ||
  !!(wobj.white_list && some(wobj.white_list, userInWL => userName === userInWL));

export const generateRandomString = stringLength => {
  let randomString = '';
  let randomAscii;
  const asciiLow = 65;
  const asciiHigh = 90;
  for (let i = 0; i < stringLength; i += 1) {
    randomAscii = Math.floor(Math.random() * (asciiHigh - asciiLow) + asciiLow);
    randomString += String.fromCharCode(randomAscii);
  }
  return randomString;
};

export const generatePermlink = () =>
  Math.random()
    .toString(36)
    .substring(2);

export const prepareAlbumData = (form, currentUsername, wObject) => {
  const data = {};
  data.author = currentUsername;
  data.parentAuthor = wObject.author;
  data.parentPermlink = wObject.author_permlink;
  data.body = `@${data.author} created a new album: ${form.galleryAlbum}.`;
  data.title = '';

  data.field = {
    name: 'galleryAlbum',
    body: form.galleryAlbum,
    locale: 'en-US',
    id: generatePermlink(),
  };

  data.permlink = `${data.author}-${generatePermlink()}`;
  data.lastUpdated = Date.now();
  data.wobjectName = getObjectName(wObject);

  return data;
};

export const prepareAlbumToStore = data => ({
  locale: data.field.locale,
  creator: data.author,
  permlink: data.permlink,
  name: data.field.name,
  body: data.field.body,
  weight: 1,
  active_votes: [],
  items: [],
  id: data.field.id,
});

export const prepareImageToStore = postData => ({
  weight: 1,
  locale: postData.field.locale,
  creator: postData.author,
  permlink: postData.permlink,
  name: postData.field.name,
  body: postData.field.body,
  active_votes: [],
});

export const hasType = (wobj, type) =>
  Boolean(wobj && wobj.object_type && wobj.object_type.toLowerCase() === type.toLowerCase());

export const getAppendData = (creator, wObj, bodyMsg, fieldContent) => {
  const { author, author_permlink: parentPermlink } = wObj;
  let body = bodyMsg;
  if (!body) {
    const langReadable = filter(LANGUAGES, {
      id: fieldContent.locale === 'auto' ? 'en-US' : fieldContent.locale,
    })[0].name;
    body = `@${creator} added ${fieldContent.name} (${langReadable}):\n ${fieldContent.body.replace(
      /[{}"]/g,
      '',
    )}`;
  }
  return {
    author: creator,
    parentAuthor: author,
    parentPermlink,
    body,
    title: '',
    field: fieldContent,
    permlink: `${creator}-${generatePermlink()}`,
    lastUpdated: Date.now(),
    wobjectName: getObjectName(wObj),
  };
};

export const parseWobjectField = (wobject, fieldName) => {
  if (isEmpty(wobject) || !fieldName) return null;

  const wobjFields = get(wobject, fieldName);

  if (typeof wobjFields !== 'string') return null;

  try {
    return JSON.parse(wobjFields);
  } catch (err) {
    return null;
  }
};

export const parseButtonsField = wobject =>
  get(wobject, 'button', []).map(btn => {
    if (btn) {
      try {
        return {
          ...btn,
          id: TYPES_OF_MENU_ITEM.BUTTON,
          body: JSON.parse(btn.body),
        };
      } catch (err) {
        return null;
      }
    }

    return null;
  });

export const parseAddress = wobject => {
  if (isEmpty(wobject) || !wobject.address) return null;

  return compact(
    Object.values(addressFields).map(fieldName => {
      const parsedWobject = parseWobjectField(wobject, 'address');
      return get(parsedWobject, fieldName);
    }),
  ).join(', ');
};

export const getLastPermlinksFromHash = url =>
  url
    .split('/')
    .pop()
    .replace('#', '');
export const getPermlinksFromHash = url => url.replace('#', '').split('/');
export const getMenuItems = (wobject, menuType, objType) => {
  const listItems = get(wobject, 'listItem', []).filter(item => item.type === menuType);
  if (isEmpty(wobject.menuItems)) return listItems;

  return get(wobject, 'menuItems', [])
    .filter(item => item.object_type === objType)
    .map(item => {
      const matchItem = listItems.find(f => f.body === item.author_permlink) || {};

      return { ...item, alias: matchItem.alias, id: menuType };
    });
};
