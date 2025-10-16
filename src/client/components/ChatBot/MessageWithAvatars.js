import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getProxyImageURL } from '../../../common/helpers/image';
import { getAppUrl, getUsedLocale, getAppHost } from '../../../store/appStore/appSelectors';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { getHtml } from '../Story/Body';
import ObjectAvatarPicture from './ObjectAvatarPicture';

const MessageWithAvatars = ({ text }) => {
  const appUrl = useSelector(getAppUrl);
  const locale = useSelector(getUsedLocale);
  const host = useSelector(getAppHost);
  const [objectData, setObjectData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!text || typeof text !== 'string') {
    return <span />;
  }

  const extractObjectLinks = t => {
    const patterns = [
      /\/object\/([^\s)\]]+)/g,
      /https?:\/\/[^/]+\/object\/([^\s)\]]+)/g,
      /\[([^\]]+)]\(\/object\/([^\s)\]]+)\)/g,
      /\[([^\]]+)]\(https?:\/\/[^/]+\/object\/([^\s)\]]+)\)/g,
    ];

    const matches = [];

    patterns.forEach(pattern => {
      let match;

      // eslint-disable-next-line no-cond-assign
      while ((match = pattern.exec(t)) !== null) {
        const objectLink = match[2] || match[1];

        const cleanObjectLink = objectLink.split('/')[0];

        matches.push(cleanObjectLink);
      }
    });

    return [...new Set(matches)];
  };

  const getObjectForImage = imageUrl => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, objectInfo] of Object.entries(objectData)) {
      if (objectInfo && objectInfo.avatar) {
        const objectAvatar = objectInfo.avatar;
        const proxyAvatar = getProxyImageURL(objectAvatar, 'preview');

        const matches = [
          imageUrl === objectAvatar,
          imageUrl === proxyAvatar,
          imageUrl.includes(objectAvatar),
          objectAvatar.includes(imageUrl),

          imageUrl
            .split('?')[0]
            .split('/')
            .pop() ===
            objectAvatar
              .split('?')[0]
              .split('/')
              .pop(),
          proxyAvatar
            .split('?')[0]
            .split('/')
            .pop() ===
            imageUrl
              .split('?')[0]
              .split('/')
              .pop(),
        ];

        if (matches.some(match => match)) {
          return objectInfo;
        }
      }
    }

    return null;
  };

  useEffect(() => {
    const objectLinks = extractObjectLinks(text);

    if (objectLinks.length > 0) {
      setIsLoading(true);
      getObjectInfo(objectLinks, locale, host)
        .then(response => {
          if (response && response.wobjects) {
            const objectMap = {};

            response.wobjects.forEach(obj => {
              objectMap[obj.author_permlink] = obj;
            });
            setObjectData(objectMap);
          }
        })
        .catch(error => {
          console.error('Error fetching object info:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [text, locale, host]);

  const processTextWithImagesAndLinks = t => {
    const parts = [];

    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while ((match = markdownImageRegex.exec(t)) !== null) {
      if (match.index > lastIndex) {
        let beforeText = t.slice(lastIndex, match.index);

        if (beforeText.endsWith('(')) {
          beforeText = beforeText.slice(0, -1);
        }

        if (beforeText) {
          parts.push(
            <span key={`text-${lastIndex}`}>
              {getHtml(beforeText, {}, 'Object', { appUrl, isChatBotLink: true })}
            </span>,
          );
        }
      }

      const imageUrl = match[2];
      const fullMatch = match[0];

      const objectInfo = getObjectForImage(imageUrl);

      if (objectInfo && !isLoading) {
        parts.push(
          <ObjectAvatarPicture
            key={`img-avatar-${match.index}`}
            object={objectInfo}
            className="object-avatar-large"
          />,
        );
      } else {
        parts.push(
          <img
            key={`img-${match.index}`}
            src={imageUrl}
            alt={match[1] || 'image'}
            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', margin: '4px' }}
            onError={e => {
              e.target.style.display = 'none';
              const fallbackSpan = document.createElement('span');

              fallbackSpan.innerHTML = getHtml(fullMatch, {}, 'Object', {
                appUrl,
                isChatBotLink: true,
              });
              e.target.parentNode.replaceChild(fallbackSpan, e.target);
            }}
          />,
        );
      }

      const afterImageIndex = match.index + match[0].length;
      const nextChar = text[afterImageIndex];

      if (nextChar === ')') {
        lastIndex = afterImageIndex + 1;
      } else {
        lastIndex = afterImageIndex;
      }
    }

    if (lastIndex < text.length) {
      let remainingText = text.slice(lastIndex);

      if (remainingText.startsWith(')')) {
        remainingText = remainingText.slice(1);
      }

      if (remainingText) {
        parts.push(
          <span key={`remaining-${lastIndex}`}>
            {getHtml(remainingText, {}, 'Object', { appUrl, isChatBotLink: true })}
          </span>,
        );
      }
    }

    return parts.length > 0 ? parts : [<span key="fallback">{text}</span>];
  };

  return <span>{processTextWithImagesAndLinks(text)}</span>;
};

MessageWithAvatars.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MessageWithAvatars;
