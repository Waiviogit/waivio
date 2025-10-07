import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAppUrl } from '../../../store/appStore/appSelectors';
import { renderMessageWithAvatars } from './AssistantMessage';

const UserMessage = React.memo(({ text, lastMessageRef }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <>
      <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
      <div className="message from-user">{renderMessageWithAvatars(text, appUrl)}</div>
    </>
  );
});

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
  lastMessageRef: PropTypes.shape().isRequired,
};
export default UserMessage;
