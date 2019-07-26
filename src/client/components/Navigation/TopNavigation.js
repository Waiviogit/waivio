import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter } from 'react-router-dom';
import './TopNavigation.less';

const TopNavigation = ({ authenticated, userName }) => (
  <ul className="TopNavigation">
    {authenticated && location && (
      <li>
        <NavLink
          to="/"
          isActive={() => location.pathname === '/'}
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
        isActive={() => location.pathname === '/trending'}
        className="TopNavigation__item"
        activeClassName="TopNavigation__item--active"
      >
        <FormattedMessage id="news" defaultMessage="News" />
      </NavLink>
    </li>
    <li>
      <NavLink
        to={authenticated ? `/rewards/active/@${userName}` : `/rewards/all`}
        isActive={() => _.includes(location.pathname, '/rewards/')}
        className="TopNavigation__item"
        activeClassName="TopNavigation__item--active"
      >
        <FormattedMessage id="rewards" defaultMessage="Rewards" />
      </NavLink>
    </li>
    <li>
      <NavLink
        to={`/objects`}
        isActive={() => _.includes(location.pathname, '/objects')}
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
          isActive={() => _.includes(location.pathname, '/activity')}
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
        isActive={() => _.includes(location.pathname, '/object/ylr-waivio')}
        className="TopNavigation__item"
        activeClassName="TopNavigation__item--active"
      >
        <FormattedMessage id="about" defaultMessage="About" />
      </NavLink>
    </li>
  </ul>
);

TopNavigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

TopNavigation.defaultProps = {
  userName: false,
};

export default withRouter(TopNavigation);
