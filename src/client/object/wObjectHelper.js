import _ from 'lodash';
import { objectFields, supportedObjectFields } from '../../../src/common/constants/listOfFields';
import { WAIVIO_META_FIELD_NAME } from '../../common/constants/waivio';

// set innerField to "null" to get whole parsed object
export const getFieldWithMaxWeight = (wObject, currentField, innerField) => {
  const field = supportedObjectFields.includes(currentField);
  if (!field || !wObject) return '';

  const fieldValues = _.filter(wObject.fields, ['name', currentField]);
  const orderedValues = _.orderBy(fieldValues, ['weight'], ['desc']);
  if (!orderedValues.length) return '';

  const fld = orderedValues[0];

  if (fld.body) {
    const parsed = _.attempt(JSON.parse, fld.body);
    if (_.isError(parsed)) return fld.body;
    if (!innerField) return parsed;
    if (parsed[innerField]) return parsed[innerField];
  }
  return '';
};
//
export const getFielsByName = (wObject, currentField) => {
  if (!supportedObjectFields.includes(currentField) || !wObject) return [];
  return _.filter(wObject.fields, ['name', currentField]);
};

export const getField = (wObject, currentField, fieldName) => {
  const wo = _.find(wObject.fields, ['name', currentField]);

  if (!wo) return '';

  let parsed = null;

  try {
    parsed = JSON.parse(wo.body);
  } catch (e) {
    //
  }
  return parsed ? parsed[fieldName] : wo.body;
};

export const getFieldsCount = (wObject, fieldName) =>
  wObject && wObject.fields ? wObject.fields.filter(field => field.name === fieldName).length : 0;

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

export const mapObjectAppends = (comments, wObj) => {
  const filteredComments = Object.values(comments).filter(comment => hasActionType(comment));
  return wObj.fields.map(field => {
    const matchComment = filteredComments.find(
      comment => comment.permlink === field.permlink && comment.author === field.author,
    );
    const rankedUser = wObj.users && wObj.users.find(user => user.name === field.creator);
    return {
      ...matchComment,
      author: field.creator,
      author_original: field.author,
      author_rank: (rankedUser && rankedUser.rank) || 0,
      append_field_name: field.name || '',
      append_field_weight: field.weight || null,
    };
  });
};

export const hasField = (post, fieldName, locale) => {
  const parsedMetadata = post && post.json_metadata && _.attempt(JSON.parse, post.json_metadata);
  if (!parsedMetadata || _.isError(parsedMetadata)) return false;

  const field =
    parsedMetadata[WAIVIO_META_FIELD_NAME] && parsedMetadata[WAIVIO_META_FIELD_NAME].field;
  return (
    !(fieldName && !(field && field.name === fieldName)) &&
    !(locale && !(field && field.locale === locale))
  );
};

export const getWebsiteField = (wObject, currentField = objectFields.website) => {
  const wo = _.find(wObject.fields, ['name', currentField]);
  if (!wo) return '';
  return wo;
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
  let comparator;
  switch (sortBy) {
    case 'rank':
      comparator = (a, b) => b.rank - a.rank || (a.name > b.name ? 1 : -1);
      break;
    case 'by-name-desc':
      comparator = (a, b) => (a.name < b.name ? 1 : -1);
      break;
    case 'by-name-asc':
    default:
      comparator = (a, b) => (a.name > b.name ? 1 : -1);
      break;
  }
  const sorted = _.uniqBy(items, 'id').sort(comparator);
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
