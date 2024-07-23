import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';

const UserMessage = ({ text }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <div className="message from-user">
      {getHtml(text, {}, 'Object', { appUrl, isChatBotLink: true })}
    </div>
  );
};

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
export default UserMessage;
