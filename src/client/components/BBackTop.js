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
  ...otherProps
}) {
  return (
    <div className="BBackTop">
      <div
        className={classNames(className, 'BBackTop__container', {
          'BBackTop__container--shifted': isModal,
        })}
      >
        <BackTop className="BBackTop_button" {...otherProps}>
          <i className="iconfont icon-back-top" />
        </BackTop>
      </div>
      {authentication ? (
        <div className="BBackTop__chat-button">
          <Button
            onClick={openChat}
            type="primary"
            shape="circle"
            icon={!isChat ? 'message' : 'close'}
          />
        </div>
      ) : null}
    </div>
  );
}

BBackTop.propTypes = {
  className: PropTypes.string,
  isModal: PropTypes.bool,
  isChat: PropTypes.bool.isRequired,
  openChat: PropTypes.func.isRequired,
  authentication: PropTypes.bool.isRequired,
};

BBackTop.defaultProps = {
  className: '',
  isModal: false,
};
