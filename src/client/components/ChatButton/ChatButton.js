import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import classNames from 'classnames';
import { getScreenSize } from '../../reducers';
import './ChatButton.less';

const ChatButton = ({ authentication, openChat, isChat, messagesCount, screenSize }) => {
  const isMobile = screenSize === 'xsmall' || screenSize === 'small';
  return (
    <div className={classNames('ChatButton', { 'hide-element': !authentication || isMobile })}>
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
              <Icon style={{ fontSize: '30px' }} type="message" />
            ) : null
          ) : (
            <Icon style={{ fontSize: '30px' }} type="close" />
          )}
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
  screenSize: PropTypes.string,
};

ChatButton.defaultProps = {
  messagesCount: 0,
  screenSize: '',
};

export default connect(state => ({
  screenSize: getScreenSize(state),
}))(ChatButton);
