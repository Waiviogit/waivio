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
  TOOLS_ACTIVITY: '/activity',
  TOOLS_DRAFTS: '/drafts',
  TOOLS_BOOKMARKS: '/bookmarks',
  TOOLS_EDIT_PROFILE: '/edit-profile',
  TOOLS_INVITE: '/invite',
  TOOLS_SETTINGS: '/settings',
  ABOUT: '/object/ylr-waivio',
  USERS: '/discover',
};
const FEED_URLS = [LINKS.FEED_HOT, LINKS.FEED_NEW, LINKS.FEED_TRENDING];
const TOOLS_URLS = [
  LINKS.TOOLS_BOOKMARKS,
  LINKS.TOOLS_DRAFTS,
  LINKS.TOOLS_EDIT_PROFILE,
  LINKS.TOOLS_INVITE,
  LINKS.TOOLS_SETTINGS,
  LINKS.TOOLS_ACTIVITY,
];

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
      <li className="TopNavigation__item">
        <Link
          to={`${LINKS.TOOLS_DRAFTS}`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': TOOLS_URLS.some(feedUrl => pathname.includes(feedUrl)),
          })}
        >
          <FormattedMessage id="tools" defaultMessage="Tools" />
        </Link>
      </li>
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
