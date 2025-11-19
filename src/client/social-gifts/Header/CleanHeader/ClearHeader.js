import PropTypes from 'prop-types';
import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import GeneralSearch from '../../../websites/WebsiteLayoutComponents/Header/GeneralSearch/GeneralSearch';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import WebsiteTopNavigation from '../TopNavigation/WebsiteTopNavigation';

import './HeaderClean.less';

const ClearHeader = memo(
  ({
    hideSignIn,
    searchBarActive,
    to,
    logoClassList,
    hideHeader,
    logo,
    mainObj,
    currHost,
    header,
    handleMobileSearchButtonClick,
    config,
  }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const title = useMemo(
      () => header || config?.host || currHost || mainObj?.title || mainObj?.description || '',
      [config?.host, currHost, header, mainObj?.description, mainObj?.title],
    );
    const handleToggleMode = () => setIsDarkMode(prev => !prev);

    if (hideSignIn) return null;

    return (
      <>
        <header className={classNames('HeaderClean', { dark: isDarkMode })}>
          <div className="HeaderClean__inner">
            {!searchBarActive && (
              <Link
                to={to}
                className={classNames('HeaderClean__logo', logoClassList)}
                title={mainObj?.title || mainObj?.description || currHost}
              >
                {logo && <img alt={title} src={logo} className="Header__img" />}
                <span>{title}</span>
              </Link>
            )}
            <div className="HeaderClean__search">
              <GeneralSearch searchBarActive isSocialProduct />
            </div>
            <div className="HeaderClean__actions">
              <button
                className={classNames('Header__mobile-search', {
                  'Header__mobile-search-close': searchBarActive,
                })}
                onClick={handleMobileSearchButtonClick}
                type="button"
              >
                <i
                  className={classNames('iconfont', {
                    'icon-close': searchBarActive,
                    'icon-search': !searchBarActive,
                  })}
                />
              </button>
              <HeaderButton isSocialGifts domain={currHost} searchBarActive={searchBarActive} />
              <button type="button" className="HeaderClean__modeBtn" onClick={handleToggleMode}>
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>
        </header>
        {config?.mainBanner && (
          <div
            className="HeaderClean__banner"
            style={{ backgroundImage: `url(${config?.mainBanner})` }}
          >
            <h1>{mainObj?.name || 'Your name'}</h1>
            <h2>{mainObj?.title || 'Your title of the best site by Lucy'}</h2>
            {!hideHeader && (
              <div className="HeaderClean__nav">
                <WebsiteTopNavigation shopSettings={config?.shopSettings} />
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);

ClearHeader.propTypes = {
  hideSignIn: PropTypes.bool,
  searchBarActive: PropTypes.bool,
  to: PropTypes.string,
  logoClassList: PropTypes.string,
  hideHeader: PropTypes.bool,
  logo: PropTypes.string,
  mainObj: PropTypes.shape({
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  currHost: PropTypes.string,
  header: PropTypes.string,
  handleMobileSearchButtonClick: PropTypes.func,
  config: PropTypes.shape({
    host: PropTypes.string,
    mainBanner: PropTypes.string,
    shopSettings: PropTypes.shape({}),
  }),
};

export default ClearHeader;
