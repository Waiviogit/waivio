import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ChatWindow from './ChatBot/ChatWindow';
import './BBackTop.less';

export default function BBackTop({ className, isModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    typeof window !== 'undefined' && (
      <>
        <div className="BBackTop">
          <div
            className={classNames(className, 'BBackTop__container', {
              'BBackTop__container--shifted': isModal,
            })}
          >
            <div className="BBackTop_button-ai" onClick={toggleChat}>
              AI
            </div>
          </div>
        </div>
        <ChatWindow
          className={isOpen ? 'open' : 'closed'}
          open={isOpen}
          hideChat={() => setIsOpen(false)}
        />
      </>
    )
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
