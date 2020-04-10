import React from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import ModalSignUp from '../Authorization/ModalSignUp/ModalSignUp';
import ModalSignIn from '../Authorization/ModalSignIn/ModalSignIn';
import LanguageSettings from './LanguageSettings';

const LoggedOutMenu = props => {
  const { location, searchBarActive, isMobile } = props;
  const next = location.pathname.length > 1 ? location.pathname : '';
  return (
    <div
      className={classNames('Topnav__menu-container Topnav__menu-logedout', {
        'Topnav__mobile-hidden': searchBarActive,
      })}
    >
      <Menu className="Topnav__menu" mode="horizontal">
        <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="signup">
          <ModalSignUp isButton={false} />
        </Menu.Item>
        <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="divider" disabled>
          |
        </Menu.Item>
        <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="login">
          <ModalSignIn next={next} />
        </Menu.Item>
        {!isMobile && (
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="language">
            <LanguageSettings />
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

LoggedOutMenu.propTypes = {
  location: PropTypes.shape().isRequired,
  searchBarActive: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,
};

LoggedOutMenu.defaultProps = {
  isMobile: false,
};

export default LoggedOutMenu;
