import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import MapOS from '../../../components/Maps/Map';
import {
  getConfigurationValues,
  getScreenSize,
  getSearchUsersResults,
  getUserLocation,
  getWebsiteSearchResult,
  getWebsiteSearchType,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchType } from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';

import './WebsiteBody.less';

const WebsiteBody = props => {
  useEffect(() => {
    if (isEmpty(props.userLocation)) props.getCoordinates();
  });

  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.searchType !== 'All',
  });
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const currentLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;

  return (
    <div className="WebsiteBody topnav-layout">
      {props.searchType !== 'All' && <SearchAllResult />}
      <img
        className="WebsiteBody__logo"
        srcSet={currentLogo}
        alt="pacific dining gifts"
        styleName="brain-image"
      />
      <div className={mapClassList}>
        {!isEmpty(props.userLocation) && (
          <MapOS
            wobjects={props.searchResult}
            heigth={'93vh'}
            width={'100vw'}
            userLocation={props.userLocation}
            onMarkerClick={() => {}}
            setArea={() => {}}
            customControl={null}
            onCustomControlClick={() => {}}
            setMapArea={() => {}}
            getAreaSearchData={() => {}}
            primaryObjectCoordinates={[]}
            zoomMap={6}
          />
        )}
      </div>
    </div>
  );
};

WebsiteBody.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  getCoordinates: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}).isRequired,
  searchType: PropTypes.string.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  configuration: PropTypes.arrayOf.isRequired,
  screenSize: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    configuration: getConfigurationValues(state),
    screenSize: getScreenSize(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
  },
)(withRouter(WebsiteBody));
