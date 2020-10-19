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
  reduce,
  findIndex,
  isEqual,
  map,
  size,
} from 'lodash';
import { getClientWObj } from '../adapters';
import {
  supportedObjectFields,
  objectFieldsWithInnerData,
  TYPES_OF_MENU_ITEM,
  objectFields,
  TYPES_OF_MENU_ITEM as OBJECT_TYPES,
  sortingMenuName,
} from '../../common/constants/listOfFields';
import { WAIVIO_META_FIELD_NAME } from '../../common/constants/waivio';
import OBJECT_TYPE from './const/objectTypes';
import { calculateApprovePercent, getObjectName } from '../helpers/wObjectHelper';

export const getFieldWithMaxWeight = (wObject, currentField, defaultValue = '') => {
  if (!wObject || !currentField || !supportedObjectFields.includes(currentField))
    return defaultValue;
  let fieldValues;
  if (wObject.fields) {
    fieldValues = wObject.fields.filter(
      field =>
        field.name === currentField &&
        calculateApprovePercent(field.active_votes, field.weight, wObject) >= 70,
    );
  }

  if (!fieldValues) return defaultValue;

  const orderedValues = orderBy(fieldValues, ['weight'], ['desc']);

  if (orderedValues[0] && !isEmpty(orderedValues[0].body)) {
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
    objectFields.name,
    objectFields.description,
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
      .filter(
        field =>
          !Object.keys(maxWeightedFields).includes(field.name) &&
          calculateApprovePercent(field.active_votes, field.weight, wObj) >= 70,
      )
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
  const fields = get(wObject, 'fields', []);

  if (sortingMenuName[fieldName])
    return size(
      fields.filter(field => field.name === objectFields.listItem && field.type === fieldName),
    );

  return size(fields.filter(field => field.name === fieldName));
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
 * @param sortBy - string, one of 'by-name-asc'|'by-name-desc'|'rank'|'recency'|'custom'
 * @param sortOrder - array of strings (object permlinks)
 * @returns {*}
 */
export const sortListItemsBy = (items, sortBy = 'recency', sortOrder = null) => {
  if (!items || !items.length) return [];
  if (!sortBy) return items;
  let comparator;
  switch (sortBy) {
    case 'rank':
      comparator = (a, b) => b.weight - a.weight || (a.name >= b.name ? 1 : -1);
      break;
    case 'recency':
    default:
      comparator = (a, b) => (a.createdAt < b.createdAt ? 1 : -1);
      break;
    case 'by-name-desc':
      comparator = (a, b) => (getObjectName(a) < getObjectName(b) ? 1 : -1);
      break;
    case 'custom':
      break;
    case 'by-name-asc':
      comparator = (a, b) => (getObjectName(a) > getObjectName(b) ? 1 : -1);
      break;
  }
  const sorted = uniqBy(items, 'author_permlink').sort(comparator);
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

export const mainerName = (votes, moderators, admins) => {
  if (!votes || !moderators || !admins) return null;

  const statusName = perc => (perc > 0 ? 'approved' : 'rejected');
  const mainObjCreator = (mainer, name, status) => ({
    mainer,
    name,
    status,
  });
  const moderator = votes
    .filter(vote => moderators.includes(vote.voter))
    .sort((after, before) => before.createdAt - after.createdAt)[0];

  if (moderator) {
    return mainObjCreator('moderator', moderator.voter, statusName(moderator.percent));
  }

  const admin = votes
    .filter(vote => admins.includes(vote.voter))
    .sort((after, before) => before.createdAt - after.createdAt)[0];

  if (admin) {
    return mainObjCreator('admin', admin.voter, statusName(admin.percent));
  }

  return null;
};

export const getWobjectsWithMaxWeight = wobjects =>
  reduce(
    wobjects,
    (acc, object) => {
      const idx = findIndex(acc, o => isEqual(o.map, object.map));
      if (idx === -1) {
        return [...acc, object];
      }
      acc[idx] = acc[idx].weight < object.weight ? object : acc[idx];

      return acc;
    },
    [],
  );

export const getWobjectsForMap = objects => {
  const wobjectsWithMap = filter(objects, wobj => !isEmpty(wobj.map));
  const wobjectWithPropositions = filter(
    wobjectsWithMap,
    wobject => wobject.campaigns || wobject.propositions,
  );
  const wobjectsWithMaxWeight = getWobjectsWithMaxWeight(wobjectsWithMap);
  return map(
    wobjectsWithMaxWeight,
    obj => find(wobjectWithPropositions, o => isEqual(o.map, obj.map)) || obj,
  );
};

export const getLink = link => {
  if (link && link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
    return `http://${link}`;
  }
  return link;
};

export const getWithUrlWordList = urlPathname => urlPathname.split('/').pop() === 'list';

export const getLinkEdit = (wobject, isEditMode, isMobile) => {
  const link = `/object/${wobject.author_permlink}`;
  if (isEditMode) return null;
  if (isMobile) return `${link}/about`;
  if (wobject.object_type === OBJECT_TYPES.LIST || wobject.object_type === OBJECT_TYPES.PAGE)
    return `${link}/${wobject.object_type}`;

  return `${link}/reviews`;
};

export const getListSorting = wobj => {
  const type = size(wobj[objectFields.sorting]) ? 'custom' : 'recency';
  const order = type === 'custom' ? wobj[objectFields.sorting] : null;

  return { type, order };
};

export const getExposedFieldsByObjType = wobj => {
  const exposedFields = get(wobj, 'exposedFields', []);
  const renderedFields = exposedFields.includes('listItem')
    ? [
        ...exposedFields.filter(f => f !== objectFields.listItem),
        TYPES_OF_MENU_ITEM.PAGE,
        TYPES_OF_MENU_ITEM.LIST,
      ]
    : exposedFields;

  return renderedFields.sort();
};
