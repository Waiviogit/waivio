import {
  getHasMap,
  getTypeName,
  getActiveFilters,
  getFilteredObjects,
  getObjectTypeState,
  getAvailableFilters,
  getObjectTypeLoading,
  getObjectTypeSorting,
  getFilteredObjectsMap,
  getHasMoreRelatedObjects,
} from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromObjectType', () => {
  const state = {
    objectType: {
      data: {
        name: 'name',
      },
      fetching: 'fetching',
      filteredObjects: 'filteredObjects',
      mapWobjects: 'mapWobjects',
      hasMoreRelatedObjects: 'hasMoreRelatedObjects',
      filtersList: 'filtersList',
      activeFilters: 'activeFilters',
      map: 'map',
      sort: 'sort',
    },
  };

  it('Should return fetching', () => {
    expect(getObjectTypeState(state)).toEqual(state.objectType.data);
  });

  it('Should return fetching', () => {
    expect(getObjectTypeLoading(state)).toBe('fetching');
  });

  it('Should return filteredObjects', () => {
    expect(getFilteredObjects(state)).toBe('filteredObjects');
  });

  it('Should return mapWobjects', () => {
    expect(getFilteredObjectsMap(state)).toBe('mapWobjects');
  });

  it('Should return hasMoreRelatedObjects', () => {
    expect(getHasMoreRelatedObjects(state)).toBe('hasMoreRelatedObjects');
  });

  it('Should return filtersList', () => {
    expect(getAvailableFilters(state)).toBe('filtersList');
  });

  it('Should return activeFilters', () => {
    expect(getActiveFilters(state)).toBe('activeFilters');
  });

  it('Should return name', () => {
    expect(getTypeName(state)).toBe('name');
  });

  it('Should return map', () => {
    expect(getHasMap(state)).toBe('map');
  });

  it('Should return sort', () => {
    expect(getObjectTypeSorting(state)).toBe('sort');
  });
});
