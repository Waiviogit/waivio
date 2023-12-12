import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import OBJECT_TYPE from '../object/const/objectTypes';
import { hasType } from '../../common/helpers/wObjectHelper';
import { isMobile } from '../../common/helpers/apiHelpers';
import { getIsWaivio, getUserAdministrator } from '../../store/appStore/appSelectors';

import './ObjectMenu.less';

const TAB_NAME = {
  ABOUT: 'about',
  GALLERY: 'gallery',
  LIST: 'list',
  PAGE: 'page',
  WIDGET: 'widget',
  WEBPAGE: 'webpage',
  NEWSFEED: 'newsfeed',
  SHOP: 'shop',
  UPDATES: 'updates',
  REVIEWS: 'reviews',
  FOLLOWERS: 'followers',
  EXPERTISE: 'expertise',
};

const ObjectMenu = props => {
  const isList = hasType(props.wobject, OBJECT_TYPE.LIST);
  const isPage = hasType(props.wobject, OBJECT_TYPE.PAGE);
  const isWidget = hasType(props.wobject, OBJECT_TYPE.WIDGET);
  const isWebpage = hasType(props.wobject, OBJECT_TYPE.WEBPAGE);
  const isNewsfeed = hasType(props.wobject, OBJECT_TYPE.NEWSFEED);
  const isShop = hasType(props.wobject, OBJECT_TYPE.SHOP);
  const isHashtag = hasType(props.wobject, OBJECT_TYPE.HASHTAG);
  const { name, 0: tab = TAB_NAME.REVIEWS } = useParams();

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
          {isWebpage && (
            <li className={getItemClasses(TAB_NAME.WEBPAGE)} data-key={TAB_NAME.WEBPAGE}>
              <Link to={createLink(TAB_NAME.WEBPAGE)}>
                <FormattedMessage id="webpage" defaultMessage="Webpage" />
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
            className={getItemClasses([TAB_NAME.REVIEWS, isMobile() ? '' : TAB_NAME.ABOUT, ''])}
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
          {props.accessExtend && (props.isWaivio || props.isAdministrator) && (
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
          <li className={getItemClasses(TAB_NAME.HIDDEN_TAB)} data-key={TAB_NAME.HIDDEN_TAB}>
            <Link to={createLink(TAB_NAME.HIDDEN_TAB)}>
              <FormattedMessage id="info" defaultMessage="Info" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

ObjectMenu.propTypes = {
  followers: PropTypes.number,
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
}))(ObjectMenu);
