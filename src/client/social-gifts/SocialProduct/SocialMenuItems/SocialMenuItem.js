import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const SocialMenuItem = ({ item, isOpen }) => {
  const [open, setOpen] = useState(isOpen);
  const itemBody = JSON.parse(item.body);

  const handleOpenItem = () => {
    setOpen(!open);
  };

  return (
    <div className="SocialMenuItems__container">
      <div className="SocialMenuItems__item" onClick={handleOpenItem}>
        <div className="SocialMenuItems__item-title">{itemBody.title}</div>
        <Icon type={open ? 'minus' : 'plus'} style={{ fontSize: '20px' }} />
      </div>
      <div className={`SocialMenuItems__content ${open ? 'SocialMenuItems__content--open' : ''}`}>
        content
      </div>
    </div>
  );
};

SocialMenuItem.propTypes = {
  item: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool,
};

SocialMenuItem.defaultProps = {
  isOpen: false,
};
export default SocialMenuItem;
