import React from 'react';
import PropTypes from 'prop-types';
import { getHtml } from '../Story/Body';

const UserMessage = ({ text }) => <div className="message from-user">{getHtml(text)}</div>;

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
export default UserMessage;
