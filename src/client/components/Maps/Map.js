import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import React, { createRef } from 'react';
import Map from 'pigeon-maps';
import { Icon, Modal } from 'antd';
import Overlay from 'pigeon-overlay';
import classNames from 'classnames';
import { getClientWObj } from '../../adapters';
import { getInnerFieldWithMaxWeight } from '../../object/wObjectHelper';
import { mapFields, objectFields } from '../../../common/constants/listOfFields';
import { RADIUS, ZOOM } from '../../../common/constants/map';
import Loading from '../Icon/Loading';
import { getRadius } from './mapHelper';
import { getIsMapModalOpen, getSuitableLanguage } from '../../reducers';
import { setMapFullscreenMode } from './mapActions';
import mapProvider from '../../helpers/mapProvider';
import CustomMarker from './CustomMarker';
import './Map.less';

const defaultCoords = {
  centerLat: 37.0902,
  centerLng: 95.0235,
};

@connect(
  state => ({
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
  }),
  {
    setMapFullscreenMode,
  },
)
class MapOS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoboxData: false,
      zoom: ZOOM,
      center: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      isInitial: true,
      radius: RADIUS,
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
    const { setMapArea } = this.props;
    setMapArea({ radius, coordinates: center });
  }

  componentDidUpdate(prevProps, prevState) {
    const { zoom, center, radius } = this.state;
    if (prevState.zoom !== zoom || !_.isEqual(prevState.center, center)) {
      const { setMapArea } = this.props;
      setMapArea({ radius, coordinates: center });
    }
  }

  onBoundsChanged = ({ center, zoom }) => {
    this.setState({ radius: this.calculateRadius(zoom) });
    const { setArea } = this.props;
    setArea({ center, zoom });
    this.setState({ center, zoom });
  };

  calculateRadius = zoom => {
    const { width, isFullscreenMode } = this.props;
    let radius = getRadius(zoom);
    if (isFullscreenMode) radius = (radius * this.mapRef.current.state.width) / width;
    return radius;
  };

  getMarkers = () => {
    const { wobjects, onMarkerClick } = this.props;
    return (
      !_.isEmpty(wobjects) &&
      _.map(wobjects, wobject => {
        const lat =
          getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.latitude) ||
          _.get(wobject, 'map.coordinates[1]');
        const lng =
          getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.longitude) ||
          _.get(wobject, 'map.coordinates[0]');
        const isMarked = Boolean(wobject && wobject.campaigns);
        return lat && lng ? (
          <CustomMarker
            key={`obj${wobject.author_permlink}`}
            isMarked={isMarked}
            anchor={[+lat, +lng]}
            payload={wobject}
            onMouseOver={this.handleMarkerClick}
            onClick={onMarkerClick}
            onMouseOut={this.closeInfobox}
          />
        ) : null;
      })
    );
  };

  getOverlayLayout = () => {
    const wobj = getClientWObj(this.state.infoboxData.wobject, this.props.usedLocale);
    return (
      <Overlay anchor={this.state.infoboxData.coordinates} offset={[-12, 35]}>
        <div role="presentation" className="MapOS__overlay-wrap">
          <img src={wobj.avatar} width={35} height={35} alt="" />
          <div className="MapOS__overlay-wrap-name">{wobj.name}</div>
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

  handleMarkerClick = ({ payload, anchor }) => {
    if (this.state.infoboxData && this.state.infoboxData.coordinates === anchor) {
      this.setState({ infoboxData: null });
    }
    this.setState({ infoboxData: { wobject: payload, coordinates: anchor } });
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
    this.toggleModal().then(() => {
      const { setMapArea } = this.props;
      const { radius, center } = this.state;
      setMapArea({ radius, coordinates: center });
    });
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
    const { zoom, center } = this.state;
    const { getAreaSearchData } = this.props;
    if (_.isEmpty(center)) {
      getAreaSearchData({
        radius: 500000000,
        coordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    } else {
      getAreaSearchData({ radius: getRadius(zoom), coordinates: center });
    }
    this.getMapArea();
  };

  render() {
    const { heigth, isFullscreenMode, customControl, onCustomControlClick, wobjects } = this.props;
    const { infoboxData, zoom, center } = this.state;
    const markersLayout = this.getMarkers(wobjects);
    return center ? (
      <div className="MapOS">
        <Map
          provider={mapProvider}
          onBoundsChanged={this.onBoundsChanged}
          center={center}
          zoom={zoom}
          height={heigth}
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
      <Loading />
    );
  }
}

MapOS.propTypes = {
  wobjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isFullscreenMode: PropTypes.bool,
  heigth: PropTypes.number,
  width: PropTypes.number,
  userLocation: PropTypes.shape(),
  customControl: PropTypes.node,
  usedLocale: PropTypes.string,
  onCustomControlClick: PropTypes.func,
  setArea: PropTypes.func,
  setMapFullscreenMode: PropTypes.func,
  setMapArea: PropTypes.func.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  getAreaSearchData: PropTypes.func,
};

MapOS.defaultProps = {
  ...defaultCoords,
  isFullscreenMode: false,
  markers: {},
  wobjects: [],
  heigth: 200,
  userLocation: {},
  customControl: null,
  usedLocale: 'en-US',
  setArea: () => {},
  setMapFullscreenMode: () => {},
  onCustomControlClick: () => {},
};

export default MapOS;
