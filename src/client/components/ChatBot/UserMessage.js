import React from 'react';
import PropTypes from 'prop-types';
import MessageWithAvatars from './MessageWithAvatars';

const UserMessage = React.memo(({ text, lastMessageRef }) => (
  <>
    <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
    <div className="message from-user">
      <MessageWithAvatars text={text} />
    </div>
  </>
));

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
  lastMessageRef: PropTypes.shape().isRequired,
};
export default UserMessage;
