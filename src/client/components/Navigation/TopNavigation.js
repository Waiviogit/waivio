import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getAuthenticatedUser, getRewardsTab } from '../../../store/authStore/authSelectors';

import './TopNavigation.less';

const LINKS = {
  FEED_TRENDING: '/trending',
  FEED_HOT: '/hot',
  FEED_NEW: '/created',
  MY_FEED_REWARDS: '/rewards-list',
  MY_FEED_NOTIFICATIONS: '/notifications-list',
  FEED_PROMOTED: '/promoted',
  REWARDS: '/rewards/',
  SHOP: '/shop',
  TOOLS_DRAFTS: '/drafts',
  TOOLS_BOOKMARKS: '/bookmarks',
  TOOLS_EDIT_PROFILE: '/edit-profile',
  TOOLS_INVITE: '/invite',
  TOOLS_SETTINGS: '/settings',
  TOOLS_SETTINGS_GUESTS: '/guests-settings',
  TOOLS_SETTINGS_NOTIFICATIONS: '/notification-settings',
  ABOUT: '/object/ylr-waivio/page#mim-transform-your-passion-into-profit-with-waivio',
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
  NEW_ACCOUNT: '/new-accounts',
  DATA_IMPORT: '/data-import',
  MESSAGE_BOT: '/message-bot',
  REPOSTING_BOT: '/reposting-bot',
  LIST_DUPLICATOR: '/list-duplication',
  CLAIM_AUTHORITY_BOT: '/claim-authority',
  DEPARTMENTS_BOT: '/departments-bot',
  DESCRIPTIONS_BOT: '/descriptions-bot',
  TAGS_BOT: '/tags-bot',
  ASIN_SCANER: '/ASIN-scanner',
  CHROME_EXTENSION: '/chrome-extension',
  AFFILIATE_CODES: '/affiliate-codes',
  ADSENSE: '/adsense',
  USER_AFFILIATE_CODES: '/user-affiliate-codes',
  BLOG: '/user-blog',
  FEED: '/feed',
  BLACKLIST: '/blacklist',
  ADMIN_WEBSITES: '/admin-websites',
  ADMIN_CREDITS: '/admin-credits',
  ADMIN_SUBSCRIPTIONS: '/admin-subscriptions',
  ADMIN_WHITELIST: '/admin-whitelist',
  ADMIN_NEW_ACCOUNTS: '/admin-new-accounts',
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
  LINKS.WEBSITE_CREATE,
  LINKS.NEW_ACCOUNT,
  LINKS.DATA_IMPORT,
  LINKS.MESSAGE_BOT,
  LINKS.LIST_DUPLICATOR,
  LINKS.CLAIM_AUTHORITY_BOT,
  LINKS.DEPARTMENTS_BOT,
  LINKS.DESCRIPTIONS_BOT,
  LINKS.ASIN_SCANER,
  LINKS.CHROME_EXTENSION,
  LINKS.TAGS_BOT,
  LINKS.USER_AFFILIATE_CODES,
];
const WEBSITE_URLS = [
  LINKS.TOOLS_SETTINGS,
  LINKS.WEBSITES_MANAGE,
  LINKS.WEBSITES_PAYMENTS,
  LINKS.WEBSITES_CONFIGURATION,
  LINKS.WEBSITES_ADMINISTRATION,
  LINKS.WEBSITES_MODERATORS,
  LINKS.WEBSITES_AUTHORITIES,
  LINKS.WEBSITES_OBJECT_FILTERS,
  LINKS.WEBSITES_MUTED_USER,
  LINKS.AFFILIATE_CODES,
  LINKS.ADSENSE,
  LINKS.WEBSITES_AREAS,
];

const TopNavigation = ({ location: { pathname } }) => {
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const rewardsTab = useSelector(getRewardsTab);
  const isRouteMathed =
    pathname === '/' ||
    Object.values(LINKS).some(
      url =>
        pathname.includes(url) &&
        !pathname.includes(`/object/`) &&
        !pathname.includes(`/favorites/`),
    );

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
              to={`${LINKS.REWARDS}${rewardsTab}`}
              className={classNames('TopNavigation__link', {
                'TopNavigation__link--active': pathname.includes(`${LINKS.REWARDS}`),
              })}
            >
              <FormattedMessage id="earn" defaultMessage="Earn" />
            </Link>
          </li>
          <li className="TopNavigation__item">
            <Link
              to={`${LINKS.SHOP}`}
              className={classNames('TopNavigation__link', {
                'TopNavigation__link--active': pathname.includes(LINKS.SHOP),
              })}
            >
              <FormattedMessage id="shop" defaultMessage="Shop" />
            </Link>
          </li>
          {!isEmpty(authenticatedUser) && (
            <li className="TopNavigation__item">
              <Link
                to={`${LINKS.TOOLS_SETTINGS_NOTIFICATIONS}`}
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

export default withRouter(TopNavigation);
