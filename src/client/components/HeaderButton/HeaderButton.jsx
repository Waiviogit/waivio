import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import store from 'store';
import classNames from 'classnames';
import { filter, get, includes, isUndefined, size } from 'lodash';
import { Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { ReactEditor } from 'slate-react';

import BTooltip from '../BTooltip';
import Popover from '../Popover';
import Notifications from '../Navigation/Notifications/Notifications';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import { getUserAccount, getUserMetadata } from '../../../store/usersStore/usersActions';
import { logout } from '../../../store/authStore/authActions';
import ModalSignIn from '../Navigation/ModlaSignIn/ModalSignIn';
import LanguageSettings from '../Navigation/LanguageSettings';
import { setCurrentPage } from '../../../store/appStore/appActions';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import {
  getAuthenticatedUserMetaData,
  getAuthenticatedUserName,
  getRewardsTab,
} from '../../../store/authStore/authSelectors';
import {
  getIsLoadingNotifications,
  getNotifications,
} from '../../../store/userStore/userSelectors';
import { getTokenBalance } from '../../../store/walletStore/walletActions';
import { getObjectUrlForLink } from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';

const HeaderButtons = props => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const rewardsTab = useSelector(getRewardsTab);
  const [notificationsPopoverVisible, setNotificationsPopoverVisible] = useState(false);
  const {
    intl,
    username,
    notifications,
    userMetaData,
    loadingNotifications,
    history,
    location,
  } = props;
  const lastSeenTimestamp = get(userMetaData, 'notifications_last_timestamp');

  let popoverItems = [
    <PopoverMenuItem key="feed" topNav>
      <FormattedMessage id="feed" defaultMessage="My Feed" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="rewards" topNav>
      <FormattedMessage id="menu_rewards" defaultMessage="Rewards" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="tools" topNav>
      <FormattedMessage id="menu_tools" defaultMessage="Tools" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="drafts" topNav>
      <FormattedMessage id="menu_drafts" defaultMessage="Drafts" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="my-profile" topNav>
      <FormattedMessage id="my_profile" defaultMessage="Profile" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="wallet" topNav>
      <FormattedMessage id="wallet" defaultMessage="Wallet" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="settings" topNav>
      <FormattedMessage id="settings" defaultMessage="Settings" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="logout" topNav>
      <FormattedMessage id="logout" defaultMessage="Logout" />
    </PopoverMenuItem>,
  ];

  if (props.isWebsite && isMobile()) {
    popoverItems = [
      <PopoverMenuItem key="reviews" topNav>
        <FormattedMessage id="reviews" defaultMessage="Reviews" />
      </PopoverMenuItem>,
      <PopoverMenuItem key="legal" topNav>
        <FormattedMessage id="legal" defaultMessage="Legal" />
      </PopoverMenuItem>,
      ...popoverItems,
    ];
  }

  if (props.aboutObject && isMobile()) {
    popoverItems.unshift(
      <PopoverMenuItem key="about" topNav>
        <FormattedMessage id="about" defaultMessage="About" />
      </PopoverMenuItem>,
    );
  }

  const notificationsCount = isUndefined(lastSeenTimestamp)
    ? size(notifications)
    : size(
        filter(
          notifications,
          notification =>
            lastSeenTimestamp < notification.timestamp &&
            includes(PARSED_NOTIFICATIONS, notification.type),
        ),
      );
  const displayBadge = notificationsCount > 0;
  const notificationsCountDisplay = notificationsCount > 99 ? '99+' : notificationsCount;

  const handleScrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

  const handleCloseNotificationsPopover = () => setNotificationsPopoverVisible(false);

  const handleMoreMenuVisibleChange = visible => setPopoverVisible(visible);

  const handleNotificationsPopoverVisibleChange = visible =>
    setNotificationsPopoverVisible(visible);

  const handleEditor = () => window.slateEditor && ReactEditor.focus(window.slateEditor);

  const handleMenuItemClick = key => {
    switch (key) {
      case 'logout':
        props.logout();
        break;
      case 'activity':
        history.push('/activity');
        break;
      case 'replies':
        history.push('/replies');
        break;
      case 'bookmarks':
        history.push('/bookmarks');
        break;
      case 'drafts':
        history.push('/drafts');
        break;
      case 'settings':
        history.push('/settings');
        break;
      case 'feed':
        !props.isWaivio ? history.push('/feed') : history.push('/');
        break;
      case 'news':
        history.push('/trending');
        break;
      case 'objects':
        history.push('/objects');
        break;
      case 'wallet':
        history.push(`/@${username}/transfers?type=WAIV`);
        break;
      case 'my-profile':
        history.push(`/@${username}`);
        break;
      case 'rewards':
        history.push(`/rewards/${rewardsTab}`);
        break;
      case 'discover':
        history.push(`/discover-objects/restaurant`);
        break;
      case 'tools':
        history.push(`/notification-settings`);
        break;
      case 'reviews':
        history.push(`/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh`);
        break;
      case 'legal':
        if (props.aboutObject && !props.isHelpingObjTypes) {
          history.push(`/object/${props.aboutObject.author_permlink}/menu#ljc-legal`);
        } else {
          history.push(`/object/ljc-legal/list`);
        }
        break;
      case 'about':
        history.push(`${getObjectUrlForLink(props.aboutObject)}`);
        break;
      default:
        break;
    }
  };

  const handleMoreMenuSelect = key => {
    setPopoverVisible(false);
    handleMenuItemClick(key);

    if (props.isWebsite) {
      props.setCurrentPage(key);
      store.set('currentPage', key);
    }
  };

  if (!username) {
    const next = location.pathname.length > 1 ? location.pathname : '';
    const popoverNotAuthUserItems = [
      <PopoverMenuItem key="reviews" topNav>
        <FormattedMessage id="reviews" defaultMessage="Reviews" />
      </PopoverMenuItem>,
      <PopoverMenuItem key="legal" topNav>
        <FormattedMessage id="legal" defaultMessage="Legal" />
      </PopoverMenuItem>,
    ];

    if (props.aboutObject) {
      popoverNotAuthUserItems.unshift(
        <PopoverMenuItem key="about" topNav>
          <FormattedMessage id="about" defaultMessage="About" />
        </PopoverMenuItem>,
      );
    }

    return (
      <div className={'Topnav__menu-container Topnav__menu-logged-out'}>
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="login">
            <ModalSignIn isSocialGifts={props.isSocialGifts} domain={props.domain} next={next} />
          </Menu.Item>
          <Menu.Item key="language">
            <LanguageSettings />
          </Menu.Item>
          {isMobile() && props.isWebsite && (
            <Menu.Item key="more" className="Topnav__menu--icon">
              <Popover
                placement="bottom"
                trigger="click"
                visible={popoverVisible}
                onVisibleChange={handleMoreMenuVisibleChange}
                overlayStyle={{ position: 'fixed' }}
                content={
                  <PopoverMenu onSelect={handleMoreMenuSelect}>
                    {popoverNotAuthUserItems}
                  </PopoverMenu>
                }
                overlayClassName="Topnav__popover"
              >
                <a className="Topnav__link-mt5">
                  <Icon type="caret-down" />
                  <Icon type="bars" />
                </a>
              </Popover>
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  }

  return (
    <div
      className={classNames('Topnav__menu-container', {
        'Topnav__mobile-hidden': props.searchBarActive,
      })}
    >
      <Menu selectedKeys={[]} className="Topnav__menu-container__menu" mode="horizontal">
        <Menu.Item key="write">
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
            mouseEnterDelay={1}
            overlayClassName="Topnav__notifications-tooltip"
          >
            <Link to="/editor" className="Topnav__link Topnav__link--action" onClick={handleEditor}>
              <i className="iconfont icon-write" />
            </Link>
          </BTooltip>
        </Menu.Item>
        <Menu.Item key="notifications" className="Topnav__item--badge">
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
            overlayClassName="Topnav__notifications-tooltip"
            mouseEnterDelay={1}
          >
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <Notifications
                  notifications={notifications}
                  onNotificationClick={handleCloseNotificationsPopover}
                  currentAuthUsername={username}
                  lastSeenTimestamp={lastSeenTimestamp}
                  loadingNotifications={loadingNotifications}
                  getUpdatedUserMetadata={props.getUserMetadata}
                />
              }
              visible={notificationsPopoverVisible}
              onVisibleChange={handleNotificationsPopoverVisibleChange}
              overlayClassName="Notifications__popover-overlay"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
            >
              <a className="Topnav__link Topnav__link--light Topnav__link--action">
                {displayBadge ? (
                  <div className="Topnav__notifications-count">{notificationsCountDisplay}</div>
                ) : (
                  <i className="iconfont icon-remind" />
                )}
              </a>
            </Popover>
          </BTooltip>
        </Menu.Item>
        <Menu.Item key="user" className="Topnav__item-user">
          <Link className="Topnav__user" to={`/@${username}`} onClick={handleScrollToTop}>
            <Avatar username={username} size={36} />
          </Link>
        </Menu.Item>
        <Menu.Item key="more" className="Topnav__menu--icon">
          <Popover
            placement="bottom"
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={handleMoreMenuVisibleChange}
            overlayStyle={{ position: 'fixed' }}
            content={<PopoverMenu onSelect={handleMoreMenuSelect}>{popoverItems}</PopoverMenu>}
            overlayClassName="Topnav__popover"
          >
            <a className="Topnav__link">
              <Icon type="caret-down" />
              <Icon type="bars" />
            </a>
          </Popover>
        </Menu.Item>
      </Menu>
    </div>
  );
};

HeaderButtons.propTypes = {
  intl: PropTypes.shape().isRequired,
  aboutObject: PropTypes.shape(),
  isHelpingObjTypes: PropTypes.shape(),
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  userMetaData: PropTypes.shape(),
  loadingNotifications: PropTypes.bool,
  isWebsite: PropTypes.bool,
  getUserMetadata: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  username: PropTypes.string,
  domain: PropTypes.string,
  searchBarActive: PropTypes.bool,
  isWaivio: PropTypes.bool,
  isSocialGifts: PropTypes.bool,
};

HeaderButtons.defaultProps = {
  notifications: [],
  username: '',
  userMetaData: {},
  loadingNotifications: false,
  isStartSearchAutoComplete: false,
  isWebsite: false,
  searchBarActive: false,
  isWaivio: true,
};

export default connect(
  state => ({
    userMetaData: getAuthenticatedUserMetaData(state),
    username: getAuthenticatedUserName(state),
    notifications: getNotifications(state),
    loadingNotifications: getIsLoadingNotifications(state),
    isWaivio: getIsWaivio(state),
  }),
  {
    getUserMetadata,
    logout,
    setCurrentPage,
    getUserAccount,
    getTokenBalance,
  },
)(withRouter(injectIntl(HeaderButtons)));
