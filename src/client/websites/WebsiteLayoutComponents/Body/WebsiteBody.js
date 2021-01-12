import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
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
  getWobjectsPoint,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchType } from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import { getWebsiteObjWithCoordinates } from '../../websiteActions';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
    limit: 100,
    skip: 0,
  });
  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.searchType !== 'All',
  });
  const currMapCoordinates = isEmpty(props.configCoordinates.center)
    ? props.userLocation
    : props.configCoordinates.center;

  useEffect(() => {
    if (isEmpty(props.userLocation)) props.getCoordinates();

    if (!isEmpty(boundsParams.topPoint) && !isEmpty(boundsParams.bottomPoint)) {
      props.getWebsiteObjWithCoordinates(boundsParams);
    }
  }, [props.userLocation, boundsParams]);

  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const currentLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;
  const aboutObject = get(props, ['configuration', 'aboutObject']);
  const currLink = aboutObject ? `/object/${aboutObject}` : '/';

  const handleOnBoundsChanged = data => {
    if (!isEmpty(data)) {
      setBoundsParams({
        ...boundsParams,
        topPoint: [data.ne[1], data.ne[0]],
        bottomPoint: [data.sw[1], data.sw[0]],
      });
    }
  };
  const currentWobject = !isEmpty(props.searchResult) ? props.searchResult : props.wobjectsPoint;
  return (
    <div className="WebsiteBody topnav-layout">
      {props.searchType !== 'All' && <SearchAllResult />}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        className="WebsiteBody__logo"
        srcSet={currentLogo}
        alt="pacific dining gifts"
        styleName="brain-image"
        onClick={() => props.history.push(currLink)}
      />
      <div className={mapClassList}>
        {!isEmpty(currMapCoordinates) && (
          <MapOS
            wobjects={currentWobject}
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
            handleOnBoundsChanged={handleOnBoundsChanged}
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getCoordinates: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}).isRequired,
  searchType: PropTypes.string.isRequired,
  searchResult: PropTypes.arrayOf.isRequired,
  configuration: PropTypes.arrayOf.isRequired,
  screenSize: PropTypes.string.isRequired,
  configCoordinates: PropTypes.arrayOf.isRequired,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.shape(),
};

WebsiteBody.defaultProps = {
  wobjectsPoint: [],
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
    wobjectsPoint: getWobjectsPoint(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
  },
)(withRouter(WebsiteBody));
