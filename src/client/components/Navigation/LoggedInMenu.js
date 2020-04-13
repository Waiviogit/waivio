import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import classNames from 'classnames';
import ModalBroker from '../../../investarena/components/Modals/ModalBroker';
import HotNews from './HotNews';
import BTooltip from '../BTooltip';
import Avatar from '../Avatar';
import Topnav from './Topnav';
import BurgerMenu from './BurgerMenu';
import NotificationsTooltip from './Notifications/NotificationsTooltip';

const LoggedInMenu = ({ intl, username, isGuest, searchBarActive, onMenuItemClick }) => (
  <div
    className={classNames('Topnav__menu-container', {
      'Topnav__mobile-hidden': searchBarActive,
    })}
  >
    <ModalBroker />
    <Menu selectedKeys={[]} className="Topnav__menu" mode="horizontal">
      <Menu.Item className="Topnav__menu-item" key="hot">
        <HotNews />
      </Menu.Item>
      <Menu.Item className="Topnav__menu-item" key="write">
        <BTooltip
          placement="bottom"
          title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
          overlayClassName="Topnav__notifications-tooltip"
          mouseEnterDelay={1}
        >
          <Link to="/editor" className="Topnav__link Topnav__link--action">
            <i className="iconfont icon-write" />
          </Link>
        </BTooltip>
      </Menu.Item>

      <Menu.Item className="Topnav__menu-item" key="notifications">
        <NotificationsTooltip username={username} />
      </Menu.Item>
      <Menu.Item className="Topnav__menu-item" key="user">
        <Link className="Topnav__user" to={`/@${username}`} onClick={Topnav.handleScrollToTop}>
          <Avatar username={username} size={36} />
        </Link>
      </Menu.Item>
      <Menu.Item className="Topnav__menu-item Topnav__menu-item--burger" key="more">
        <BurgerMenu isGuest={isGuest} onMenuItemClick={onMenuItemClick} />
      </Menu.Item>
    </Menu>
  </div>
);

LoggedInMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  searchBarActive: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export default injectIntl(LoggedInMenu);
