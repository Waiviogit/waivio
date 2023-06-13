import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import { getConfigurationValues, getWebsiteLogo } from '../../../store/appStore/appSelectors';
import GeneralSearch from '../../websites/WebsiteLayoutComponents/Header/GeneralSearch/GeneralSearch';
import WebsiteTopNavigation from './TopNavigation/WebsiteTopNavigation';

import './Header.less';

const Header = () => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const config = useSelector(getConfigurationValues);
  const handleMobileSearchButtonClick = () => setSearchBarActive(!searchBarActive);
  const logo = useSelector(getWebsiteLogo);
  const currHost = typeof location !== 'undefined' && location.hostname;
  const header = config?.header?.name;

  return (
    <React.Fragment>
      <div className="Header">
        <Link to={'/'} className="Header__logo">
          {logo && <img alt="logo" src={logo} className="Header__img" />}
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
      {config.mainBanner && (
        <img
          alt={''}
          src={config.mainBanner}
          style={{
            width: '100%',
          }}
        />
      )}
      <WebsiteTopNavigation shopSettings={config.shopSettings} />
    </React.Fragment>
  );
};

export default Header;
