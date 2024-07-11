import React from 'react';
import PropTypes from 'prop-types';
import { parseChatBotLinks } from './chatBotHelper';

const UserMessage = ({ text }) => (
  <div
    className="message from-user"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: parseChatBotLinks(text) }}
  />
);

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
export default UserMessage;
