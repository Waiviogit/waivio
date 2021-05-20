import { Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import { Map } from 'pigeon-maps';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Overlay from 'pigeon-overlay';
import { isEmpty } from 'lodash';
import { getRadius, getParsedMap } from './mapHelper';
import CustomMarker from './CustomMarker';
import Loading from '../Icon/Loading';
import { getCoordinates } from '../../store/userStore/userActions';
import mapProvider from '../../helpers/mapProvider';
import { setMapFullscreenMode } from '../../store/mapStore/mapActions';
import { getIsMapModalOpen } from '../../store/mapStore/mapSelectors';

import './Map.less';

export const defaultCoords = [37.0902, 95.0235];

@connect(
  state => ({
    isFullscreenMode: getIsMapModalOpen(state),
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
      zoom: 16,
      center: this.props.center,
      bounds: null,
      initial: true,
      radius: 342,
    };

    this.mapRef = createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick = () => {
    if (location.hostname.includes('waivio') && !isEmpty(this.state.infoboxData)) {
      this.setState({ infoboxData: null });
    }
  };

  getMarkers = () => {
    const { wobject } = this.props;
    const parsedMap = getParsedMap(wobject);
    const lat = parsedMap.latitude;
    const lng = parsedMap.longitude;
    const isMarked = Boolean(
      (wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions)),
    );

    return lat && lng ? (
      <CustomMarker
        key={`obj${wobject.author_permlink}`}
        isMarked={isMarked}
        anchor={[+lat, +lng]}
        payload={wobject}
        onClick={this.handleMarkerClick}
      />
    ) : null;
  };

  setQueryInUrl = (anchor, permlink) => {
    const url = `center=${anchor.join(',')}&zoom=${this.state.zoom}&permlink=${permlink}`;

    this.props.history.push(`/?${url}`);
  };

  handleMarkerClick = ({ payload, anchor }) => {
    if (this.props.isWaivio) {
      if (this.state.infoboxData && this.state.infoboxData.coordinates === anchor) {
        this.setState({ infoboxData: null });
      }
      this.setState({ infoboxData: { wobject: payload, coordinates: anchor } });
    } else {
      this.setQueryInUrl(anchor, payload.author_permlink);
    }
  };

  getOverlayLayout = () => {
    const { infoboxData } = this.state;
    const wobj = infoboxData.wobject;

    return (
      <Overlay anchor={this.state.infoboxData.coordinates} offset={[-12, 35]}>
        <div
          role="presentation"
          className="MapOS__overlay-wrap"
          onMouseLeave={this.closeInfobox}
          onClick={this.closeModal}
        >
          <img src={wobj.avatar} width={35} height={35} alt="" />
          <div role="presentation" className="MapOS__overlay-wrap-name">
            {wobj.name}
          </div>
        </div>
      </Overlay>
    );
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
    this.props.history.push(`/object/${permlink}`);
  };

  showUserPosition = position =>
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });

  closeInfobox = () => {
    this.setState({ infoboxData: null });
  };

  calculateRadius = zoom => {
    const { width, isFullscreenMode } = this.props;
    let radius = getRadius(zoom);

    if (isFullscreenMode) radius = (radius * this.mapRef.current.state.width) / width;

    return radius;
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

  closeModal = () => {
    if (this.props.isFullscreenMode) this.props.setMapFullscreenMode(!this.props.isFullscreenMode);
  };

  openModal = () => {
    if (this.props.isWaivio) this.props.setMapFullscreenMode(!this.props.isFullscreenMode);
    else this.setQueryInUrl(this.props.center, this.props.wobject.author_permlink);
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
  render() {
    const { mapHeigth, isFullscreenMode, wobject } = this.props;
    const { center, infoboxData, zoom } = this.state;
    const markersLayout = this.getMarkers(wobject);

    return center ? (
      <div className="MapOS">
        <Map provider={mapProvider} center={center} zoom={zoom} height={mapHeigth} animate>
          {markersLayout}
          {infoboxData && this.getOverlayLayout()}
        </Map>
        {this.zoomButtonsLayout()}
        <div role="presentation" className="MapOS__locateGPS" onClick={this.setCoordinates}>
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
        <div role="presentation" className="MapOS__fullScreen" onClick={this.openModal}>
          <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
        </div>
        {isFullscreenMode && (
          <Modal
            title={null}
            footer={null}
            visible={isFullscreenMode}
            onCancel={this.closeModal}
            style={{ top: 0 }}
            width={'100%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
              <Map ref={this.mapRef} center={center} zoom={zoom} provider={mapProvider} animate>
                {markersLayout}
                {infoboxData && this.getOverlayLayout()}
              </Map>
              {this.zoomButtonsLayout()}
              <div
                role="presentation"
                className="MapOS__locateGPS"
                onClick={this.setCoordinates}
                title="find me"
              >
                <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
              </div>
              <div role="presentation" className="MapOS__fullScreen" onClick={this.openModal}>
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
  setMapFullscreenMode: () => {},
  width: 0,
  isWaivio: true,
};

MapObjectInfo.propTypes = {
  mapHeigth: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  isFullscreenMode: PropTypes.bool,
  isWaivio: PropTypes.bool,
  setMapFullscreenMode: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  wobject: PropTypes.object.isRequired,
  history: PropTypes.shape().isRequired,
  width: PropTypes.number,
};

export default MapObjectInfo;
