import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getHtml } from '../Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';
import { linkifyText } from '../../../common/helpers/parser';

const UserMessage = React.memo(({ text, lastMessageRef }) => {
  const appUrl = useSelector(getAppUrl);

  return (
    <>
      <div ref={lastMessageRef} style={{ marginBottom: '20px' }} />
      <div className="message from-user">
        {getHtml(linkifyText(text), {}, 'Object', { appUrl, isChatBotLink: true })}
      </div>
    </>
  );
});

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
  lastMessageRef: PropTypes.shape().isRequired,
};
export default UserMessage;
