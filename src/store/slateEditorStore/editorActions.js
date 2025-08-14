/* eslint-disable arrow-body-style */
import { batch } from 'react-redux';
import { message } from 'antd';
import assert from 'assert';
import Cookie from 'js-cookie';
import { push } from 'connected-react-router';
import { convertToRaw } from 'draft-js';
import {
  forEach,
  get,
  includes,
  isEmpty,
  isEqual,
  kebabCase,
  map,
  orderBy,
  uniqBy,
  uniqWith,
  size,
  isNil,
} from 'lodash';
import { Transforms } from 'slate';
import { createAction } from 'redux-actions';
import { rewardsPost, createBody } from '../../client/newRewards/ManageCampaingsTab/constants';
import { generateGiveawayMarkdown } from '../../client/rewards/rewardsHelper';
import { REFERRAL_PERCENT } from '../../common/helpers/constants';
import { jsonParse } from '../../common/helpers/formatter';
import { rewardsValues } from '../../common/constants/rewards';
import { createPermlink } from '../../client/vendor/steemitHelpers';
import * as apiConfig from '../../waivioApi/config.json';
import {
  safeDraftAction,
  deleteDraft,
  deleteCampaignIdFromDraft,
  getDraftsList,
} from '../draftsStore/draftsActions';
import {
  getCurrentDraftSelector,
  getLinkedObjects,
  getObjectPercentageSelector,
  getCurrentCampaignSelector,
  getDraftPostsSelector,
} from '../draftsStore/draftsSelectors';
import { deactivateCampaing } from '../newRewards/newRewardsActions';
import { saveSettings } from '../settingsStore/settingsActions';
import { notify } from '../../client/app/Notification/notificationActions';
import { clearBeneficiariesUsers } from '../searchStore/searchActions';
import { getCurrentHost, getTranslationByKey, getCurrentCurrency } from '../appStore/appSelectors';
import { getAuthenticatedUser, getAuthenticatedUserName } from '../authStore/authSelectors';
import { getHiveBeneficiaryAccount, getLocale } from '../settingsStore/settingsSelectors';
import {
  getCampaign,
  getMentionCampaign,
  getObjectInfo,
  getObjectsByIds,
  getObjPermlinkByCompanyId,
  createNewCampaing,
  validateActivateCampaing,
} from '../../waivioApi/ApiClient';
import {
  getCurrentLinkPermlink,
  getCurrentLoadObjects,
  getNewLinkedObjectsCards,
  checkCursorInSearchSlate,
} from '../../common/helpers/editorHelper';
import {
  getEditor,
  getEditorExtended,
  getEditorLinkedObjects,
  getEditorLinkedObjectsCards,
  getEditorSlate,
  getLastSelection,
} from './editorSelectors';
import {
  getAppendData,
  getObjectName,
  getObjectType,
  generatePermlink,
} from '../../common/helpers/wObjectHelper';
import { createPostMetadata, getObjectLink } from '../../common/helpers/postHelpers';
import { Entity } from '../../client/components/EditorExtended';
import { extractLinks } from '../../common/helpers/parser';
import objectTypes from '../../client/object/const/objectTypes';
import { insertObject } from '../../client/components/EditorExtended/util/SlateEditor/utils/common';
import { setGuestMana } from '../usersStore/usersActions';
import { createWaivioObject } from '../wObjectStore/wobjectsActions';
import { appendObject } from '../appendStore/appendActions';
import { objectFields } from '../../common/constants/listOfFields';
import { importData, prepareObjects } from '../../client/websites/MapObjectImport/importHelper';

export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const ADD_EDITED_POST = '@editor/ADD_EDITED_POST';
export const addEditedPost = createAction(ADD_EDITED_POST);

export const UPLOAD_IMG_START = '@editor/UPLOAD_IMG_START';
export const UPLOAD_IMG_FINISH = '@editor/UPLOAD_IMG_FINISH';
export const SET_EDITOR_STATE = '@editor/SET_EDITOR_STATE';

export const SET_CLEAR_STATE = '@editor/SET_CLEAR_STATE';
export const LEAVE_EDITOR = '@editor/LEAVE_EDITOR';
export const SET_IS_SHOW_EDITOR_SEARCH = '@editor/SET_IS_SHOW_EDITOR_SEARCH';
export const SET_SEARCH_COORDINATES = '@editor/SET_CURSOR_COORDINATES';
export const SET_EDITOR_EXTENDED_STATE = '@editor/SET_EDITOR_EXTENDED_STATE';
export const SET_EDITOR_SEARCH_VALUE = '@editor/SET_EDITOR_SEARCH_VALUE';
export const CLEAR_EDITOR_SEARCH_OBJECTS = '@editor/CLEAR_EDITOR_SEARCH_OBJECTS';
export const SET_EDITOR = '@editor/SET_EDITOR';
export const SET_IMPORT_OBJECT = '@editor/SET_IMPORT_OBJECT';

export const setEditorState = payload => ({ type: SET_EDITOR_STATE, payload });
export const setClearState = () => ({ type: SET_CLEAR_STATE });
export const leaveEditor = () => ({ type: LEAVE_EDITOR });
export const setShowEditorSearch = payload => ({ type: SET_IS_SHOW_EDITOR_SEARCH, payload });
export const setCursorCoordinates = payload => ({ type: SET_SEARCH_COORDINATES, payload });
export const setEditorExtendedState = payload => ({ type: SET_EDITOR_EXTENDED_STATE, payload });
export const setEditorSearchValue = payload => ({ type: SET_EDITOR_SEARCH_VALUE, payload });
export const clearEditorSearchObjects = () => ({ type: CLEAR_EDITOR_SEARCH_OBJECTS });
export const setEditor = payload => ({ type: SET_EDITOR, payload });

export const editPost = (
  {
    id,
    author,
    permlink,
    title,
    body,
    json_metadata,
    parent_author,
    parent_permlink,
    reward,
    giveaway,
  }, // eslint-disable-line
) => (dispatch, getState) => {
  const draftList = getDraftPostsSelector(getState());
  const jsonMetadata = jsonParse(json_metadata);
  const draft = {
    author,
    body,
    draftId: id,
    isUpdating: true,
    jsonMetadata: {
      ...jsonMetadata,
      ...(giveaway
        ? {
            giveaway: true,
          }
        : {}),
    },
    lastUpdated: Date.now(),
    originalBody: body,
    parentAuthor: parent_author,
    parentPermlink: parent_permlink,
    permlink,
    reward,
    title,
  };

  if (isEmpty(draftList)) {
    return dispatch(getDraftsList()).then(() => {
      return dispatch(safeDraftAction(id, draft, { isEdit: true }));
    });
  }

  return dispatch(safeDraftAction(id, draft, { isEdit: true }));
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

const buildCommentOp = (
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  title,
  body,
  jsonMetadata,
) => [
  'comment',
  {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author,
    permlink,
    title,
    body,
    json_metadata: JSON.stringify(jsonMetadata),
  },
];

const buildCommentOptions = (
  author,
  permlink,
  reward,
  beneficiaries,
  isGuest,
  hiveBeneficiaryAccount,
) => {
  const guestHivePresent = hiveBeneficiaryAccount && isGuest ? 5000 : 0;
  const config = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: reward === rewardsValues.none ? '0.000 HBD' : '1000000.000 HBD',
    // eslint-disable-next-line no-nested-ternary
    percent_hbd: reward === rewardsValues.all ? 0 : isGuest ? guestHivePresent : 10000,
    extensions: [],
  };

  if (beneficiaries.length > 0) {
    config.extensions.push([0, { beneficiaries }]);
  }

  return ['comment_options', config];
};

const buildVoteOp = (author, permlink) => [
  'vote',
  {
    voter: author,
    author,
    permlink,
    weight: 10000,
  },
];

const mergeBeneficiaries = beneficiaries => {
  const beneficiariesMap = {};

  beneficiaries.forEach(({ account, weight }) => {
    if (beneficiariesMap[account]) {
      beneficiariesMap[account] += weight;
    } else {
      beneficiariesMap[account] = weight;
    }
  });

  return Object.entries(beneficiariesMap).map(([account, weight]) => ({ account, weight }));
};

const broadcastComment = (
  steemConnectAPI,
  isUpdating,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  permlink,
  referral,
  authUsername,
  beneficiaries,
  isReview,
  isGuest,
  hiveBeneficiaryAccount,
  upvote,
) => {
  const operations = [
    buildCommentOp(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata),
  ];

  if (isUpdating) return steemConnectAPI.broadcast(operations);

  if (referral && referral !== authUsername) {
    beneficiaries.push({ account: referral, weight: REFERRAL_PERCENT });
  }

  const mergedBeneficiaries = mergeBeneficiaries(beneficiaries);

  operations.push(
    buildCommentOptions(
      author,
      permlink,
      reward,
      mergedBeneficiaries,
      isGuest,
      hiveBeneficiaryAccount,
    ),
  );

  if (upvote) operations.push(buildVoteOp(author, permlink));

  return steemConnectAPI.broadcast(operations, isReview);
};

export const createGiveawayCamp = async (permlink, title, giveawayData, steemConnectAPI) => {
  if (giveawayData) {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const k = {
      guideName: giveawayData.guideName,
      giveawayPostTitle: title,
      requiredObject: `@${giveawayData.guideName}`,
      objects: [`@${giveawayData.guideName}`],
      name: giveawayData.name,
      type: 'giveaways',
      budget: giveawayData.reward * giveawayData.winners,
      reward: Number(giveawayData.reward),
      countReservationDays: 1,
      commissionAgreement:
        typeof giveawayData?.commission === 'number'
          ? giveawayData?.commission / 100
          : giveawayData?.commission?.replace('%', '') / 100,
      ...(giveawayData.giveawayRequirements
        ? {
            giveawayRequirements: giveawayData.giveawayRequirements.reduce(
              (acc, curr) => {
                acc[curr] = true;

                return acc;
              },
              {
                follow: false,
                likePost: false,
                comment: false,
                tagInComment: false,
                reblog: false,
              },
            ),
          }
        : {}),
      requirements: {
        minPhotos: 0,
        receiptPhoto: true,
      },
      userRequirements: {
        minPosts: Number(giveawayData.minPosts) || 0,
        minFollowers: Number(giveawayData.minFollowers) || 0,
        minExpertise: Number(giveawayData.minExpertise) || 0,
      },
      frequencyAssign: 0,
      app: appName,
      expiredAt: giveawayData.expiredAt,
      currency: giveawayData.currency,
      timezone: giveawayData.timezone,
      payoutToken: 'WAIV',
      qualifiedPayoutToken: true,
      reach: 'global',
      giveawayPermlink: permlink,
    };

    try {
      const campaign = await createNewCampaing(k, giveawayData.guideName);

      if (campaign._id) {
        const resp = await validateActivateCampaing({
          _id: campaign._id,
          guideName: campaign.guideName,
          permlink,
        });

        if (resp.isValid) {
          const activationPermlink = `activate-${rewardsPost.parent_author.replace(
            '.',
            '-',
          )}-${generatePermlink()}`;

          const commentOp = [
            'comment',
            {
              ...rewardsPost,
              author: campaign.guideName,
              permlink: activationPermlink,
              title: `Activate giveaways campaign`,
              body: createBody(campaign),
              json_metadata: JSON.stringify({
                waivioRewards: { type: 'activateCampaign', campaignId: campaign._id },
              }),
            },
          ];

          steemConnectAPI.broadcast([commentOp]);

          return activationPermlink;
        }
        if (resp.message) {
          message.error(resp.message);
        }

        return '';
      }
      console.error(campaign);
      if (campaign?.message) message.error(campaign?.message);
    } catch (e) {
      message.error(e?.message);

      console.error(e);
    }
  }

  return '';
};

export function createPost(postData, beneficiaries, isReview, campaign, giveawayData) {
  requiredFields.forEach(field => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return async (dispatch, getState, { steemConnectAPI }) => {
    const state = getState();
    const authUser = state.auth.user;
    const isGuest = state.auth.isGuestUser;
    const hiveBeneficiaryAccount = getHiveBeneficiaryAccount(state);
    const locale = getLocale(state);
    const follower = getAuthenticatedUserName(state);
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      reward,
      upvote,
      draftId,
      isUpdating,
      jsonMetadata,
    } = postData;

    let newBody =
      isReview && campaign
        ? `${body}\n***\n<center>This review was sponsored in part by [@${campaign.guideName}](/@${campaign.guideName})</center>\n\n`
        : body;

    if (giveawayData) {
      const curr = getCurrentCurrency(state);

      newBody = `${body}${generateGiveawayMarkdown(giveawayData, curr?.type)}`;
    }

    const url = getCurrentHost(state);
    const match = url?.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+).*$/);
    const host = match?.[1] || location?.hostname;

    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink, locale, follower);

    const account = hiveBeneficiaryAccount || 'waivio.hpower';
    const baseWeight = 10000 - beneficiaries.reduce((acc, val) => acc + val.weight, 0);
    const allBeneficiaries = isGuest
      ? [{ account, weight: baseWeight }, ...beneficiaries]
      : beneficiaries;

    let referral;
    const refCookie = Cookie.get('referral');

    if (refCookie) {
      const daysOld =
        (Date.now() - new Date(`${authUser.created}Z`).getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld < 30) referral = refCookie;
    }
    const reservation_permlink = get(campaign, 'reservation_permlink');
    const permlink = await getPermLink;
    const campaignActivationPermlink = await createGiveawayCamp(
      permlink,
      title,
      giveawayData,
      steemConnectAPI,
    );

    const metaData = {
      ...jsonMetadata,
      ...(reservation_permlink
        ? {
            reservation_permlink,
          }
        : {}),
      ...(campaignActivationPermlink ? { campaignActivationPermlink } : {}),
      ...(isReview && campaign ? { campaignId: campaign._id } : {}),
      ...(isUpdating ? {} : { host }),
    };

    dispatch(saveSettings({ upvoteSetting: upvote, rewardSetting: reward }));
    dispatch({ type: CREATE_POST_START });

    await new Promise(resolve => setTimeout(resolve, 4000));

    const result = await broadcastComment(
      steemConnectAPI,
      isUpdating,
      parentAuthor,
      parentPermlink,
      author,
      title,
      newBody,
      metaData,
      reward,
      permlink,
      referral,
      authUser.name,
      orderBy(mergeBeneficiaries(allBeneficiaries), ['account'], ['asc']),
      isReview,
      isGuest,
      hiveBeneficiaryAccount,
      !isUpdating && !isGuest && upvote,
    ).catch(err => {
      const errorMsg = err.error?.message || err.error_description || 'Error';

      dispatch({ type: CREATE_POST_ERROR, payload: err });
      dispatch(notify(errorMsg, 'error'));

      if (campaignActivationPermlink)
        setTimeout(
          () =>
            dispatch(
              deactivateCampaing(
                { ...campaign, activationPermlink: campaignActivationPermlink },
                authUser.name,
              ),
            ),
          3000,
        );

      return null;
    });

    if (!result) return;

    const { status, ok, result: res } = result;
    const r = isGuest ? await result.json() : res;

    if ([422, 403].includes(status)) {
      if (status !== 403) message.error('Something went wrong.');
      dispatch({ type: CREATE_POST_ERROR });

      return;
    }

    if (status === 429) {
      if (isGuest) {
        const guestMana = await dispatch(setGuestMana(authUser.name));

        if (r.error.message) {
          message.error(r.error.message);
        } else if (guestMana.payload < 10) {
          message.error('Guest mana is too low. Please wait for recovery.');
        } else {
          dispatch(notify(`Too many comments from ${authUser.name} in queue`, 'error'));
        }
      } else {
        dispatch(notify(`Too many comments from ${authUser.name} in queue`, 'error'));
      }
      dispatch({ type: CREATE_POST_ERROR });

      return;
    }

    const isResultSuccess = ok || res?.id;

    if (draftId) {
      batch(() => {
        if (isResultSuccess) dispatch(deleteDraft([draftId]));
        dispatch(addEditedPost(permlink));
      });
    }

    const notifySuccess = () => {
      const publicMessage = getTranslationByKey('post_publication')(state);

      dispatch(push(`/@${author}`));
      isGuest ? dispatch(notify(publicMessage, 'success')) : message.success(publicMessage);
    };

    if (isGuest && upvote) {
      steemConnectAPI.vote(authUser.name, authUser.name, permlink, 10000);
    }

    setTimeout(notifySuccess, isGuest ? 5000 : 3000);
    dispatch(clearBeneficiariesUsers());
  };
}

export const SET_UPDATED_EDITOR_DATA = '@editor/SET_UPDATED_EDITOR_DATA';
export const SET_LINKED_OBJ = '@draftsStore/SET_LINKED_OBJ';
export const SET_LINKED_OBJS = '@draftsStore/SET_LINKED_OBJS';
export const SET_CAMPAIGN_LINKED_OBJS = '@draftsStore/SET_CAMPAIGN_LINKED_OBJS';
export const SET_UPDATED_EDITOR_EXTENDED_DATA = '@editor/SET_UPDATED_EDITOR_EXTENDED_DATA';
export const setUpdatedEditorData = payload => ({ type: SET_UPDATED_EDITOR_DATA, payload });
export const setLinkedObj = payload => ({ type: SET_LINKED_OBJ, payload });
export const setLinkedObjs = payload => ({ type: SET_LINKED_OBJS, payload });
export const setCampaignLinkedObjs = payload => ({ type: SET_CAMPAIGN_LINKED_OBJS, payload });

export const SET_CAMPAIGN = '@draftsStore/SET_CAMPAIGN';

export const setCampaign = payload => ({ type: SET_CAMPAIGN, payload });

export const setUpdatedEditorExtendedData = payload => ({
  type: SET_UPDATED_EDITOR_EXTENDED_DATA,
  payload,
});

export const getCampaignInfo = ({ campaignId }, intl, campaignType, secondaryItem) => {
  return (dispatch, getState) => {
    const state = getState();
    const authUserName = getAuthenticatedUserName(state);
    const linkedObjects = getLinkedObjects(state);
    const method = campaignType === campaignType.REVIEWS ? getCampaign : getMentionCampaign;

    return method(authUserName, campaignId, secondaryItem)
      .then(campaign => {
        const campaignPermlinks =
          campaign.requiredObject.author_permlink === campaign.secondaryObject.author_permlink
            ? [campaign.requiredObject.author_permlink]
            : [campaign.requiredObject.author_permlink, campaign.secondaryObject.author_permlink];
        const authorPermlinks = campaignPermlinks.filter(
          obj => !linkedObjects.some(lo => lo.author_permlink === obj),
        );

        if (!isEmpty(authorPermlinks))
          getObjectsByIds({
            authorPermlinks,
          }).then(({ wobjects }) => {
            dispatch(setCampaignLinkedObjs(wobjects));
          });
        dispatch(setCampaign(campaign));

        return campaign;
      })
      .catch(() => {
        dispatch(deleteCampaignIdFromDraft());
      });
  };
};

export const buildPost = (draftId, data = {}, isEditPost) => (dispatch, getState) => {
  const state = getState();
  const host = getCurrentHost(state);
  const user = getAuthenticatedUser(state);
  const currDraft = getCurrentDraftSelector(state, { draftId });
  const campaign = getCurrentCampaignSelector(state);

  const {
    body,
    originalBody,
    topics,
    content,
    isUpdating,
    settings,
    titleValue,
    title,
    permlink,
    parentPermlink,
    jsonMetadata,
  } = { ...getEditor(state), isUpdating: currDraft?.isUpdating, ...data };
  const updatedEditor = { isEditPost };
  const linkedObjects = getLinkedObjects(state);
  const objPercentage = getObjectPercentageSelector(state);

  dispatch(setUpdatedEditorData(updatedEditor));

  const campaignId = get(campaign, '_id', null) || get(jsonMetadata, 'campaignId', null);
  const campaignType =
    get(campaign, 'type', undefined) || get(currDraft, 'campaignType', undefined);
  let secondaryItem = get(currDraft, 'secondaryItem', undefined);

  if (campaign) {
    secondaryItem = campaign?.secondaryObject?.author_permlink
      ? get(campaign, ['secondaryObject', 'author_permlink'], undefined)
      : `@${get(campaign, ['secondaryObject', 'name'], undefined)}`;
  }

  const reservationPermlink = get(jsonMetadata, 'reservation_permlink', null);
  const postData = {
    body: content || body || originalBody,
    lastUpdated: Date.now(),
    isUpdating,
    draftId,
    campaignType,
    secondaryItem,
    ...settings,
    ...(permlink || titleValue ? { permlink: permlink || kebabCase(titleValue) } : {}),
    parentAuthor: '',
    parentPermlink,
    author: user.name || '',
  };

  if (titleValue || title) {
    postData.title = titleValue || title;
  }

  const oldMetadata = get(currDraft, 'jsonMetadata', {});

  const mappedWobjects = linkedObjects
    ? linkedObjects
        .filter(obj => get(objPercentage, `[${obj.author_permlink}].percent`, 0) > 0)
        ?.map(obj => ({
          object_type: obj.object_type,
          name: getObjectName(obj),
          author_permlink: obj.author_permlink,
          defaultShowLink: obj.defaultShowLink,
          avatar: obj.avatar,
          description: obj.description,
          percent: get(objPercentage, [obj.author_permlink, 'percent']),
        }))
    : [];

  postData.jsonMetadata = createPostMetadata(
    content,
    topics,
    oldMetadata,
    mappedWobjects,
    campaignId,
    host,
    reservationPermlink,
  );

  if (originalBody) {
    postData.originalBody = originalBody;
  }

  return postData;
};

export const handleObjectSelect = (object, withFocus, intl, match) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const lastSelection = getLastSelection(state);
  const { content, titleValue, topics = [] } = getEditor(state);
  const editor = getEditorSlate(state);
  const objName = getObjectName(object);
  const objType = getObjectType(object);
  const objNameDisplay = objType === objectTypes.HASHTAG ? `#${objName}` : objName;
  const objPermlink = object.author_permlink;
  const separator = content?.slice(-1) === '\n' ? '' : '\n';
  const draftContent = {
    title: titleValue,
    body: `${content}${separator}[${objNameDisplay}](${getObjectLink(object, match)})&nbsp;\n`,
  };

  const updateTopics = uniqWith(
    object.type === 'hashtag' || (object.object_type === 'hashtag' && [...topics, objPermlink]),
    isEqual,
  );

  dispatch(
    setUpdatedEditorData({
      draftContent,
      topics: size(updateTopics) ? updateTopics : topics,
    }),
  );
  const { beforeRange } = editor.selection
    ? checkCursorInSearchSlate(editor, false, true)
    : { beforeRange: lastSelection };
  const url = getObjectLink(object, match);
  const textReplace = objType === objectTypes.HASHTAG ? `#${objName}` : objName;

  Transforms.select(editor, beforeRange);
  insertObject(editor, url, textReplace, true);

  dispatch(setLinkedObj(object));

  return Promise.resolve(draftContent);
};

export const getObjectIds = (rawContent, newObject, draftId) => (dispatch, getState) => {
  const isReview = includes(draftId, 'review');
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const isLinked = string => linkedObjects.some(item => item.defaultShowLink.includes(string));

  return (
    Object.values(rawContent.entityMap)
      // eslint-disable-next-line array-callback-return,consistent-return
      ?.map(entity => {
        if (entity.type === Entity.OBJECT) {
          return getCurrentLinkPermlink(entity);
        }
        if (
          !isReview &&
          entity.type === Entity.LINK &&
          (isLinked(get(entity, 'data.url', '')) || newObject)
        ) {
          return getCurrentLinkPermlink(entity);
        }
      })
      .filter(item => !!item)
  );
};

export const getRawContentEntityMap = (rawContent, response) => (dispatch, getState) => {
  const state = getState();
  const linkedObjects = getEditorLinkedObjects(state);
  const entityMap = {};

  forEach(rawContent.entityMap, (value, key) => {
    let currObj = null;
    const loadedObject = getCurrentLoadObjects(response, value);

    if (loadedObject) {
      linkedObjects.push(loadedObject);
      if (!isEmpty(linkedObjects) && !isEmpty(loadedObject)) {
        map(linkedObjects, obj => {
          if (isEqual(obj.author_permlink, loadedObject.author_permlink)) {
            currObj = loadedObject;
          }
        });
      } else {
        currObj = loadedObject;
      }

      entityMap[key] = {
        ...value,
        data: currObj ? { ...value.data, object: currObj } : { ...value.data },
      };
    }
  });

  return entityMap;
};

export const getRestoreObjects = (rawContent, newObject, draftId) => async (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const { prevEditorState } = getEditorExtended(state);
  const linkedCards = getEditorLinkedObjectsCards(state);

  const objectIds = dispatch(getObjectIds(rawContent, newObject, draftId));

  const newLinkedObjectsCards = getNewLinkedObjectsCards(
    linkedCards,
    objectIds,
    Object.values(rawContent.entityMap),
    get(prevEditorState, 'getCurrentContent', false) &&
      Object.values(convertToRaw(prevEditorState.getCurrentContent()).entityMap),
  );

  let rawContentUpdated = rawContent;

  if (objectIds.length) {
    const response = await getObjectsByIds({
      locale,
      requiredFields: ['rating'],
      authorPermlinks: objectIds,
    });
    const entityMap = dispatch(getRawContentEntityMap(rawContent, response));

    rawContentUpdated = { ...rawContentUpdated, entityMap };
  }

  return { rawContentUpdated, newLinkedObjectsCards };
};

export const handlePasteText = html => async (dispatch, getState) => {
  const links = extractLinks(html);
  const objectIds = links?.map(item => {
    const itemArray = item.split('/');

    return itemArray[itemArray.length - 1];
  });

  if (objectIds.length) {
    const state = getState();
    const locale = getLocale(state);
    const linkedObjects = getLinkedObjects(state) || [];
    const { wobjects } = await getObjectsByIds({
      locale,
      requiredFields: ['rating'],
      authorPermlinks: objectIds,
    });

    const newLinkedObjects = uniqBy([...linkedObjects, ...wobjects], 'author_permlink');

    dispatch(setLinkedObjs(newLinkedObjects));
  }
};

export const selectObjectFromSearch = (selectedObject, editor, match) => dispatch => {
  if (selectedObject) {
    const { beforeRange } = checkCursorInSearchSlate(editor, false, true);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectLink(selectedObject, match);

    Transforms.select(editor, beforeRange);
    insertObject(editor, url, textReplace, true);

    dispatch(setShowEditorSearch(false));
    dispatch(setLinkedObj(selectedObject));
  }
};

export const prepareAndImportObjects = (
  isRestaurant,
  isPlace,
  isEditor,
  isComment,
  parentPost,
  setLoading,
  cancelModal,
  history,
  objects,
  checkedIds,
  restaurantTags,
  businessTags,
  listAssociations,
  locale,
  userName,
  objTypes,
  intl,
) => dispatch => {
  prepareObjects(
    objects,
    checkedIds,
    isRestaurant,
    isPlace,
    restaurantTags,
    businessTags,
    listAssociations,
    userName,
  ).then(async processedObjects => {
    if (isEditor) {
      let type = 'business';

      if (isRestaurant(processedObjects[0])) {
        type = 'restaurant';
      } else if (isPlace(processedObjects[0])) {
        type = 'place';
      }

      const selectedType = objTypes[type];
      const objData = {
        ...processedObjects[0],
        type,
        id: processedObjects[0]?.name,
        parentAuthor: selectedType.author,
        parentPermlink: selectedType.permlink,
        isExtendingOpen: true,
        isPostingOpen: true,
      };
      const { companyIdType, companyId } = objData?.companyIds[0];
      const existWobjPermlink = (await getObjPermlinkByCompanyId(companyId, companyIdType))?.result;

      if (!isEmpty(existWobjPermlink) && !isNil(existWobjPermlink)) {
        const objsForEditor = await getObjectInfo([existWobjPermlink]);
        const importedObj = { ...objsForEditor?.wobjects[0], object_type: type };

        if (isComment) {
          dispatch(setImportObject({ [parentPost.id]: importedObj }));
        } else {
          dispatch(handleObjectSelect(importedObj, false, intl));
        }
        importData(
          processedObjects,
          isRestaurant,
          isPlace,
          userName,
          locale,
          isEditor,
          isComment,
          setLoading,
          cancelModal,
          history,
        );
        cancelModal();
      } else {
        dispatch(createWaivioObject(objData)).then(res => {
          const { parentPermlink, parentAuthor } = res;
          const comanyIdBody = JSON.stringify(objData?.companyIds[0]);

          dispatch(
            appendObject(
              getAppendData(
                userName,
                {
                  id: parentPermlink,
                  author: parentAuthor,
                  creator: userName,
                  name: objData.name,
                  locale,
                  author_permlink: parentPermlink,
                },
                '',
                {
                  name: objectFields.companyId,
                  body: comanyIdBody,
                  locale,
                },
              ),
            ),
          ).then(async r => {
            setTimeout(async () => {
              if (r?.transactionId) {
                const importedObj = {
                  ...objData,
                  author_permlink: r.parentPermlink,
                  id: r.parentPermlink,
                  _id: r.parentPermlink,
                  object_type: type,
                };

                if (isComment) {
                  dispatch(setImportObject({ [parentPost.id]: importedObj }));
                } else {
                  dispatch(handleObjectSelect(importedObj, false, intl));
                }
                importData(
                  processedObjects,
                  isRestaurant,
                  isPlace,
                  userName,
                  locale,
                  isEditor,
                  isComment,
                  setLoading,
                  cancelModal,
                  history,
                );
                cancelModal();
              }
            }, 6000);
          });
        });
      }
    } else {
      importData(
        processedObjects,
        isRestaurant,
        isPlace,
        userName,
        locale,
        isEditor,
        isComment,
        setLoading,
        cancelModal,
        history,
      );
    }
  });
};

export const setImportObject = obj => dispatch => {
  return dispatch({
    type: SET_IMPORT_OBJECT,
    payload: obj,
  });
};

export const SET_LAST_SELECTION = 'SET_LAST_SELECTION';

export const setLastSelection = selection => ({
  type: SET_LAST_SELECTION,
  payload: selection,
});
