import React from 'react';
import PropTypes from 'prop-types';
import { BackTop, Button } from 'antd';
import classNames from 'classnames';
import './Chat/Chat';
import './BBackTop.less';

export default function BBackTop({
  className,
  isModal,
  isChat,
  authentication,
  openChat,
  messagesCount,
  ...otherProps
}) {
  return (
    <div className="BBackTop">
      <div
        className={classNames(className, 'BBackTop__container', {
          'BBackTop__container--shifted': isModal,
        })}
      >
        {authentication ? (
          <div className={classNames('BBackTop__chat-button')}>
            <Button
              onClick={openChat}
              type="primary"
              shape="circle"
              icon={
                // eslint-disable-next-line no-nested-ternary
                !isChat ? (!messagesCount ? 'message' : null) : 'close'
              }
            >
              {// eslint-disable-next-line no-nested-ternary
              !isChat && messagesCount ? (messagesCount > 99 ? '99+' : messagesCount) : null}
            </Button>
          </div>
        ) : null}
        <BackTop className="BBackTop_button" {...otherProps}>
          <i className="iconfont icon-back-top" />
        </BackTop>
      </div>
    </div>
  );
}

BBackTop.propTypes = {
  className: PropTypes.string,
  isModal: PropTypes.bool,
  isChat: PropTypes.bool.isRequired,
  openChat: PropTypes.func.isRequired,
  authentication: PropTypes.bool.isRequired,
  messagesCount: PropTypes.number,
};

BBackTop.defaultProps = {
  className: '',
  isModal: false,
  messagesCount: 0,
};
