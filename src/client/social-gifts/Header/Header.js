import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import {
  getConfigurationValues,
  getWebsiteLogo,
  getNavigItems,
} from '../../../store/appStore/appSelectors';
import GeneralSearch from '../../websites/WebsiteLayoutComponents/Header/GeneralSearch/GeneralSearch';
import WebsiteTopNavigation from './TopNavigation/WebsiteTopNavigation';

import './Header.less';

const Header = () => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const config = useSelector(getConfigurationValues);
  const link = useSelector(getNavigItems)[0];
  const handleMobileSearchButtonClick = () => setSearchBarActive(!searchBarActive);
  const logo = useSelector(getWebsiteLogo);
  const currHost = typeof location !== 'undefined' && location.hostname;
  const header = config?.header?.name;
  const logoClassList = classNames('Header__logo', {
    'Header__logo--upperCase': !header,
  });

  return (
    <React.Fragment>
      <div className="Header">
        {!searchBarActive && (
          <Link
            to={
              config?.shopSettings?.type === 'user'
                ? `/user-shop/${config?.shopSettings?.value}`
                : link?.link
            }
            className={logoClassList}
            title={config.aboutObject?.title || config.aboutObject?.description || currHost}
          >
            {logo && (
              <img
                alt={`Social Gifts - ${header || config.host || currHost}`}
                src={logo}
                className="Header__img"
              />
            )}
            <span>{header || config.host || currHost}</span>
          </Link>
        )}
        {typeof window !== 'undefined' && (
          <React.Fragment>
            <GeneralSearch searchBarActive={searchBarActive} isSocialProduct />
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
              {!searchBarActive && typeof window !== 'undefined' && (
                <HeaderButton isSocialGifts domain={currHost} searchBarActive={searchBarActive} />
              )}
            </div>
          </React.Fragment>
        )}
      </div>
      {config.mainBanner && (
        <img
          id="socialGiftsMainBanner"
          alt={`Promotional banner for ${header || config.host || currHost} Site`}
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
