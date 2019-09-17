import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Chat.less';

const Chat = ({ visibility }) => {
  console.log('visibility', visibility);
  return (
    <div
      className={classNames('Chat', {
        'hide-element': visibility,
      })}
    >
      Wellcome to the chat
    </div>
  );
};

Chat.propTypes = {
  visibility: PropTypes.bool.isRequired,
};

export default Chat;
