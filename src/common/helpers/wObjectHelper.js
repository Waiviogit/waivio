import { get, some, filter, isEmpty, compact, isEqual } from 'lodash';
import { addressFieldsForFormatting, TYPES_OF_MENU_ITEM } from '../constants/listOfFields';
import LANGUAGES from '../translations/languages';

export const getObjectName = (wobj = {}) =>
  get(wobj, 'name') || get(wobj, 'default_name') || get(wobj, 'objectName') || '';

export const getObjectTitle = (wobj = {}) => wobj.title || '';

export const getObjectUrl = (wobj = {}) =>
  get(wobj, 'defaultShowLink') || `/object/${wobj.author_permlink}`;

export const getObjectAvatar = (wobj = {}) =>
  get(wobj, 'avatar', '') || get(wobj, ['parent', 'avatar'], '');

export const getObjectType = (wobj = {}) => get(wobj, 'object_type') || get(wobj, 'type');

export const getObjectReward = (wobj = {}) =>
  get(wobj, 'campaigns.max_reward') || get(wobj, 'propositions[0].reward') || get(wobj, 'reward');

export const getObjectMap = (wobj = {}) => {
  const map = get(wobj, 'map');

  if (map) return JSON.parse(map);

  return null;
};

export const getObjectMapInArray = (wobj = {}) => {
  const objMap = getObjectMap(wobj);

  if (objMap) return [+objMap.latitude, +objMap.longitude];

  return null;
};

export const isList = wobj => getObjectType(wobj) === 'list';

export const getCurrentPoint = (wobjects, queryCenter) =>
  wobjects.find(wobj => {
    const pointMap = getObjectMapInArray(wobj);

    if (pointMap) return isEqual(pointMap, queryCenter);

    return false;
  });

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

export const prepareAlbumData = (form, currentUsername, wObject, votePercent) => {
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
  data.votePower = votePercent;

  return data;
};

export const prepareBlogData = (form, currentUserName, wObject, votePercent) => {
  const blog = form.blogTitle || form.blogAccount;
  const data = {};

  data.author = currentUserName;
  data.parentAuthor = wObject.author;
  data.parentPermlink = wObject.author_permlink;
  data.body = `@${data.author} added a new blog: ${blog}.`;
  data.title = blog || '';

  data.permlink = `${data.author}-${generatePermlink()}`;
  data.lastUpdated = Date.now();
  data.wobjectName = getObjectName(wObject);
  data.field = {
    body: form.blogAccount,
    name: form.currentField,
    locale: form.currentLocale,
    blogTitle: blog,
  };
  data.votePower = votePercent;

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

export const parseButtonsField = wobject => {
  const buttons = get(wobject, 'button');

  if (!buttons) return [];

  return buttons.map(btn => {
    try {
      return {
        ...btn,
        id: TYPES_OF_MENU_ITEM.BUTTON,
        body: JSON.parse(btn.body),
      };
    } catch (err) {
      return null;
    }
  });
};

export const getBlogItems = wobject => get(wobject, 'blog', []);
export const getFormItems = wobject => get(wobject, 'form', []);
export const getNewsFilterItems = wobject => get(wobject, 'newsFilter', []);

export const parseAddress = (wobject, hideField = []) => {
  if (isEmpty(wobject) || !wobject.address) return null;

  return compact(
    addressFieldsForFormatting.map(fieldName => {
      const parsedWobject = parseWobjectField(wobject, 'address');

      if (hideField.some(field => field === fieldName)) return null;

      return get(parsedWobject, fieldName);
    }),
  ).join(', ');
};

export const getLastPermlinksFromHash = url =>
  url
    .split('/')
    .pop()
    .replace('#', '');

export const getPermlinksFromHash = url => (url ? url.replace('#', '').split('/') : []);

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

export const getSortList = (sortedList, itemsList) =>
  itemsList.reduce((acc, item) => {
    if (sortedList.includes(item.author_permlink)) {
      return [...acc, item];
    }

    return acc;
  }, []);

export const getListItems = wobject => get(wobject, 'listItems', []);
export const getListItem = wobject => get(wobject, 'listItem', []);

export const itemsList = (sort, wobj) =>
  !isEmpty(sort) ? getSortList(sort, getListItems(wobj)) : getListItems(wobj);

export const getDefaultAlbum = albums => albums.find(item => item.body === 'Photos') || {};

export const recencySortOrder = listItem => listItem.map(item => get(item, 'body', '')).reverse();

export const compareBreadcrumb = wobj => ({
  id: wobj.author_permlink,
  name: getObjectName(wobj),
  title: getObjectTitle(wobj),
  path: wobj.defaultShowLink,
  type: getObjectType(wobj) !== 'page' ? 'menu' : getObjectType(wobj),
});

export const sortWobjectsByHash = (wobjects, permlinks) =>
  permlinks.reduce((acc, curr) => {
    const currentWobj = wobjects.find(wobj => wobj.id === curr);

    return [...acc, currentWobj];
  }, []);

export const createNewHash = (currPermlink, hash, wobj = {}) => {
  const permlinks = getPermlinksFromHash(hash);
  const findIndex = permlinks.findIndex(el => el === currPermlink);
  const hashPermlinks = [...permlinks];

  if (currPermlink === wobj.author_permlink) return '';

  if (findIndex >= 0) hashPermlinks.splice(findIndex + 1);
  else hashPermlinks.push(currPermlink);

  return hashPermlinks.join('/');
};

export const createNewPath = (wobj, type) => {
  let currType = type;

  if (hasType(wobj, 'list') && type !== 'page') currType = 'list';
  if (!hasType(wobj, 'list') && type !== 'page') currType = 'menu';

  return `/object/${wobj.author_permlink}/${currType}`;
};

export const isPhotosAlbumExist = albums => albums.some(album => album.body === 'Photos');
