import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BackTop } from 'antd';
import { useSelector } from 'react-redux';
import ChatWindow from './ChatBot/ChatWindow';
import { getIsWaivio } from '../../store/appStore/appSelectors';
import './BBackTop.less';

export default function BBackTop({ className, isModal, ...otherProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const isWaivio = useSelector(getIsWaivio);
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="BBackTop">
        <div
          className={classNames(className, 'BBackTop__container', {
            'BBackTop__container--shifted': isModal,
          })}
        >
          {isWaivio ? (
            <div className="BBackTop_button-ai" onClick={toggleChat}>
              AI
            </div>
          ) : (
            <BackTop className="BBackTop_button" {...otherProps}>
              <i className="iconfont icon-back-top" />
            </BackTop>
          )}
        </div>
      </div>
      <ChatWindow className={isOpen ? 'open' : 'closed'} hideChat={() => setIsOpen(false)} />
    </>
  );
}

BBackTop.propTypes = {
  className: PropTypes.string,
  isModal: PropTypes.bool,
};

BBackTop.defaultProps = {
  className: '',
  isModal: false,
};
