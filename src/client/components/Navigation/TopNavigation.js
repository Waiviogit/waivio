import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './TopNavigation.less';

const LINKS = {
  MY_FEED: '/my_feed',
  DISCOVER: '/discover-objects',
  ABOUT: '/object/qjr-investarena-q-and-a/list',
  // QUICK_FORECAST: '/quickforecast',
};

const TopNavigation = ({ authenticated, location: { pathname }, onMenuClick }) => (
  <ul className="TopNavigation" role="presentation" onClick={onMenuClick}>
    <li className="TopNavigation__item">
      <Link
        to="/"
        className={classNames('TopNavigation__link', {
          'TopNavigation__link--active': pathname === '/',
        })}
      >
        <FormattedMessage id="home" defaultMessage="Home" />
      </Link>
    </li>
    {authenticated && (
      <li className="TopNavigation__item">
        <Link
          to={LINKS.MY_FEED}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname === LINKS.MY_FEED,
          })}
        >
          <FormattedMessage id="my_feed" defaultMessage="My feed" />
        </Link>
      </li>
    )}
    <li className="TopNavigation__item">
      <Link
        to={`${LINKS.DISCOVER}/crypto`}
        className={classNames('TopNavigation__link', {
          'TopNavigation__link--active': pathname.includes(LINKS.DISCOVER),
        })}
      >
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
    </li>
    <li className="TopNavigation__item">
      <Link
        to={LINKS.ABOUT}
        className={classNames('TopNavigation__link', {
          'TopNavigation__link--active': pathname.includes(LINKS.ABOUT),
        })}
      >
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
    </li>
    {/*<li className="TopNavigation__item">*/}
    {/*<Link*/}
    {/*to={LINKS.QUICK_FORECAST}*/}
    {/*className={classNames('TopNavigation__link', {*/}
    {/*'TopNavigation__link--active': pathname.includes(LINKS.QUICK_FORECAST),*/}
    {/*})}*/}
    {/*>*/}
    {/*<FormattedMessage id="quick_forecast" defaultMessage="Forecast" />*/}
    {/*</Link>*/}
    {/*</li>*/}
  </ul>
);

TopNavigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape(),
  onMenuClick: PropTypes.func,
};

TopNavigation.defaultProps = {
  location: {
    pathname: '',
  },
  isMobile: true,
  onMenuClick: () => {},
};

export default TopNavigation;
