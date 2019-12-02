import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import classNames from 'classnames';
import './ChatButton.less';

const ChatButton = ({ authentication, openChat, isChat, messagesCount }) => {
  const getButtonContent = () => {
    if (!isChat && messagesCount) {
      if (messagesCount > 99) {
        return '99+';
      }
      return messagesCount;
    }
    return <Icon style={{ fontSize: '30px', paddingTop: '5px' }} type="message" />;
  };
  return (
    <div className={classNames('ChatButton', { 'hide-element': !authentication || isChat })}>
      <div className={classNames('ChatButton__item')}>
        <Button onClick={openChat} type="primary" shape="circle">
          {getButtonContent()}
        </Button>
      </div>
    </div>
  );
};

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
