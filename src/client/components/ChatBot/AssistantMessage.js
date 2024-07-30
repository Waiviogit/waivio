import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import TypingText from './TypingText';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';

export const linkifyText = text => {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\)/g;

  const parts = text.split(markdownLinkRegex);

  return parts
    .reduce((acc, part, index) => {
      if (index % 3 === 0) {
        acc.push(part.replace(urlRegex, url => `<${url}>`));
      } else if (index % 3 === 1) {
        acc.push(`[${part}]`);
      } else if (index % 3 === 2) {
        acc.push(`(${part})&nbsp;`);
      }

      return acc;
    }, [])
    .join('');
};

const AssistantMessage = ({ text, loading, lastMessageRef }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <>
      <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
      <div className="flex">
        {' '}
        <img
          className="chat-logo-small"
          src="/images/icons/cryptocurrencies/waiv.png"
          alt={'Waivio'}
        />
        {!loading && (
          <div className="message from-assistant">
            {getHtml(linkifyText(text), {}, 'Object', { appUrl, isChatBotLink: true })}
          </div>
        )}
        {loading && <TypingText />}
      </div>
    </>
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
