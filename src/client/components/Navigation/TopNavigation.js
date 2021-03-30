import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { getAuthenticatedUser } from '../../reducers';
import { PATH_NAME_DISCOVER } from '../../../common/constants/rewards';
import './TopNavigation.less';

const LINKS = {
  FEED_TRENDING: '/trending',
  FEED_HOT: '/hot',
  FEED_NEW: '/created',
  MY_FEED_REWARDS: '/rewards-list',
  MY_FEED_NOTIFICATIONS: '/notifications-list',
  FEED_PROMOTED: '/promoted',
  REWARDS: '/rewards',
  DISCOVER: '/discover-objects',
  TOOLS_DRAFTS: '/drafts',
  TOOLS_BOOKMARKS: '/bookmarks',
  TOOLS_EDIT_PROFILE: '/edit-profile',
  TOOLS_INVITE: '/invite',
  TOOLS_SETTINGS: '/settings',
  TOOLS_SETTINGS_GUESTS: '/guests-settings',
  TOOLS_SETTINGS_NOTIFICATIONS: '/notification-settings',
  ABOUT: '/object/ylr-waivio/page#mwt-about-waivio',
  WEBSITE_CREATE: '/create',
  WEBSITES_MANAGE: '/manage',
  WEBSITES_PAYMENTS: '/payments',
  WEBSITES_CONFIGURATION: '/configuration',
  WEBSITES_ADMINISTRATION: '/administrations',
  WEBSITES_MODERATORS: '/moderators',
  WEBSITES_AUTHORITIES: '/authorities',
  WEBSITES_OBJECT_FILTERS: '/objects-filters',
  WEBSITES_AREAS: '/objects',
  WEBSITES_MUTED_USER: '/muted-users',
  NOTIFICATIONS: '/notifications-list',
  USERS: PATH_NAME_DISCOVER,
  BLOG: '/user-blog',
  FEED: '/feed',
  BLACKLIST: '/blacklist',
};

const FEED_URLS = [
  LINKS.FEED_HOT,
  LINKS.FEED_NEW,
  LINKS.FEED_TRENDING,
  LINKS.MY_FEED_REWARDS,
  LINKS.MY_FEED_NOTIFICATIONS,
  LINKS.BLOG,
  LINKS.FEED,
];
const TOOLS_URLS = [
  LINKS.TOOLS_BOOKMARKS,
  LINKS.TOOLS_DRAFTS,
  LINKS.TOOLS_EDIT_PROFILE,
  LINKS.TOOLS_INVITE,
  LINKS.TOOLS_SETTINGS,
  LINKS.TOOLS_SETTINGS_GUESTS,
  LINKS.TOOLS_SETTINGS_NOTIFICATIONS,
];
const WEBSITE_URLS = [
  LINKS.TOOLS_SETTINGS,
  LINKS.WEBSITE_CREATE,
  LINKS.WEBSITES_MANAGE,
  LINKS.WEBSITES_PAYMENTS,
  LINKS.WEBSITES_CONFIGURATION,
  LINKS.WEBSITES_ADMINISTRATION,
  LINKS.WEBSITES_MODERATORS,
  LINKS.WEBSITES_AUTHORITIES,
  LINKS.WEBSITES_OBJECT_FILTERS,
  LINKS.WEBSITES_MUTED_USER,
  LINKS.WEBSITES_AREAS,
];

const TopNavigation = ({ location: { pathname } }) => {
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const isRouteMathed =
    pathname === '/' || Object.values(LINKS).some(url => pathname.includes(url));
  return isRouteMathed ? (
    <div className="TopNavigation">
      <div className="container menu-layout">
        <ul className="TopNavigation__menu center">
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
              to={`${LINKS.REWARDS}/all`}
              className={classNames('TopNavigation__link', {
                'TopNavigation__link--active':
                  pathname.includes(LINKS.REWARDS) &&
                  (!pathname.includes('list') || pathname.includes(LINKS.BLACKLIST)),
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
          {!isEmpty(authenticatedUser) && (
            <li className="TopNavigation__item">
              <Link
                to={`${LINKS.TOOLS_DRAFTS}`}
                className={classNames('TopNavigation__link', {
                  'TopNavigation__link--active':
                    !pathname.includes(LINKS.REWARDS) &&
                    (TOOLS_URLS.some(item => pathname === item) ||
                      WEBSITE_URLS.some(item => pathname.includes(item))),
                })}
              >
                <FormattedMessage id="tools" defaultMessage="Tools" />
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
      </div>
    </div>
  ) : null;
};

TopNavigation.propTypes = {
  location: PropTypes.shape(),
};

TopNavigation.defaultProps = {
  location: {
    pathname: '',
  },
};

export default TopNavigation;
