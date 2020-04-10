import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AutoComplete, Button, Input } from 'antd';
import classNames from 'classnames';
import { disconnectBroker } from '../../../../investarena/redux/actions/brokersActions';
import { logout } from '../../../auth/authActions';
import { getIsBeaxyUser } from '../../../user/usersHelper';
import BrokerBalance from '../BrokerBalance/BrokerBalance';
import Avatar from '../../Avatar';
import LoggedMenuMobile from './LoggedMenuMobile/LoggedMenuMobile';
import MenuButtons from './MenuButtons/MenuButtons';
import { getIsBrokerConnected } from '../../../reducers';
import Topnav from '../Topnav';
import './MobileMenu.less';
import LoggedOutButtons from '../LoggedOutMenu';

const MobileMenu = props => {
  const {
    searchOptions,
    onSearch,
    onSelect,
    onChange,
    onFocus,
    dropdownOpen,
    intl,
    searchBarValue,
    onSearchPressEnter,
    onBlur,
    username,
    onLogout,
    disconnectPlatform,
    platformName,
    toggleMobileMenu,
    toggleModal,
    isBrokerConnected,
    location,
    searchBarActive,
  } = props;

  const isBeaxyUser = getIsBeaxyUser(username);

  const [isBrokerActions, setIsBrokerActions] = useState(false);

  useEffect(() => {
    if (isBrokerActions && isBrokerConnected) toggleMobileMenu();
  }, [isBrokerConnected]);

  const onLogoutHandler = () => {
    onLogout();
    toggleMobileMenu();
  };

  const onBrokerConnectClick = () => {
    toggleModal('broker');
    setIsBrokerActions(true);
  };

  const onAvatarClick = () => {
    Topnav.handleScrollToTop();
    toggleMobileMenu();
  };

  const onDisconnectPlatform = () => {
    disconnectPlatform();
    toggleMobileMenu();
  };

  const memoLogoutHandler = useCallback(() => onLogoutHandler(), []);
  const memoToggleModalBroker = useCallback(() => onBrokerConnectClick(), []);
  const memoAvatarClick = useCallback(() => onAvatarClick(), []);

  return (
    <div className="MobileMenu">
      <i className="MobileMenu__mask" onClick={toggleMobileMenu} role="presentation" />
      <div className="MobileMenu__wrapper">
        {username && (
          <div className="userData">
            <div className="userData__broker-balance">
              {platformName === 'beaxy' && <BrokerBalance isMobile />}
            </div>
            <div className="userData__user">
              <Link to={`/@${username}`} onClick={memoAvatarClick}>
                <Avatar username={username} size={50} />
              </Link>
            </div>
          </div>
        )}
        <div className="MobileMenu__input-container" onBlur={onBlur}>
          <AutoComplete
            dropdownClassName={classNames('Topnav__search-dropdown-container', {
              'logged-out': !username,
            })}
            dataSource={searchOptions}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={onChange}
            defaultActiveFirstOption={false}
            dropdownMatchSelectWidth={false}
            optionLabelProp="value"
            dropdownStyle={{ color: 'red' }}
            value={searchBarValue}
            open={dropdownOpen}
            onFocus={onFocus}
          >
            <Input
              onPressEnter={onSearchPressEnter}
              placeholder={intl.formatMessage({
                id: 'search_placeholder',
                defaultMessage: 'What are you looking for?',
              })}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </AutoComplete>
          <i className="iconfont icon-search" />
        </div>
        {username && <MenuButtons {...props} toggleMenu={toggleMobileMenu} />}
        <LoggedMenuMobile
          onLogout={memoLogoutHandler}
          toggleMenu={toggleMobileMenu}
          username={username}
          location={location}
          searchBarActive={searchBarActive}
        />
        {username && !isBeaxyUser && (
          <div className="MobileMenu__connect-broker">
            {platformName === 'widgets' ? (
              <Button onClick={memoToggleModalBroker}>
                {intl.formatMessage({
                  id: 'headerAuthorized.connectToBeaxy',
                  defaultMessage: 'Connect to beaxy',
                })}
              </Button>
            ) : (
              <Button onClick={onDisconnectPlatform}>
                <FormattedMessage id="disconnect_broker" defaultMessage="Disconnect broker" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  searchOptions: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  searchBarValue: PropTypes.string,
  onSearchPressEnter: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  username: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  disconnectPlatform: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
  toggleMobileMenu: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isBrokerConnected: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  searchBarActive: PropTypes.bool.isRequired,
};

MobileMenu.defaultProps = {
  username: '',
  dropdownOpen: false,
  searchBarValue: '',
};

const mapStateToProps = state => ({
  isBrokerConnected: getIsBrokerConnected(state),
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  disconnectPlatform: () => dispatch(disconnectBroker()),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MobileMenu));
