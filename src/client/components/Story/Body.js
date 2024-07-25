import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { isUndefined, filter, isEmpty } from 'lodash';
import { useLocation } from 'react-router';
import classNames from 'classnames';
import sanitizeHtml from 'sanitize-html';
import Remarkable from 'remarkable';
import steemEmbed from '../../vendor/embedMedia';
import { jsonParse } from '../../../common/helpers/formatter';
import sanitizeConfig from '../../vendor/SanitizeConfig';
import { imageRegex, rewriteRegex, videoPreviewRegex } from '../../../common/helpers/regexHelpers';
import htmlReady from '../../vendor/steemitHtmlReady';
import improve from '../../../common/helpers/improve';
import { extractLinks } from '../../../common/helpers/parser';
import { getBodyLink } from '../EditorExtended/util/videoHelper';
import PostFeedEmbed from './PostFeedEmbed';
import AsyncVideo from '../../vendor/asyncVideo';
import { addBreakLines, addPeakdImage, addSpaces } from '../../../common/helpers/editorHelper';

import './Body.less';

export const remarkable = new Remarkable({
  html: true,
  breaks: true,
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
});

const getEmbed = link => {
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

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
export function getHtml(
  body,
  jsonMetadata = {},
  returnType = 'Object',
  options = { isChatBotLink: false },
  location,
  isPage,
) {
  const parsedJsonMetadata = jsonParse(jsonMetadata) || {};

  parsedJsonMetadata.image = parsedJsonMetadata.image ? [...parsedJsonMetadata.image] : [];
  if (!body) return '';
  let parsedBody = body?.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

  parsedBody = addPeakdImage(parsedBody);

  parsedBody?.replace(imageRegex, img => {
    if (filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
      parsedJsonMetadata.image.push(img);
    }
  });

  const videoPreviewResult = parsedBody.match(videoPreviewRegex);

  if (videoPreviewResult) {
    const videoLink = getBodyLink(videoPreviewResult);

    if (videoLink) parsedBody = parsedBody?.replace(videoPreviewResult[0], videoLink);
  }

  parsedBody = improve(parsedBody);
  parsedBody = addSpaces(parsedBody);
  parsedBody = addBreakLines(parsedBody);
  parsedBody = remarkable.render(parsedBody);
  const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };

  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;

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
      isChatBotLink: options.isChatBotLink,
    }),
  );

  if (returnType === 'text') {
    return parsedBody;
  }

  const sections = [];

  const splittedBody = parsedBody.split('~~~ embed:');

  for (let i = 0; i < splittedBody.length; i += 1) {
    let section = splittedBody[i];
    const extractedLinks = extractLinks(section);
    const match = section.match(/^([A-Za-z0-9./_@:,?=&;-]+) ([A-Za-z0-9@:/]+) (\S+) ~~~/);

    if (match && match.length >= 4) {
      const id = match[1];
      const type = match[2];
      const link = match[3] && match[3].replace('&amp;', '&');
      const embed = getEmbed(link);

      if (link.includes('odysee.com')) {
        sections.push({
          component: <AsyncVideo url={link} />,
        });
      } else {
        sections.push(
          ReactDOMServer.renderToString(
            <PostFeedEmbed key={`embed-a-${i}`} inPost embed={embed} />,
          ),
        );
      }
      section = section.substring(`${id} ${type} ${link} ~~~`.length);
    }
    if (!isEmpty(extractedLinks)) {
      const uniqueLinks = extractedLinks.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        [],
      );

      // eslint-disable-next-line no-loop-func
      uniqueLinks.forEach(item => {
        let link = item;

        if (link.includes('3speak.tv/watch/')) {
          const type = 'video';
          const embed = getEmbed(link);

          link = link.substring(` ${type} ${link}`.length);

          sections.push(
            ReactDOMServer.renderToString(
              <PostFeedEmbed key={`embed-a-${item}`} inPost embed={embed} />,
            ),
          );
        }
      });
    }

    if (section !== '') {
      sections.push(section);
    }
  }

  return sections.map(content => {
    if (content.component) return content.component;

    // eslint-disable-next-line react/no-danger
    return <div key={content} dangerouslySetInnerHTML={{ __html: content }} />;
  });
}

const Body = props => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      Array.from(document.body.getElementsByTagName('img')).forEach(imgNode => {
        // eslint-disable-next-line no-param-reassign
        imgNode.onerror = () => {
          // eslint-disable-next-line no-param-reassign
          imgNode.src = imgNode.alt;
        };
      });
    }
  }, []);

  const location = useLocation();
  const options = {
    appUrl: props.appUrl.replace('http://', 'https://'),
    rewriteLinks: props.rewriteLinks,
    secureLinks: props.exitPageSetting,
  };
  const htmlSections = getHtml(
    props.body,
    props.jsonMetadata,
    'Object',
    options,
    location,
    props.isPage,
  );

  return <div className={classNames('Body', { 'Body--full': props.full })}>{htmlSections}</div>;
};

Body.propTypes = {
  appUrl: PropTypes.string.isRequired,
  rewriteLinks: PropTypes.bool.isRequired,
  exitPageSetting: PropTypes.bool.isRequired,
  body: PropTypes.string,
  jsonMetadata: PropTypes.string,
  full: PropTypes.bool,
  isPage: PropTypes.bool,
};

Body.defaultProps = {
  body: '',
  jsonMetadata: '',
  full: false,
  isPage: false,
};

export default Body;
