import sanitizeHtml from 'sanitize-html';
import url from 'url';
import { VIDEO_MATCH_URL } from '../../common/helpers/regexHelpers';
import { getLastPermlinksFromHash } from '../../common/helpers/wObjectHelper';
import CryptoJS from 'crypto-js';

/**
 This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://raw.githubusercontent.com/steemit/steemit.com/354c08a10cf88e0828a70dbf7ed9082698aea20d/app/utils/SanitizeConfig.js
 *
 */
const iframeWhitelist = [
  {
    re: /^(https?:)?\/\/player.vimeo.com\/video\/.*/i,
    fn: src => {
      // <iframe src="https://player.vimeo.com/video/179213493" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      if (!src) return null;
      const m = src.match(/https:\/\/player\.vimeo\.com\/video\/([0-9]+)/);
      if (!m || m.length !== 2) return null;
      return `https://player.vimeo.com/video/${m[1]}`;
    },
  },
  {
    re: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
    fn: src => src.replace(/\?.+$/, ''), // strip query string (yt: autoplay=1,controls=0,showinfo=0, etc)
  },
  {
    re: /^https:\/\/emb.d.tube(\/#!)?(\/v)?\/([^/"]+\/[^/"]+)/i,
    fn: src => src.replace(/\?.+$/, ''), // strip query string
  },
  {
    re: /^https:\/\/3speak\.(?:online|co|tv)\/embed\?v=([A-Za-z0-9_\-\/.]+)(&.*)?$/,
    fn: src => src.replace(/\?.+$/, ''), // strip query string
  },

  {
    re: /^(https?:)?\/\/w.soundcloud.com\/player\/.*/i,
    fn: src => {
      if (!src) return null;
      // <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
      const m = src.match(/url=(.+?)[&?]/);
      if (!m || m.length !== 2) return null;
      return (
        `https://w.soundcloud.com/player/?url=${m[1]}&auto_play=false&hide_related=false&show_comments=true` +
        '&show_user=true&show_reposts=false&visual=true'
      );
    },
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:periscope.tv\/)(.*)?$/i,
    fn: src => {
      return src.replaceAll('\\', '');
    }, // handled by embedjs
  },
  {
    re: /^(https?:)?\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?/i,
    fn: src => src.replace(/\?.+$/, ''), // strip query string
  },
  {
    re: /^(https?:\/\/)?(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?\?.*$/i,
    fn: src => {
      return src.replaceAll('\\', '');
    }, // strip query string
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:(player.)?twitch.tv\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:bitchute\.com\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
  {
    re: VIDEO_MATCH_URL.TIKTOK,
    fn: src => src, // handled by embedjs
  },
];
export const noImageText = '(Image not shown due to low ratings)';
export const allowedTags = `
    div, iframe, del,
    a, p, b, q, br, ul, li, i, b, ol, img, h1, h2, h3, h4, h5, h6, hr, u,
    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
    strike, sup, sub, details, summary
`
  .trim()
  .split(/,\s*/);

export const parseLink = (
  appUrl,
  location,
  isPage,
  isPost,
  isChatBotLink,
  name,
  parsedJsonMetadata,
  safeLinks,
) => (tagName, attribs) => {
  let { href } = attribs;
  if (
    typeof window === 'undefined' &&
    safeLinks &&
    !href.startsWith('/') &&
    !href.startsWith('#') &&
    !isHostSafeFrontend(href, safeLinks)
  ) {
    return { tagName: 'div', text: '' };
  }

  if (!href) href = '#';
  href = href.trim();
  const attys = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(href)) {
    attys.href = `mailto:${href}`;
    attys.target = '_blank';
    return {
      tagName,
      attribs: attys,
    };
  }

  try {
    const linkUrl = url.parse(href);
    const linkWebsiteUrl = url.format({
      protocol: linkUrl.protocol,
      host: linkUrl.host,
      hash: linkUrl.hash,
    });
    const internalLink = href.indexOf('/') === 0;

    if (!internalLink) attys.target = '_blank';
    const chatPictures =
      linkWebsiteUrl.includes('waivio.nyc3.digitaloceanspaces.com') && isChatBotLink;

    if (
      !chatPictures &&
      (linkWebsiteUrl?.includes('waivio') || linkWebsiteUrl?.includes('dining')) &&
      linkUrl.pathname !== '/'
    ) {
      const lastPerm = getLastPermlinksFromHash(linkUrl.hash);
      if (isPage) {
        href = linkUrl.hash && location?.pathname !== '/' ? location?.pathname : linkUrl.pathname;

        if (appUrl?.includes('waivio') || appUrl?.includes('dining')) {
          if (location?.hash && !linkUrl.pathname.endsWith('/webpage'))
            href = href + location?.hash;

          if (linkUrl.hash) {
            if (href?.includes('#')) {
              if (!href?.includes(lastPerm)) {
                href = href + `/${lastPerm}`;
              }
            } else {
              href += linkUrl.hash;
            }
          }
        } else {
          const objName = name || linkUrl.pathname.split('/')[2];

          const withCrumbs = href?.includes('breadcrumbs');
          if (location?.hash && !linkUrl.pathname.endsWith('/webpage')) {
            href = `${href}?breadcrumbs=${objName}/${location?.hash.replace('#', '')}`;
          }

          if (linkUrl.hash) {
            if (withCrumbs) {
              if (!href?.includes(lastPerm)) {
                href = href.replace(objName, lastPerm) + `/${lastPerm}`;
              }
            } else {
              href = `${href.replace(
                objName,
                lastPerm,
              )}?breadcrumbs=${objName}/${linkUrl.hash.replace('#', '')}`;
            }
          }
        }

        attys.target = '';
      }
    }

    if (isPost) {
      if (
        (parsedJsonMetadata?.app?.includes('waivio') ||
          parsedJsonMetadata?.app?.includes('dining')) &&
        linkUrl?.pathname?.includes('/object/')
      ) {
        href = linkUrl.path;
      }

      attys.target = '';
    }
    if (isChatBotLink) attys.target = '_blank';
    attys.href = href;

    return {
      tagName,
      attribs: attys,
    };
  } catch (e) {
    return {
      tagName,
      attribs: {},
    };
  }
};

const getHostFromUrl = (url = '') => {
  try {
    // Clean the URL first
    let cleanUrl = url.trim();

    // Remove any trailing punctuation that might have slipped through
    cleanUrl = cleanUrl.replace(/[*.,;:!?)\]}>"']+$/, '');

    const urlObj = new URL(cleanUrl);

    const { hostname } = urlObj;

    if (hostname.startsWith('www.')) return hostname.replace('www.', '');
    return hostname;
  } catch (error) {
    console.log(`Failed to parse URL: ${url}`, error.message);
    return null;
  }
};

const normalizeDomain = domain => domain.toLowerCase().trim();

const isHostSafeFrontend = (inputUrl, redisData) => {
  const hostname = getHostFromUrl(inputUrl);
  if (!hostname) return false;

  const baseDomain = normalizeDomain(hostname);
  const hash = CryptoJS.SHA256(baseDomain).toString(CryptoJS.enc.Hex);
  const prefix = Buffer.from(hash.slice(0, redisData.prefixLength * 2), 'hex');
  const buffer = Buffer.from(redisData.data, 'base64');
  const prefixLen = redisData.prefixLength;

  for (let i = 0; i < buffer.length; i += prefixLen) {
    const storedPrefix = buffer.slice(i, i + prefixLen);
    if (storedPrefix.equals(prefix)) {
      return true;
    }
  }

  return false;
};
// Medium insert plugin uses: div, figure, figcaption, iframe
export default ({
  large = true,
  noImage = false,
  sanitizeErrors = [],
  appUrl,
  location,
  isPage,
  isPost,
  isChatBotLink,
  baseObj,
  parsedJsonMetadata,
  safeLinks,
}) => ({
  allowedTags,
  // figure, figcaption,

  // SEE https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  allowedAttributes: {
    // "src" MUST pass a whitelist (below)
    iframe: [
      'src',
      'width',
      'height',
      'frameborder',
      'allowfullscreen',
      'webkitallowfullscreen',
      'mozallowfullscreen',
    ],

    // class attribute is strictly whitelisted (below)
    div: ['class'],

    // style is subject to attack, filtering more below
    td: ['style'],
    img: ['src', 'alt'],
    a: ['href', 'rel', 'target'],
    ol: ['start'],
  },
  allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['byteball', 'bitcoin']),
  transformTags: {
    iframe: (tagName, attribs) => {
      const srcAtty = decodeURIComponent(attribs.src);
      for (const item of iframeWhitelist) {
        if (item.re.test(srcAtty)) {
          const src = typeof item.fn === 'function' ? item.fn(srcAtty, item.re) : srcAtty;
          if (!src) break;
          return {
            tagName: 'iframe',
            attribs: {
              frameborder: '0',
              allowfullscreen: 'allowfullscreen',
              webkitallowfullscreen: 'webkitallowfullscreen', // deprecated but required for vimeo : https://vimeo.com/forums/help/topic:278181
              mozallowfullscreen: 'mozallowfullscreen', // deprecated but required for vimeo
              src,
              width: large ? '640' : '100%',
              height: large ? '360' : '270',
            },
          };
        }
      }

      sanitizeErrors.push(`Invalid iframe URL: ${srcAtty}`);
      return { tagName: 'div', text: `(Unsupported ${srcAtty})` };
    },
    img: (tagName, attribs) => {
      if (noImage) return { tagName: 'div', text: noImageText };
      // See https://github.com/punkave/sanitize-html/issues/117
      let { src, alt } = attribs;
      if (!/^(https?:)?\/\//i.test(src)) {
        console.log('Blocked, image tag src does not appear to be a url', tagName, attribs);
        sanitizeErrors.push('An image in this post did not save properly.');
        return { tagName: 'img', attribs: { src: 'brokenimg.jpg' } };
      }

      // replace http:// with // to force https when needed
      src = src?.replace(/^http:\/\//i, '//');

      const atts = { src };
      if (alt && alt !== '') atts.alt = alt;

      if (isChatBotLink) {
        const imgTag = `<img src="${atts.src}" alt="${atts.alt || ''}">`;
        const aTag = `<a href="${atts.src}" target="_blank" style="cursor: pointer">${imgTag}</a>`;
        return { tagName: 'div', text: aTag };
      }

      return { tagName, attribs: atts };
    },
    div: (tagName, attribs) => {
      const attys = {};
      const classWhitelist = [
        'pull-right',
        'pull-left',
        'text-justify',
        'text-rtl',
        'text-center',
        'text-right',
        'videoWrapper',
      ];
      const validClass = classWhitelist.find(e => attribs.class === e);
      if (validClass) {
        attys.class = validClass;
      }
      return {
        tagName,
        attribs: attys,
      };
    },
    td: (tagName, attribs) => {
      const attys = {};
      if (attribs.style === 'text-align:right') {
        attys.style = 'text-align:right';
      }
      return {
        tagName,
        attribs: attys,
      };
    },
    a: parseLink(
      appUrl,
      location,
      isPage,
      isPost,
      isChatBotLink,
      baseObj,
      parsedJsonMetadata,
      safeLinks,
    ),
  },
});
