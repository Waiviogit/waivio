import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapOS from '../../../components/Maps/Map';
import {
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

  return (
    <div className="WebsiteBody topnav-layout">
      {props.searchType !== 'All' && <SearchAllResult/>}
      <div className="WebsiteBody__map">
        {!isEmpty(props.userLocation) && (
          <MapOS
            wobjects={[]}
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
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
  },
)(withRouter(WebsiteBody));
