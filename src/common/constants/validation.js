/* eslint-disable */
import { objectFields } from './listOfFields';

const objectNameValidationRegExp = /^[^\/&?%]{0,100}$/;

export const ALLOWED_IMG_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
export const MAX_IMG_SIZE = {
  [objectFields.avatar]: 2097152,
  [objectFields.background]: 15728640,
};

export default objectNameValidationRegExp;
