import moment from 'moment';
import { get } from 'lodash';

export const MATCH_BOTS_TYPES = {
  AUTHORS: 'waivioauthors',
  CURATORS: 'waiviocurators',
  SPONSORS: 'waiviocampaigns',
};

export const MATCH_BOTS_NAMES = {
  AUTHORS: 'author',
  CURATORS: 'curator',
};

export const INITIAL_INPUTS_VALUE = {
  selectedUser: null,
  voteValue: 100,
  manaValue: 100,
  expiredDate: null,
  notesValue: '',
  isSubmitted: false,
};

export const INITIAL_INPUTS_VALUE_CURATOR = {
  voteRatio: 100,
  manaValue: 100,
  notesValue: '',
  isDownvote: true,
  isComment: true,
  expiredDate: null,
  isSubmitted: false,
  selectedUser: null,
};

export const redirectAuthHiveSigner = (isAuthority, botType) => {
  const path = window.location.href;

  !isAuthority
    ? (window.location = `https://hivesigner.com/authorize/${botType}?redirect_uri=${path}&callback`)
    : (window.location = `https://hivesigner.com/revoke/${botType}?redirect_uri=${path}&callback`);
};

export const getBotObjAuthor = botData => {
  const dataObj = {
    type: 'author',
    name: get(botData, 'selectedUser.account', ''),
    enabled: true,
    voteWeight: botData.voteValue * 100,
    minVotingPower: botData.manaValue * 100,
    note: botData.notesValue,
    expiredAt: botData.expiredDate && botData.expiredDate.format(),
  };

  if (
    dataObj.type &&
    dataObj.name &&
    dataObj.enabled &&
    dataObj.voteWeight &&
    dataObj.minVotingPower
  ) {
    return dataObj;
  }

  return {};
};

export const getBotObjCurator = botData => {
  const dataObj = {
    type: 'curator',
    enabled: true,
    note: botData.notesValue,
    voteComments: botData.isComment,
    voteRatio: botData.voteRatio / 100,
    enablePowerDown: botData.isDownvote,
    minVotingPower: botData.manaValue * 100,
    expiredAt: botData.expiredDate && botData.expiredDate.format(),
    name: get(botData, 'selectedUser.account', ''),
  };

  if (
    dataObj.type &&
    dataObj.name &&
    dataObj.enabled &&
    dataObj.voteRatio &&
    dataObj.minVotingPower
  ) {
    return dataObj;
  }

  return {};
};

export const setInitialInputValues = value => {
  const initialState = {
    selectedUser: { account: value.name },
    manaValue: value.minVotingPower / 100,
    expiredDate: moment(value.expiredAt),
    notesValue: value.note || '',
    isSubmitted: false,
  };

  if (value.voteWeight) initialState.voteValue = value.voteWeight / 100;
  if (value.voteComments) initialState.isComments = value.voteComments;
  if (value.enablePowerDown) initialState.isDownvote = value.enablePowerDown;
  if (value.voteRatio) initialState.voteRatio = value.voteRatio * 100;

  return initialState;
};
