import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import './WebsiteTopNavigation.less';

const obj = [
  {
    name: 'Community',
    link: '/newsfeed',
  },
  {
    name: 'Shop',
    link: '/',
  },
  {
    name: 'Bookstore',
    link: '/bookstore',
  },
  {
    name: 'Checklist',
    link: '/checklist',
  },
  {
    name: 'about',
    link: '/checklist',
  },
];

const user = [
  // {
  //   name: 'Blog',
  //   link: '/blog',
  // },
  {
    name: 'Shop',
    link: '/',
  },
  {
    name: 'Legal',
    link: '/object/ljc-legal/list',
  },
];

const WebsiteTopNavigation = ({ shopSettings }) => {
  if (isEmpty(shopSettings) || shopSettings?.type === 'object') return null;

  const linkList = shopSettings?.type === 'user' ? user : obj;

  return (
    <div className="WebsiteTopNavigation">
      {linkList.map(l => (
        <NavLink
          className="WebsiteTopNavigation__link"
          isActive={match => l?.link === match?.url}
          activeClassName={'WebsiteTopNavigation__link--active'}
          key={l.link}
          to={l.link}
        >
          {l.name}
        </NavLink>
      ))}
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default WebsiteTopNavigation;
