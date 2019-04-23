import _ from 'lodash';
import { getHtml } from '../components/Story/Body';
import { extractImageTags, extractLinks } from './parser';
import { categoryRegex } from './regexHelpers';
import { jsonParse } from './formatter';
import DMCA from '../../common/constants/dmca.json';
import whiteListedApps from './apps';
import { WAIVIO_META_FIELD_NAME } from '../../common/constants/waivio';

const appVersion = require('../../../package.json').version;

export const isPostDeleted = post => post.title === 'deleted' && post.body === 'deleted';

export const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = _.attempt(JSON.parse, post.json_metadata);

  if (_.isError(postJSONMetaData)) return false;

  return _.includes(postJSONMetaData.tags, 'nsfw');
};

export function dropCategory(url) {
  return url ? url.replace(categoryRegex, '') : null;
}

/**
 * Gets app data from a post.
 * Only Returns app info from apps whitelisted in apps.json
 * @param post
 * @returns An empty object if app is not valid otherwise an object with {appName: String, version: String}
 */
export function getAppData(post) {
  try {
    const jsonMetadata = jsonParse(post.json_metadata);
    const appDetails = _.get(jsonMetadata, 'app', '');
    const appData = _.split(appDetails, '/');
    const appKey = _.get(appData, 0, '');
    const version = _.get(appData, 1, '');

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
  const bannedAuthors = _.get(DMCA, 'authors', []);
  const bannedPosts = _.get(DMCA, 'posts', []);
  const postURL = `${post.author}/${post.permlink}`;

  return _.includes(bannedAuthors, post.author) || _.includes(bannedPosts, postURL);
};

export function getContentImages(content, parsed = false) {
  const parsedBody = parsed ? content : getHtml(content, {}, 'text');

  return extractImageTags(parsedBody).map(tag =>
    _.unescape(tag.src.replace('https://steemitimages.com/0x0/', '')),
  );
}

export function createPostMetadata(body, tags, oldMetadata = {}, waivioData) {
  let metaData = {
    community: 'waiviodev',
    app: `waiviodev/${appVersion}`,
    format: 'markdown',
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

  metaData.tags = tags;
  metaData.users = users;
  metaData.links = links.slice(0, 10);
  metaData.image = images;
  if (waivioData) {
    metaData[WAIVIO_META_FIELD_NAME] = waivioData;
  }

  return metaData;
}

/**
 *
 * @param markdownContent: string
 * @returns Object with post's title and body - {postBody: string, postTitle: string}
 */
export function splitPostContent(markdownContent) {
  const regExp = new RegExp('^(.{2,})\n'); // eslint-disable-line
  const postTitle = regExp.exec(markdownContent);
  const postBody = markdownContent.replace(regExp, '');
  return {
    postTitle: postTitle ? postTitle[0].trim() : '',
    postBody: postBody || '',
  };
}

export function isContentValid(markdownContent) {
  const { postTitle, postBody } = splitPostContent(markdownContent);
  return Boolean(postTitle && postBody.trim());
}
