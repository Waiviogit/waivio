import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { has } from 'lodash';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { parseJSON } from '../../../../common/helpers/parseJSON';
import { checkAndOpenWaivioLink } from '../../../../common/helpers/urlHelpers';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';

const MenuItemButton = ({ item, show }) => {
  const [url, setUrl] = useState('');
  const itemBody = parseJSON(item.body);
  const dispatch = useDispatch();
  const webLink = has(itemBody, 'linkToWeb');
  const linkTarget = webLink ? '_blank' : '_self';
  const defaultButtonType = itemBody?.style === 'highlight' ? 'primary' : 'default';
  const match = useRouteMatch();
  const authorPermlink = match.params.name;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (itemBody) {
      if (has(itemBody, 'linkToObject')) {
        switch (itemBody.objectType) {
          case 'list':
            return setUrl(`/object/${authorPermlink}/menu#${itemBody.linkToObject}`);
          case 'page':
            return setUrl(`/object/${authorPermlink}/page#${itemBody.linkToObject}`);
          case 'html':
            return setUrl(`/object/${authorPermlink}/code#${itemBody.linkToObject}`);
          case 'webpage':
            return setUrl(`/object/${authorPermlink}/webpage#${itemBody.linkToObject}`);
          case 'newsfeed':
            return setUrl(`/object/${authorPermlink}/newsfeed/${itemBody.linkToObject}`);
          case 'widget':
            return setUrl(`/object/${authorPermlink}/widget#${itemBody.linkToObject}`);
          case 'map':
            return setUrl(`/object/${authorPermlink}/map#${itemBody.linkToObject}`);
          default:
            return setUrl(`/object/${itemBody.linkToObject}`);
        }
      }

      return setUrl(`${itemBody.linkToWeb}`);
    }
  }, []);

  const renderItem = () => {
    switch (itemBody.style) {
      case 'icon':
        return webLink ? (
          <div>
            <a
              onClick={() => {
                if (!checkAndOpenWaivioLink(url)) {
                  dispatch(setLinkSafetyInfo(url));
                }
              }}
              className="MenuItemButtons__link "
            >
              <img src={itemBody.image} className="MenuItemButtons__icon" alt={itemBody.title} />
            </a>
            <a target={linkTarget} href={url} className="MenuItemButtons__link">
              {' '}
              {itemBody.title}
            </a>
          </div>
        ) : (
          <div>
            <Link target={linkTarget} to={url} className="MenuItemButtons__link ">
              <img src={itemBody.image} className="MenuItemButtons__icon" alt={itemBody.title} />
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
            <a
              onClick={() => {
                if (!checkAndOpenWaivioLink(url)) {
                  dispatch(setLinkSafetyInfo(url));
                }
              }}
            >
              <img src={itemBody.image} className="MenuItemButtons__image" alt={linkTarget} />
            </a>
          </div>
        ) : (
          <div>
            <Link to={url} target={linkTarget}>
              <img src={itemBody.image} className="MenuItemButtons__image" alt={linkTarget} />
            </Link>
          </div>
        );
      default:
        return webLink ? (
          <div className="object-sidebar__menu-item">
            <Button className="LinkButton menu-button" type={defaultButtonType}>
              <a
                onClick={() => {
                  if (!checkAndOpenWaivioLink(url)) {
                    dispatch(setLinkSafetyInfo(url));
                  }
                }}
                className="MenuItemButtons__hideLongTitle"
              >
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

  if (!itemBody) return null;

  return show && <div className="mb2">{renderItem()}</div>;
};

MenuItemButton.propTypes = {
  item: PropTypes.shape().isRequired,
  show: PropTypes.bool,
};

export default MenuItemButton;
