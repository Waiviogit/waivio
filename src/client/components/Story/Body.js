import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { isUndefined, filter, isEmpty } from 'lodash';
import { useLocation, useParams } from 'react-router';
import classNames from 'classnames';
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
  // if (options.isChatBotLink) parsedBody = addExplicitNumbersToLists(parsedBody);
  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };

  parsedBody = htmlReady(parsedBody, htmlReadyOptions, returnType).html;

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
    }),
  );

  if (body.length - parsedBody.length > 1000 && sendPostError) {
    sendPostError();
  }

  if (returnType === 'text') {
    return parsedBody;
  }

  parsedBody = parsedBody.replace(/~~~ embed:(\S+) (\S+) (\S+) ~~~/g, (a, embedId, c, url) => {
    const embed = getEmbed(url);

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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      Array.from(document.body.getElementsByTagName('img')).forEach(imgNode => {
        // eslint-disable-next-line no-param-reassign
        imgNode.onerror = () => {
          // eslint-disable-next-line no-param-reassign
          imgNode.src = imgNode.alt;
          // eslint-disable-next-line no-param-reassign
          imgNode.alt = '/images/icons/no-image.png';
        };
      });
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
  );

  return (
    <React.Fragment>
      <div className={classNames('Body', { 'Body--full': props.full })}>{htmlSections}</div>
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
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  full: false,
  isPage: false,
};

export default Body;
