import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { isUndefined, filter, isEmpty } from 'lodash';
import { useLocation, useParams } from 'react-router';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { Map, Marker } from 'pigeon-maps';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import steemEmbed from '../../vendor/embedMedia';
import { jsonParse } from '../../../common/helpers/formatter';
import sanitizeConfig from '../../vendor/SanitizeConfig';
import { imageRegex, rewriteRegex, videoPreviewRegex } from '../../../common/helpers/regexHelpers';
import htmlReady from '../../vendor/steemitHtmlReady';
import improve from '../../../common/helpers/improve';
import { getBodyLink } from '../EditorExtended/util/videoHelper';
import PostFeedEmbed from './PostFeedEmbed';
import mapProvider from '../../../common/helpers/mapProvider';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { setLinkSafetyInfo } from '../../../store/wObjectStore/wobjActions';
import './Body.less';

function parseGPSCoordinates(text) {
  const regex = /(?<=!worldmappin\s)(-?\d+\.\d+)\s*lat\s*(-?\d+\.\d+)\s*long/;
  const match = text.match(regex);

  if (match) {
    const latitude = match[1];
    const longitude = match[2];

    return [+latitude, +longitude];
  }

  return null;
}

export const remarkable = new Remarkable({
  html: true,
  breaks: true,
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
});

export const getEmbed = link => {
  const embed = steemEmbed.get(link, { width: '100%', height: 400, autoplay: false });

  if (isUndefined(embed)) {
    return {
      provider_name: '',
      thumbnail: '',
      embed: link,
    };
  }

  return embed;
};

// const addExplicitNumbersToLists = html =>
//   html?.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, listContent) => {
//     let count = 1;
//     const updatedList = listContent?.replace(
//       /<li>([\s\S]*?)<\/li>/g,
//       (_, item) => `<li>${count++}. ${item}</li>`, // Add numbers explicitly
//     );
//
//     return `<ol>${updatedList}</ol>`;
//   });

export function getHtml(
  body,
  jsonMetadata = {},
  returnType = 'Object',
  options = { isChatBotLink: false, isPost: false },
  location,
  isPage,
  baseObj = '',
  sendPostError,
  safeLinks,
) {
  const parsedJsonMetadata = jsonParse(jsonMetadata) || {};
  const isMobl = isMobile();

  if (!isEmpty(parsedJsonMetadata.image))
    parsedJsonMetadata.image = parsedJsonMetadata.image ? [...parsedJsonMetadata.image] : [];
  if (!body) return '';
  let parsedBody = body?.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  if (!isEmpty(parsedJsonMetadata.image))
    parsedBody?.replace(imageRegex, img => {
      if (filter(parsedJsonMetadata.image, i => i?.indexOf(img) !== -1).length === 0) {
        parsedJsonMetadata.image.push(img);
      }
    });

  const videoPreviewResult = parsedBody.match(videoPreviewRegex);

  if (videoPreviewResult) {
    const videoLink = getBodyLink(videoPreviewResult);

    if (videoLink) parsedBody = parsedBody?.replace(videoPreviewResult[0], videoLink);
  }

  parsedBody = improve(parsedBody);
  parsedBody = parsedBody.split('\n\n').reduce((acc, item) => {
    if (!item) return `${acc}<br />\n\n`;

    return `${acc + item}\n\n`;
  }, '');
  parsedBody = remarkable.render(parsedBody);
  parsedBody = parsedBody
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*<img[^>]*>[^<]*)<\/a>/gi, (match, href, content) =>
      content.replace(/<img([^>]*)>/gi, `<img$1 data-linked-url="${href}">`),
    )
    .replace(/<img([^>]*?)\/\s+([^>]*?)>/gi, '<img$1 $2 />');
  // if (options.isChatBotLink) parsedBody = addExplicitNumbersToLists(parsedBody);
  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };

  parsedBody = htmlReady(parsedBody, htmlReadyOptions, returnType).html;

  const MD_DATA_IMG = /!\[([^\]]*)\]\(\s*(data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+)\s*\)/gi;

  if (options.rewriteLinks) {
    parsedBody = parsedBody.replace(rewriteRegex, (match, p1) => `"${p1 || '/'}"`);
  }

  parsedBody = sanitizeHtml(
    parsedBody,
    sanitizeConfig({
      appUrl: options.appUrl,
      secureLinks: options.secureLinks,
      location,
      isPage,
      isPost: options.isPost,
      isChatBotLink: options.isChatBotLink,
      baseObj,
      parsedJsonMetadata,
      large: !isMobl,
      safeLinks,
    }),
  );
  parsedBody = parsedBody.replace(
    MD_DATA_IMG,
    (_, alt, src) => `<img src="${src}" alt="${alt}" data-fallback-src="${src}">`,
  );

  if (body.length - parsedBody.length > 1000 && sendPostError) {
    sendPostError();
  }

  if (returnType === 'text') {
    return parsedBody;
  }
  parsedBody = parsedBody.replace(/~~~ embed:(\S+) (\S+) (\S+) ~~~/g, (a, embedId, c, url) => {
    const embed = getEmbed(url.replaceAll('&amp;', '&'));

    return ReactDOMServer.renderToString(
      <PostFeedEmbed key={`embed-a-${embedId}`} inPost embed={embed} />,
    );
  });

  return (
    <div
      key={(Math.random() + 1).toString(36).substring(7)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: parsedBody }}
    />
  );
}

const Body = props => {
  const mapRegex = /\[\/\/\]:# \((.*?)\)/g;
  const withMap = props.body.match(mapRegex);
  const dispatch = useDispatch();
  const handleLinkClick = e => {
    const a = e.target.closest('a[data-href]');
    if (!a) return;

    e.preventDefault();
    e.stopPropagation();

    const href = a.dataset.href;
    dispatch(setLinkSafetyInfo(href));
  };
  // const openLink = e => {
  //   const anchor = e.target.closest('a');
  //
  //   if (anchor) {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     const href = anchor.getAttribute('href');
  //
  //     dispatch(setLinkSafetyInfo(href));
  //   }
  // };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const setupImageErrorHandlers = () => {
        Array.from(document.body.getElementsByTagName('img')).forEach(imgNode => {
          // Skip if already processed
          if (imgNode.dataset.processed) return;

          // eslint-disable-next-line no-param-reassign
          imgNode.onerror = () => {
            // Use data-fallback-src if available, otherwise fall back to alt
            const fallbackSrc = imgNode.getAttribute('data-fallback-src') || imgNode.alt;

            // Prevent infinite loop by checking if we already tried the fallback
            if (fallbackSrc && fallbackSrc !== imgNode.src) {
              // Force React to recognize the change by removing and re-adding the src
              // eslint-disable-next-line no-param-reassign
              imgNode.src = '';
              // eslint-disable-next-line no-param-reassign
              imgNode.src = fallbackSrc;
              // Mark as processed to prevent infinite loops
              // eslint-disable-next-line no-param-reassign
              imgNode.dataset.processed = 'true';
            } else {
              // eslint-disable-next-line no-param-reassign
              imgNode.src = '/images/icons/no-image.png';
              // eslint-disable-next-line no-param-reassign
              imgNode.dataset.processed = 'true';
            }
          };
        });
      };

      // Setup handlers immediately
      setupImageErrorHandlers();

      // Setup MutationObserver to handle new images added by React
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG') {
                  setupImageErrorHandlers();
                } else if (node.querySelectorAll) {
                  const images = node.querySelectorAll('img');

                  if (images.length > 0) {
                    setupImageErrorHandlers();
                  }
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);
  const location = useLocation();
  const params = useParams();
  const options = {
    appUrl: props.appUrl.replace('http://', 'https://'),
    rewriteLinks: props.rewriteLinks,
    secureLinks: props.exitPageSetting,
    isPost: props.isPost,
  };

  const sendError = () => props.sendPostError(props.postId);

  const htmlSections = getHtml(
    props.body,
    props.jsonMetadata,
    'Object',
    options,
    location,
    props.isPage,
    params.name,
    sendError,
    props.safeLinks,
    props.full,
  );

  return (
    <React.Fragment>
      <div className={classNames('Body', { 'Body--full': props.full })} onClick={handleLinkClick}>
        {htmlSections}
      </div>
      {!isEmpty(withMap) &&
        withMap.map(map => {
          const center = parseGPSCoordinates(map);

          return (
            <Map
              key={map}
              height={300}
              animate
              defaultCenter={center}
              provider={mapProvider}
              defaultZoom={10}
            >
              <Marker anchor={center} />
            </Map>
          );
        })}
    </React.Fragment>
  );
};

Body.propTypes = {
  appUrl: PropTypes.string.isRequired,
  sendPostError: PropTypes.func,
  rewriteLinks: PropTypes.bool.isRequired,
  exitPageSetting: PropTypes.bool.isRequired,
  body: PropTypes.string,
  jsonMetadata: PropTypes.string,
  postId: PropTypes.string,
  full: PropTypes.bool,
  isPage: PropTypes.bool,
  isPost: PropTypes.bool,
  safeLinks: PropTypes.shape({}),
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  full: false,
  isPage: false,
};

export default Body;
