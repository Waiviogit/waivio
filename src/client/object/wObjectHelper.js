import { filter, get, has, isEmpty, uniqBy } from 'lodash';
import { getObjectName, getSortList, isList } from '../../common/helpers/wObjectHelper';
import { objectFields, TYPES_OF_MENU_ITEM } from '../../common/constants/listOfFields';

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

export const truncate = str => (str && str.length > 255 ? str?.substring(0, 255) : str);

export const shortenDescription = (description, length) => {
  if (isEmpty(description)) return '';
  if (description.length <= length) {
    return {
      firstDescrPart: description,
      secondDescrPart: '',
    };
  }
  const shortened = description?.substr(0, length);
  const lastPeriod = shortened?.lastIndexOf('.');

  if (lastPeriod === -1) {
    return {
      firstDescrPart: shortened,
      secondDescrPart: description?.substring(length),
    };
  }

  return {
    firstDescrPart: shortened?.substring(0, lastPeriod + 1),
    secondDescrPart: description?.substring(lastPeriod + 1).trim(),
  };
};
export const getProductDescriptionParagraphs = dividedParagraphs =>
  dividedParagraphs?.reduce((acc, paragraph, index) => {
    if (index % 2 === 0) {
      const paragraph1 = paragraph;
      const paragraph2 = dividedParagraphs[index + 1];
      const combinedParagraphs = [paragraph1, paragraph2].filter(Boolean).join('\n\n');

      acc.push(combinedParagraphs);
    }

    return acc;
  }, []);

export const getBusinessDescriptionParagraphs = dividedParagraphs =>
  dividedParagraphs?.reduce((acc, paragraph, index) => {
    if (index % 2 === 0) {
      const paragraph1 = paragraph;
      const paragraph2 = dividedParagraphs[index + 1];

      if (paragraph1.length < 150 && paragraph2) {
        const combinedParagraphs = [paragraph1, paragraph2].join('\n\n');

        acc.push(combinedParagraphs);
      } else {
        acc.push(paragraph1);
        if (paragraph2) {
          acc.push(paragraph2);
        }
      }
    }

    return acc;
  }, []);

export const removeEmptyLines = string => {
  const lines = string?.split('\n');
  const nonEmptyLines = lines?.filter(line => line?.trim() !== '');

  return nonEmptyLines?.join('\n');
};

export const sortItemsByPromotion = (items, host) =>
  items
    .filter(item => item.promotion?.some(promo => promo.body === host))
    .sort((a, b) => {
      const promoA = a.promotion.find(promo => promo.body === host);
      const promoB = b.promotion.find(promo => promo.body === host);

      return promoA.startDate - promoB.startDate;
    });

/**
 *
 * @param items - array of waivio objects
 * @param sortByParam - string, one of 'by-name-asc'|'by-name-desc'|'rank'|'recency'|'custom'
 * @param sortOrder - array of strings (object permlinks)
 * @param host - string, host name
 * @returns {*}
 */
export const sortListItemsBy = (items, sortByParam = 'recency', sortOrder = null, host) => {
  if (!items || !items.length) return [];
  const sortItemsByPr = sortItemsByPromotion(items, host);
  const withoutPromotion = items
    .filter(item => !sortItemsByPr?.includes(item))
    .sort((a, b) => {
      if (!a.addedAt && !b.addedAt) return 0;
      if (!a.addedAt) return 1;
      if (!b.addedAt) return -1;

      return new Date(a.addedAt) - new Date(b.addedAt);
    });

  const excludedIds = new Set(sortOrder?.exclude || []);
  const withoutExcluded = excludedIds.size
    ? withoutPromotion.filter(item => !excludedIds.has(item.author_permlink))
    : withoutPromotion;

  if (sortByParam === 'custom' && sortOrder) {
    if (sortOrder && sortOrder.sortType && sortOrder.sortType !== 'custom') {
      let comparator;

      switch (sortOrder.sortType) {
        case 'rank':
          comparator = (a, b) => {
            if (b.weight !== a.weight) return b.weight - a.weight;

            const nameA = getObjectName(a) || '';
            const nameB = getObjectName(b) || '';

            return nameA.localeCompare(nameB);
          };
          break;
        case 'by-name-asc':
          comparator = (a, b) => {
            const nameA = getObjectName(a) || '';
            const nameB = getObjectName(b) || '';

            return nameA.localeCompare(nameB);
          };
          break;
        case 'by-name-desc':
          comparator = (a, b) => {
            const nameA = getObjectName(a) || '';
            const nameB = getObjectName(b) || '';

            return nameB.localeCompare(nameA);
          };
          break;
        case 'recency':
          comparator = (a, b) => {
            if (!a.addedAt && !b.addedAt) return 0;
            if (!a.addedAt) return 1;
            if (!b.addedAt) return -1;

            return new Date(a.addedAt) - new Date(b.addedAt);
          };
          break;
        case 'reverse_recency':
          comparator = (a, b) => {
            if (!a.addedAt && !b.addedAt) return 0;
            if (!a.addedAt) return -1;
            if (!b.addedAt) return 1;

            return new Date(b.addedAt) - new Date(a.addedAt);
          };
          break;
        default:
          comparator = (a, b) => {
            const nameA = getObjectName(a) || '';
            const nameB = getObjectName(b) || '';

            return nameA.localeCompare(nameB);
          };
          break;
      }

      const sorted = uniqBy(withoutExcluded, 'author_permlink').sort((a, b) => {
        const cmp = comparator(a, b);

        if (cmp !== 0) return cmp;
        if (has(a, 'addedAt') && has(b, 'addedAt')) {
          return new Date(b.addedAt) - new Date(a.addedAt);
        }

        return 0;
      });

      const sorting = (a, b) => isList(b) - isList(a);

      return [...sortItemsByPr, ...sorted.sort(sorting)];
    }

    if (!sortOrder || !sortOrder.include || sortOrder.include.length === 0) {
      const sorted = uniqBy(withoutExcluded, 'author_permlink').sort((a, b) => {
        const nameA = getObjectName(a) || '';
        const nameB = getObjectName(b) || '';
        const cmp = nameA.localeCompare(nameB);

        if (cmp !== 0) return cmp;
        if (has(a, 'addedAt') && has(b, 'addedAt')) {
          return new Date(b.addedAt) - new Date(a.addedAt);
        }

        return 0;
      });
      const sorting = (a, b) => isList(b) - isList(a);

      return [...sortItemsByPr, ...sorted.sort(sorting)];
    }

    return [...sortItemsByPr, ...getSortList(sortOrder, withoutExcluded)];
  }
  let comparator;

  switch (sortByParam) {
    case 'rank':
      comparator = (a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;

        const nameA = getObjectName(a) || '';
        const nameB = getObjectName(b) || '';

        return nameA.localeCompare(nameB);
      };
      break;
    case 'by-name-asc':
      comparator = (a, b) => {
        const nameA = getObjectName(a) || '';
        const nameB = getObjectName(b) || '';

        return nameA.localeCompare(nameB);
      };
      break;
    case 'by-name-desc':
      comparator = (a, b) => {
        const nameA = getObjectName(a) || '';
        const nameB = getObjectName(b) || '';

        return nameB.localeCompare(nameA);
      };
      break;
    case 'recency':
      comparator = (a, b) => {
        if (!a.addedAt && !b.addedAt) return 0;
        if (!a.addedAt) return 1;
        if (!b.addedAt) return -1;

        return new Date(a.addedAt) - new Date(b.addedAt);
      };
      break;
    case 'reverse_recency':
      comparator = (a, b) => {
        if (!a.addedAt && !b.addedAt) return 0;
        if (!a.addedAt) return -1;
        if (!b.addedAt) return 1;

        return new Date(b.addedAt) - new Date(a.addedAt);
      };
      break;
    default:
      comparator = () => 0;
      break;
  }

  const uniqueItems = uniqBy(withoutExcluded, 'author_permlink');

  const lists = uniqueItems.filter(item => isList(item));
  const nonLists = uniqueItems.filter(item => !isList(item));
  const sortedLists = lists.sort((a, b) => {
    const cmp = comparator(a, b);

    if (cmp !== 0) return cmp;

    if (has(a, 'addedAt') && has(b, 'addedAt')) {
      return new Date(b.addedAt) - new Date(a.addedAt);
    }

    return 0;
  });

  const sortedNonLists = nonLists.sort((a, b) => {
    const cmp = comparator(a, b);

    if (cmp !== 0) return cmp;

    if (has(a, 'addedAt') && has(b, 'addedAt')) {
      return new Date(b.addedAt) - new Date(a.addedAt);
    }

    return 0;
  });

  return [...sortItemsByPr, ...sortedLists, ...sortedNonLists];
};

export const getWobjectsForMap = objects =>
  filter(objects, wobj => !isEmpty(wobj.map) || !isEmpty(wobj.parent.map));

export const getLink = link => {
  if (link && link?.indexOf('http://') === -1 && link?.indexOf('https://') === -1) {
    return `http://${link}`;
  }

  return link;
};

export const getExposedFieldsByObjType = wobj => {
  const exposedFields = get(wobj, 'exposedFields', []).map(field => field.name);
  const renderedFields = exposedFields?.includes('listItem')
    ? [...exposedFields.filter(f => f !== objectFields.listItem), TYPES_OF_MENU_ITEM.LIST]
    : exposedFields;

  return renderedFields.sort();
};
