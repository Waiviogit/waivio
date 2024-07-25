import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import TypingText from './TypingText';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';

const AssistantMessage = ({ text, loading, lastMessageRef }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <div className="flex" ref={lastMessageRef}>
      {' '}
      <img
        className="chat-logo-small"
        src="/images/icons/cryptocurrencies/waiv.png"
        alt={'Waivio'}
      />
      {!loading && (
        <div className="message from-assistant">
          {getHtml(text, {}, 'Object', { appUrl, isChatBotLink: true })}
        </div>
      )}
      {loading && <TypingText />}
    </div>
  );
};

AssistantMessage.propTypes = {
  text: PropTypes.string,
  loading: PropTypes.bool,
  lastMessageRef: PropTypes.shape().isRequired,
};

AssistantMessage.defaultProps = {
  loading: false,
};
export default AssistantMessage;
