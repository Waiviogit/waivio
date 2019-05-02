import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './PostsNavigation.less';

const PostsNavigation = ({ location }) => (
  <ul className="PostsNavigation">
    <li>
      <NavLink
        to="/"
        isActive={() => location.pathname === '/'}
        className="PostsNavigation__item"
        activeClassName="PostsNavigation__item--active"
      >
        <FormattedMessage id="feed" defaultMessage="Feed" />
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/trending"
        isActive={() => location.pathname !== '/'}
        className="PostsNavigation__item"
        activeClassName="PostsNavigation__item--active"
      >
        <FormattedMessage id="news" defaultMessage="News" />
      </NavLink>
    </li>
  </ul>
);

PostsNavigation.propTypes = {
  location: PropTypes.shape().isRequired,
};

export default PostsNavigation;
