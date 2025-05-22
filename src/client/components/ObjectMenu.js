import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import OBJECT_TYPE from '../object/const/objectTypes';
import { hasType } from '../../common/helpers/wObjectHelper';
import {
  getIsWaivio,
  getSiteTrusties,
  getUserAdministrator,
} from '../../store/appStore/appSelectors';

import './ObjectMenu.less';
import { getAuthorityList } from '../../store/appendStore/appendSelectors';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';

const TAB_NAME = {
  ABOUT: 'about',
  GALLERY: 'gallery',
  LIST: 'list',
  PAGE: 'page',
  WIDGET: 'widget',
  MAP: 'map',
  WEBPAGE: 'webpage',
  NEWSFEED: 'newsfeed',
  SHOP: 'shop',
  UPDATES: 'updates',
  REVIEWS: 'reviews',
  THREADS: 'threads',
  FOLLOWERS: 'followers',
  EXPERTISE: 'expertise',
  GROUP: 'group',
};

const ObjectMenu = props => {
  const isList = hasType(props.wobject, OBJECT_TYPE.LIST);
  const isPage = hasType(props.wobject, OBJECT_TYPE.PAGE);
  const isWidget = hasType(props.wobject, OBJECT_TYPE.WIDGET);
  const isMap = hasType(props.wobject, OBJECT_TYPE.MAP);
  const isWebpage = hasType(props.wobject, OBJECT_TYPE.WEBPAGE);
  const isGroup = hasType(props.wobject, OBJECT_TYPE.GROUP);
  const isNewsfeed = hasType(props.wobject, OBJECT_TYPE.NEWSFEED);
  const isShop = hasType(props.wobject, OBJECT_TYPE.SHOP);
  const isHashtag = hasType(props.wobject, OBJECT_TYPE.HASHTAG);
  const isSpesialPage =
    isList || isPage || isWidget || isMap || isWebpage || isGroup || isNewsfeed || isShop;
  const {
    name,
    0: tab = isSpesialPage ? props.wobject?.object_type : TAB_NAME.REVIEWS,
  } = useParams();
  const authorityList = useSelector(getAuthorityList);
  const trusties = useSelector(getSiteTrusties);
  const activeHeart = authorityList[props.wobject.author_permlink];
  const isTrusty = trusties?.includes(props.username);
  const showUpdates =
    (props.accessExtend && (props.isWaivio || props.isAdministrator)) || (activeHeart && isTrusty);
  const getItemClasses = key =>
    classNames('ObjectMenu__item', {
      'ObjectMenu__item--active': key.includes(tab),
    });
  const createLink = key => `/object/${name}/${key}`;

  return (
    <div className="ObjectMenu">
      <div className="container menu-layout">
        <div className="left" />
        <ul className="ObjectMenu__menu center">
          <li className={getItemClasses(TAB_NAME.ABOUT)} data-key={TAB_NAME.ABOUT}>
            <Link to={createLink(TAB_NAME.ABOUT)}>
              <FormattedMessage id="about" defaultMessage="About" />
            </Link>
          </li>
          {isList && (
            <li className={getItemClasses(TAB_NAME.LIST)} data-key={TAB_NAME.LIST}>
              <Link to={createLink(TAB_NAME.LIST)}>
                <FormattedMessage id="list" defaultMessage="List" />
              </Link>
            </li>
          )}
          {isPage && (
            <li className={getItemClasses(TAB_NAME.PAGE)} data-key={TAB_NAME.PAGE}>
              <Link to={createLink(TAB_NAME.PAGE)}>
                <FormattedMessage id="page" defaultMessage="Page" />
              </Link>
            </li>
          )}
          {isWidget && (
            <li className={getItemClasses(TAB_NAME.WIDGET)} data-key={TAB_NAME.WIDGET}>
              <Link to={createLink(TAB_NAME.WIDGET)}>
                <FormattedMessage id="Widget" defaultMessage="Widget" />
              </Link>
            </li>
          )}{' '}
          {isMap && (
            <li className={getItemClasses(TAB_NAME.MAP)} data-key={TAB_NAME.MAP}>
              <Link to={createLink(TAB_NAME.MAP)}>
                <FormattedMessage id="map" defaultMessage="Map" />
              </Link>
            </li>
          )}{' '}
          {isWebpage && (
            <li className={getItemClasses(TAB_NAME.WEBPAGE)} data-key={TAB_NAME.WEBPAGE}>
              <Link to={createLink(TAB_NAME.WEBPAGE)}>
                <FormattedMessage id="webpage" defaultMessage="Webpage" />
              </Link>
            </li>
          )}{' '}
          {isGroup && (
            <li className={getItemClasses(TAB_NAME.GROUP)} data-key={TAB_NAME.GROUP}>
              <Link to={createLink(TAB_NAME.GROUP)}>
                <FormattedMessage id="group" defaultMessage="Group" />
              </Link>
            </li>
          )}{' '}
          {isNewsfeed && (
            <li className={getItemClasses(TAB_NAME.NEWSFEED)} data-key={TAB_NAME.NEWSFEED}>
              <Link to={createLink(TAB_NAME.NEWSFEED)}>
                <FormattedMessage id="newsfeed" defaultMessage="Newsfeed" />
              </Link>
            </li>
          )}{' '}
          {isShop && (
            <li className={getItemClasses(TAB_NAME.SHOP)} data-key={TAB_NAME.SHOP}>
              <Link to={createLink(TAB_NAME.SHOP)}>
                <FormattedMessage id="shop" defaultMessage="Shop" />
              </Link>
            </li>
          )}
          <li
            className={getItemClasses([TAB_NAME.REVIEWS, TAB_NAME.THREADS])}
            data-key={TAB_NAME.REVIEWS}
          >
            <Link to={createLink(TAB_NAME.REVIEWS)}>
              <FormattedMessage id="reviews" defaultMessage="Reviews" />
            </Link>
          </li>
          {props.accessExtend && !isPage && !isHashtag && (
            <li className={getItemClasses(TAB_NAME.GALLERY)} data-key={TAB_NAME.GALLERY}>
              <Link to={createLink(TAB_NAME.GALLERY)}>
                <FormattedMessage id="gallery" defaultMessage="Gallery" />
              </Link>
            </li>
          )}
          {showUpdates && (
            <li
              className={getItemClasses(TAB_NAME.UPDATES)}
              role="presentation"
              data-key={TAB_NAME.UPDATES}
            >
              <Link to={createLink(TAB_NAME.UPDATES)}>
                <FormattedMessage id="updates" defaultMessage="Updates" />
                <span className="ObjectMenu__badge">
                  <FormattedNumber value={props.wobject.updatesCount} />
                </span>
              </Link>
            </li>
          )}
          <li
            className={getItemClasses(TAB_NAME.FOLLOWERS)}
            role="presentation"
            data-key={TAB_NAME.FOLLOWERS}
          >
            <Link to={createLink(TAB_NAME.FOLLOWERS)}>
              <FormattedMessage id="followers" defaultMessage="Followers" />
              <span className="ObjectMenu__badge">
                <FormattedNumber value={props.followers} />
              </span>{' '}
            </Link>
          </li>
          <li
            className={getItemClasses(TAB_NAME.EXPERTISE)}
            role="presentation"
            data-key={TAB_NAME.EXPERTISE}
          >
            <Link to={createLink(TAB_NAME.EXPERTISE)}>
              <FormattedMessage id="experts" defaultMessage="Experts" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

ObjectMenu.propTypes = {
  followers: PropTypes.number,
  username: PropTypes.string,
  accessExtend: PropTypes.bool,
  wobject: PropTypes.shape(),
  isWaivio: PropTypes.bool,
  isAdministrator: PropTypes.bool,
};

ObjectMenu.defaultProps = {
  followers: 0,
  accessExtend: true,
  isWaivio: true,
  wobject: {},
};

export default connect(state => ({
  isWaivio: getIsWaivio(state),
  isAdministrator: getUserAdministrator(state),
  username: getAuthenticatedUserName(state),
}))(ObjectMenu);
