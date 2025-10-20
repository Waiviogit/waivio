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
    const preprocessedText = t.replace(
      /^(\s*)[-•·*](\s*)(!\[[^\]]*\]\(https?:\/\/[^)]+\))/gm,
      '$1$3',
    );

    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while ((match = markdownImageRegex.exec(preprocessedText)) !== null) {
      if (match.index > lastIndex) {
        let beforeText = preprocessedText.slice(lastIndex, match.index);

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

      let imageUrl = match[2];

      imageUrl = imageUrl.trim();

      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        imageUrl = `https://${imageUrl}`;
      }

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
          <div
            key={`img-container-${match.index}`}
            style={{ textAlign: 'center', margin: '10px 0' }}
          >
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ cursor: 'pointer' }}
            >
              <img
                key={`img-${match.index}`}
                src={imageUrl}
                alt={match[1] || 'image'}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={e => {
                  e.target.style.display = 'none';
                  const fallbackDiv = document.createElement('div');

                  fallbackDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background-color: #f5f5f5;
                    border: 2px dashed #ccc;
         height:200px;
                    color: #666;
                    font-size: 14px;
                    text-align: center;
      
                  `;
                  fallbackDiv.innerHTML = `
                    <div style="height: 200px" >
                      <div style="font-size: 24px; ">🖼️</div>
                      <div style="margin-top: -20px;">Image not available
                      <p>  <a href="${imageUrl}" target="_blank" style=" text-decoration: none;">
                          View original
                        </a></p></div>
                
                    </div>
                  `;
                  e.target.parentNode.replaceChild(fallbackDiv, e.target);
                }}
              />
            </a>
          </div>,
        );
      }

      const afterImageIndex = match.index + match[0].length;
      const nextChar = preprocessedText[afterImageIndex];

      if (nextChar === ')') {
        lastIndex = afterImageIndex + 1;
      } else {
        lastIndex = afterImageIndex;
      }
    }

    if (lastIndex < preprocessedText.length) {
      let remainingText = preprocessedText.slice(lastIndex);

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

    return parts.length > 0 ? parts : [<span key="fallback">{preprocessedText}</span>];
  };

  return <span>{processTextWithImagesAndLinks(text)}</span>;
};

MessageWithAvatars.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MessageWithAvatars;
