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
  getMetadata(draft.author)
    .then(metadata =>
      updateUserMetadata(draft.author, {
        ...metadata,
        drafts: [...metadata.drafts.filter(d => d.draftId !== draft.draftId), draft],
      }).catch(e => e.message),
    )
    .then(() => draft);

export const deleteDraftMetadata = (draftIds, userName) =>
  getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        drafts: metadata.drafts.filter(d => !draftIds.includes(d.draftId)),
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
