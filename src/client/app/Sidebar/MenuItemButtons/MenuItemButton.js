import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { has } from 'lodash';
import { Link } from 'react-router-dom';

const MenuItemButton = ({ item }) => {
  const [url, setUrl] = useState('');
  const itemBody = JSON.parse(item.body);
  const webLink = has(itemBody, 'linkToWeb');
  const linkTarget = webLink ? '_blank' : '_self';
  const defaultButtonType = itemBody.style === 'highlight' ? 'primary' : 'default';

  useEffect(() => {
    if (has(itemBody, 'linkToObject')) {
      setUrl(`/object/${item.defaultShowLink}`);
    }

    setUrl(`${itemBody.linkToWeb}`);
  }, []);

  const renderItem = () => {
    switch (itemBody.style) {
      case 'icon':
        return webLink ? (
          <div>
            <a target={linkTarget} href={url} className="MenuItemButtons__link ">
              <img src={itemBody.image} className="MenuItemButtons__icon" alt="pic" />
            </a>
            <a target={linkTarget} href={url} className="MenuItemButtons__link">
              {' '}
              {itemBody.title}
            </a>
          </div>
        ) : (
          <div>
            <Link target={linkTarget} to={url} className="MenuItemButtons__link ">
              <img src={itemBody.image} className="MenuItemButtons__icon" alt="pic" />
            </Link>
            <Link target={linkTarget} to={url} className="MenuItemButtons__link">
              {' '}
              {itemBody.title}
            </Link>
          </div>
        );
      case 'image':
        return webLink ? (
          <div>
            <a href={url} target={linkTarget}>
              <img src={itemBody.image} className="MenuItemButtons__image" alt="pic" />
            </a>
          </div>
        ) : (
          <div>
            <Link to={url} target={linkTarget}>
              <img src={itemBody.image} className="MenuItemButtons__image" alt="pic" />
            </Link>
          </div>
        );
      default:
        return webLink ? (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <a target={linkTarget} href={url} className="MenuItemButtons__hideLongTitle">
                {itemBody.title}
              </a>
            </Button>
          </div>
        ) : (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <Link target={linkTarget} to={url} className="MenuItemButtons__hideLongTitle">
                {itemBody.title}
              </Link>
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
