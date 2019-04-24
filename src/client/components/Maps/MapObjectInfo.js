import { Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import Map from 'pigeon-maps';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Marker from 'pigeon-marker/react';
import './Map.less';
import Loading from '../Icon/Loading';
import { getUserLocation } from '../../reducers';
import { getCoordinates } from '../../user/userActions';

export const defaultCoords = [37.0902, 95.0235];

@connect(
  state => ({
    userLocation: getUserLocation(state),
  }),
  {
    getCoordinates,
  },
)
class MapObjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 12,
      center: this.props.center,
      bounds: null,
      initial: true,
      isFullscreenMode: false,
    };

    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.incrementZoom = this.incrementZoom.bind(this);
    this.decrementZoom = this.decrementZoom.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.zoomButtonsLayout = this.zoomButtonsLayout.bind(this);
  }

  onBoundsChanged = ({ center, zoom, bounds, initial }) =>
    this.setState({ center, zoom, bounds, initial });

  setCoordinates = () => {
    if (navigator && navigator.geolocation) {
      const positionGPS = navigator.geolocation.getCurrentPosition(this.showUserPosition);
      if (positionGPS) {
        this.setState({ center: positionGPS });
      }
    }
    // this.setState({ center: [this.props.centerLat, this.props.centerLng] });
  };

  setPosition = () => {
    this.setState({ userCoordinates: null });
    this.setCoordinates();
  };

  showUserPosition = position =>
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });

  incrementZoom = () => this.setState({ zoom: this.state.zoom + 1 });

  decrementZoom = () => this.setState({ zoom: this.state.zoom - 1 });

  toggleModal = () => this.setState({ isFullscreenMode: !this.state.isFullscreenMode });

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
    const { heigth, setCoordinates } = this.props;
    const { center, isFullscreenMode, zoom } = this.state;
    return center ? (
      <div className="MapOS">
        <Map
          onBoundsChanged={this.onBoundsChanged}
          center={center}
          zoom={zoom}
          height={heigth}
          onClick={setCoordinates}
          animate
        >
          <Marker
            key={`${this.props.center[0]}${this.props.center[1]}`}
            anchor={this.props.center}
          />
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
            width={'90%'}
            wrapClassName={classNames('MapModal')}
            destroyOnClose
          >
            <div className="MapOS__fullscreenContent">
              <Map
                onBoundsChanged={this.onBoundsChanged}
                center={center}
                zoom={zoom}
                onClick={setCoordinates}
                animate
              >
                <Marker
                  key={`${this.props.center[0]}${this.props.center[1]}`}
                  anchor={this.props.center}
                />
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
  heigth: 200,
  setCoordinates: () => {},
};

MapObjectInfo.propTypes = {
  setCoordinates: PropTypes.func,
  heigth: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
};

export default MapObjectInfo;
