/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs(Removed Embed and ipfs related code). Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/2c2b89a6745aebec1fa45453f31362d700f1bfb7/shared/HtmlReady.js
 */

import steemEmbed from './embedMedia';
import xmldom from 'xmldom';
import linksRe from './steemitLinks';
import { validateAccountName } from './ChainValidation';
import { getImagePathPost, getProxyImageURL } from '../../common/helpers/image';
import { isEmpty } from 'lodash';
import { imageRegex } from '../../common/helpers/regexHelpers';

const noop = () => {};
const DOMParser = new xmldom.DOMParser({
  errorHandler: { warning: noop, error: noop },
});
const XMLSerializer = new xmldom.XMLSerializer();

/**
 * Functions performed by HTMLReady
 *
 * State reporting
 *  - hashtags: collect all #tags in content
 *  - usertags: collect all @mentions in content
 *  - htmltags: collect all html <tags> used (for validation)
 *  - images: collect all image URLs in content
 *  - links: collect all href URLs in content
 *
 * Mutations
 *  - link()
 *    - ensure all <a> href's begin with a protocol. prepend https:// otherwise.
 *  - iframe()
 *    - wrap all <iframe>s in <div class="videoWrapper"> for responsive sizing
 *  - img()
 *    - convert any <img> src IPFS prefixes to standard URL
 *    - change relative protocol to https://
 *  - linkifyNode()
 *    - scans text content to be turned into rich content
 *    - embedYouTubeNode()
 *      - identify plain youtube URLs and prep them for "rich embed"
 *    - linkify()
 *      - scan text for:
 *        - #tags, convert to <a> links
 *        - @mentions, convert to <a> links
 *        - naked URLs
 *          - if img URL, normalize URL and convert to <img> tag
 *          - otherwise, normalize URL and convert to <a> link
 *  - proxifyImages()
 *    - prepend proxy URL to any non-local <img> src's
 *
 * We could implement 2 levels of HTML mutation for maximum reuse:
 *  1. Normalization of HTML - non-proprietary, pre-rendering cleanup/normalization
 *    - (state reporting done at this level)
 *    - normalize URL protocols
 *    - convert naked URLs to images/links
 *    - convert embeddable URLs to <iframe>s
 *    - basic sanitization?
 *  2. Steemit.com Rendering - add in proprietary Steemit.com functions/links
 *    - convert <iframe>s to custom objects
 *    - linkify #tags and @mentions
 *    - proxify images
 *
 * TODO:
 *  - change url to normalizeUrl(url)
 *    - rewrite IPFS prefixes to valid URLs
 *    - schema normalization
 *    - gracefully handle protocols like ftp, mailto
 */

/** Split the HTML on top-level elements. This allows react to compare separately, preventing excessive re-rendering.
 * Used in MarkdownViewer.jsx
 */
// export function sectionHtml (html) {
//   const doc = DOMParser.parseFromString(html, 'text/html')
//   const sections = Array(...doc.childNodes).map(child => XMLSerializer.serializeToString(child))
//   return sections
// }

/** Embed videos, link mentions and hashtags, etc...
 */
export default function(html, { mutate = true, resolveIframe } = {}) {
  const state = { mutate, resolveIframe };
  state.hashtags = new Set();
  state.usertags = new Set();
  state.htmltags = new Set();
  state.images = new Set();
  state.links = new Set();
  try {
    const doc = DOMParser.parseFromString(html, 'text/html');

    traverse(doc, state);
    if (mutate) proxifyImages(doc);
    if (!mutate) return state;
    return { html: doc ? XMLSerializer.serializeToString(doc) : '', ...state };
  } catch (error) {
    console.error(error);
    // Not Used, parseFromString might throw an error in the future
    return { html };
  }
}

function traverse(node, state, depth = 0) {
  if (!node || !node.childNodes || isEmpty(node.childNodes)) return;
  Array.from(node.childNodes).forEach(child => {
    const tag = child.tagName ? child.tagName.toLowerCase() : null;

    if (tag) state.htmltags.add(tag);

    if (tag === 'img') img(state, child);
    else if (tag === 'iframe') iframe(state, child);
    else if (tag === 'a') link(state, child);
    else if (child.nodeName === '#text') linkifyNode(child, state);

    traverse(child, state, depth + 1);
  });
}

function link(state, child) {
  const url = child.getAttribute('href');
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (url) {
    state.links.add(url);
    if (state.mutate && !url.includes('mailto:') && emailRegex.test(url)) {
      // If this link is not relative, http, or https -- add https.
      if (!/^((#)|(\/(?!\/))|((https?:)?\/\/))/.test(url)) {
        child.setAttribute('href', 'https://' + url);
      }
    }
  }
}

// wrap iframes in div.videoWrapper to control size/aspect ratio
function iframe(state, child) {
  const url = child.getAttribute('src');
  let domString;
  const embed = steemEmbed.get(url || '', { width: '100%', height: 400 });
  if (embed && embed.id) {
    const { images, links } = state;
    links.add(embed.url);
    images.add(`https://img.youtube.com/vi/${embed.id}/hqdefault.jpg`);
    if (!resolveIframe) domString = `~~~ embed:${embed.id} ${embed.provider_name} ${embed.url} ~~~`;
  }

  const { mutate, resolveIframe } = state;
  if (!mutate) return;

  const tag = child?.parentNode.tagName
    ? child?.parentNode.tagName.toLowerCase()
    : child?.parentNode.tagName;
  if (tag === 'div' && child?.parentNode.getAttribute('class') === 'videoWrapper') return;
  const html = XMLSerializer.serializeToString(child);
  if (resolveIframe) domString = `<div class="videoWrapper">${html}</div>`;
  if (domString) child?.parentNode.replaceChild(DOMParser.parseFromString(domString), child);
}

function img(state, child) {
  const url = child.getAttribute('src');
  if (url) {
    state.images.add(url);
    if (state.mutate) {
      let url2 = url;
      if (/^\/\//.test(url2)) {
        // Change relative protocol imgs to https
        url2 = `https:${url2}`;
      }
      if (url2 !== url) {
        child.setAttribute('src', url2);
      }
    }
  }
}

// For all img elements with non-local URLs, prepend the proxy URL (e.g. `https://img0.steemit.com/0x0/`)
function proxifyImages(doc) {
  if (!doc) return;
  Array.from(doc.getElementsByTagName('img')).forEach(node => {
    const url = node.getAttribute('src');

    node.setAttribute('src', getProxyImageURL(url));
    node.setAttribute('alt', url);
  });
}

function linkifyNode(child, state) {
  try {
    const tag = child?.parentNode.tagName
      ? child?.parentNode.tagName.toLowerCase()
      : child?.parentNode.tagName;

    if (tag === 'code') return;
    if (tag === 'a') return;
    if (imageRegex.test(child?.nodeValue)) {
      const dataWithImg = XMLSerializer.serializeToString(child);
      const contentWithImg = imagify(dataWithImg);
      if (contentWithImg !== dataWithImg) {
        const newChild = DOMParser.parseFromString(`<span>${contentWithImg}</span>`);
        child?.parentNode.replaceChild(newChild, child);
        return newChild;
      }
    }

    const { mutate } = state;
    if (!child.data) return;
    if (isEmbedable(child, state.links, state.images, state.resolveIframe)) return;

    const data = XMLSerializer.serializeToString(child);
    const content = linkify(
      data,
      state.mutate,
      state.hashtags,
      state.usertags,
      state.images,
      state.links,
    );
    if (mutate && content !== data) {
      const newChild = DOMParser.parseFromString(`<span>${content}</span>`);
      child?.parentNode.replaceChild(newChild, child);
      return newChild;
    }
  } catch (error) {
    console.log(error);
  }
}

function imagify(content) {
  // hashtag
  content = content.replace(imageRegex, item => {
    return `<img src="${item}" alt="" />`;
  });

  return content;
}

function linkify(content, mutate, hashtags, usertags, images, links) {
  // hashtag
  content = content.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    const space = /^\s/.test(tag) ? tag[0] : '';
    const tag2 = tag.trim().substring(1);
    const tagLower = tag2.toLowerCase();
    if (hashtags) hashtags.add(tagLower);
    if (!mutate) return tag;
    return `${space}<a href="/object/${tagLower}">${tag}</a>`;
  });

  // usertag (mention)
  // Cribbed from https://github.com/twitter/twitter-text/blob/v1.14.7/js/twitter-text.js#L90
  // https://github.com/steemit/condenser/blob/7c588536d2568a554391ea1edaa656c636c5a890/src/shared/HtmlReady.js#L272-L290
  content = content.replace(
    // Added # symbol to regEx on position 70 for correct match of Guest user names
    /(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-_.a-z\d]+[a-z\d])/gi,
    (match, preceeding1, preceeding2, user) => {
      const userLower = user.toLowerCase();
      const valid = validateAccountName(userLower) == null;

      if (valid && usertags) usertags.add(userLower);

      const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

      if (!mutate) return `${preceedings}${user}`;

      return valid
        ? `${preceedings}<a href="/@${userLower}">@${user}</a>`
        : `${preceedings}@${user}`;
    },
  );

  content = content.replace(linksRe.any, ln => {
    // do not linkify .exe or .zip urls
    if (/\.(zip|exe)$/i.test(ln)) return ln;

    if (links) links.add(ln);
    return `<a href="${ln}">${ln}</a>`;
  });
  return content;
}

function isEmbedable(child, links, images, resolveIframe) {
  try {
    if (!child.data) return false;
    // /https:\/\/youtu\.be\/[A-Za-z0-9_-]+/g
    const data = child.data;
    const foundLinks = data.match(linksRe.any);
    if (!foundLinks) return false;
    const embed = steemEmbed.get(foundLinks[0] || '', { width: '100%', height: 400 });

    if (embed && embed.id) {
      const domString = resolveIframe
        ? embed.embed
        : `${data.slice(0, foundLinks.index)}~~~ embed:${embed.id} ${embed.provider_name} ${
            embed.url
          } ~~~${data.slice(foundLinks.index + foundLinks[0].length, data.length)}`;
      const v = DOMParser.parseFromString(domString);
      if (v) child?.parentNode.replaceChild(v, child);
      if (links) links.add(embed.url);
      if (images) images.add(`https://img.youtube.com/vi/${embed.id}/hqdefault.jpg`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
