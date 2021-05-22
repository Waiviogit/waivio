import { get } from 'lodash';
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
    .then(metadata => {
      updateUserMetadata(draft.author, {
        ...metadata,
        drafts: [...metadata.drafts.filter(d => d.draftId !== draft.draftId), draft],
      }).catch(e => e.message);

      return metadata.drafts.find(d => d.draftId === draft.draftId);
    })
    .then(newDraft => ({ ...newDraft, ...draft }));

export const deleteDraftMetadataObject = (draftId, userName, objPermlink) => {
  const getFilteredDrafts = metadata =>
    get(metadata, 'drafts', {}).map(draft => {
      if (draft.draftId === draftId) {
        return {
          ...draft,
          jsonMetadata: {
            ...draft.jsonMetadata,
            wobj: {
              ...draft.jsonMetadata.wobj,
              wobjects: draft.jsonMetadata.wobj.wobjects.map(item => {
                if (item.author_permlink === objPermlink) {
                  return {
                    ...item,
                    isNotLinked: true,
                  };
                }

                return item;
              }),
            },
          },
        };
      }

      return draft;
    });

  return getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        drafts: getFilteredDrafts(metadata),
      }),
    )
    .then(resp => resp.user_metadata.drafts);
};

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

export const saveNotificationsLastTimestamp = (lastTimestamp, userName) =>
  getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        notifications_last_timestamp: lastTimestamp,
      }),
    )
    .then(resp => resp.user_metadata.notifications_last_timestamp);

export const saveNotificationsSettings = (userNotifications, userName) =>
  getMetadata(userName)
    .then(metadata =>
      updateUserMetadata(userName, {
        ...metadata,
        settings: {
          ...metadata.settings,
          userNotifications: {
            ...metadata.settings.userNotifications,
            ...userNotifications,
          },
        },
      }),
    )
    .then(resp => resp.user_metadata);

export default getMetadata;
