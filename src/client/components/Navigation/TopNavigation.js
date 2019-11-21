import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './TopNavigation.less';

const LINKS = {
  FEED_TRENDING: '/trending',
  FEED_HOT: '/hot',
  FEED_NEW: '/created',
  FEED_PROMOTED: '/promoted',
  REWARDS: '/rewards',
  DISCOVER: '/discover-objects',
  ACTIVITY: '/activity',
  ABOUT: '/object/ylr-waivio',
  USERS: '/discover',
};
const FEED_URLS = [LINKS.FEED_HOT, LINKS.FEED_NEW, LINKS.FEED_TRENDING];

const TopNavigation = ({ authenticated, location: { pathname } }) => {
  const isRouteMathed =
    pathname === '/' || Object.values(LINKS).some(url => pathname.includes(url));
  return isRouteMathed ? (
    <ul className="TopNavigation">
      <li className="TopNavigation__item">
        <Link
          to="/"
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active':
              pathname === '/' || FEED_URLS.some(feedUrl => pathname.includes(feedUrl)),
          })}
        >
          <FormattedMessage id="feed" defaultMessage="Feed" />
        </Link>
      </li>
      <li className="TopNavigation__item">
        <Link
          to={authenticated ? `${LINKS.REWARDS}/active` : `${LINKS.REWARDS}/all`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname.includes(LINKS.REWARDS),
          })}
        >
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </Link>
      </li>
      <li className="TopNavigation__item">
        <Link
          to={`${LINKS.DISCOVER}/hashtag`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active':
              pathname.includes(LINKS.DISCOVER) || pathname.includes(LINKS.USERS),
          })}
        >
          <FormattedMessage id="discover" defaultMessage="Discover" />
        </Link>
      </li>
      {authenticated && (
        <li className="TopNavigation__item">
          <Link
            to={LINKS.ACTIVITY}
            className={classNames('TopNavigation__link', {
              'TopNavigation__link--active': pathname === LINKS.ACTIVITY,
            })}
          >
            <FormattedMessage id="activity" defaultMessage="Activity" />
          </Link>
        </li>
      )}
      <li className="TopNavigation__item">
        <Link
          to={LINKS.ABOUT}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname.includes(LINKS.ABOUT),
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
