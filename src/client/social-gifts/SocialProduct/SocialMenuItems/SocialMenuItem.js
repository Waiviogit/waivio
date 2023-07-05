import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { has } from 'lodash';
import { Icon } from 'antd';
import MenuItemContentSwitcher from './MenuItemContentSwitcher';

const SocialMenuItem = ({ item, isOpen }) => {
  const [open, setOpen] = useState(isOpen);
  const history = useHistory();
  const itemBody = JSON.parse(item.body);
  const webLink = has(itemBody, 'linkToWeb');
  const linkTarget = webLink ? '_blank' : '_self';
  const isImageButton = ['image', 'icon'].includes(itemBody.style);
  const isNestedObjType = ['page', 'list', 'newsfeed', 'widget'].includes(itemBody.objectType);

  const handleOpenItem = () => {
    if ((isImageButton && !isNestedObjType) || !isNestedObjType) {
      history.push(`/object/product/${itemBody.linkToObject}`);
    } else {
      setOpen(!open);
    }
  };
  const getimagesLayout = () => {
    switch (itemBody.style) {
      case 'icon':
        return webLink ? (
          <div>
            <a target={linkTarget} href={itemBody.linkToWeb} className="SocialMenuItems__link ">
              <img src={itemBody.image} className="SocialMenuItems__icon" alt="pic" />
            </a>
            <a target={linkTarget} href={itemBody.linkToWeb} className="SocialMenuItems__link">
              {' '}
              {itemBody.title}
            </a>
          </div>
        ) : (
          <span>
            <span className="SocialMenuItems__link ">
              <img src={itemBody.image} className="SocialMenuItems__icon" alt="pic" />
            </span>
            <span className="SocialMenuItems__link"> {itemBody.title}</span>
          </span>
        );
      case 'image':
        return webLink ? (
          <div>
            <a href={itemBody.linkToWeb} target={linkTarget}>
              <img src={itemBody.image} className="SocialMenuItems__image" alt="pic" />
            </a>
          </div>
        ) : (
          <img src={itemBody.image} className="SocialMenuItems__image" alt="pic" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="SocialMenuItems__container">
      <div className="SocialMenuItems__item" onClick={handleOpenItem}>
        <div className="SocialMenuItems__item-title">
          {isImageButton ? getimagesLayout() : itemBody.title}
        </div>
        {(isNestedObjType || webLink) && (
          <Icon type={open ? 'minus' : 'plus'} style={{ fontSize: '20px' }} />
        )}
      </div>
      <div className={`SocialMenuItems__content ${open ? 'SocialMenuItems__content--open' : ''}`}>
        {open && <MenuItemContentSwitcher item={item} />}
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
