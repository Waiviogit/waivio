import React from 'react';
import PropTypes from 'prop-types';

const AssistantMessage = ({ text }) => (
  <div className="flex">
    {' '}
    <img className="chat-logo-small" src="/images/icons/cryptocurrencies/waiv.png" alt={'Waivio'} />
    <div className="message from-assistant">{text}</div>
  </div>
);

AssistantMessage.propTypes = {
  text: PropTypes.string.isRequired,
};
export default AssistantMessage;
