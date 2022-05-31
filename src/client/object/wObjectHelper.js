import { get, filter, isEmpty, uniqBy, orderBy, has } from 'lodash';
import { TYPES_OF_MENU_ITEM, objectFields } from '../../common/constants/listOfFields';
import { getObjectName, isList } from '../../common/helpers/wObjectHelper';

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

const getFieldType = fieldName => {
  switch (fieldName) {
    case 'menuList':
      return 'listItem';
    case 'menuPage':
      return 'pageContent';
    case 'formField':
      return 'form';
    default:
      return fieldName;
  }
};

export const getFieldsCount = (wObject, fieldName) => {
  const type = getFieldType(fieldName);
  const field = get(wObject, 'exposedFields', []).find(f => f.name === type);

  return field?.value || 0;
};

export const truncate = str => (str && str.length > 255 ? str.substring(0, 255) : str);

/**
 *
 * @param items - array of waivio objects
 * @param sortByParam - string, one of 'by-name-asc'|'by-name-desc'|'rank'|'recency'|'custom'
 * @param sortOrder - array of strings (object permlinks)
 * @param isSortByDateAdding - if true, the list will be sorted by the date the object was added
 * @returns {*}
 */
export const sortListItemsBy = (
  items,
  sortByParam = 'recency',
  sortOrder = null,
  isSortByDateAdding = false,
) => {
  if (!items || !items.length) return [];
  if (!sortByParam) return items;
  const isCustomSorting = sortByParam === 'custom';
  const isRecencySorting = sortByParam === 'recency';
  let comparator;

  switch (sortByParam) {
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
  const sortedByDate =
    sorted.every(item => has(item, 'addedAt')) && isSortByDateAdding
      ? orderBy(sorted, ['addedAt'], 'desc')
      : sorted;

  const sorting = (a, b) => isList(b) - isList(a);
  const resultArr = isCustomSorting ? sorted : sortedByDate.sort(sorting);

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
  const exposedFields = get(wobj, 'exposedFields', []).map(field => field.name);
  let renderedFields = exposedFields.includes('listItem')
    ? [
        ...exposedFields.filter(f => f !== objectFields.listItem),
        TYPES_OF_MENU_ITEM.PAGE,
        TYPES_OF_MENU_ITEM.LIST,
      ]
    : exposedFields;

  renderedFields = renderedFields.map(item => (item === 'form' ? 'formField' : item));

  return renderedFields.sort();
};
