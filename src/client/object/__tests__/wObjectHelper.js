import { hasField, getFieldWithMaxWeight } from '../wObjectHelper';
import { WAIVIO_META_FIELD_NAME } from '../../../common/constants/waivio';

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
  it('should return false without fieldName prop', () => {
    const post = {
      json_metadata: `{"${[
        WAIVIO_META_FIELD_NAME,
      ]}": {"field": {"name": "testName", "locale": "en-US"}}}`,
    };
    expect(hasField(post, null, 'en-US')).toEqual(false);
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
    expect(getFieldWithMaxWeight(wObject, 'name', null)).toEqual(result.body);
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
    expect(getFieldWithMaxWeight(wObject, 'address', 'country')).toEqual('resultValue');
  });
  // Strange function return
  it('should return parsed field body if innerField null', () => {
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
    expect(getFieldWithMaxWeight(wObject, 'address', null)).toEqual({ country: 'resultValue' });
  });
  //
  it('should return "" if field body empty', () => {
    const result = {
      weight: 794,
      name: 'address',
      body: '{}',
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
    expect(getFieldWithMaxWeight(wObject, 'address', 'country')).toEqual('');
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
    expect(getFieldWithMaxWeight(wObject, 'address', 'country')).toEqual('');
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
    expect(getFieldWithMaxWeight(wObject, 'name', null)).toEqual(result.body);
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
    expect(getFieldWithMaxWeight(wObject, 'Unsupported', null)).toEqual('');
  });
  it('should return "" if wObject not exist', () => {
    expect(getFieldWithMaxWeight(null, 'name', null)).toEqual('');
  });
  it('should return "" if fields not exist', () => {
    const wObject = {};
    expect(getFieldWithMaxWeight(wObject, 'name', null)).toEqual('');
  });
  it('should return "" if fields empty', () => {
    const wObject = { fields: [] };
    expect(getFieldWithMaxWeight(wObject, 'name', null)).toEqual('');
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
    expect(getFieldWithMaxWeight(wObject, 'name', null)).toEqual('');
  });
});
