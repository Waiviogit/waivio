import React from 'react';
import PropTypes from 'prop-types';
import TypingText from './TypingText';
import { getHtml } from '../Story/Body';

const AssistantMessage = ({ text, loading }) => (
  <div className="flex">
    {' '}
    <img className="chat-logo-small" src="/images/icons/cryptocurrencies/waiv.png" alt={'Waivio'} />
    {!loading && <div className="message from-assistant">{getHtml(text)}</div>}
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
