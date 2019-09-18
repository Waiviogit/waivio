import {
  hasField,
  getFieldWithMaxWeight,
  sortListItemsBy,
  getInnerFieldWithMaxWeight,
  getFieldsWithMaxWeight,
} from '../wObjectHelper';
import { WAIVIO_META_FIELD_NAME } from '../../../common/constants/waivio';
import * as mockObject from '../__mock__/mockData';

describe('hasField', () => {
  it('should return true if field exist', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"field": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, 'testName', 'en-US')).toEqual(true);
  });
  it('should return false if field not exist', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"field": {"name": "NOTtestName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, 'testName', 'en-US')).toEqual(false);
  });
  it('should return false without post prop', () => {
    expect(hasField(null, 'testName', 'en-US')).toEqual(false);
  });
  it('should return false without WAIVIO_META_FIELD_NAME in json_metadata', () => {
    const post = {
      json_metadata: `{"Invalid": {"field": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, 'testName', 'en-US')).toEqual(false);
  });
  it('should return false without fieldName prop and different locales', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"field": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, null, 'ru-Ru')).toEqual(false);
  });
  it('should return tru without fieldName prop and the same locales', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"field": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, null, 'en-US')).toEqual(true);
  });
  it('should return false without field in json_metadata', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"NOTfield": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, null, 'en-US')).toEqual(false);
  });
  it('should return false without json_metadata in post', () => {
    const post = {};
    expect(hasField(post, 'testName', 'en-US')).toEqual(false);
  });
  it('should return false if json_metadata contains invalid json', () => {
    const post = { json_metadata: `invalid_json:{` };
    expect(hasField(post, 'testName', 'en-US')).toEqual(false);
  });
});

describe('getFieldWithMaxWeight', () => {
  it('should return field body with max weight', () => {
    const result = {
      weight: 794,
      name: 'name',
      body: 'TestResult',
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'name',
          body: 'CrazyPssina',
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'name')).toEqual(result.body);
  });
  it('should return field innerField of field with max weight', () => {
    const result = {
      weight: 794,
      name: 'address',
      body: '{"country":"resultValue"}',
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'address',
          body: '{"country":"bla"}',
        },
        result,
      ],
    };
    expect(getInnerFieldWithMaxWeight(wObject, 'address', 'country')).toEqual('resultValue');
  });
  // Strange function return
  it('should return parsed field body if innerField null', () => {
    const result = {
      weight: 794,
      name: 'address',
      body: { country: 'resultValue' },
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'address',
          body: { country: 'bla' },
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'address', null)).toEqual({ country: 'resultValue' });
  });
  //
  it('should return "" if field body empty', () => {
    const result = {
      weight: 794,
      name: 'address',
      body: {},
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'address',
          body: { country: 'bla' },
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'address')).toEqual('');
  });
  it('should return "" without field body', () => {
    const result = {
      weight: 794,
      name: 'address',
      // no body
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'address',
          body: '{"country":"bla"}',
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'address')).toEqual('');
  });
  it('should return field body if single', () => {
    const result = {
      weight: 794,
      name: 'name',
      body: 'TestResult',
    };
    const wObject = {
      fields: [result],
    };
    expect(getFieldWithMaxWeight(wObject, 'name')).toEqual(result.body);
  });
  it('should return "" if field unsupported', () => {
    const result = {
      weight: 794,
      name: 'name',
      body: 'TestResult',
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'name',
          body: 'CrazyPssina',
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'Unsupported')).toEqual('');
  });
  it('should return "" if wObject not exist', () => {
    expect(getFieldWithMaxWeight(null, 'name')).toEqual('');
  });
  it('should return "" if fields not exist', () => {
    const wObject = {};
    expect(getFieldWithMaxWeight(wObject, 'name')).toEqual('');
  });
  it('should return "" if fields empty', () => {
    const wObject = { fields: [] };
    expect(getFieldWithMaxWeight(wObject, 'name')).toEqual('');
  });
  it('should return "" if field not exist ', () => {
    const result = {
      weight: 794,
      name: 'NOTname',
      body: 'TestResult',
    };
    const wObject = {
      fields: [
        {
          weight: 793,
          name: 'NOTname',
          body: 'CrazyPssina',
        },
        result,
      ],
    };
    expect(getFieldWithMaxWeight(wObject, 'name')).toEqual('');
  });
});

describe('getFieldsWithMaxWeight', () => {
  it('should return empty object if wObj is empty', () => {
    const wObject = {};
    expect(getFieldsWithMaxWeight(wObject)).toEqual('');
  });
  it('should return empty object if wObj.fields is empty', () => {
    const wObject = { fields: [] };
    expect(getFieldsWithMaxWeight(wObject)).toEqual('');
  });
  it('should return object with actual fields', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'blog',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.SampleWObject)).toEqual(expected);
  });
  it('should return object with actual fields if the same fields in a row with same weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'steem',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectInRowDataWithSameWeigth)).toEqual(expected);
  });
  it('should return object with actual fields if the same fields in a row with different weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'allowList',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectInRowDataWithDifferentWeigth)).toEqual(
      expected,
    );
  });
  it('should return object with actual fields if the same fields not in a row with same weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'steem',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectNotInRowDataWithSameWeigth)).toEqual(expected);
  });
  it('should return object with actual fields if the same fields not in a row with different weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'allowList',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectNotInRowDataWithDifferentWeigth)).toEqual(
      expected,
    );
  });
  it('should return object with actual fields if the same fields, more then two, in a row with same weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'steem',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectMoreTwoObjInRowDataWithSameWeigth)).toEqual(
      expected,
    );
  });
  it('should return object with actual fields if the same fields, more then two, in a row with different weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'sometext',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(
      getFieldsWithMaxWeight(mockObject.wObjectMoreTwoObjInRowDataWithDifferentWeigth),
    ).toEqual(expected);
  });
  it('should return object with actual fields if the same fields, more then two, not in a row with same weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'steem',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(getFieldsWithMaxWeight(mockObject.wObjectMoreTwoObjNotInRowDataWithSameWeigth)).toEqual(
      expected,
    );
  });
  it('should return object with actual fields if the same fields, more then two, not in a row with different weight', () => {
    const expected = {
      name: 'milk',
      newsFilter: 'allow',
      website: 'http://www.broadwaychinese.ca',
    };
    expect(
      getFieldsWithMaxWeight(mockObject.wObjectMoreTwoObjNotInRowDataWithDifferentWeigth),
    ).toEqual(expected);
  });
});

describe('sortListItemsBy', () => {
  const obj1 = { id: 'id_obj1', type: 'item', name: 'obj-1', rank: 22 };
  const obj2 = { id: 'id_obj2', type: 'crypto', name: 'obj-2', rank: 11 };
  const list1 = { id: 'id_lst1', type: 'list', name: 'list-1', rank: 77 };
  const list2 = { id: 'id_lst2', type: 'list', name: 'list-2', rank: 99 };
  const list3 = { id: 'id_lst3', type: 'list', name: 'list-3', rank: 88 };

  let items = [];
  beforeEach(() => {
    items = [obj1, list1, list3, obj2, list2]
      .map(item => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.value);
  });
  it('should return the the same items instance', () => {
    items = [];
    expect(sortListItemsBy(items, 'noMatter')).toEqual(items);
  });
  it('should sort items by type (lists first) and name by default', () => {
    expect(sortListItemsBy(items)).toEqual([list1, list2, list3, obj1, obj2]);
  });
  it('should sort items by type (lists first) and name asc', () => {
    expect(sortListItemsBy(items, 'by-name-asc')).toEqual([list1, list2, list3, obj1, obj2]);
  });
  it('should sort items by type (lists first) and name desc', () => {
    expect(sortListItemsBy(items, 'by-name-desc')).toEqual([list3, list2, list1, obj2, obj1]);
  });
  it('should sort items by type (lists first) and rank', () => {
    expect(sortListItemsBy(items, 'rank')).toEqual([list2, list3, list1, obj1, obj2]);
  });
  it('should sort items by type (lists first) and rank (by name if ranks are equal)', () => {
    const withSameRank1 = { ...obj1, id: 'id_obj', name: obj1.name.slice(0, -2) };
    const withSameRank2 = { ...obj1, id: 'id_obj-1', name: `${obj1.name}-1` };
    expect(sortListItemsBy([...items, withSameRank1, withSameRank2], 'rank')).toEqual([
      list2,
      list3,
      list1,
      withSameRank1,
      obj1,
      withSameRank2,
      obj2,
    ]);
  });
  it('should not sort if custom sort is defined and sort order is not defined', () => {
    expect(sortListItemsBy([list1, list2, list3, obj1, obj2], 'custom')).toEqual([
      list1,
      list2,
      list3,
      obj1,
      obj2,
    ]);
  });
  it('should sort items according sortOrder', () => {
    const expected = [obj2, list3, list1, obj1, list2];
    expect(sortListItemsBy(items, 'custom', expected.map(item => item.id))).toEqual(expected);
  });
  it('should move new items to the end of the list', () => {
    const expected = [obj2, list1, list2];
    expect(sortListItemsBy(items, 'custom', expected.map(item => item.id))).toEqual([
      ...expected,
      list3,
      obj1,
    ]);
  });
  it('should skip item without error if there is no item for id in sort-order', () => {
    const expected = [obj2, list1, list2];
    expect(
      sortListItemsBy(items, 'custom', ['deleted-item_id', ...expected.map(item => item.id)]),
    ).toEqual([...expected, list3, obj1]);
  });
});
