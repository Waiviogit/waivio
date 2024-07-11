import React from 'react';
import PropTypes from 'prop-types';
import TypingText from './TypingText';
import { parseChatBotLinks } from './chatBotHelper';

const AssistantMessage = ({ text, loading }) => (
  <div className="flex">
    {' '}
    <img className="chat-logo-small" src="/images/icons/cryptocurrencies/waiv.png" alt={'Waivio'} />
    {!loading && (
      <div
        className="message from-assistant"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: parseChatBotLinks(text) }}
      />
    )}
    {loading && <TypingText />}
  </div>
);

AssistantMessage.propTypes = {
  text: PropTypes.string,
  loading: PropTypes.bool,
};

AssistantMessage.defaultProps = {
  loading: false,
};
export default AssistantMessage;
