import { get, some, find, filter, isEmpty } from 'lodash';
import { objectFields } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getAppendDownvotes, getAppendUpvotes } from './voteHelpers';
import { mainerName } from '../object/wObjectHelper';

export const accessTypesArr = ['is_extending_open', 'is_posting_open'];

export const haveAccess = (wobj, userName, accessType) =>
  wobj[accessType] ||
  !!(wobj.white_list && some(wobj.white_list, userInWL => userName === userInWL));

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
  const wo = find(item.fields, ['name', field]);
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
    const langReadable = filter(LANGUAGES, {
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

export const calculateApprovePercent = (votes, weight, wobj = {}) => {
  if (weight < 0) return 0;

  const approves = getAppendUpvotes(votes);
  const rejects = getAppendDownvotes(votes);

  if (!isEmpty(votes)) {
    if (rejects.length && !approves.length) return 0;

    const mainer = mainerName(votes, wobj.moderators, wobj.admins);

    if (mainer) return mainer.status === 'approved' ? 100 : 0;

    const summRshares = votes.reduce((acc, vote) => acc + Math.abs(vote.rshares_weight), 0);

    if (summRshares < 0) return 0;

    const approveRshares = approves.reduce((acc, vote) => acc + vote.rshares_weight, 0);
    const rejectRshares = rejects.reduce((acc, vote) => acc + Math.abs(vote.rshares_weight), 0);

    if (rejectRshares) return summRshares ? (approveRshares * 100) / summRshares : 0;

    return 100;
  }

  return 100;
};

export const addActiveVotesInField = (wobj, field, category = '') => {
  const fieldsArray = get(wobj, 'fields', []);
  let matchField = fieldsArray.find(
    wobjField =>
      wobjField.body === field.id ||
      wobjField.permlink === field.permlink ||
      wobjField.body === field.name ||
      wobjField.body === field.body ||
      wobjField.body === field.author_permlink,
  );

  if (category) {
    matchField = fieldsArray.find(
      wobjField => wobjField.body === field.name && wobjField.id === category,
    );
  }
  const activeVotes = matchField ? matchField.active_votes : [];
  const weight = matchField ? matchField.weight : 0;

  return {
    ...field,
    active_votes: [...activeVotes],
    weight,
  };
};

export const getApprovedField = (wobj, fieldName, locale = 'en-US') => {
  const stringBodyFields = ['name', 'parent', 'avatar', 'description', 'background'];
  const localeIndependentFields = ['status', 'map', 'avatar'];

  if (!wobj || !wobj.fields || !fieldName) return null;

  let approvedField = get(wobj, 'fields').filter(field => {
    let mapedField = field;

    if (!field.active_votes || field.active_votes.length) {
      mapedField = addActiveVotesInField(wobj, field);
    }

    return (
      mapedField.name === fieldName &&
      calculateApprovePercent(mapedField.active_votes, mapedField.weight, wobj) >= 70 &&
      (localeIndependentFields.includes(fieldName) || mapedField.locale === locale)
    );
  });

  if (!approvedField.length) return null;

  const approveByMainer = approvedField.filter(field => {
    const mainer = mainerName(field.active_votes, wobj.moderators, wobj.admins);

    return mainer && mainer.status === 'approved';
  });

  if (approveByMainer.length) {
    approvedField = approveByMainer[0].created
      ? approveByMainer[0]
      : approveByMainer[approveByMainer.length - 1];
  } else {
    approvedField = approvedField.sort((a, b) => b.weight - a.weight)[0];
  }

  if (stringBodyFields.includes(fieldName)) {
    return approvedField.body;
  }

  return JSON.parse(approvedField.body);
};

export const parseWobjectField = (wobject, fieldName) => {
  if (isEmpty(wobject) || !fieldName) return null;

  const wobjFields = get(wobject, fieldName);

  if (typeof wobjFields !== 'string') return null;

  try {
    return JSON.parse(wobjFields);
  } catch (err) {
    return null;
  }
};
