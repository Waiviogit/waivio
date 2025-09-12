import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { getIsSocial, getIsWaivio } from '../../store/appStore/appSelectors';
import './UserMenu.less';

const UserMenu = props => {
  const isWaivio = useSelector(getIsWaivio);
  const isSocial = useSelector(getIsSocial);
  const { name, 0: tab = 'posts' } = useParams();
  const showUserShop = isWaivio || isSocial;

  const getItemClasses = keys =>
    classNames('UserMenu__item', { 'UserMenu__item--active': keys?.includes(tab) });

  return (
    <div className="UserMenu">
      <div className="container menu-layout">
        <div className="left" />
        <ul className="UserMenu__menu ">
          <li
            className={getItemClasses([
              'discussions',
              'comments',
              'activity',
              'posts',
              'threads',
              'mentions',
            ])}
            role="presentation"
          >
            <Link to={`/@${name}`}>
              <FormattedMessage id="posts" defaultMessage="Posts" />
            </Link>
          </li>
          {showUserShop && (
            <li className={getItemClasses(['map'])} role="presentation">
              <Link to={`/@${name}/map`}>
                <FormattedMessage id="map" defaultMessage="Map" />
              </Link>
            </li>
          )}
          {showUserShop && (
            <li className={getItemClasses(['userShop'])} role="presentation">
              <Link to={`/@${name}/userShop`}>
                <FormattedMessage id="shop" defaultMessage="Shop" />
              </Link>
            </li>
          )}{' '}
          {showUserShop && (
            <li className={getItemClasses(['recipe'])} role="presentation">
              <Link to={`/@${name}/recipe`}>
                <FormattedMessage id="recipes" defaultMessage="Recipes" />
              </Link>
            </li>
          )}{' '}
          {showUserShop && (
            <li className={getItemClasses(['favorites'])} role="presentation">
              <Link to={`/@${name}/favorites`}>
                <FormattedMessage id="favorites" defaultMessage="Favorites" />
              </Link>
            </li>
          )}
          <li className={getItemClasses(['transfers'])}>
            <Link to={`/@${name}/transfers?type=WAIV`}>
              <FormattedMessage id="wallet" defaultMessage="Wallet" />
            </Link>
          </li>
          <li
            className={getItemClasses(['followers', 'following', 'following-objects'])}
            role="presentation"
          >
            <Link to={`/@${name}/followers`}>
              <FormattedMessage id="followers" defaultMessage="Followers" />{' '}
              <FormattedNumber value={props.followers} />
            </Link>
          </li>
          <li className={getItemClasses(['expertise-hashtags', 'expertise-objects'])}>
            <Link to={`/@${name}/expertise-hashtags`}>
              <FormattedMessage id="user_expertise" defaultMessage="Expertise" />
            </Link>
          </li>
          <li className={getItemClasses(['about'])} data-key="about">
            <Link to={`/@${name}/about`}>
              <FormattedMessage id="about" defaultMessage="About" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

UserMenu.propTypes = {
  followers: PropTypes.number,
};

UserMenu.defaultProps = {
  onChange: () => {},
  defaultKey: 'discussions',
  followers: 0,
  following: 0,
  isGuest: false,
};

export default UserMenu;
