import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import GeneralSearch from '../../websites/WebsiteLayoutComponents/Header/GeneralSearch/GeneralSearch';
import WebsiteTopNavigation from './TopNavigation/WebsiteTopNavigation';
import './Header.less';

const ClassicHeader = ({
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
}) => (
  <React.Fragment>
    {!hideSignIn && (
      <React.Fragment>
        <div className="Header">
          {!searchBarActive && (
            <Link
              to={to}
              className={logoClassList}
              title={mainObj?.title || mainObj?.description || currHost}
            >
              {logo && (
                <img
                  alt={`Social Gifts - ${header || config?.host || currHost} `}
                  src={logo}
                  className="Header__img"
                />
              )}
              <span>{header || config?.host || currHost}</span>
            </Link>
          )}
          {typeof window !== 'undefined' && (
            <React.Fragment>
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
                {!searchBarActive && typeof window !== 'undefined' && (
                  <HeaderButton isSocialGifts domain={currHost} searchBarActive={searchBarActive} />
                )}
              </div>
            </React.Fragment>
          )}
        </div>
        {config?.mainBanner && (
          <img
            id="socialGiftsMainBanner"
            alt={`Promotional banner for ${header || config?.host || currHost}`}
            src={config?.mainBanner}
            style={{
              width: '100%',
            }}
          />
        )}
      </React.Fragment>
    )}
    {!hideHeader && <WebsiteTopNavigation shopSettings={config?.shopSettings} />}
  </React.Fragment>
);

ClassicHeader.propTypes = {
  hideSignIn: PropTypes.bool,
  searchBarActive: PropTypes.bool,
  to: PropTypes.string,
  logoClassList: PropTypes.string,
  hideHeader: PropTypes.bool,
  logo: PropTypes.string,
  mainObj: PropTypes.shape({
    title: PropTypes.string,
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

export default ClassicHeader;
