import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import FilterTypesList from '../../../search/SearchAllResult/components/FilterTypesList';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import SubmitDishPhotosButton from '../../../widgets/SubmitDishPhotosButton/SubmitDishPhotosButton';
import { getConfigurationValues, getWebsiteLogo } from '../../../../store/appStore/appSelectors';
import { getObjectAvatar, getObjectUrlForLink } from '../../../../common/helpers/wObjectHelper';

import './WebsiteHeader.less';

const MainPageHeader = props => {
  const logo = useSelector(getWebsiteLogo);
  const config = useSelector(getConfigurationValues);
  const currHost = typeof location !== 'undefined' && location.hostname;
  const aboutObject = config?.aboutObject;
  const header = config?.header;
  const currentLogo = logo || getObjectAvatar(aboutObject);
  const objType = aboutObject?.object_type;
  const isHelpingObjTypes = ['list', 'page', 'widget', 'newsfeed'].includes(objType);
  const legalLink =
    aboutObject && !isHelpingObjTypes
      ? `/object/${aboutObject.author_permlink}/menu#ljc-legal`
      : `/object/ljc-legal/list`;
  const reviewLink =
    aboutObject && !isHelpingObjTypes
      ? `/object/${aboutObject.author_permlink}/reviews/mds-dining-gifts`
      : '/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh';

  return (
    <div className="MainPageHeader">
      <div className="MainPageHeader__navWrapper">
        <div className="MainPageHeader__logo">
          <Link to="/" className="MainPageHeader__logoLink">
            <img src={currentLogo} className="MainPageHeader__logoImg" alt="logo" />
            <b className="MainPageHeader__name">{header?.name || currHost}</b>
          </Link>
          {!props.withMap && (
            <Link to="/map?type=restaurant&showPanel=true" className="MainPageHeader__link">
              {props.intl.formatMessage({ id: 'map_header', defaultMessage: 'map' })}
            </Link>
          )}
          <span className={!props.withMap && 'MainPageHeader__logo-border'}>
            {header?.message ||
              props.intl.formatMessage({
                id: 'eat_out_earn_crypto',
                defaultMessage: 'Eat out, earn crypto',
              })}
          </span>
        </div>
        <div className="MainPageHeader__buttonWrap">
          <div className="MainPageHeader__listLink">
            {aboutObject && (
              <Link to={getObjectUrlForLink(aboutObject)}>
                {props.intl.formatMessage({ id: 'about', defaultMessage: 'About' })}
              </Link>
            )}
            <Link to={reviewLink}>
              {props.intl.formatMessage({ id: 'reviews', defaultMessage: 'Reviews' })}
            </Link>
            <Link to={legalLink}>
              {props.intl.formatMessage({ id: 'legal', defaultMessage: 'Legal' })}
            </Link>
          </div>
          <HeaderButton isWebsite aboutObject={aboutObject} isHelpingObjTypes={isHelpingObjTypes} />
        </div>
      </div>
      {props.withMap && (
        <div className="DiningFiltersClass">
          <div className="DiningFiltersClass__searchWrap">
            <WebsiteSearch placeholder="Search" />
            <FilterTypesList />
          </div>
          <SubmitDishPhotosButton className={'DiningFiltersClass__submit'} />
        </div>
      )}
    </div>
  );
};

MainPageHeader.propTypes = {
  withMap: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MainPageHeader);
