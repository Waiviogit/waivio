import _ from 'lodash';
import { getField } from '../objects/WaivioObject';

export const accessTypesArr = ['is_extending_open', 'is_posting_open'];

export const haveAccess = (wobj, userName, accessType) =>
  wobj[accessType] ||
  !!(wobj.white_list && _.some(wobj.white_list, userInWL => userName === userInWL));

export const generateRandomString = stringLength => {
  let randomString = '';
  let randomAscii;
  const asciiLow = 65;
  const asciiHigh = 90;
  for (let i = 0; i < stringLength; i += 1) {
    randomAscii = Math.floor(Math.random() * (asciiHigh - asciiLow) + asciiLow);
    randomString += String.fromCharCode(randomAscii);
  }
  return randomString;
};

export const prepareAlbumData = (form, currentUsername, wObject) => {
  const data = {};
  data.author = currentUsername;
  data.parentAuthor = wObject.author;
  data.parentPermlink = wObject.author_permlink;
  data.body = `@${data.author} created a new album: ${form.galleryAlbum}.`;
  data.title = '';

  data.field = {
    name: 'galleryAlbum',
    body: form.galleryAlbum,
    locale: 'en-US',
  };

  data.permlink = `${data.author}-${Math.random()
    .toString(36)
    .substring(2)}`;
  data.lastUpdated = Date.now();

  data.wobjectName = getField(wObject, 'name');
  return data;
};
