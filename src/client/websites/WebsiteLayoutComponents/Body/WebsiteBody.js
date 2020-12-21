import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import MapOS from '../../../components/Maps/Map';
import {
  getMapForMainPage,
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
  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.searchType !== 'All',
  });
  const currMapCoordinates = isEmpty(props.configCoordinates.center)
    ? props.userLocation
    : props.configCoordinates.center;

  useEffect(() => {
    if (isEmpty(props.userLocation)) props.getCoordinates();
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
        {!isEmpty(currMapCoordinates) && (
          <MapOS
            wobjects={props.searchResult}
            heigth={'93vh'}
            width={'100vw'}
            userLocation={currMapCoordinates}
            onMarkerClick={() => {}}
            setArea={() => {}}
            customControl={null}
            onCustomControlClick={() => {}}
            setMapArea={() => {}}
            getAreaSearchData={() => {}}
            primaryObjectCoordinates={[]}
            zoomMap={props.configCoordinates.zoom}
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
  configCoordinates: PropTypes.arrayOf.isRequired,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    configCoordinates: getMapForMainPage(state),
    configuration: getConfigurationValues(state),
    screenSize: getScreenSize(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
  },
)(withRouter(WebsiteBody));
