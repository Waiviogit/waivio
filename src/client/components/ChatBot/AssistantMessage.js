import React from 'react';
import PropTypes from 'prop-types';
import MessageWithAvatars from './MessageWithAvatars';
import TypingText from './TypingText';

const AssistantMessage = React.memo(({ text, loading, lastMessageRef, siteImage, siteName }) => (
  <>
    <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
    <div className="flex">
      {' '}
      <img className="chat-logo-small" src={siteImage} alt={siteName} />
      {!loading && (
        <div className="message from-assistant">
          <MessageWithAvatars text={text} />
        </div>
      )}
      {loading && <TypingText />}
    </div>
  </>
));

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
