import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import React, { createRef } from 'react';
import Map from 'pigeon-maps';
import { Icon, Modal } from 'antd';
import Overlay from 'pigeon-overlay';
import classNames from 'classnames';
import { getClientWObj } from '../../adapters';
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
      zoom: 8,
      center: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      isInitial: true,
      radius: 91287,
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
    return !_.isEmpty(wobjects)
      ? _.map(wobjects, wobject => {
          const lat = wobject.map.coordinates[1];
          const lng = wobject.map.coordinates[0];
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
      : null;
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

  toggleModal = () => this.props.setMapFullscreenMode(!this.props.isFullscreenMode);

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
        <div role="presentation" className="MapOS__fullScreen" onClick={this.toggleModal}>
          <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
        </div>
        {isFullscreenMode && (
          <Modal
            style={{ top: 0 }}
            title={null}
            footer={null}
            visible={isFullscreenMode}
            onCancel={this.toggleModal}
            width={'100%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
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
              <div role="presentation" className="MapOS__fullScreen" onClick={this.toggleModal}>
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
  // eslint-disable-next-line react/forbid-prop-types
  wobjects: PropTypes.array.isRequired,
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
