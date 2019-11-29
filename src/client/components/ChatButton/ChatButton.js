import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import classNames from 'classnames';
import './ChatButton.less';

const ChatButton = ({ authentication, openChat, isChat, messagesCount }) => (
  <div className={classNames('ChatButton', { 'hide-element': !authentication || isChat })}>
    <div className={classNames('ChatButton__item')}>
      <Button onClick={openChat} type="primary" shape="circle">
        {// eslint-disable-next-line no-nested-ternary
        !isChat && messagesCount ? (
          messagesCount > 99 ? (
            '99+'
          ) : (
            messagesCount
          )
        ) : !isChat ? (
          !messagesCount ? (
            <Icon style={{ fontSize: '30px', paddingTop: '5px' }} type="message" />
          ) : null
        ) : (
          <Icon style={{ fontSize: '30px' }} type="close" />
        )}
      </Button>
    </div>
  </div>
);

ChatButton.propTypes = {
  isChat: PropTypes.bool.isRequired,
  openChat: PropTypes.func.isRequired,
  authentication: PropTypes.bool.isRequired,
  messagesCount: PropTypes.number,
};

ChatButton.defaultProps = {
  messagesCount: 0,
  screenSize: '',
};

export default ChatButton;
