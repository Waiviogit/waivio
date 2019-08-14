import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './TopNavigation.less';

const LINKS = [
  '/trending',
  '/rewards',
  '/objectType',
  '/discover-objects',
  '/activity',
  '/object/ylr-waivio',
];

const TopNavigation = ({ authenticated, location: { pathname } }) => {
  const isRouteMathed = pathname === '/' || LINKS.some(link => pathname.includes(link));
  return isRouteMathed ? (
    <ul className="TopNavigation">
      {authenticated && (
        <li>
          <NavLink
            to="/"
            exact
            className="TopNavigation__item"
            activeClassName="TopNavigation__item--active"
          >
            <FormattedMessage id="feed" defaultMessage="Feed" />
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to="/trending"
          exact
          className="TopNavigation__item"
          activeClassName="TopNavigation__item--active"
        >
          <FormattedMessage id="news" defaultMessage="News" />
        </NavLink>
      </li>
      <li>
        <NavLink
          to={authenticated ? `/rewards/active` : `/rewards/all`}
          className="TopNavigation__item"
          activeClassName="TopNavigation__item--active"
        >
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </NavLink>
      </li>
      <li>
        <NavLink
          to={`/objectType/hashtag`}
          className="TopNavigation__item"
          activeClassName="TopNavigation__item--active"
        >
          <FormattedMessage id="discover" defaultMessage="Discover" />
        </NavLink>
      </li>
      {authenticated && (
        <li>
          <NavLink
            to={`/activity`}
            className="TopNavigation__item"
            activeClassName="TopNavigation__item--active"
          >
            <FormattedMessage id="activity" defaultMessage="Activity" />
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to={`/object/ylr-waivio`}
          className="TopNavigation__item"
          activeClassName="TopNavigation__item--active"
        >
          <FormattedMessage id="about" defaultMessage="About" />
        </NavLink>
      </li>
    </ul>
  ) : null;
};

TopNavigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape(),
};

TopNavigation.defaultProps = {
  location: {
    pathname: '',
  },
};

export default TopNavigation;
