import uuidv4 from 'uuid/v4';
import {
  fromPairs,
  get,
  attempt,
  isError,
  includes,
  unescape,
  split,
  isEmpty,
  size,
  isNil,
} from 'lodash';
import { getHtml } from '../components/Story/Body';
import { extractImageTags, extractLinks } from './parser';
import { categoryRegex, botNameRegex } from './regexHelpers';
import { jsonParse } from './formatter';
import DMCA from '../../common/constants/dmca.json';
import whiteListedApps from './apps';
import {
  WAIVIO_META_FIELD_NAME,
  WAIVIO_PARENT_PERMLINK,
  POST_AUTHOR_FOR_REWARDS_COMMENTS,
} from '../../common/constants/waivio';
import { rewardsValues } from '../../common/constants/rewards';
import * as apiConfig from '../../waivioApi/config.json';
import { getObjectName } from './wObjectHelper';

const appVersion = require('../../../package.json').version;

export const isPostDeleted = post => post.title === 'deleted' && post.body === 'deleted';

export const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = attempt(JSON.parse, post.json_metadata);

  if (isError(postJSONMetaData)) return false;

  return includes(postJSONMetaData.tags, 'nsfw');
};

export function dropCategory(url) {
  return url ? url.replace(categoryRegex, '') : null;
}

export const replaceBotWithGuestName = (url, guestInfo) => {
  if (url) {
    if (url.match(botNameRegex)[0] === `@${POST_AUTHOR_FOR_REWARDS_COMMENTS}`) {
      return url;
    }

    return guestInfo && guestInfo.userId ? url.replace(botNameRegex, `@${guestInfo.userId}`) : url;
  }

  return null;
};

/**
 * Gets app data from a post.
 * Only Returns app info from apps whitelisted in apps.json
 * @param post
 * @returns An empty object if app is not valid otherwise an object with {appName: String, version: String}
 */
export function getAppData(post) {
  try {
    const jsonMetadata = jsonParse(post.json_metadata);
    const appDetails = get(jsonMetadata, 'app', '');
    const appData = split(appDetails, '/');
    const appKey = get(appData, 0, '');
    const version = get(appData, 1, '1.0.0');

    if (whiteListedApps[appKey]) {
      return {
        appName: whiteListedApps[appKey],
        version,
      };
    }

    return {};
  } catch (error) {
    return {};
  }
}

export const isBannedPost = post => {
  const bannedAuthors = get(DMCA, 'authors', []);
  const bannedPosts = get(DMCA, 'posts', []);
  const postURL = `${post.author}/${post.permlink}`;

  return includes(bannedAuthors, post.author) || includes(bannedPosts, postURL);
};

export function getContentImages(content, parsed = false) {
  const parsedBody = parsed ? content : getHtml(content, {}, 'text');

  return extractImageTags(parsedBody).map(tag =>
    unescape(tag.src.replace('https://images.hive.blog/0x0/', '')),
  );
}

export function createPostMetadata(body, tags, oldMetadata = {}, waivioData, campaignId, host) {
  const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
  let metaData = {
    community: appName,
    app: `${appName}/${appVersion}`,
    format: 'markdown',
    timeOfPostCreation: Date.now() + 3000,
    host,
  };

  metaData = {
    ...oldMetadata,
    ...metaData,
  };

  const users = [];
  const userRegex = /@([a-zA-Z.0-9-]+)/g;
  let matches;

  // eslint-disable-next-line no-cond-assign
  while ((matches = userRegex.exec(body))) {
    if (users.indexOf(matches[1]) === -1) {
      users.push(matches[1]);
    }
  }

  const parsedBody = getHtml(body, {}, 'text');

  const images = getContentImages(parsedBody, true);
  const links = extractLinks(parsedBody);

  if (!isEmpty(tags)) metaData.tags = tags.map(tag => tag.toLowerCase());
  metaData.users = users;
  metaData.links = links.slice(0, 10);
  metaData.image = images;

  if (waivioData) {
    metaData[WAIVIO_META_FIELD_NAME] = waivioData;
  }
  if (campaignId) metaData.campaignId = campaignId;

  return metaData;
}

/**
 *
 * @param markdownContent: string
 * @param titleKey - string (optional)
 * @param bodyKey - string (optional)
 * @returns Object with post's title and body - {postBody: string, postTitle: string}
 */

export function splitPostContent(markdownContent, { bodyKey } = { bodyKey: 'postBody' }) {
  const regExp = new RegExp('^(.*)\n'); // eslint-disable-line
  const postBody = markdownContent.replace(regExp, '');

  return {
    [bodyKey]: postBody || '',
  };
}

export function getObjectUrl(objPermlink) {
  if (!objPermlink) return '';

  return `${apiConfig.production.protocol}${apiConfig.production.host}/object/${objPermlink}`;
}

export function getInitialState(props, newDraftId = '') {
  const search = props.location.search.replace(/ & /, ' ');
  const initObjects = new URLSearchParams(search).getAll('object');

  let state = {
    campaign: props.campaignId ? { id: props.campaignId } : null,
    draftId: props.draftId || newDraftId || uuidv4(),
    parentPermlink: WAIVIO_PARENT_PERMLINK,
    draftContent: {
      title: '',
      body: initObjects
        ? initObjects.reduce((acc, curr) => {
            const matches = curr.match(/^\[(.+)\]\((\S+)\)/);

            if (!isNil(matches) && matches[1] && matches[2]) {
              return `${acc}[${matches[1]}](${getObjectUrl(matches[2])})\n`;
            }

            return acc;
          }, '')
        : '',
    },
    content: '',
    topics: [],
    linkedObjects: [],
    hideLinkedObjects: [],
    objPercentage: {},
    settings: {
      reward: rewardsValues.half,
      beneficiary: true,
      upvote: props.upvoteSetting,
    },
    isUpdating: false,
    permlink: null,
    originalBody: null,
    titleValue: '',
    currentRawContent: {},
  };
  const { draftPosts, draftId } = props;
  const draftPost = draftPosts.find(d => d.draftId === draftId);

  if (draftId && draftPost) {
    const draftObjects = get(draftPost, ['jsonMetadata', WAIVIO_META_FIELD_NAME, 'wobjects'], []);
    const tags = get(draftPost, ['jsonMetadata', 'tags'], []);

    state = {
      campaign: draftPost.campaignId ? { id: draftPost.campaignId } : null,
      draftId: props.draftId,
      parentPermlink: draftPost.parentPermlink || WAIVIO_PARENT_PERMLINK,
      draftContent: {
        title: get(draftPost, 'title', ''),
        body: get(draftPost, 'originalBody', '') || get(draftPost, 'body', ''),
      },
      content: '',
      topics: typeof tags === 'string' ? [tags] : tags,
      linkedObjects: draftPost.linkedObjects || [],
      hideLinkedObjects: [],
      objPercentage: fromPairs(
        draftObjects.map(obj => [obj.author_permlink, { percent: obj.percent }]),
      ),
      settings: {
        reward: draftPost.reward,
        beneficiary: draftPost.beneficiary,
        upvote: draftPost.upvote,
      },
      isUpdating: Boolean(draftPost.isUpdating),
      permlink: draftPost.permlink || null,
      originalBody: draftPost.originalBody || null,
    };
  }

  return state;
}

export function isContentValid(markdownContent) {
  const { postBody } = markdownContent ? splitPostContent(markdownContent) : { postBody: '' };

  return Boolean(postBody.trim());
}

export function getPostHashtags(items) {
  if (!size(items)) return [];
  const sortedItems = items.sort((a, b) => b.weight - a.weight);
  const postItems = sortedItems.slice(0, 3);

  return postItems.map(item => getObjectName(item));
}

export const getAuthorName = post =>
  post.guestInfo && post.guestInfo.userId ? post.guestInfo.userId : post.author;
