import _ from 'lodash';

export const accessTypesArr = ['is_extending_open', 'is_posting_open'];

export const haveAcess = (wobj, userName, accessType) =>
  wobj[accessType] ||
  (wobj.white_list && _.some(wobj.white_list, userInWL => userName === userInWL));
