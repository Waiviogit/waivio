import React from 'react';
import PropTypes from 'prop-types';
import { BackTop, Button } from 'antd';
import classNames from 'classnames';
import './Chat/Chat';
import './BBackTop.less';

export default function BBackTop({ className, isModal, openChat, ...otherProps }) {
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
      <div className="BBackTop__chat-button">
        <Button onClick={openChat} type="primary" shape="circle" icon="message" />
      </div>
    </div>
  );
}

BBackTop.propTypes = {
  className: PropTypes.string,
  isModal: PropTypes.bool,
  openChat: PropTypes.func.isRequired,
};

BBackTop.defaultProps = {
  className: '',
  isModal: false,
};
