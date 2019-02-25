/* eslint-disable */
import { objectFields } from './listOfFields';

export const objectNameValidationRegExp = /^[^!@#$%^&*(),.?":{}|<>]{0,100}$/;

export const websiteTitleRegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{0,100}$/;

export const objectURLValidationRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const phoneNameValidationRegExp = /^[^!@#$%^&*,.?":{}|<>]{0,100}$/;

export const emailValidationRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{0,100}$/;

export const ALLOWED_IMG_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
export const MAX_IMG_SIZE = {
  [objectFields.avatar]: 2097152,
  [objectFields.background]: 15728640,
};

export default null;
