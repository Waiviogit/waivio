import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { Button } from 'antd';
import { has } from 'lodash';
import { getObject } from '../../../../waivioApi/ApiClient';

const MenuItemButton = ({ item }) => {
  const [url, setUrl] = useState('');
  const itemBody = JSON.parse(item.body);
  const linkTarget = has(itemBody, 'linkToWeb') ? '_blank' : '_self';
  const defaultButtonType = itemBody.style === 'highlight' ? 'primary' : 'default';
  const match = useRouteMatch();
  const authorPermlink = match.params.name;

  useEffect(() => {
    if (has(itemBody, 'linkToObject')) {
      getObject(itemBody.linkToObject).then(res => {
        switch (res.object_type) {
          case 'list':
            return setUrl(`/object/${authorPermlink}/menu#${itemBody.linkToObject}`);
          case 'page':
            return setUrl(`/object/${authorPermlink}/page#${itemBody.linkToObject}`);
          case 'newsfeed':
            return setUrl(
              `/object/${authorPermlink}/newsFilter/${res.newsFeed.permlink}?parentObj=${res.author_permlink}`,
            );
          // case 'widget':
          //   return setUrl(`/object/${authorPermlink}/widget#${res.author_permlink}`)
          default:
            return setUrl(`/object/${itemBody.linkToObject}`);
        }
      });
    }

    setUrl(`${itemBody.linkToWeb}`);
  }, []);

  const renderItem = () => {
    switch (itemBody.style) {
      case 'icon':
        return (
          <div>
            <a target={linkTarget} href={url} className="MenuItemButtons__link ">
              <img src={itemBody.image} className="MenuItemButtons__icon" alt="pic" />
            </a>
            <a target={linkTarget} href={url} className="MenuItemButtons__link">
              {' '}
              {itemBody.title}
            </a>
          </div>
        );
      case 'image':
        return (
          <div>
            <a href={url} target={linkTarget}>
              <img src={itemBody.image} className="MenuItemButtons__image" alt="pic" />
            </a>
          </div>
        );
      default:
        return (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <a target={linkTarget} href={url} className="MenuItemButtons__hideLongTitle">
                {itemBody.title}
              </a>
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
