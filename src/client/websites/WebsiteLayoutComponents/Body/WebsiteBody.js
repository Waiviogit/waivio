import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import MapOS from '../../../components/Maps/Map';
import { getUserLocation, getWebsiteSearchResult, getWebsiteSearchType } from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchType } from '../../../search/searchActions';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import UserCard from '../../../components/UserCard';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const filterTypes = ['restaurant', 'dish', 'drink', 'user'];
  const itemsClassList = key =>
    classNames('WebsiteBody__type', {
      'WebsiteBody__type--active': props.searchType === key,
    });

  useEffect(() => {
    if (isEmpty(props.userLocation)) props.getCoordinates();
  });

  return (
    <div className="WebsiteBody topnav-layout">
      <div className="WebsiteBody__search">
        <ul className="WebsiteBody__type-wrap">
          {filterTypes.map(type => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              className={itemsClassList(type)}
              onClick={() => props.setWebsiteSearchType(type)}
              key={type}
            >
              {type}
            </li>
          ))}
        </ul>
        {props.searchType === 'user' ? (
          <UserCard />
        ) : (
          <React.Fragment>
            <div>filtratsiya</div>
            <div>sortirovka</div>
            <div>
              {props.searchResult.map(obj => (
                <ObjectCardView wObject={obj} />
              ))}
            </div>
          </React.Fragment>
        )}

        <div>filtratsiya</div>
        <div>sortirovka</div>
        <div>
          {props.searchResult.map(obj => (
            <ObjectCardView wObject={obj} />
          ))}
        </div>
      </div>
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
  setWebsiteSearchType: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({}).isRequired,
  searchType: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    searchType: getWebsiteSearchType(state),
    searchResult: getWebsiteSearchResult(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
  },
)(withRouter(WebsiteBody));
