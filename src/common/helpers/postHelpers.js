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
  uniqBy,
  uniq,
  has,
} from 'lodash';
import { getHtml } from '../../client/components/Story/Body';
import { extractImageTags, extractLinks } from './parser';
import { categoryRegex, botNameRegex, videoPreviewRegex } from './regexHelpers';
import { jsonParse } from './formatter';
import DMCA from '../constants/dmca.json';
import whiteListedApps from './apps';
import {
  WAIVIO_META_FIELD_NAME,
  WAIVIO_PARENT_PERMLINK,
  POST_AUTHOR_FOR_REWARDS_COMMENTS,
} from '../constants/waivio';
import { rewardsValues } from '../constants/rewards';
import * as apiConfig from '../../waivioApi/config.json';
import { getObjectName, getObjectUrlForLink } from './wObjectHelper';
import { parseJSON } from './parseJSON';
import { objectFields } from '../constants/listOfFields';
import steemEmbed from '../../client/vendor/embedMedia';
import { getProxyImageURL } from './image';
import { getBodyLink } from '../../client/components/EditorExtended/util/videoHelper';

const appVersion = require('../../../package.json').version;

const getTagsFromBody = text => {
  const regex = /#\w+/g;

  return text.match(regex);
};

export const isPostDeleted = post => post.title === 'deleted' && post.body === 'deleted';

export const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = attempt(parseJSON, post.json_metadata);

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

export function createPostMetadata(
  body,
  tags,
  oldMetadata = {},
  waivioData,
  campaignId,
  host,
  reservationPermlink,
) {
  const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
  let metaData = {
    community: appName,
    app: `${appName}/${appVersion}`,
    format: 'markdown',
    timeOfPostCreation: Date.now() + 3000,
    host,
    tags: [],
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

  const parsedBody = getHtml(body, {}, 'text', { appUrl: host });
  const images = getContentImages(parsedBody, true);
  const links = extractLinks(parsedBody);
  const parseTags = getTagsFromBody(parsedBody);

  if (!isEmpty(tags)) metaData.tags = tags.map(tag => tag.toLowerCase());
  if (!isEmpty(parseTags))
    metaData.tags = uniq([
      ...metaData.tags,
      ...parseTags.map(tag => tag.toLowerCase().replace('#', '')),
    ]);

  metaData.users = users;
  metaData.links = links.slice(0, 10);
  metaData.image = images;

  if (waivioData) {
    metaData[WAIVIO_META_FIELD_NAME] = waivioData;
  }
  if (campaignId) metaData.campaignId = campaignId;
  if (reservationPermlink) metaData.reservation_permlink = reservationPermlink;

  return {
    ...metaData,
    wobj: { wobjects: uniqBy(get(metaData, 'wobj.wobjects', []), 'author_permlink') },
  };
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

  return `${apiConfig[process.env.NODE_ENV].protocol}${
    apiConfig[process.env.NODE_ENV].host
  }/object/${objPermlink}`;
}

export const getObjectLink = (obj, match = {}) => {
  if (isEmpty(obj)) return '';

  if (match?.url?.includes('/page') && ['page', 'list'].includes(obj.object_type)) {
    return `${apiConfig[process.env.NODE_ENV].protocol}${
      apiConfig[process.env.NODE_ENV].host
    }/object/${match.params.name}/page#${obj.author_permlink}`;
  }

  return `${apiConfig[process.env.NODE_ENV].protocol}${
    apiConfig[process.env.NODE_ENV].host
  }${getObjectUrlForLink(obj)}`;
};

const setTitle = (initObjects, props, authors) => {
  if (size(initObjects)) {
    const title = initObjects.reduce((acc, curr) => {
      const matches = curr.match(/^\[(.+)\]\((\S+)\)/);

      if (!isNil(matches) && matches[1]) {
        return initObjects.length > 1 ? `${acc}${matches[1]}, ` : `${acc}${matches[1]}`;
      }

      return acc;
    }, 'Review: ');

    if (!isEmpty(authors)) {
      let authorAcc = title;

      authors.forEach((author, i) => {
        const matchesAuthor = author.match(/^\[(.+)\]\((\S+)\)/);
        const authorName = matchesAuthor ? matchesAuthor[1] : author;

        authorAcc = i === 0 ? `${authorAcc} by ${authorName}` : `${authorAcc}, ${authorName}`;
      });

      return authorAcc;
    }

    return title;
  }

  return get(props, 'editor.draftContent.title', '');
};

const setBody = (initObjects, props, authors) => {
  const body =
    get(props, 'editor.draftContent.body', false) || size(initObjects)
      ? initObjects.reduce((acc, curr) => {
          const matches = curr.match(/^\[(.+)\]\((\S+)\)/);

          if (!isNil(matches) && matches[1] && matches[2]) {
            if (isEmpty(authors)) return `${acc}[${matches[1]}](${getObjectUrl(matches[2])})\n`;

            return initObjects.length <= 1
              ? `${acc}[${matches[1]}](${getObjectUrl(matches[2])})`
              : `${acc}[${matches[1]}](${getObjectUrl(matches[2])}), `;
          }

          return acc;
        }, '')
      : '';

  if (!isEmpty(authors)) {
    let authorAcc = body;

    authors.forEach((author, i) => {
      const matchesAuthor = author.match(/^\[(.+)\]\((\S+)\)/);
      const authorLink = matchesAuthor
        ? `[${matchesAuthor[1]}](${getObjectUrl(matchesAuthor[2])})`
        : author;

      authorAcc = i === 0 ? `${authorAcc} by ${authorLink}` : `${authorAcc}, ${authorLink}`;
    });

    return authorAcc;
  }

  return body;
};

const getObjects = state => {
  const objects = [state.mainObject];

  if (state.secondaryObject) objects.push(state.secondaryObject);

  return objects;
};

export function getInitialState(props, hideLinkedObjectsSession = []) {
  const query = new URLSearchParams(props.location.search);
  const initObjects = props.location.state
    ? getObjects(props.location.state)
    : query.getAll('object');
  const authors = query.getAll('author');
  const hideObjects = hideLinkedObjectsSession || props.editor.hideLinkedObjects || [];
  const campaignId = props.campaignId ? { id: props.campaignId } : null;
  const campaign = get(props, 'editor.campaign', null) ? props.editor.campaign : campaignId;
  const title = setTitle(initObjects, props, authors);
  let state = {
    campaign,
    draftId: props.draftId || uuidv4(),
    parentPermlink: WAIVIO_PARENT_PERMLINK,
    draftContent: {
      title,
      body: setBody(initObjects, props, authors),
    },
    content: '',
    topics: [],
    linkedObjects: [],
    hideLinkedObjects: hideObjects,
    objPercentage: {},
    settings: {
      reward: rewardsValues.half,
      beneficiary: true,
      upvote: props.upvoteSetting,
    },
    isUpdating: false,
    permlink: null,
    originalBody: null,
    titleValue: title,
    currentRawContent: {},
    isEditPost: get(props, 'editor.isEditPost', false),
  };
  const { draftId } = props;
  const draftPost = props.currDraft;

  if (draftId && draftPost) {
    const draftObjects = get(draftPost, ['jsonMetadata', WAIVIO_META_FIELD_NAME, 'wobjects'], []);
    const tags = get(draftPost, ['jsonMetadata', 'tags'], []);

    state = {
      campaign,
      draftId: props.draftId,
      parentPermlink: draftPost.parentPermlink || WAIVIO_PARENT_PERMLINK,
      draftContent: {
        title: get(draftPost, 'title', ''),
        body: get(draftPost, 'originalBody', '') || get(draftPost, 'body', ''),
      },
      content: '',
      topics: typeof tags === 'string' ? [tags] : tags,
      linkedObjects: draftPost.linkedObjects || [],
      hideLinkedObjects: hideObjects,
      objPercentage: fromPairs(
        draftObjects.map(obj => [obj.author_permlink, { percent: obj.percent }]),
      ),
      settings: {
        reward: draftPost.reward,
        beneficiary: draftPost.beneficiary,
        upvote: draftPost.upvote,
      },
      isUpdating: get(props.currDraft, 'isUpdating', false),
      permlink: draftPost.permlink || null,
      originalBody: draftPost.originalBody || null,
      titleValue: get(draftPost, 'title', ''),
      isEditPost: get(props, 'editor.isEditPost', false),
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

export const getImageForPreview = (post, isUpdates = false) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  let imagePath = [];

  if (!isEmpty(jsonMetadata) && !isEmpty(jsonMetadata.image)) {
    imagePath = jsonMetadata.image;
  } else {
    const contentImages = getContentImages(post.body);

    if (contentImages.length) {
      imagePath = contentImages;
    }
  }

  if (isUpdates) {
    if (
      [
        objectFields.avatar,
        objectFields.galleryItem,
        objectFields.background,
        objectFields.affiliateButton,
      ].includes(post.name)
    )
      imagePath = [post.body];
    if (
      post.name === objectFields.productId &&
      !isEmpty(post.body) &&
      post.body.includes('waivio.nyc3.digitaloceanspaces')
    ) {
      imagePath = [parseJSON(post.body)?.productIdImage];
    }
    if ([objectFields.options, objectFields.menuItem].includes(post.name)) {
      if (!isEmpty(post.body) && post.body.includes('waivio.nyc3.digitaloceanspaces')) {
        imagePath = [parseJSON(post.body)?.image];
      }
    }
  }

  return imagePath;
};

export const getVideoForPreview = post => {
  const regexPattern = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|\.be\/)([\w-]+)(?:\S+)?/g;
  const embeds = steemEmbed.getAll(post.body, { height: '100%' }, true);
  const jsonMetadata = jsonParse(post.json_metadata);
  const video = jsonMetadata && jsonMetadata.video;

  if (has(video, 'content.videohash') && has(video, 'info.snaphash')) {
    const author = get(video, 'info.author', '');
    const permlink = get(video, 'info.permlink', '');
    const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
    const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;

    embeds[0] = {
      type: 'video',
      provider_name: 'DTube',
      embed: dTubeIFrame,
      thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
    };
  }

  const videoPreviewResult = post.body.match(videoPreviewRegex);
  const videoPreviewResulYoutube = post.body.match(regexPattern);

  if (!embeds[0] && videoPreviewResult) {
    const videoLink = getBodyLink(videoPreviewResult);

    if (videoLink) {
      const options = {
        width: '100%',
        height: 340,
        autoplay: false,
        thumbnail: '',
      };
      let thumbnailID;

      if (video && video.files) {
        if (video.files.ipfs && video.files.ipfs.img) {
          thumbnailID = video.files.ipfs.img[360];
          options.thumbnail = thumbnailID && `https://ipfs.io/ipfs/${thumbnailID}`;
        } else {
          thumbnailID = video.files.youtube;
          options.thumbnail =
            thumbnailID && `https://img.youtube.com/vi/${thumbnailID}/mqdefault.jpg`;
        }
      }
      if (embeds[0]) {
        embeds[0] = steemEmbed.get(videoLink, options, true);
      }
    }
  }

  if (!embeds[0] && videoPreviewResulYoutube) {
    const videoLink = videoPreviewResulYoutube[0];

    if (videoLink) {
      const options = {
        width: '100%',
        height: 340,
        autoplay: false,
        thumbnail: '',
      };

      embeds[0] = steemEmbed.get(videoLink.replaceAll('\\', ''), options, true);
    }
  }

  return embeds;
};
