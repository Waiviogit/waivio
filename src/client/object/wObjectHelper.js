import {
  attempt,
  get,
  groupBy,
  filter,
  find,
  includes,
  isEmpty,
  isError,
  mapValues,
  orderBy,
  uniqBy,
} from 'lodash';
import { getClientWObj } from '../adapters';
import {
  supportedObjectFields,
  objectFieldsWithInnerData,
  TYPES_OF_MENU_ITEM,
  objectFields,
} from '../../../src/common/constants/listOfFields';
import { WAIVIO_META_FIELD_NAME } from '../../common/constants/waivio';
import OBJECT_TYPE from './const/objectTypes';

export const getInitialUrl = (wobj, screenSize, { pathname, hash }) => {
  let url = pathname + hash;
  const { type, menuItems, sortCustom } = wobj;
  switch (type && type.toLowerCase()) {
    case OBJECT_TYPE.PAGE:
      url = `${pathname}/${OBJECT_TYPE.PAGE}`;
      break;
    case OBJECT_TYPE.LIST:
      url = `${pathname}/${OBJECT_TYPE.LIST}`;
      break;
    case OBJECT_TYPE.HASHTAG:
      break;
    default:
      if (menuItems && menuItems.length) {
        url = `${pathname}/menu#${(sortCustom &&
          sortCustom.find(item => item !== TYPES_OF_MENU_ITEM.BUTTON)) ||
          menuItems[0].author_permlink}`;
      } else if (screenSize !== 'large') {
        url = `${pathname}/about`;
      }
      break;
  }
  return url;
};

export const getFieldWithMaxWeight = (wObject, currentField, defaultValue = '') => {
  if (!wObject || !currentField || !supportedObjectFields.includes(currentField))
    return defaultValue;

  const fieldValues = filter(wObject.fields, ['name', currentField]);
  if (!fieldValues.length) return defaultValue;

  const orderedValues = orderBy(fieldValues, ['weight'], ['desc']);

  if (!isEmpty(orderedValues[0].body)) {
    const upvotedByModerator = orderedValues.find(field => field.upvotedByModerator);
    return upvotedByModerator ? upvotedByModerator.body : orderedValues[0].body;
  }
  return defaultValue;
};

export const getFieldsWithMaxWeight = (wObj, usedLocale = 'en-US', defaultLocale = 'en-US') => {
  if (!wObj || (wObj && isEmpty(wObj.fields))) return null;

  const LOCALES = {
    CURRENT: usedLocale,
    DEFAULT: defaultLocale,
    OTHER: 'otherLanguages',
  };
  const localesToFilter = new Set(Object.values(LOCALES));

  // fields with complex body - contains serialized objects, need to parse
  const complexFields = [
    objectFields.button,
    objectFields.address,
    objectFields.website,
    objectFields.link,
    objectFields.status,
    objectFields.newsFilter,
  ];

  const fieldsByLocale = {
    [LOCALES.CURRENT]: [],
    [LOCALES.DEFAULT]: [],
    [LOCALES.OTHER]: [],
  };

  wObj.fields
    .filter(f => !Object.keys(wObj).includes(f.name)) // skip fields which already exist as wObj properties
    .forEach(field => {
      if (localesToFilter.has(field.locale)) {
        fieldsByLocale[field.locale].push(field);
      } else {
        fieldsByLocale[LOCALES.OTHER].push(field);
      }
    });

  // firstly, looking for fields upvoted by moderator
  let maxWeightedFields = mapValues(
    groupBy(
      orderBy(
        wObj.fields.filter(f => f.upvotedByModerator),
        'weight',
        'desc',
      ),
      'name',
    ),
    fieldsArr =>
      fieldsArr.find(f => f.locale === usedLocale || f.locale === defaultLocale) || fieldsArr[0],
  );
  localesToFilter.forEach(locale => {
    fieldsByLocale[locale]
      .filter(field => !Object.keys(maxWeightedFields).includes(field.name))
      .reduce((acc, curr) => {
        if (acc[curr.name]) {
          if (curr.weight > acc[curr.name].weight) {
            acc[curr.name] = curr;
          }
        } else {
          acc[curr.name] = curr;
        }
        return acc;
      }, maxWeightedFields);
  });

  maxWeightedFields = mapValues(maxWeightedFields, 'body');
  complexFields.forEach(field => {
    if (maxWeightedFields[field]) {
      const parsed = attempt(JSON.parse, maxWeightedFields[field]);
      if (!isError(parsed)) maxWeightedFields[field] = parsed;
    }
  });
  return maxWeightedFields;
};

export const getInnerFieldWithMaxWeight = (wObject, currentField, innerField) => {
  if (includes(objectFieldsWithInnerData, currentField)) {
    const fieldBody = getFieldWithMaxWeight(wObject, currentField);
    if (fieldBody) {
      const parsed = attempt(JSON.parse, fieldBody);
      if (isError(parsed)) return '';
      if (!innerField) return parsed;
      return parsed[innerField];
    }
  }
  return '';
};

export const getFieldsByName = (wObject, currentField) => {
  if (!supportedObjectFields.includes(currentField) || !wObject) return [];
  return filter(wObject.fields, ['name', currentField]);
};

export const getField = (wObject, currentField, fieldName) => {
  const wo = find(wObject.fields, ['name', currentField]);

  if (!wo) return '';

  let parsed = null;

  try {
    parsed = JSON.parse(wo.body);
  } catch (e) {
    //
  }
  return parsed ? parsed[fieldName] : wo.body;
};

export const getListItems = (
  wobj,
  { uniq, isMappedToClientWobject } = { uniq: false, isMappedToClientWobject: false },
) => {
  let items = [];
  if (wobj) {
    if (wobj.listItems) {
      items = wobj.listItems;
    } else if (wobj.menuItems) {
      items = wobj.menuItems;
    }
  }
  if (uniq) {
    items = uniqBy(items, 'author_permlink');
  }
  if (isMappedToClientWobject) {
    items = items.map(item => getClientWObj(item));
  }
  return items;
};

export const getListItemLink = (listItem, location) => {
  switch (listItem.type) {
    case OBJECT_TYPE.PAGE:
      return {
        pathname: `${location.pathname}`,
        hash: `${location.hash}${location.hash.length ? '/' : ''}${listItem.id}`,
      };
    case OBJECT_TYPE.LIST:
      return {
        pathname: `${location.pathname}`,
        hash: `${
          !location.hash
            ? listItem.id
            : `${
                location.hash.includes(listItem.id)
                  ? `${location.hash.split(listItem.id)[0]}${listItem.id}`
                  : `${location.hash}/${listItem.id}`
              }`
        }`,
      };
    default:
      return { pathname: `/object/${listItem.id}` };
  }
};

export const getFieldsCount = (wObject, fieldName) => {
  let count = 0;
  if (includes(TYPES_OF_MENU_ITEM, fieldName)) {
    count = getListItems(wObject, { uniq: true }).filter(item =>
      fieldName === TYPES_OF_MENU_ITEM.LIST
        ? item.object_type === OBJECT_TYPE.LIST
        : item.object_type === OBJECT_TYPE.PAGE,
    ).length;
  } else {
    count = get(wObject, 'fields', []).filter(field => field.name === fieldName).length;
  }
  return count;
};

export const truncate = str => (str && str.length > 255 ? str.substring(0, 255) : str);

export const hasActionType = (post, actionTypes = ['createObject', 'appendObject']) => {
  const parsedMetadata = post && post.json_metadata && JSON.parse(post.json_metadata);
  if (!parsedMetadata) return false;

  const objActionType =
    parsedMetadata[WAIVIO_META_FIELD_NAME] && parsedMetadata[WAIVIO_META_FIELD_NAME].action;
  const appendingField =
    parsedMetadata[WAIVIO_META_FIELD_NAME] && parsedMetadata[WAIVIO_META_FIELD_NAME].field;
  return (
    actionTypes.includes(objActionType) &&
    appendingField &&
    supportedObjectFields.includes(appendingField.name)
  );
};

export const mapObjectAppends = (comments, wObj, albums) => {
  const galleryImages = [];
  albums.forEach(album => album.items.forEach(item => galleryImages.push(item)));

  const filteredComments = Object.values(comments).filter(comment => hasActionType(comment));
  return [...wObj.fields, ...galleryImages, ...albums].map(field => {
    const matchComment = filteredComments.find(
      comment => comment.permlink === field.permlink && comment.author === field.author,
    );
    const rankedUser = wObj.users && wObj.users.find(user => user.name === field.creator);
    return {
      ...matchComment,
      active_votes: field.active_votes,
      author: field.creator,
      author_original: field.author,
      author_rank: (rankedUser && rankedUser.rank) || 0,
      append_field_name: field.name || '',
      append_field_weight: field.weight || null,
      upvotedByModerator: field.upvotedByModerator ? field.upvotedByModerator : false,
    };
  });
};

export const hasField = (post, fieldName, locale) => {
  const parsedMetadata = post && post.json_metadata && attempt(JSON.parse, post.json_metadata);
  if (!parsedMetadata || isError(parsedMetadata)) return false;

  const field =
    parsedMetadata[WAIVIO_META_FIELD_NAME] && parsedMetadata[WAIVIO_META_FIELD_NAME].field;
  return (
    !(fieldName && !(field && field.name === fieldName)) &&
    !(locale && !(field && field.locale === locale))
  );
};

export const IMAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  TIMEOUT: 'timeout',
};

export const testImage = (url, callback, timeout = 3000) => {
  let timedOut = false;
  let timer;

  const img = new Image();

  const handleError = () => {
    if (!timedOut) {
      clearTimeout(timer);
      callback(url, IMAGE_STATUS.ERROR);
    }
  };

  img.onerror = handleError;
  img.onabort = handleError;
  img.onload = () => {
    if (!timedOut) {
      clearTimeout(timer);
      callback(url, IMAGE_STATUS.SUCCESS);
    }
  };
  img.src = url;
  timer = setTimeout(() => {
    timedOut = true;
    callback(url, IMAGE_STATUS.TIMEOUT);
  }, timeout);
};

/**
 *
 * @param items - array of waivio objects
 * @param sortBy - string, one of 'by-name-asc'|'by-name-desc'|'rank'|'custom'
 * @param sortOrder - array of strings (object permlinks)
 * @returns {*}
 */
export const sortListItemsBy = (items, sortBy = 'by-name-asc', sortOrder = null) => {
  if (!items || !items.length) return [];
  if (!sortBy) return items;
  let comparator;
  switch (sortBy) {
    case 'rank':
      comparator = (a, b) => b.weight - a.weight || (a.name >= b.name ? 1 : -1);
      break;
    case 'by-name-desc':
      comparator = (a, b) => (a.name < b.name ? 1 : -1);
      break;
    case 'custom':
      break;
    case 'by-name-asc':
    default:
      comparator = (a, b) => (a.name > b.name ? 1 : -1);
      break;
  }
  const sorted = uniqBy(items, 'id').sort(comparator);
  const resultArr = [
    ...sorted.filter(item => item.type === 'list'),
    ...sorted.filter(item => item.type !== 'list'),
  ];

  if (sortBy === 'custom' && sortOrder && sortOrder.length) {
    [...sortOrder].reverse().forEach(permlink => {
      const index = resultArr.findIndex(item => item.id === permlink);
      if (index !== -1) {
        const [itemToMove] = resultArr.splice(index, 1);
        resultArr.unshift(itemToMove);
      }
    });
  }
  return resultArr;
};

/** validator for pageContent field in object with type 'Page'
 *
 * @param pageContent - markDown string
 * @param prevPageContent - markDown string
 */
export function validateContent(pageContent = '', prevPageContent = '') {
  const currContent = pageContent.trim();
  if (!currContent || currContent === prevPageContent.trim()) return false;

  return true;
}

export function combineObjectMenu(menuItems, { button, news } = { button: null, news: null }) {
  const result = [...menuItems];
  if (news) {
    result.push({
      id: TYPES_OF_MENU_ITEM.NEWS,
    });
  }
  if (button) {
    result.push({
      id: TYPES_OF_MENU_ITEM.BUTTON,
      ...button,
    });
  }
  return result;
}
