import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import {
  getMapForMainPage,
  getConfigurationValues,
  getScreenSize,
  getSearchUsersResults,
  getUserLocation,
  getWebsiteSearchResult,
  getWebsiteSearchType,
  getWobjectsPoint,
  isGuestUser,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchType } from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import { getWebsiteObjWithCoordinates } from '../../websiteActions';
import mapProvider from '../../../helpers/mapProvider';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import DEFAULTS from '../../../object/const/defaultValues';
import { getObjectAvatar, getObjectName } from '../../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../../rewards/rewardsHelper';
import './WebsiteBody.less';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
    limit: 100,
    skip: 0,
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.searchType !== 'All',
  });
  const currMapCoordinates = isEmpty(props.configCoordinates.center)
    ? props.userLocation
    : props.configCoordinates.center;

  useEffect(() => {
    if (isEmpty(props.userLocation)) props.getCoordinates();
    if (!isEmpty(boundsParams.topPoint) && !isEmpty(boundsParams.bottomPoint)) {
      const accessToken = props.isGuest
        ? localStorage.getItem('accessToken')
        : Cookie.get('access_token');
      props.getWebsiteObjWithCoordinates(boundsParams, accessToken);
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

  const handleMarkerClick = ({ payload, anchor }) => {
    handleAddMapCoordinates(anchor);
    if (infoboxData && infoboxData.coordinates === anchor) {
      setInfoboxData({ infoboxData: null });
    }
    setInfoboxData({ wobject: payload, coordinates: anchor });
  };

  const getMarkers = wObjects =>
    !isEmpty(wObjects) &&
    map(wObjects, wobject => {
      const parsedMap = getParsedMap(wobject);
      const latitude = get(parsedMap, ['latitude']);
      const longitude = get(parsedMap, ['longitude']);
      const isMarked =
        Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
        props.match.path.includes('rewards');

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
          onClick={handleMarkerClick}
        />
      ) : null;
    });

  const currentWobject = !isEmpty(props.searchResult) ? props.searchResult : props.wobjectsPoint;

  const markersLayout = getMarkers(currentWobject);

  const getOverlayLayout = () => {
    const currentWobj = infoboxData;
    const avatar = getObjectAvatar(currentWobj.wobject);
    const defaultAvatar = DEFAULTS.AVATAR;

    return (
      <Overlay anchor={infoboxData.coordinates} offset={[-12, 35]}>
        <div role="presentation" className="WebsiteBody__overlay-wrap">
          <img src={avatar || defaultAvatar} width={35} height={35} alt="" />
          <div role="presentation" className="MapOS__overlay-wrap-name">
            <Link to={`/object/${currentWobj.wobject.author_permlink}`}>
              {getObjectName(currentWobj.wobject)}
            </Link>
          </div>
        </div>
      </Overlay>
    );
  };

  return (
    <div className="WebsiteBody">
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
          <Map
            center={currMapCoordinates}
            zoom={props.configCoordinates.zoom}
            provider={mapProvider}
            onBoundsChanged={data => handleOnBoundsChanged(data.bounds)}
          >
            {markersLayout}
            {infoboxData && getOverlayLayout()}
          </Map>
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
  isGuest: PropTypes.bool,
  match: PropTypes.shape(),
};

WebsiteBody.defaultProps = {
  wobjectsPoint: [],
  isGuest: false,
  match: {},
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
    isGuest: isGuestUser(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
  },
)(withRouter(WebsiteBody));
