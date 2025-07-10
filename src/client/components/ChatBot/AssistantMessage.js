import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import TypingText from './TypingText';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';
import { linkifyText } from '../../../common/helpers/parser';

const AssistantMessage = React.memo(({ text, loading, lastMessageRef, siteImage, siteName }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <>
      <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
      <div className="flex">
        {' '}
        <img className="chat-logo-small" src={siteImage} alt={siteName} />
        {!loading && (
          <div className="message from-assistant">
            {getHtml(linkifyText(text), {}, 'Object', { appUrl, isChatBotLink: true })}
          </div>
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
