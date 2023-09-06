import { get, some, filter, isEmpty, compact, isEqual, has } from 'lodash';
import { addressFieldsForFormatting, TYPES_OF_MENU_ITEM } from '../constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { parseJSON } from './parseJSON';
import { getFeedContentByObject } from '../../waivioApi/ApiClient';

export const getObjectName = (wobj = {}) =>
  get(wobj, 'name') ||
  get(wobj, 'default_name') ||
  get(wobj, 'objectName') ||
  get(wobj, 'object_name') ||
  '';

export const getObjectTitle = (wobj = {}) => wobj.title || '';

export const getTitleForLink = (wobj = {}) =>
  wobj?.title || wobj?.description || getObjectName(wobj);

export const getObjectUrlForLink = (wobj = {}) =>
  get(wobj, 'defaultShowLink') || `/object/${wobj.author_permlink || wobj.permlink || wobj.id}`;

export const getObjectAvatar = (wobj = {}) =>
  get(wobj, 'avatar', '') || get(wobj, ['parent', 'avatar'], '');

export const getObjectType = (wobj = {}) => get(wobj, 'object_type') || get(wobj, 'type');

export const getObjectReward = (wobj = {}) =>
  get(wobj, 'campaigns.max_reward') ||
  get(wobj, 'propositions[0].reward') ||
  get(wobj, 'reward') ||
  wobj?.maxReward;

export const getObjectMap = (wobj = {}) => {
  const map = get(wobj, 'map');

  if (map) return parseJSON(map);

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
    locale: wObject.locale || 'en-US',
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
    return parseJSON(wobjFields);
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
        body: parseJSON(btn.body),
      };
    } catch (err) {
      return null;
    }
  });
};

export const getBlogItems = wobject => get(wobject, 'blog', []);
export const getFormItems = wobject => get(wobject, 'form', []);
export const getNewsFilterItems = wobject => get(wobject, 'newsFilter', []);
export const getNewsFeedItems = wobject => get(wobject, 'newsFeed', []);

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
    .replace('#', '')
    .replaceAll('%20', ' ');

export const createHash = (hash, name) => {
  const permlinks = getPermlinksFromHash(hash);
  const findIndex = permlinks.findIndex(el => el === name);
  const hashPermlinks = [...permlinks];

  if (findIndex >= 0) hashPermlinks.splice(findIndex + 1);

  return `#${hashPermlinks.join('/')}`;
};

export const getPermlinksFromHash = url =>
  url
    ? url
        .replace('#', '')
        .split('/')
        .map(perm => perm.replaceAll('%20', ' '))
    : [];

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

export const getSortList = (sortedList = {}, itemsList) => {
  const filtered = itemsList.filter(list => !sortedList?.exclude?.includes(list.author_permlink));
  const withoutSorting = filtered.filter(
    list => !sortedList?.include?.includes(list.author_permlink),
  );

  const customSort = sortedList.include.reduce((acc, item) => {
    const findItem = filtered.find(i => i.author_permlink === item);

    if (findItem) {
      return [...acc, findItem];
    }

    return acc;
  }, []);

  return [...customSort, ...withoutSorting];
};

export const getSortItemListForModal = (sortedList, itemsList) => {
  if (isEmpty(sortedList)) return itemsList;

  const exclude = itemsList.filter(list => sortedList?.exclude.includes(list.author_permlink));
  const withoutSorting = itemsList.filter(
    list =>
      !sortedList.include.includes(list.author_permlink) &&
      !sortedList.exclude.includes(list.author_permlink),
  );

  const customSort = sortedList.include.reduce((acc, item) => {
    const findItem = itemsList.find(i => i.author_permlink === item);

    if (findItem) {
      return [...acc, findItem];
    }

    return acc;
  }, []);

  return [...customSort, ...withoutSorting, ...exclude];
};

export const getListItems = wobject =>
  get(wobject, 'listItems', []).map(item => {
    const post = wobject?.listItem.find(({ body }) => body === item.author_permlink);

    return {
      ...item,
      active_votes: post.active_votes,
    };
  });
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

  return hashPermlinks.length > 1 ? hashPermlinks.join('/') : hashPermlinks[0];
};

export const getLinkPath = (match, department, path, location) => {
  if (match.params.department === department.name) return path;

  return match.params.department && match.params.department !== department.name
    ? `${path}/${match.params.department}/#${createNewHash(department.name, location.hash)}`
    : `${path}/${department.name}`;
};

export const createNewPath = (wobj, type) => {
  let currType = type;

  if (hasType(wobj, 'list') && type !== 'page') currType = 'list';
  if (!hasType(wobj, 'list') && type !== 'page') currType = 'menu';

  return `/object/${wobj.author_permlink}/${currType}`;
};

export const isPhotosAlbumExist = albums => albums.some(album => album.body === 'Photos');

export const sortAlphabetically = (a, b) => (a < b ? -1 : 1);
export const sortOptions = (a, b) => {
  if (a.body.position && b.body.position) {
    return a.body.position - b.body.position;
  } else if (!a.body.position && !b.body.position) {
    if (a.body.value < b.body.value) return -1;
    if (a.body.value > b.body.value) return 1;

    return 0;
  }

  return !a.body.position ? 1 : -1;
};

export const sortByFieldPermlinksList = (permlinksArr, objects) =>
  permlinksArr?.reduce((acc, item) => {
    const findItem = objects?.find(i => i.author_permlink === item);

    if (findItem) {
      return [...acc, findItem];
    }

    return acc;
  }, []);

export const showDescriptionPage = async (wobject, locale) => {
  const hasPosts = await getFeedContentByObject(wobject.author_permlink, 1, [], locale).then(
    res => !isEmpty(res),
  );

  return (
    !['list', 'page', 'widget', 'newsfeed'].includes(wobject.object_type) &&
    has(wobject, 'description') &&
    !hasPosts &&
    !wobject.menuItem &&
    !wobject.menuItems
  );
};
export const handleCreatePost = (wobject, authors, history) => {
  if (wobject && wobject.author_permlink) {
    let redirectUrl = `/editor?object=`;

    if (!isEmpty(wobject.parent)) {
      const parentObject = wobject.parent;

      redirectUrl += `${encodeURIComponent(
        `[${getObjectName(parentObject)}](${parentObject.author_permlink})`,
      )}&object=`;
    }

    redirectUrl += encodeURIComponent(`[${getObjectName(wobject)}](${wobject.author_permlink})`);

    if (!isEmpty(wobject.authors)) {
      authors.forEach(author => {
        redirectUrl += author.author_permlink
          ? `&author=${encodeURIComponent(`[${author.name}](${author.author_permlink})`)}`
          : `&author=${encodeURIComponent(author.name)}`;
      });
    }

    history.push(redirectUrl);
  }
};

export const getObjectFieldName = (field, object, intl) => {
  if (object?.object_type === 'list') {
    switch (field) {
      case 'sortCustom':
        return intl.formatMessage({ id: `list_sorting`, defaultMessage: 'List sorting' });
      case 'menuList':
        return intl.formatMessage({ id: `list_item`, defaultMessage: 'List item' });
      default:
        return intl.formatMessage({ id: `object_field_${field}`, defaultMessage: field });
    }
  } else {
    return intl.formatMessage({ id: `object_field_${field}`, defaultMessage: field });
  }
};
export const getUpdateFieldName = field => (field && field === 'menuList' ? 'listItem' : field);
