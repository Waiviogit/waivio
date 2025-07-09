/* eslint-disable */
import { objectFields } from './listOfFields';

export const objectNameValidationRegExp = /^[^!@#$%^&*(),.?":{}|<>]{0,100}$/;

export const blogNameValidationRegExp = /^[^!@#$%^&*(),.?":{}|<>]{0,17}$/;

export const websiteTitleRegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._ -]{0,100}$/;

// export const objectURLValidationRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
export const objectURLValidationRegExp = /.*/;

export const phoneNameValidationRegExp = /^[^!@#$%^&*,?":{}|<>]{0,100}$/;

export const emailValidationRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{0,100}$/;

export const wordsWithSpaceRegExp = /^([\w-_.,:!?]+ )*([\w-_.,:?!]+)?$/;

export const matchAllButNumberRegExp = /[^.\d]+/g;

export const regOrigin = new RegExp(/(https:\/\/|http:\/\/|www\.)/g);

export const regReferer = new RegExp(/(https:\/\/|http:\/\/|www\.|\/.+$|\/)/g);

export const ALLOWED_IMG_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'];
export const MAX_IMG_SIZE = {
  [objectFields.avatar]: 2097152,
  [objectFields.background]: 31457280,
};

export default null;
