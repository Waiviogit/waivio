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

const generatePermlink = () =>
  Math.random()
    .toString(36)
    .substring(2);

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
    id: generatePermlink(),
  };

  data.permlink = `${data.author}-${generatePermlink()}`;
  data.lastUpdated = Date.now();

  data.wobjectName = getField(wObject, 'name');
  return data;
};

export const prepareAlbumToStore = data => ({
  locale: data.field.locale,
  creator: data.author,
  permlink: data.permlink,
  name: data.field.name,
  body: data.field.body,
  weight: 1,
  active_votes: [],
  items: [],
  id: data.field.id,
});

export const prepareImageToStore = postData => ({
  weight: 1,
  locale: postData.field.locale,
  creator: postData.author,
  permlink: postData.permlink,
  name: postData.field.name,
  body: postData.field.body,
  active_votes: [],
});
