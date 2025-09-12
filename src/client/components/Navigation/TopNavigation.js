import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { setGoogleTagEvent } from '../../../common/helpers';
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
  WEBSITES_ACTIONS: '/actions',
  WEBSITES_CONFIGURATION: '/configuration',
  WEBSITES_ADMINISTRATION: '/administrations',
  WEBSITES_MODERATORS: '/moderators',
  WEBSITES_AUTHORITIES: '/authorities',
  WEBSITES_TRUSTED_ACCOUNTS: '/trusted-accounts',
  WEBSITES_SHOPIFY: '/shopify',
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
  ADMIN_ACTIONS: '/admin-actions',
  ADMIN_SUBSCRIPTIONS: '/admin-subscriptions',
  ADMIN_WHITELIST: '/admin-whitelist',
  ADMIN_NEW_ACCOUNTS: '/admin-new-accounts',
  ADMIN_GUESTS: '/admin-guests',
  ADMIN_SPAM: '/admin-spam',
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
  LINKS.WEBSITES_ACTIONS,
  LINKS.WEBSITES_CONFIGURATION,
  LINKS.WEBSITES_ADMINISTRATION,
  LINKS.WEBSITES_MODERATORS,
  LINKS.WEBSITES_AUTHORITIES,
  LINKS.WEBSITES_TRUSTED_ACCOUNTS,
  LINKS.WEBSITES_SHOPIFY,
  LINKS.WEBSITES_OBJECT_FILTERS,
  LINKS.WEBSITES_MUTED_USER,
  LINKS.AFFILIATE_CODES,
  LINKS.ADSENSE,
  LINKS.WEBSITES_AREAS,
];

const TopNavigation = ({ location: { pathname } }) => {
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const rewardsTab = useSelector(getRewardsTab);

  const isRouteMatched =
    pathname === '/' ||
    Object.values(LINKS).some(
      url =>
        pathname?.includes(url) &&
        !pathname?.includes(`/object/`) &&
        !pathname?.includes(`/favorites/`),
    );

  const navItems = [
    {
      to: '/',
      id: 'feed',
      defaultMessage: 'Feed',
      isActive: pathname === '/' || FEED_URLS.some(url => pathname?.includes(url)),
      event: 'click_myfeed',
    },
    {
      to: `${LINKS.REWARDS}${rewardsTab}`,
      id: 'earn',
      defaultMessage: 'Earn',
      isActive: pathname?.includes(LINKS.REWARDS),
      event: 'click_earn',
    },
    {
      to: LINKS.SHOP,
      id: 'shop',
      defaultMessage: 'Shop',
      isActive: pathname?.includes(LINKS.SHOP) && !pathname?.includes(LINKS.WEBSITES_SHOPIFY),
      event: 'click_mainshop',
    },
    !isEmpty(authenticatedUser) && {
      to: LINKS.TOOLS_SETTINGS_NOTIFICATIONS,
      id: 'tools',
      defaultMessage: 'Tools',
      isActive:
        !pathname?.includes(LINKS.REWARDS) &&
        (TOOLS_URLS?.includes(pathname) || WEBSITE_URLS.some(url => pathname?.includes(url))),
      event: 'click_tools',
    },
    {
      to: LINKS.ABOUT,
      id: 'about',
      defaultMessage: 'About',
      isActive: pathname?.includes(LINKS.ABOUT),
      event: 'click_about',
    },
  ].filter(Boolean);

  return isRouteMatched ? (
    <div className="TopNavigation">
      <div className="container menu-layout">
        <ul className="TopNavigation__menu center">
          {navItems.map(({ to, id, defaultMessage, isActive, event }) => (
            <li className="TopNavigation__item" key={id}>
              <Link
                to={to}
                className={classNames('TopNavigation__link', {
                  'TopNavigation__link--active': isActive,
                })}
                onClick={() => setGoogleTagEvent(event)}
              >
                <FormattedMessage id={id} defaultMessage={defaultMessage} />
              </Link>
            </li>
          ))}
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
