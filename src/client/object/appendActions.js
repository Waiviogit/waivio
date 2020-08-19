import { createAsyncActionType } from '../helpers/stateHelpers';
import { getChangedField, postAppendWaivioObject } from '../../waivioApi/ApiClient';
import { followObject, voteObject } from './wobjActions';
import { getAuthenticatedUserName, getLocale, getVotePercent } from '../reducers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const APPEND_WAIVIO_OBJECT = createAsyncActionType('@append/APPEND_WAIVIO_OBJECT');

export const appendObject = (postData, { follow, isLike = true } = {}) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  const state = getState();
  const locale = getLocale(state);
  const voter = getAuthenticatedUserName(state);

  return new Promise((resolve, reject) =>
    postAppendWaivioObject(postData)
      .then(res => {
        if (!res.message) {
          if (postData.votePower !== null && isLike)
            dispatch(
              voteObject(res.author, res.permlink, postData.votePower || getVotePercent(state)),
            );
          if (follow) dispatch(followObject(postData.parentPermlink));

          busyAPI.sendAsync(subscribeMethod, [voter, res.block_num, subscribeTypes.posts]);
          busyAPI.subscribe((response, mess) => {
            if (
              subscribeTypes.posts === mess.type &&
              mess.notification.blockParsed === res.block_num
            ) {
              resolve(res);
              dispatch({
                type: APPEND_WAIVIO_OBJECT.ACTION,
                payload: {
                  promise: getChangedField(
                    res.parentPermlink,
                    postData.field.name,
                    res.author,
                    res.permlink,
                    locale,
                  ),
                },
              });
            }
          });
        }
      })
      .catch(e => reject(e)),
  );
};
