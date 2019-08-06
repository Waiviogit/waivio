import { omit } from 'lodash';
import SteemConnect from '../steemConnectAPI';
import { getAuthenticatedUserMetadata, updateUserMetadata } from '../../waivioApi/ApiClient';

const getMetadata = userName => getAuthenticatedUserMetadata(userName);

export const saveSettingsMetadata = (userName, settings) =>
  getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        settings: {
          ...metadata.settings,
          ...settings,
        },
      }),
    )
    .then(resp => resp.user_metadata.settings);

export const setLocaleMetadata = locale =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        locale,
      }),
    )
    .then(resp => resp.user_metadata.locale);

export const addDraftMetadata = draft =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        drafts: {
          ...metadata.drafts,
          [draft.id]: draft.postData,
        },
      }),
    )
    .then(resp => resp.user_metadata.drafts[draft.id]);

export const deleteDraftMetadata = draftIds =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        drafts: omit(metadata.drafts, draftIds),
      }),
    )
    .then(resp => resp.user_metadata.drafts);

const getUpdatedBookmarks = (bookmarks, postId) =>
  bookmarks.includes(postId) ? bookmarks.filter(b => b !== postId) : [...bookmarks, postId];
export const toggleBookmarkMetadata = (userName, postId) =>
  getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        bookmarks: getUpdatedBookmarks(metadata.bookmarks, postId),
      }),
    )
    .then(resp => resp.user_metadata.bookmarks);

export const saveNotificationsLastTimestamp = lastTimestamp =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        notifications_last_timestamp: lastTimestamp,
      }),
    )
    .then(resp => resp.user_metadata.notifications_last_timestamp);

export default getMetadata;
