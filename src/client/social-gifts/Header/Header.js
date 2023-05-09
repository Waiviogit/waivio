import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getConfigurationValues } from '../../../store/appStore/appSelectors';
import GeneralSearch from '../../websites/WebsiteLayoutComponents/Header/GeneralSearch';

import './Header.less';

const Header = () => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const config = useSelector(getConfigurationValues);
  const handleMobileSearchButtonClick = () => setSearchBarActive(!searchBarActive);
  const logo = isMobile() ? config.mobileLogo : config.desktopLogo;
  const currHost = typeof location !== 'undefined' && location.hostname;
  const header = config?.header;

  return (
    <div className="Header">
      <Link to={'/'} className="Header__logo">
        <img alt="logo" src={logo} className="Header__img" />
        <span>{header || config.host || currHost}</span>
      </Link>
      <GeneralSearch searchBarActive={searchBarActive} />
      <div className={'Header__rightWrap'}>
        <button
          className={classNames('Header__mobile-search', {
            'Header__mobile-search-close': searchBarActive,
          })}
          onClick={handleMobileSearchButtonClick}
        >
          <i
            className={classNames('iconfont', {
              'icon-close': searchBarActive,
              'icon-search': !searchBarActive,
            })}
          />
        </button>
        <HeaderButton searchBarActive={searchBarActive} />
      </div>
    </div>
  );
};

export default Header;
