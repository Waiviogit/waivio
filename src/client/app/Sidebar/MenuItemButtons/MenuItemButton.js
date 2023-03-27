import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { has } from 'lodash';

const MenuItemButton = ({ item }) => {
  const itemBody = JSON.parse(item.body);
  const linkTo = has(itemBody, 'linkToObject')
    ? `/object/${itemBody.linkToObject}`
    : `${itemBody.linkToWeb}`;
  const defaultButtonType = itemBody.style === 'highlight' ? 'primary' : 'default';

  const renderItem = () => {
    switch (itemBody.style) {
      case 'icon':
        return (
          <div>
            <img src={itemBody.image} className="MenuItemButtons__icon" alt="pic" />
            <a href={linkTo} className="MenuItemButtons__link">
              {' '}
              {itemBody.title}
            </a>
          </div>
        );
      case 'image':
        return (
          <div>
            <a href={linkTo}>
              <img src={itemBody.image} className="MenuItemButtons__image" alt="pic" />
            </a>
          </div>
        );
      default:
        return (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <a href={linkTo}>{itemBody.title}</a>
            </Button>
          </div>
        );
    }
  };

  return <div className="mb2">{renderItem()}</div>;
};

MenuItemButton.propTypes = {
  item: PropTypes.shape().isRequired,
};

export default MenuItemButton;
