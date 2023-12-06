import sanitizeHtml from 'sanitize-html';
import url from 'url';
import { knownDomains } from '../../common/helpers/constants';
import { getLastPermlinksFromHash } from '../../common/helpers/wObjectHelper';

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
    fn: src => src, // handled by embedjs
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:(player.)?twitch.tv\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:bitchute\.com\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
];
export const noImageText = '(Image not shown due to low ratings)';
export const allowedTags = `
    div, iframe, del,
    a, p, b, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr, u,
    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
    strike, sup, sub, details, summary
`
  .trim()
  .split(/,\s*/);

export const parseLink = (appUrl, location, isPage) => (tagName, attribs) => {
  let { href } = attribs;
  if (!href) href = '#';
  href = href.trim();
  const attys = {};
  const linkUrl = url.parse(href);
  const linkWebsiteUrl = url.format({
    protocol: linkUrl.protocol,
    host: linkUrl.host,
    hash: linkUrl.hash,
  });

  const internalLink = href.indexOf('/') === 0;

  if (!internalLink) attys.target = '_blank';
  if (
    (linkWebsiteUrl.includes('waivio') || linkWebsiteUrl.includes('dining')) &&
    linkUrl.pathname !== '/'
  ) {
    if (isPage) {
      href = linkUrl.hash && location?.pathname ? location.pathname : linkUrl.pathname;

      if (location?.hash) {
        href = href + location.hash;
      }

      if (linkUrl.hash)
        href = href.includes('#')
          ? href + `/${getLastPermlinksFromHash(linkUrl.hash)}`
          : href + linkUrl.hash;
    } else {
      href = appUrl + linkUrl.pathname;
      if (linkUrl.hash)
        href = href.includes('#')
          ? href + `/${getLastPermlinksFromHash(linkUrl.hash)}`
          : href + linkUrl.hash;
    }

    attys.target = '';
  }

  attys.href = href;

  return {
    tagName,
    attribs: attys,
  };
};

// Medium insert plugin uses: div, figure, figcaption, iframe
export default ({
  large = true,
  noImage = false,
  sanitizeErrors = [],
  appUrl,
  secureLinks = false,
  location,
  isPage,
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
              width: large ? '640' : '480',
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
      src = src.replace(/^http:\/\//i, '//');

      const atts = { src };
      if (alt && alt !== '') atts.alt = alt;
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
    a: parseLink(appUrl, location, isPage),
  },
});
