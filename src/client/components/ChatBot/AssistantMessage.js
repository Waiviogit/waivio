import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import TypingText from './TypingText';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';
import { linkifyText, getPreviousLink } from '../../../common/helpers/parser';

export const processAvatarLinks = mess => {
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\)/g;
  let processedText = mess;

  processedText = processedText.replace(markdownImageRegex, (match, altText, imageUrl) => {
    const previousLink = getPreviousLink(mess, imageUrl);

    if (previousLink && previousLink.includes('/object/')) {
      return `__AVATAR_LINK__${imageUrl}__${previousLink}__${altText}__END_AVATAR__`;
    }

    return match;
  });

  return processedText;
};

export const renderMessageWithAvatars = (mess, appUrl) => {
  const linkifiedText = linkifyText(mess);
  const processedText = processAvatarLinks(linkifiedText);
  const parts = processedText.split(/__AVATAR_LINK__(.*?)__END_AVATAR__/g);
  const handleAvatarClick = objectName => {
    window.open(`/object/${objectName}`, '_blank');
  };

  return parts.map((part, index) => {
    if (part.includes('__') && part.includes('__') && !part.includes('__AVATAR_LINK__')) {
      const avatarData = part.split('__').filter(Boolean);

      if (avatarData.length >= 3) {
        const [imageUrl, objectName, altText] = avatarData;

        return (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={altText}
            style={{
              cursor: 'pointer',
            }}
            onClick={() => handleAvatarClick(objectName)}
          />
        );
      }
    }

    if (part.trim() && !part.includes('__AVATAR_LINK__') && !part.includes('__END_AVATAR__')) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <span key={index}>{getHtml(part, {}, 'Object', { appUrl, isChatBotLink: true })}</span>
      );
    }

    return null;
  });
};

const AssistantMessage = React.memo(({ text, loading, lastMessageRef, siteImage, siteName }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <>
      <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
      <div className="flex">
        {' '}
        <img className="chat-logo-small" src={siteImage} alt={siteName} />
        {!loading && (
          <div className="message from-assistant">{renderMessageWithAvatars(text, appUrl)}</div>
        )}
        {loading && <TypingText />}
      </div>
    </>
  );
});

AssistantMessage.propTypes = {
  text: PropTypes.string,
  siteName: PropTypes.string,
  siteImage: PropTypes.string,
  loading: PropTypes.bool,
  lastMessageRef: PropTypes.shape().isRequired,
};

AssistantMessage.defaultProps = {
  loading: false,
};
export default AssistantMessage;
