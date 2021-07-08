import { createSelector } from 'reselect';

import listOfObjectTypes from '../../common/constants/listOfObjectTypes';

// selector
export const objectTypesState = state => state.objectTypes;

// reselect function
export const getObjectTypesSimpleList = createSelector(
  [objectTypesState],
  objectTypes => objectTypes.list,
);
export const getObjectTypesList = createSelector([getObjectTypesSimpleList], list => {
  // Commented functional for automatic adding of types in the end of objectTypesListSorted object
  // const objectTypesListNotInOrder = _.filter(state.list, ({name}) => !listOfObjectTypes.includes(name));
  const objectTypesListSorted = {};

  listOfObjectTypes.forEach(type => {
    if (list[type]) {
      objectTypesListSorted[type] = list[type];
    }
  });

  return objectTypesListSorted;
  // return {...objectTypesListSorted, ...objectTypesListNotInOrder};
});

export const getObjectTypesLoading = createSelector(
  [objectTypesState],
  objectTypes => objectTypes.fetching,
);
