import React from 'react';
import { Link } from 'react-router-dom';
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

const WebsiteTopNavigation = ({ shopSettings }) => {
  if (isEmpty(shopSettings)) return null;

  return (
    <div className="WebsiteTopNavigation">
      {shopSettings?.type === 'user' ? (
        <React.Fragment>
          <Link to={`/blog`}>Blog</Link>
          <Link to={`/`}>Shop</Link>
          <Link to={`/object/ljc-legal/list`}>Legal</Link>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {obj.map(l => (
            <Link key={l.link} to={l.link}>
              {l.name}
            </Link>
          ))}
        </React.Fragment>
      )}
      <React.Fragment>
        <Link to={`/blog`}>Blog</Link>
        <Link to={`/`}>Shop</Link>
        <Link to={`/object/ljc-legal/list`}>Legal</Link>
      </React.Fragment>
    </div>
  );
};

WebsiteTopNavigation.propTypes = {
  shopSettings: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default WebsiteTopNavigation;
