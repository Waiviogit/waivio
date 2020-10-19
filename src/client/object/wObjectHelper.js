import { get, filter, isEmpty, uniqBy, size } from 'lodash';
import {
  TYPES_OF_MENU_ITEM,
  objectFields,
  sortingMenuName,
  TYPES_OF_MENU_ITEM as OBJECT_TYPES,
} from '../../common/constants/listOfFields';
import { getObjectName } from '../helpers/wObjectHelper';

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

export const getWobjectsForMap = objects =>
  filter(objects, wobj => !isEmpty(wobj.map) || !isEmpty(wobj.parent.map));

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
