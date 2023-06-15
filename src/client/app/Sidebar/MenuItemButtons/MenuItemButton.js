import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { has } from 'lodash';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

const MenuItemButton = ({ item }) => {
  const [url, setUrl] = useState('');
  const webLink = has(item, 'linkToWeb');
  const linkTarget = webLink ? '_blank' : '_self';
  const defaultButtonType = item.style === 'highlight' ? 'primary' : 'default';
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const title = item?.title || item?.name;

  useEffect(() => {
    if (has(item, 'linkToObject')) {
      switch (item.objectType) {
        case 'list':
          return setUrl(`/object/${authorPermlink}/menu#${item.linkToObject}`);
        case 'page':
          return setUrl(`/object/${authorPermlink}/page#${item.linkToObject}`);
        case 'newsfeed':
          return setUrl(`/object/${authorPermlink}/newsFilter/${item.linkToObject}`);
        case 'widget':
          return setUrl(`/object/${authorPermlink}/widget#${item.linkToObject}`);
        default:
          return setUrl(`/object/${item.linkToObject}`);
      }
    }

    return setUrl(`${item.linkToWeb}`);
  }, []);

  const renderItem = () => {
    switch (item.style) {
      case 'icon':
        return webLink ? (
          <div>
            <a target={linkTarget} href={url} className="MenuItemButtons__link ">
              <img src={item.image} className="MenuItemButtons__icon" alt="pic" />
            </a>
            <a target={linkTarget} href={url} className="MenuItemButtons__link">
              {' '}
              {title}
            </a>
          </div>
        ) : (
          <div>
            <Link target={linkTarget} to={url} className="MenuItemButtons__link ">
              <img src={item.image} className="MenuItemButtons__icon" alt="pic" />
            </Link>
            <Link target={linkTarget} to={url} className="MenuItemButtons__link">
              {' '}
              {title}
            </Link>
          </div>
        );
      case 'image':
        return webLink ? (
          <div>
            <a href={url} target={linkTarget}>
              <img src={item.image} className="MenuItemButtons__image" alt="pic" />
            </a>
          </div>
        ) : (
          <div>
            <Link to={url} target={linkTarget}>
              <img src={item.image} className="MenuItemButtons__image" alt="pic" />
            </Link>
          </div>
        );
      default:
        return webLink ? (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <a target={linkTarget} href={url} className="MenuItemButtons__hideLongTitle">
                {title}
              </a>
            </Button>
          </div>
        ) : (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <Link target={linkTarget} to={url} className="MenuItemButtons__hideLongTitle">
                {title}
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
