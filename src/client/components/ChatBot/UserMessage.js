import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';

const UserMessage = ({ text, lastMessageRef }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <div className="message from-user" ref={lastMessageRef}>
      {getHtml(text, {}, 'Object', { appUrl, isChatBotLink: true })}
    </div>
  );
};

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
  lastMessageRef: PropTypes.shape().isRequired,
};
export default UserMessage;
