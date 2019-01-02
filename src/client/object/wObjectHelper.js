import _ from 'lodash';
import { supportedObjectFields } from '../../../src/common/constants/listOfFields';

export const getFieldWithMaxWeight = (wObject, currentField, innerField) => {
  const field = supportedObjectFields.includes(currentField);
  if (!field) return '';

  const fieldValues = _.filter(wObject.fields, ['name', currentField]);
  if (!fieldValues) return '';

  const orderedValues = _.orderBy(fieldValues, ['weight'], ['desc']);
  if (!orderedValues.length) return '';

  let value = '';

  _.forEach(orderedValues, fld => {
    try {
      const parsed = JSON.parse(fld.body);
      value = parsed[innerField];
      return false;
    } catch (e) {
      value = fld.body;
      return false;
    }
  });

  return value || '';
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

export const truncate = str => (str && str.length > 255 ? `${str.substring(0, 255)}...` : str);
