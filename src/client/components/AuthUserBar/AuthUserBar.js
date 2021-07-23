import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import store from 'store';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { PATH_NAME_ACTIVE } from '../../../common/constants/rewards';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import Popover from '../Popover';
import Avatar from '../Avatar';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import { logout } from '../../../store/authStore/authActions';
import { setCurrentPage } from '../../../store/appStore/appActions';

import '../../../client/components/Navigation/Topnav.less';

const AuthUserBar = props => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const handleMoreMenuVisibleChange = visible => setPopoverVisible(visible);
  const handleMoreMenuSelect = key => {
    setPopoverVisible(false);
    handleMenuItemClick(key);

    if (!props.isWaivio) {
      props.setCurrentPage(key);
      store.set('currentPage', key);
    }
  };

  let popoverItems = [
    <PopoverMenuItem key="rewards" topNav>
      <FormattedMessage id="menu_rewards" defaultMessage="Rewards" />
    </PopoverMenuItem>,
    <PopoverMenuItem key="tools" topNav>
      <FormattedMessage id="menu_tools" defaultMessage="Tools" />
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

  if (props.isWaivio) {
    popoverItems = [
      <PopoverMenuItem key="feed" topNav>
        <FormattedMessage id="feed" defaultMessage="My Feed" />
      </PopoverMenuItem>,
      <PopoverMenuItem key="discover" topNav>
        <FormattedMessage id="menu_discover" defaultMessage="Discover" />
      </PopoverMenuItem>,
      ...popoverItems,
    ];
  }

  const handleScrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

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
        history.push('/');
        break;
      case 'news':
        history.push('/trending');
        break;
      case 'objects':
        history.push('/objects');
        break;
      case 'wallet':
        history.push(`/@${props.username}/transfers`);
        break;
      case 'my-profile':
        history.push(`/@${props.username}`);
        break;
      case 'rewards':
        history.push(PATH_NAME_ACTIVE);
        break;
      case 'discover':
        history.push(`/discover-objects/hashtag`);
        break;
      case 'tools':
        history.push(`/drafts`);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Link className="Topnav__user" to={`/@${props.username}`} onClick={handleScrollToTop}>
        <Avatar username={props.username} size={36} />
      </Link>
      <Popover
        placement="bottom"
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={handleMoreMenuVisibleChange}
        overlayStyle={{ position: 'fixed' }}
        content={<PopoverMenu onSelect={handleMoreMenuSelect}>{popoverItems}</PopoverMenu>}
        overlayClassName="Topnav__popover"
      >
        <button>
          <Icon type="caret-down" />
        </button>
      </Popover>
    </React.Fragment>
  );
};

AuthUserBar.propTypes = {
  username: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  isWaivio: PropTypes.bool.isRequired,
};

AuthUserBar.defaultProps = {};

export default connect(
  state => ({
    username: getAuthenticatedUserName(state),
    isWaivio: getIsWaivio(state),
  }),
  {
    logout,
    setCurrentPage,
  },
)(withRouter(injectIntl(AuthUserBar)));
