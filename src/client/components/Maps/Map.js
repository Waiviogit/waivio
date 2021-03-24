import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { isEmpty, get, map, isEqual, debounce, has, size, isArray } from 'lodash';
import React, { createRef } from 'react';
import Map from 'pigeon-maps';
import { Icon, Modal } from 'antd';
import Overlay from 'pigeon-overlay';
import classNames from 'classnames';
import { DEFAULT_RADIUS, DEFAULT_ZOOM } from '../../../common/constants/map';
import { IS_RESERVED } from '../../../common/constants/rewards';
import Loading from '../Icon/Loading';
import { getRadius, getParsedMap, getDistanceBetweenTwoPoints, getZoom } from './mapHelper';
import {
  getFilteredObjectsMap,
  getIsMapModalOpen,
  getIsWaivio,
  getSuitableLanguage,
  getUpdatedMap,
  getUpdatedMapDiscover,
} from '../../reducers';
import { setMapFullscreenMode, resetUpdatedFlag } from './mapActions';
import mapProvider from '../../helpers/mapProvider';
import CustomMarker from './CustomMarker';
import { getObjectAvatar, getObjectName } from '../../helpers/wObjectHelper';
import DEFAULTS from '../../object/const/defaultValues';
import { handleAddMapCoordinates } from '../../rewards/rewardsHelper';
import './Map.less';

const defaultCoords = {
  centerLat: 37.0902,
  centerLng: 95.0235,
};

@connect(
  state => ({
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
    mapWobjects: getFilteredObjectsMap(state),
    updated: getUpdatedMap(state) || getUpdatedMapDiscover(state),
    isWaivio: getIsWaivio(state),
  }),
  {
    setMapFullscreenMode,
    resetUpdatedFlag,
  },
)
class MapOS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoboxData: false,
      zoom: this.props.match.params.filterKey === IS_RESERVED ? DEFAULT_ZOOM : props.zoomMap,
      center: isArray(this.props.userLocation)
        ? this.props.userLocation
        : [+this.props.userLocation.lat, +this.props.userLocation.lon],
      isInitial: true,
      radius: DEFAULT_RADIUS,
    };

    this.mapRef = createRef();

    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.showUserPosition = this.showUserPosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.zoomButtonsLayout = this.zoomButtonsLayout.bind(this);
  }

  componentDidMount() {
    const { radius, center } = this.state;
    const { setMapArea, match } = this.props;

    if (match.params.filterKey !== IS_RESERVED)
      setMapArea({ radius, coordinates: center, isMap: true, firstMapLoad: true });
    document.addEventListener('click', this.handleClick);
  }

  componentWillReceiveProps(nextProps) {
    const { primaryObjectCoordinates, zoomMap, match, wobjects } = this.props;
    const { zoom, center } = this.state;
    let newZoom;

    if (
      (!isEmpty(get(nextProps.match, ['params', 'campaignParent'])) &&
        !isEmpty(nextProps.wobjects) &&
        !isEqual(nextProps.wobjects, wobjects)) ||
      (match.params.filterKey === IS_RESERVED && +nextProps.userLocation.lat === center[0])
    ) {
      const coordinates = this.getWobjectsCoordinates(nextProps.wobjects);

      if (size(coordinates) === 1) {
        this.setState({ center: [coordinates[0].latitude, coordinates[0].longitude], zoom: 11 });

        return;
      }
      const distance = this.getDistance(coordinates, center);

      newZoom = has(match, ['params', 'campaignParent']) ? getZoom(distance) - 2 : zoom;
    } else {
      newZoom = zoom;
    }
    this.setState({ zoom: newZoom });
    if (
      !isEqual(nextProps.primaryObjectCoordinates, primaryObjectCoordinates) &&
      !isEmpty(nextProps.primaryObjectCoordinates)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        center: [nextProps.primaryObjectCoordinates[1], nextProps.primaryObjectCoordinates[0]],
      });
    }
    if (
      (zoomMap === 0 && nextProps.zoomMap) ||
      (zoom === 0 && nextProps.zoomMap) ||
      match.params.filterKey !== nextProps.match.params.filterKey ||
      match.params.campaignParent !== nextProps.match.params.campaignParent
    ) {
      this.setState({ zoom: nextProps.zoomMap });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { center, zoom } = this.state;
    const { match } = this.props;
    const propsMatch = get(match, ['params', 'filterKey']);
    const prevPropsMatch = get(prevProps.match, ['params', 'filterKey']);
    if (prevPropsMatch === IS_RESERVED && propsMatch !== prevPropsMatch) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ zoom: 0 });
    }
    if (
      (propsMatch !== prevPropsMatch &&
        !isEqual(prevProps.match, this.props.match) &&
        propsMatch !== IS_RESERVED) ||
      prevProps.match.params.campaignParent !== this.props.match.params.campaignParent
    ) {
      const firstMapLoad = true;

      this.updateMap(firstMapLoad);
    }
    if (
      (prevState.zoom !== zoom && prevState.zoom !== 0) ||
      (!isEqual(prevState.center, center) && isEqual(prevProps.match, this.props.match))
    ) {
      this.updateMap();
    }
  }

  componentWillUnmount() {
    this.props.resetUpdatedFlag();
  }

  updateMap = firstMapLoad => {
    const { match } = this.props;
    const isSecondaryObjectsCards =
      !isEmpty(match.params.campaignParent) || match.params.filterKey === IS_RESERVED;
    const { center, zoom } = this.state;
    const { setMapArea } = this.props;
    const newRadius = this.calculateRadius(zoom);
    const reqParams = {
      radius: newRadius,
      coordinates: center,
      isMap: true,
      isSecondaryObjectsCards,
      firstMapLoad,
    };

    setMapArea(reqParams);
  };

  onBoundsChanged = debounce(({ center, zoom, bounds }) => {
    this.setState({ radius: this.calculateRadius(zoom) });
    const { setArea, handleOnBoundsChanged } = this.props;
    handleOnBoundsChanged(bounds);
    setArea({ center, zoom });
    this.setState({ center, zoom });
  }, 1000);

  handleClick = () => {
    if (!isEmpty(this.state.infoboxData)) {
      this.setState({ infoboxData: null });
    }
  };

  calculateRadius = zoom => {
    const { width, isFullscreenMode } = this.props;
    let radius = getRadius(zoom);

    if (isFullscreenMode)
      radius = this.mapRef.current ? (radius * this.mapRef.current.state.width) / width : null;

    return radius;
  };

  getWobjectsCoordinates = wobjects => {
    const coordinates = [];
    let parsedMap;

    if (!isEmpty(wobjects)) {
      map(wobjects, wobject => {
        const parent = wobject.parent || {};

        if (!isEmpty(wobject.map)) {
          parsedMap = getParsedMap(wobject);
          coordinates.push(parsedMap);
        } else if (!isEmpty(parent.map)) {
          parsedMap = getParsedMap(parent);
          coordinates.push(parsedMap);
        }
      });
    }

    return coordinates;
  };

  getMarkers = () => {
    const { wobjects, match } = this.props;
    return (
      !isEmpty(wobjects) &&
      map(wobjects, wobject => {
        const parsedMap = getParsedMap(wobject);
        const lat = get(parsedMap, ['latitude']);
        const lng = get(parsedMap, ['longitude']);
        const isMarked =
          Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
          match.path.includes('rewards');

        return lat && lng ? (
          <CustomMarker
            key={`obj${wobject.author_permlink}`}
            isMarked={isMarked}
            anchor={[+lat, +lng]}
            payload={wobject}
            onClick={this.handleMarkerClick}
            onDoubleClick={this.closeInfobox}
          />
        ) : null;
      })
    );
  };

  getOverlayLayout = () => {
    const { onMarkerClick } = this.props;
    const { infoboxData } = this.state;
    const defaultAvatar = DEFAULTS.AVATAR;
    const wobj = infoboxData.wobject;
    const avatar = getObjectAvatar(wobj);
    const wobjPermlink = get(infoboxData, ['wobject', 'author_permlink']);

    return (
      <Overlay anchor={this.state.infoboxData.coordinates} offset={[-12, 35]}>
        <div
          role="presentation"
          className="MapOS__overlay-wrap"
          onMouseLeave={this.closeInfobox}
          onClick={() => onMarkerClick(wobjPermlink)}
        >
          <img src={avatar || defaultAvatar} width={35} height={35} alt="" />
          <div role="presentation" className="MapOS__overlay-wrap-name">
            {getObjectName(wobj)}
          </div>
        </div>
      </Overlay>
    );
  };

  setPosition = () => {
    this.setCoordinates();
  };

  setCoordinates = () => {
    if (navigator && navigator.geolocation) {
      const positionGPS = navigator.geolocation.getCurrentPosition(this.showUserPosition);

      if (positionGPS) {
        this.setState({ center: positionGPS });
      }
    }
  };

  showUserPosition = position => {
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });
  };

  setQueryInUrl = (anchor, permlink) => {
    const url = `center=${anchor.join(',')}&zoom=${this.state.zoom}&permlink=${permlink}`;

    if (this.props.isFullscreenMode) {
      this.props.setMapFullscreenMode(false);
    }

    this.props.history.push(`/?${url}`);
  };

  handleMarkerClick = ({ payload, anchor }) => {
    if (this.props.isWaivio) {
      handleAddMapCoordinates(anchor);
      if (this.state.infoboxData && this.state.infoboxData.coordinates === anchor) {
        this.setState({ infoboxData: null });
      }
      this.setState({ infoboxData: { wobject: payload, coordinates: anchor } });
    } else {
      this.setQueryInUrl(anchor, payload.author_permlink);
    }
  };

  closeInfobox = () => {
    this.setState({ infoboxData: null });
  };

  // eslint-disable-next-line consistent-return
  incrementZoom = () => {
    if (this.state.zoom >= 18) return null;
    const zoom = this.state.zoom + 1;
    const radius = this.calculateRadius(zoom);

    this.setState({ zoom, radius });
  };

  // eslint-disable-next-line consistent-return
  decrementZoom = () => {
    if (this.state.zoom <= 1) return null;
    const zoom = this.state.zoom - 1;
    const radius = this.calculateRadius(zoom);

    this.setState({ zoom, radius });
  };

  toggleModal = async () => {
    const { zoom } = this.state;

    await this.props.setMapFullscreenMode(!this.props.isFullscreenMode);
    await this.setState({ radius: this.calculateRadius(zoom) });
  };

  getMapArea = () => {
    if (this.props.isWaivio) {
      this.toggleModal().then(() => {
        const { setMapArea } = this.props;
        const { radius, center } = this.state;

        setMapArea({ radius, coordinates: center, isMap: true });
      });
    } else {
      this.setQueryInUrl(this.state.center, this.props.match.params.campaignParent);
    }
  };

  zoomButtonsLayout = () => (
    <div className="MapOS__zoom">
      <div role="presentation" className="MapOS__zoom-button" onClick={this.incrementZoom}>
        +
      </div>
      <div role="presentation" className="MapOS__zoom-button" onClick={this.decrementZoom}>
        -
      </div>
    </div>
  );

  getAreaSearchData = () => {
    const { center, radius } = this.state;
    const { getAreaSearchData } = this.props;

    if (isEmpty(center)) {
      getAreaSearchData({
        radius: 500000000,
        coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    } else {
      getAreaSearchData({ radius, coordinates: center });
    }
    this.getMapArea();
  };

  getDistance = (coordinates, center) => {
    if (!isEmpty(coordinates)) {
      const distance = map(coordinates, obj =>
        getDistanceBetweenTwoPoints({
          lat1: obj.latitude,
          long1: obj.longitude,
          lat2: center[0],
          long2: center[1],
        }),
      );

      return Math.max(...distance);
    }

    return null;
  };

  render() {
    const { heigth, isFullscreenMode, customControl, onCustomControlClick, wobjects } = this.props;
    const { infoboxData, center, zoom } = this.state;
    const markersLayout = this.getMarkers(wobjects);

    return center && zoom > 0 ? (
      <div className="MapOS">
        <Map
          provider={mapProvider}
          onBoundsChanged={this.onBoundsChanged}
          center={center}
          zoom={zoom}
          height={heigth}
        >
          {markersLayout}
          {infoboxData && this.getOverlayLayout()}
        </Map>

        {this.zoomButtonsLayout()}
        <div role="presentation" className="MapOS__locateGPS" onClick={this.setPosition}>
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
        <div role="presentation" className="MapOS__fullScreen" onClick={this.getMapArea}>
          <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
        </div>
        {isFullscreenMode && (
          <Modal
            style={{ top: 0 }}
            title={null}
            footer={null}
            visible={isFullscreenMode}
            onCancel={this.getMapArea}
            width={'100%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
              <div
                role="presentation"
                className={'MapOS__fullscreenContent-btn'}
                onClick={this.getAreaSearchData}
              >
                {this.props.intl.formatMessage({
                  id: 'search_area',
                  defaultMessage: 'Search area',
                })}
              </div>
              <Map
                ref={this.mapRef}
                onBoundsChanged={this.onBoundsChanged}
                provider={mapProvider}
                center={center}
                zoom={zoom}
                animate
              >
                {markersLayout}
                {infoboxData && this.getOverlayLayout()}
              </Map>
              {this.zoomButtonsLayout()}
              <div role="presentation" className="MapOS__locateGPS" onClick={this.setPosition}>
                <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
              </div>
              <div role="presentation" className="MapOS__fullScreen" onClick={this.getMapArea}>
                <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
              </div>
              {customControl && typeof onCustomControlClick === 'function' ? (
                <div
                  role="presentation"
                  className="MapOS__icon-customized"
                  onClick={onCustomControlClick}
                >
                  {customControl}
                </div>
              ) : null}
            </div>
          </Modal>
        )}
      </div>
    ) : (
      <Loading style={{ width: '270px', height: '268px', paddingTop: '110px' }} />
    );
  }
}

MapOS.propTypes = {
  wobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFullscreenMode: PropTypes.bool,
  isWaivio: PropTypes.bool,
  heigth: PropTypes.number,
  width: PropTypes.number,
  userLocation: PropTypes.shape(),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  customControl: PropTypes.node,
  onCustomControlClick: PropTypes.func,
  setArea: PropTypes.func,
  setMapFullscreenMode: PropTypes.func,
  setMapArea: PropTypes.func.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  getAreaSearchData: PropTypes.func,
  match: PropTypes.shape().isRequired,
  resetUpdatedFlag: PropTypes.func,
  primaryObjectCoordinates: PropTypes.arrayOf(PropTypes.number),
  zoomMap: PropTypes.number,
  handleOnBoundsChanged: PropTypes.func,
};

MapOS.defaultProps = {
  ...defaultCoords,
  isFullscreenMode: false,
  isWaivio: false,
  markers: {},
  wobjects: [],
  heigth: 200,
  userLocation: {},
  customControl: null,
  usedLocale: 'en-US',
  setArea: () => {},
  setMapFullscreenMode: () => {},
  onCustomControlClick: () => {},
  primaryObjectCoordinates: [],
  resetUpdatedFlag: () => {},
  handleOnBoundsChanged: () => {},
  zoomMap: 0,
};

export default withRouter(injectIntl(MapOS));
