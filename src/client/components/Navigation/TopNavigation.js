import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { every, isEmpty } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { PATH_NAME_DISCOVER, PAYABLES, RECEIVABLES } from '../../../common/constants/rewards';
import { getAuthenticatedUser, getRewardsTab } from '../../../store/authStore/authSelectors';

import './TopNavigation.less';
import { getRewardsGeneralCounts } from '../../../store/rewardsStore/rewardsActions';
import { getSort } from '../../rewards/rewardsHelper';

const LINKS = {
  FEED_TRENDING: '/trending',
  FEED_HOT: '/hot',
  FEED_NEW: '/created',
  MY_FEED_REWARDS: '/rewards-list',
  MY_FEED_NOTIFICATIONS: '/notifications-list',
  FEED_PROMOTED: '/promoted',
  REWARDS: '/rewards',
  REWARDS_NEW: '/rewards-new',
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
  NEW_ACCOUNT: '/new-accounts',
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
  LINKS.WEBSITE_CREATE,
  LINKS.NEW_ACCOUNT,
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
  LINKS.WEBSITES_AREAS,
];

const TopNavigation = ({ location: { pathname }, match, history }) => {
  const authenticatedUser = useSelector(getAuthenticatedUser);
  const rewardsTab = useSelector(getRewardsTab);
  const dispath = useDispatch();
  const isRouteMathed =
    pathname === '/' || Object.values(LINKS).some(url => pathname.includes(url));
  const handleRewardsRoute = e => {
    const sort = getSort(match, 'default', 'default', 'payout');

    dispath(
      getRewardsGeneralCounts({ userName: authenticatedUser.name, sort, match, area: [0, 0] }),
    ).then(data => {
      const { tabType } = data.value;
      const searchParams = new URLSearchParams(location.search);
      const isWidget = searchParams.get('display');
      const isReserved = searchParams.get('toReserved');
      const tabs = {
        reserved: 'reserved',
        eligible: 'active',
        all: 'all',
      };

      if (!isWidget && !isReserved) {
        e.preventDefault();
        const filterKey = 'all';
        const arrFilterKey = [PAYABLES, RECEIVABLES];

        if (every(arrFilterKey, key => filterKey !== key) && !match.params.campaignId) {
          if (window.location.href.includes('rewards/rebalancing')) {
            history.push('/rewards/rebalancing');

            return;
          }
          history.push(`/rewards/${tabs[tabType]}/`);
        } else {
          history.push(`/rewards/${tabs[tabType]}/`);
        }
      }
    });
  };

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
              onClick={handleRewardsRoute}
              to={`${LINKS.REWARDS}/all`}
              className={classNames('TopNavigation__link', {
                'TopNavigation__link--active':
                  pathname.includes(LINKS.REWARDS) &&
                  !pathname.includes(LINKS.REWARDS_NEW) &&
                  (!pathname.includes('list') || pathname.includes(LINKS.BLACKLIST)),
              })}
            >
              <FormattedMessage id="earn" defaultMessage="Earn" />
            </Link>
          </li>
          <li className="TopNavigation__item">
            <Link
              to={`${LINKS.DISCOVER}/restaurant`}
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
          <li className="TopNavigation__item">
            <Link
              to={`${LINKS.REWARDS_NEW}/${rewardsTab}`}
              className={classNames('TopNavigation__link', {
                'TopNavigation__link--active': pathname.includes(LINKS.REWARDS_NEW),
              })}
            >
              Beta
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : null;
};

TopNavigation.propTypes = {
  location: PropTypes.shape(),
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

TopNavigation.defaultProps = {
  location: {
    pathname: '',
  },
};

export default withRouter(TopNavigation);
