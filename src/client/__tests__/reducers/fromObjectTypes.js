import {
  getObjectTypesList,
  getObjectTypesLoading,
} from '../../store/objectTypesStore/objectTypesSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromObjectTypes', () => {
  const state = {
    objectTypes: {
      fetching: 'fetching',
      list: {
        dish: 'dish',
        stocks: 'stocks',
        service: 'service',
      },
    },
  };

  it('Should return fetching', () => {
    expect(getObjectTypesLoading(state)).toBe('fetching');
  });

  it('Should return list with similar types', () => {
    const exp = {
      dish: 'dish',
      stocks: 'stocks',
      service: 'service',
    };

    expect(getObjectTypesList(state)).toEqual(exp);
  });
});
