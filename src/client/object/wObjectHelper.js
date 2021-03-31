import { get, filter, isEmpty, uniqBy, size } from 'lodash';
import {
  TYPES_OF_MENU_ITEM,
  objectFields,
  sortingMenuName,
} from '../../common/constants/listOfFields';
import { getObjectName, isList } from '../helpers/wObjectHelper';

export const getListItems = (wobj, { uniq } = { uniq: false, isMappedToClientWobject: false }) => {
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

  return items;
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
  const isCustomSorting = sortBy === 'custom';
  const isRecencySorting = sortBy === 'recency';
  let comparator;
  switch (sortBy) {
    case 'rank':
      comparator = (a, b) => b.weight - a.weight || (a.name >= b.name ? 1 : -1);
      break;
    case 'by-name-desc':
      comparator = (a, b) => (getObjectName(a) < getObjectName(b) ? 1 : -1);
      break;
    case 'by-name-asc':
      comparator = (a, b) => (getObjectName(a) > getObjectName(b) ? 1 : -1);
      break;
    default:
      break;
  }
  let sorted = uniqBy(items, 'author_permlink').sort(comparator);
  if ((isCustomSorting || isRecencySorting) && !isEmpty(sortOrder)) {
    sorted = sortOrder
      .map(permlink => sorted.find(item => item.author_permlink === permlink))
      .filter(item => item);
  }
  const sorting = (a, b) => isList(b) - isList(a);
  const resultArr = isCustomSorting ? sorted : sorted.sort(sorting);
  return resultArr;
};

export const getWobjectsForMap = objects =>
  filter(objects, wobj => !isEmpty(wobj.map) || !isEmpty(wobj.parent.map));

export const getLink = link => {
  if (link && link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
    return `http://${link}`;
  }
  return link;
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
