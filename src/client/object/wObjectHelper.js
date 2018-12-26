import _ from 'lodash';
import { supportedObjectFields } from '../../../src/common/constants/listOfFields';

export const getFieldWithMaxWeight = (wObject, currentField, fieldName) => {
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
      value = parsed[fieldName];
      return false;
    } catch (e) {
      value = fld.body;
      return false;
    }
  });

  return value;
};

export const getField = (wObject, currentField, fieldName) => {
  const wo = _.find(wObject.fields, ['name', currentField]);

  if (!wo) return '';

  let pre = null;

  try {
    pre = JSON.parse(wo.body);
  } catch (e) {
    //
  }
  return pre ? pre[fieldName] : wo.body;
};
