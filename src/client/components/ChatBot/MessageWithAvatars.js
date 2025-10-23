import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';
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

  const extractObjectLinks = t => {
    if (!t || typeof t !== 'string') return [];
    const patterns = [
      /\/object\/([^\s)\]]+)/g,
      /https?:\/\/[^/]+\/object\/([^\s)\]]+)/g,
      /\[([^\]]+)]\(\/object\/([^\s)\]]+)\)/g,
      /\[([^\]]+)]\(https?:\/\/[^/]+\/object\/([^\s)\]]+)\)/g,
    ];
    const matches = new Set();

    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of patterns) {
      let match;

      // eslint-disable-next-line no-cond-assign
      while ((match = pattern.exec(t)) !== null) {
        const objectLink = match[2] || match[1];

        if (objectLink) matches.add(objectLink.split('/')[0]);
      }
    }

    return Array.from(matches);
  };

  const getObjectForImage = imageUrl => {
    // eslint-disable-next-line no-restricted-syntax
    for (const obj of Object.values(objectData)) {
      // eslint-disable-next-line no-continue
      if (!obj?.avatar) continue;
      const avatar = obj.avatar;
      const proxyAvatar = getProxyImageURL(avatar, 'preview');
      const avatarFile = avatar
        .split('?')[0]
        .split('/')
        .pop();
      const proxyFile = proxyAvatar
        .split('?')[0]
        .split('/')
        .pop();
      const imageFile = imageUrl
        .split('?')[0]
        .split('/')
        .pop();

      if (
        [avatar, proxyAvatar].includes(imageUrl) ||
        imageUrl.includes(avatar) ||
        avatar.includes(imageUrl) ||
        imageFile === avatarFile ||
        imageFile === proxyFile
      ) {
        return obj;
      }
    }

    return null;
  };

  useEffect(() => {
    const objectLinks = extractObjectLinks(text);

    if (!objectLinks.length) return;

    let isCancelled = false;

    setIsLoading(true);

    getObjectInfo(objectLinks, locale, host)
      .then(response => {
        if (isCancelled) return;
        const objectMap = {};

        response?.wobjects?.forEach(obj => {
          objectMap[obj.author_permlink] = obj;
        });
        setObjectData(objectMap);
      })
      .catch(err => {
        if (!isCancelled) console.error('Error fetching object info:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
    };
  }, [text, locale, host]);

  // eslint-disable-next-line react/prop-types
  const SafeImage = ({ src, alt }) => {
    const [error, setError] = useState(false);

    if (error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#f5f5f5',
            border: '2px dashed #ccc',
            height: 200,
            color: '#666',
            fontSize: 14,
            textAlign: 'center',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: 24 }}>🖼️</div>
          <div style={{ marginTop: -10 }}>
            Image not available
            <br />
            <p>
              {' '}
              <a href={src} target="_blank" rel="noopener noreferrer">
                View original
              </a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <a href={src} target="_blank" rel="noopener noreferrer">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
          style={{ maxWidth: '100%', margin: '10px 0' }}
        />
      </a>
    );
  };

  const processedParts = useMemo(() => {
    if (!text) return [];
    const parts = [];
    const preprocessed = text.replace(
      /^(\s*)[-•·*](\s*)(!\[[^\]]*\]\(https?:\/\/[^)]+\))/gm,
      '$1$3',
    );

    const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(preprocessed)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = preprocessed.slice(lastIndex, match.index);

        if (beforeText)
          parts.push(
            <span key={`text-${lastIndex}`}>
              {getHtml(beforeText, {}, 'Object', { appUrl, isChatBotLink: true })}
            </span>,
          );
      }

      let imageUrl = match[2].trim();

      if (!imageUrl.startsWith('http')) imageUrl = `https://${imageUrl}`;

      const obj = getObjectForImage(imageUrl);

      if (obj && !isLoading) {
        parts.push(
          <ObjectAvatarPicture
            key={`img-avatar-${match.index}`}
            object={obj}
            className="object-avatar-large"
          />,
        );
      } else {
        parts.push(
          <SafeImage key={`img-${match.index}`} src={imageUrl} alt={match[1] || 'image'} />,
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < preprocessed.length) {
      const remaining = preprocessed.slice(lastIndex);

      if (remaining)
        parts.push(
          <span key={`remaining-${lastIndex}`}>
            {getHtml(remaining, {}, 'Object', { appUrl, isChatBotLink: true })}
          </span>,
        );
    }

    return parts;
  }, [text, objectData, isLoading, appUrl]);

  return <span>{processedParts}</span>;
};

MessageWithAvatars.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MessageWithAvatars;
