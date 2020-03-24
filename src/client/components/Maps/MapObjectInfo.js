import { Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import Map from 'pigeon-maps';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Overlay from 'pigeon-overlay';
import CustomMarker from './CustomMarker';
import Loading from '../Icon/Loading';
import { getIsMapModalOpen, getSuitableLanguage } from '../../reducers';
import { getCoordinates } from '../../user/userActions';
import mapProvider from '../../helpers/mapProvider';
import { setMapFullscreenMode } from './mapActions';
import { getInnerFieldWithMaxWeight } from '../../object/wObjectHelper';
import { mapFields, objectFields } from '../../../common/constants/listOfFields';
import { getClientWObj } from '../../adapters';
import './Map.less';

export const defaultCoords = [37.0902, 95.0235];

@connect(
  state => ({
    isFullscreenMode: getIsMapModalOpen(state),
    usedLocale: getSuitableLanguage(state),
  }),
  {
    getCoordinates,
    setMapFullscreenMode,
  },
)
class MapObjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      infoboxData: false,
      zoom: 8,
      center: this.props.center,
      bounds: null,
      initial: true,
      radius: 91287,
    };

    this.mapRef = createRef();

    this.incrementZoom = this.incrementZoom.bind(this);
    this.decrementZoom = this.decrementZoom.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.zoomButtonsLayout = this.zoomButtonsLayout.bind(this);
  }

  getMarkers = () => {
    const { wobject } = this.props;
    const lat = getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.latitude);
    const lng = getInnerFieldWithMaxWeight(wobject, objectFields.map, mapFields.longitude);
    const isMarked = Boolean(wobject && wobject.campaigns);
    return lat && lng ? (
      <CustomMarker
        key={`obj${wobject.author_permlink}`}
        isMarked={isMarked}
        anchor={[+lat, +lng]}
        payload={wobject}
        onMouseOver={this.handleMarkerClick}
        onClick={this.onMarkerClick}
        onMouseOut={this.closeInfobox}
      />
    ) : null;
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

  onMarkerClick = permlink => {
    this.props.history.push(`/object/${permlink.payload.id}`);
  };

  showUserPosition = position =>
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });

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
    const { mapHeigth, isFullscreenMode, wobject } = this.props;
    const { center, infoboxData, zoom } = this.state;
    const markersLayout = this.getMarkers(wobject);
    return center ? (
      <div className="MapOS">
        <Map
          provider={mapProvider}
          // onBoundsChanged={this.onBoundsChanged}
          center={center}
          zoom={zoom}
          height={mapHeigth}
          onClick={this.setCoordinates}
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
            title={null}
            footer={null}
            visible={isFullscreenMode}
            onCancel={this.toggleModal}
            style={{ top: 0 }}
            width={'100%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
              <Map
                ref={this.mapRef}
                // onBoundsChanged={this.onBoundsChanged}
                center={center}
                zoom={zoom}
                provider={mapProvider}
                onClick={this.setCoordinates}
                animate
              >
                {markersLayout}
                {infoboxData && this.getOverlayLayout()}
              </Map>
              {this.zoomButtonsLayout()}
              <div
                role="presentation"
                className="MapOS__locateGPS"
                onClick={this.setPosition}
                title="find me"
              >
                <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
              </div>
              <div role="presentation" className="MapOS__fullScreen" onClick={this.toggleModal}>
                <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    ) : (
      <Loading />
    );
  }
}

MapObjectInfo.defaultProps = {
  center: defaultCoords,
  mapHeigth: 200,
  setCoordinates: () => {},
  setArea: () => {},
  isFullscreenMode: false,
  usedLocale: 'en-US',
  setMapFullscreenMode: () => {},
};

MapObjectInfo.propTypes = {
  mapHeigth: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  isFullscreenMode: PropTypes.bool,
  usedLocale: PropTypes.string,
  setMapFullscreenMode: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  wobject: PropTypes.object.isRequired,
  history: PropTypes.shape().isRequired,
};

export default MapObjectInfo;
