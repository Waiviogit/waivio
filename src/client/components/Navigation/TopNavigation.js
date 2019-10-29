import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { memoize } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './TopNavigation.less';

const LINKS = {
  MY_FEED: '/my_feed',
  DISCOVER: '/discover-objects',
  MARKETS: '/markets',
  DEALS: '/deals',
  ABOUT: '/object/oul-investarena/menu',
};

const getDealsLinks = (isMobile, pathname) =>
  isMobile ? (
    <React.Fragment>
      <li className="TopNavigation__item">
        <Link
          to={`${LINKS.DEALS}/open`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname === `${LINKS.DEALS}/open`,
          })}
        >
          <FormattedMessage id="open_deals" defaultMessage="!Open deals" />
        </Link>
      </li>
      <li className="TopNavigation__item">
        <Link
          to={`${LINKS.DEALS}/closed`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname === `${LINKS.DEALS}/closed`,
          })}
        >
          <FormattedMessage id="closed_deals" defaultMessage="!Closed deals" />
        </Link>
      </li>
    </React.Fragment>
  ) : (
    <li className="TopNavigation__item">
      <Link
        to={`${LINKS.DEALS}/open`}
        className={classNames('TopNavigation__link', {
          'TopNavigation__link--active': pathname.includes(LINKS.DEALS),
        })}
      >
        <FormattedMessage id="my_deals" defaultMessage="!My deals" />
      </Link>
    </li>
  );

const TopNavigation = ({ authenticated, location: { pathname }, isMobile, onMenuClick }) => {
  const renderDealsLinks = memoize(getDealsLinks);
  return (
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
          to={`${LINKS.DISCOVER}/hashtag`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname.includes(LINKS.DISCOVER),
          })}
        >
          <FormattedMessage id="discover" defaultMessage="Discover" />
        </Link>
      </li>
      <li className="TopNavigation__item">
        <Link
          to={`${LINKS.MARKETS}/crypto`}
          className={classNames('TopNavigation__link', {
            'TopNavigation__link--active': pathname.includes(LINKS.MARKETS),
          })}
        >
          <FormattedMessage id="markets" defaultMessage="Markets" />
        </Link>
      </li>
      {authenticated && renderDealsLinks(isMobile, pathname)}
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
    </ul>
  );
};

TopNavigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape(),
  isMobile: PropTypes.bool,
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
