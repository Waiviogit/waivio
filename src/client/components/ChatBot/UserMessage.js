import React from 'react';
import PropTypes from 'prop-types';

const UserMessage = ({ text }) => <div className="message from-user">{text}</div>;

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
export default UserMessage;
