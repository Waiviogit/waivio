import _ from 'lodash';
import { supportedObjectFields } from '../../../src/common/constants/listOfFields';
import { WAIVIO_META_FIELD_NAME } from '../../common/constants/waivio';

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

export const hasActionType = (post, actionType) => {
  const parsedMetadata = JSON.parse(post.json_metadata);
  const objActionType =
    parsedMetadata[WAIVIO_META_FIELD_NAME] && parsedMetadata[WAIVIO_META_FIELD_NAME].action;
  return objActionType === actionType;
};
