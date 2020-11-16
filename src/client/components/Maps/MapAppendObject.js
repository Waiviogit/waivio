import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Map from 'pigeon-maps';
import { connect } from 'react-redux';
import CustomMarker from './CustomMarker';
import Loading from '../Icon/Loading';
import { getUserLocation } from '../../reducers';
import { getCoordinates } from '../../user/userActions';
import mapProvider from '../../helpers/mapProvider';
import './Map.less';

export const defaultCoords = [37.0902, 95.0235];

@connect(
  state => ({
    userLocation: getUserLocation(state),
  }),
  {
    getCoordinates,
  },
)
class MapAppendObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 12,
      userCoordinates: null,
      isInitial: true,
    };

    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.showUserPosition = this.showUserPosition.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.incrementZoom = this.incrementZoom.bind(this);
    this.decrementZoom = this.decrementZoom.bind(this);
    this.zoomButtonsLayout = this.zoomButtonsLayout.bind(this);
  }

  componentDidMount() {
    if (
      (_.isNan(this.props.center[0]) || defaultCoords[0] === this.props.center[0]) &&
      _.isEmpty(this.props.userLocation)
    ) {
      this.props.getCoordinates();
    } else {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        userCoordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      let location = defaultCoords;

      if (_.size(nextProps.userLocation) > 0 && this.state.isInitial) {
        location = [+nextProps.userLocation.lat, +nextProps.userLocation.lon];
        this.setState({ userCoordinates: location, isInitial: false });
      } else if (!_.isNan(this.props.center[0])) {
        location = [nextProps.center[0], nextProps.center[1]];
        this.setState({ userCoordinates: location });
      }
    }
  }

  onBoundsChanged = ({ center, zoom, bounds, initial }) =>
    this.setState({ center, zoom, bounds, initial, userCoordinates: center });

  setPosition = () => {
    if (navigator && navigator.geolocation) {
      const positionGPS = navigator.geolocation.getCurrentPosition(this.showUserPosition);

      if (positionGPS) {
        this.setState({ userCoordinates: positionGPS });

        return true;
      }
    }
    this.setState({ userCoordinates: [this.props.userLocation.lat, this.props.userLocation.lon] });

    return true;
  };

  setCoordinates = coord => {
    this.props.setCoordinates(coord);
  };

  showUserPosition = position =>
    this.setState({ center: [position.coords.latitude, position.coords.longitude] });

  incrementZoom = () => this.setState({ zoom: this.state.zoom + 1 });

  decrementZoom = () => this.setState({ zoom: this.state.zoom - 1 });

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
    const { infoboxData, zoom, userCoordinates } = this.state;

    return userCoordinates ? (
      <div className="MapOS">
        <Map
          provider={mapProvider}
          onBoundsChanged={this.onBoundsChanged}
          center={userCoordinates}
          zoom={zoom}
          onClick={this.setCoordinates}
          animate
          width={719}
          height={400}
        >
          {this.props.center && !_.isNan(this.props.center[0]) && (
            <CustomMarker
              key={`${this.props.center[0]}${this.props.center[1]}`}
              anchor={this.props.center}
            />
          )}
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
      </div>
    ) : (
      <Loading />
    );
  }
}

MapAppendObject.defaultProps = {
  center: defaultCoords,
  userLocation: {},
  setCoordinates: () => {},
  getCoordinates: () => {},
};

MapAppendObject.propTypes = {
  setCoordinates: PropTypes.func,
  getCoordinates: PropTypes.func,
  userLocation: PropTypes.shape(),
  center: PropTypes.arrayOf(PropTypes.number),
};

export default MapAppendObject;
