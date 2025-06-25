import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { has } from 'lodash';
import { useDispatch } from 'react-redux';
import { Icon } from 'antd';
import MenuItemContentSwitcher from './MenuItemContentSwitcher';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';

const SocialMenuItem = ({ item, isOpen }) => {
  const [open, setOpen] = useState(isOpen);
  const history = useHistory();
  const itemBody = JSON.parse(item.body);
  const dispatch = useDispatch();
  const webLink = has(itemBody, 'linkToWeb');
  const linkTarget = webLink ? '_blank' : '_self';
  const isImageButton = ['image', 'icon'].includes(itemBody.style);
  const isNestedObjType = ['page', 'list', 'newsfeed', 'widget'].includes(itemBody.objectType);
  const shopObj = itemBody.objectType === 'shop';
  const historyPushObjType = !isNestedObjType && !webLink && !shopObj;

  const handleOpenItem = () => {
    if ((isImageButton && historyPushObjType) || historyPushObjType) {
      history.push(`/object/${itemBody.linkToObject}`);
    } else if (webLink) {
      setOpen(false);
    } else if (shopObj) {
      history.push(`/object-shop/${itemBody.linkToObject}`);
      setOpen(false);
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const getimagesLayout = () => {
    switch (itemBody.style) {
      case 'icon':
        return webLink ? (
          <div>
            <a
              onClick={() => dispatch(setLinkSafetyInfo(itemBody.linkToWeb))}
              className="SocialMenuItems__link"
            >
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
            <a onClick={() => dispatch(setLinkSafetyInfo(itemBody.linkToWeb))}>
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

  const content = (
    <>
      {' '}
      {isNestedObjType && <Icon type={open ? 'minus' : 'plus'} style={{ fontSize: '24px' }} />}
      <div
        className={
          isNestedObjType ? 'SocialMenuItems__item-title--nested' : 'SocialMenuItems__item-title'
        }
      >
        {isImageButton ? getimagesLayout() : itemBody.title}
      </div>
    </>
  );

  return (
    <div className="SocialMenuItems__container">
      {webLink ? (
        <a
          className="SocialMenuItems__item"
          onClick={() => dispatch(setLinkSafetyInfo(itemBody.linkToWeb))}
        >
          {content}
        </a>
      ) : (
        <div className="SocialMenuItems__item" onClick={handleOpenItem}>
          {content}
        </div>
      )}
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
