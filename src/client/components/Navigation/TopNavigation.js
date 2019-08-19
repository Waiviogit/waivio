import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
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
          <Link
            to="/"
            className={classNames('TopNavigation__item', {
              'TopNavigation__item--active': pathname === '/',
            })}
          >
            <FormattedMessage id="feed" defaultMessage="Feed" />
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/trending"
          className={classNames('TopNavigation__item', {
            'TopNavigation__item--active': pathname.includes('/trending'),
          })}
        >
          <FormattedMessage id="news" defaultMessage="News" />
        </Link>
      </li>
      <li>
        <Link
          to={authenticated ? `/rewards/active` : `/rewards/all`}
          className={classNames('TopNavigation__item', {
            'TopNavigation__item--active': pathname.includes('/rewards'),
          })}
        >
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </Link>
      </li>
      <li>
        <Link
          to={`/discover-objects/hashtag`}
          className={classNames('TopNavigation__item', {
            'TopNavigation__item--active': pathname.includes('/objectType'),
          })}
        >
          <FormattedMessage id="discover" defaultMessage="Discover" />
        </Link>
      </li>
      {authenticated && (
        <li>
          <Link
            to={`/activity`}
            className={classNames('TopNavigation__item', {
              'TopNavigation__item--active': pathname === '/activity',
            })}
          >
            <FormattedMessage id="activity" defaultMessage="Activity" />
          </Link>
        </li>
      )}
      <li>
        <Link
          to={`/object/ylr-waivio`}
          className={classNames('TopNavigation__item', {
            'TopNavigation__item--active': pathname.includes('/object/ylr-waivio'),
          })}
        >
          <FormattedMessage id="about" defaultMessage="About" />
        </Link>
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
