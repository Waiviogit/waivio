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
    expiredAt: botData.expiredDate.format(),
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

export const setInitialInputValues = value => ({
  selectedUser: { account: value.name },
  voteValue: value.voteWeight / 100,
  manaValue: value.minVotingPower / 100,
  expiredDate: moment(value.expiredAt),
  notesValue: value.note || '',
  isSubmitted: false,
});
