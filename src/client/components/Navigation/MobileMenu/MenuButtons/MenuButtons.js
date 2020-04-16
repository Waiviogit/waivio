import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import BTooltip from '../../../BTooltip';
import HotNews from '../../HotNews';
import NotificationsTooltip from '../../Notifications/NotificationsTooltip';
import './MenuButtons.less';

const MenuButtons = ({ intl, username, toggleMenu }) => (
  <div className="MenuButtons">
    <Menu className="MenuButtons__wrap" mode="horizontal">
      <Menu.Item className="MenuButtons__item" key="write" onClick={toggleMenu}>
        <BTooltip
          placement="bottom"
          title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
          overlayClassName="MenuButtons__notifications-tooltip"
          mouseEnterDelay={1}
        >
          <Link to="/editor" className="MenuButtons__item-link">
            <i className="iconfont icon-write" />
          </Link>
        </BTooltip>
      </Menu.Item>
      <Menu.Item className="MenuButtons__item" onClick={toggleMenu}>
        <Link to="/" className="MenuButtons__item-link">
          <img className="feed" alt="feed" src={'/images/icons/ia-icon-feed.svg'} />
        </Link>
      </Menu.Item>
      <Menu.Item className="MenuButtons__item" key="hot">
        <HotNews isMobile />
      </Menu.Item>
      <Menu.Item className="MenuButtons__item" key="notifications">
        <NotificationsTooltip isMobile username={username} toggleMobileMenu={toggleMenu} />
      </Menu.Item>
    </Menu>
  </div>
);

MenuButtons.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string,
};

MenuButtons.defaultProps = {
  username: '',
};

export default injectIntl(MenuButtons);
