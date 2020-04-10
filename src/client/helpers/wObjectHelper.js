import _ from 'lodash';
import { objectFields } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getAppendDownvotes, getAppendUpvotes } from './voteHelpers';

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

export const generatePermlink = () =>
  Math.random()
    .toString(36)
    .substring(2);

export const getField = (item, field) => {
  const wo = _.find(item.fields, ['name', field]);
  return wo ? wo.body : null;
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

export const hasType = (wobj, type) =>
  Boolean(wobj && wobj.object_type && wobj.object_type.toLowerCase() === type.toLowerCase());

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export const getAppendData = (creator, wObj, bodyMsg, fieldContent) => {
  const { author, author_permlink } = wObj;
  let body = bodyMsg;
  if (!body) {
    const langReadable = _.filter(LANGUAGES, {
      id: fieldContent.locale === 'auto' ? 'en-US' : fieldContent.locale,
    })[0].name;
    body = `@${creator} added ${fieldContent.name} (${langReadable}):\n ${fieldContent.body.replace(
      /[{}"]/g,
      '',
    )}`;
  }
  return {
    author: creator,
    parentAuthor: author,
    parentPermlink: author_permlink,
    body,
    title: '',
    field: fieldContent,
    permlink: `${creator}-${generatePermlink()}`,
    lastUpdated: Date.now(),
    wobjectName: getField(wObj, objectFields.name),
  };
};

export const calculateApprovePercent = votes => {
  if (!_.isEmpty(votes)) {
    if (getAppendDownvotes(votes).length && !getAppendUpvotes(votes).length) {
      return 0;
    }

    const summRshares = votes.reduce((acc, vote) => acc + Math.abs(vote.rshares_weight), 0);
    const approveRshares = getAppendUpvotes(votes).reduce(
      (acc, vote) => acc + vote.rshares_weight,
      0,
    );
    const rejectRshares = getAppendDownvotes(votes).reduce(
      (acc, vote) => acc + Math.abs(vote.rshares_weight),
      0,
    );

    if (rejectRshares) {
      return summRshares ? (approveRshares * 100) / summRshares : 0;
    }

    return 100;
  }

  return 100;
};

export const getApprovedField = (wobj, name) => {
  if (!wobj || !wobj.fields || !name) return null;

  let field = _.get(wobj, 'fields').filter(
    item => item.name === name && calculateApprovePercent(item.active_votes) >= 70,
  );

  if (!field.length) return null;

  field = field.sort((a, b) => b.weight - a.weight)[0];

  if (name === 'name') {
    return field.body;
  }
  return JSON.parse(field.body);
};

/* eslint-enable no-underscore-dangle */
/* eslint-enable camelcase */
