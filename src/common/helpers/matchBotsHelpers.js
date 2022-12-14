import { get } from 'lodash';
import moment from 'moment';

export const MATCH_BOTS_TYPES = {
  AUTHORS: 'waivioauthors',
  CURATORS: 'waiviocurators',
  SPONSORS: 'waiviocampaigns',
  IMPORT: 'waivio.import',
};

export const MATCH_BOTS_NAMES = {
  AUTHORS: 'author',
  CURATORS: 'curator',
};

export const INITIAL_INPUTS_VALUE = {
  selectedUser: null,
  voteValue: 100,
  manaValue: 75,
  expiredAt: null,
  notesValue: '',
  isSubmitted: false,
  minVotingPowerCurrencies: ['WAIV'],
};

export const INITIAL_INPUTS_VALUE_CURATOR = {
  voteRatio: 100,
  manaValue: 75,
  notesValue: '',
  isDownvote: false,
  isComments: false,
  expiredAt: null,
  isSubmitted: false,
  selectedUser: null,
};

export const redirectAuthHiveSigner = (isAuthority, botType) => {
  const path = window.location.href;

  !isAuthority
    ? (window.location = `https://hivesigner.com/authorize/${botType}?redirect_uri=${path}&callback`)
    : (window.location = `https://hivesigner.com/revoke/${botType}?redirect_uri=${path}&callback`);
};

export const getBotObjAuthor = (botData, isEdit) => {
  const dataObj = {
    type: MATCH_BOTS_NAMES.AUTHORS,
    name: get(botData, 'selectedUser.account', ''),
    enabled: !isEdit || botData.enabled,
    voteWeight: botData.voteValue * 100,
    minVotingPower: botData.manaValue * 100,
    minVotingPowerCurrencies: botData.minVotingPowerCurrencies,
  };

  if (botData.notesValue) dataObj.note = botData.notesValue;
  if (botData.expiredAt) dataObj.expiredAt = botData.expiredAt && botData.expiredAt.format();
  if (dataObj.type && dataObj.name && dataObj.voteWeight && dataObj.minVotingPower) {
    return dataObj;
  }

  return {};
};

export const getBotObjCurator = (botData, isEdit) => {
  const dataObj = {
    type: MATCH_BOTS_NAMES.CURATORS,
    enabled: !isEdit || botData.enabled,
    voteComments: botData.isComments,
    voteRatio: botData.voteRatio / 100,
    enablePowerDown: botData.isDownvote,
    minVotingPower: botData.manaValue * 100,
    name: get(botData, 'selectedUser.account', ''),
    minVotingPowerCurrencies: botData.minVotingPowerCurrencies,
  };

  if (botData.notesValue) dataObj.note = botData.notesValue;
  if (botData.expiredAt) dataObj.expiredAt = botData.expiredAt && botData.expiredAt.format();
  if (dataObj.type && dataObj.name && dataObj.voteRatio && dataObj.minVotingPower) {
    return dataObj;
  }

  return {};
};

export const setInitialInputValues = value => {
  const initialState = {
    selectedUser: { account: value.name },
    manaValue: value.minVotingPower / 100,
    enabled: value.enabled,
    notesValue: value.note || '',
    isSubmitted: false,
    minVotingPowerCurrencies: ['WAIV'],
  };

  if (value.voteWeight) initialState.voteValue = value.voteWeight / 100;
  if (value.voteComments) initialState.isComments = value.voteComments;
  if (value.enablePowerDown) initialState.isDownvote = value.enablePowerDown;
  if (value.voteRatio) initialState.voteRatio = value.voteRatio * 100;
  if (value.expiredAt) initialState.expiredAt = moment(value.expiredAt);

  return initialState;
};
