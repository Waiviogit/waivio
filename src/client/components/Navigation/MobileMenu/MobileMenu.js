import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AutoComplete, Button, Input } from 'antd';
import classNames from 'classnames';
import ModalBroker from '../../../../investarena/components/Modals/ModalBroker';
import { disconnectBroker } from '../../../../investarena/redux/actions/brokersActions';
import { logout } from '../../../auth/authActions';
import { getIsBeaxyUser } from '../../../user/usersHelper';
import BrokerBalance from '../BrokerBalance/BrokerBalance';
import Avatar from '../../Avatar';
import SignUp from '../../Sidebar/SignUp';
import LoggedMenuMobile from './LoggedMenuMobile/LoggedMenuMobile';
import './MobileMenu.less';
import MenuButtons from './MenuButtons/MenuButtons';

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
    handleScrollToTop,
    username,
    onLogout,
    disconnectPlatform,
    platformName,
    mobileMenuToggler,
    toggleModal,
  } = props;

  const mobileRef = useRef(null);

  const isBeaxyUser = getIsBeaxyUser(username);

  const onLogoutHandler = () => {
    onLogout();
    mobileMenuToggler();
  };

  const toggleModalBroker = () => {
    toggleModal('broker');
  };

  return (
    <div className="MobileMenu" ref={mobileRef}>
      <i className="MobileMenu__mask" onClick={mobileMenuToggler} role="presentation" />
      <div className="MobileMenu__wrapper">
        {username && (
          <div className="userData">
            <ModalBroker />
            <span className="userData__broker-balance">
              {platformName === 'beaxy' && <BrokerBalance isMobile />}
            </span>
            <span className="userData__user">
              <Link to={`/@${username}`} onClick={handleScrollToTop}>
                <Avatar username={username} size={50} />
              </Link>
            </span>
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
        {username ? <MenuButtons {...props} toggleMenu={mobileMenuToggler} /> : <SignUp />}
        <LoggedMenuMobile
          onLogout={onLogoutHandler}
          toggleMenu={mobileMenuToggler}
          username={username}
        />
        {!isBeaxyUser && platformName === 'widgets' ? (
          <div className="MobileMenu__connect-broker">
            <Button onClick={toggleModalBroker}>
              {intl.formatMessage({
                id: 'headerAuthorized.connectToBeaxy',
                defaultMessage: 'Connect to beaxy',
              })}
            </Button>
          </div>
        ) : (
          <div className="MobileMenu__connect-broker">
            <Button onClick={disconnectPlatform}>
              <FormattedMessage id="disconnect_broker" defaultMessage="Disconnect broker" />
            </Button>
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
  handleScrollToTop: PropTypes.func.isRequired,
  username: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  disconnectPlatform: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
  mobileMenuToggler: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  username: '',
  dropdownOpen: false,
  searchBarValue: '',
};

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  disconnectPlatform: () => dispatch(disconnectBroker()),
});

export default injectIntl(connect(null, mapDispatchToProps)(MobileMenu));
