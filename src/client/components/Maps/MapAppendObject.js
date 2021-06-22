import PropTypes from 'prop-types';
import { isNil, isEmpty, isEqual } from 'lodash';
import React from 'react';
import { Map } from 'pigeon-maps';
import { connect } from 'react-redux';
import CustomMarker from './CustomMarker';
import { getCoordinates } from '../../store/userStore/userActions';
import mapProvider from '../../helpers/mapProvider';
import { getUserLocation } from '../../store/userStore/userSelectors';

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
    };
  }

  componentDidMount() {
    if (isNil(this.props.center[0]) || isEmpty(this.props.userLocation)) {
      this.props.getCoordinates().then(res =>
        this.setState({
          userCoordinates: [+res.value.latitude, +res.value.longitude],
          loading: false,
        }),
      );
    } else {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        userCoordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.center, this.props.center)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({ userCoordinates: this.props.center }));
    }
  }

  onBoundsChanged = ({ center, zoom, bounds, initial }) =>
    this.setState({ center, zoom, bounds, initial, userCoordinates: center });

  handleError = async () => {
    if (isEmpty(this.props.userLocation)) {
      this.props.getCoordinates().then(res =>
        this.setState({
          userCoordinates: [+res.value.latitude, +res.value.longitude],
        }),
      );
    } else {
      this.setState({
        userCoordinates: [+this.props.userLocation.lat, +this.props.userLocation.lon],
      });
    }
  };

  setPosition = () => {
    if (navigator && navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.showUserPosition, this.handleError);
  };

  setCoordinates = coord => this.props.setCoordinates(coord);

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
    const { zoom, userCoordinates } = this.state;

    return (
      <div style={{ position: 'relative' }}>
        {this.zoomButtonsLayout()}
        <div
          role="presentation"
          className="MapOS__locateGPS"
          onClick={this.setPosition}
          title="find me"
        >
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
        <Map
          provider={mapProvider}
          onBoundsChanged={this.onBoundsChanged}
          center={userCoordinates}
          zoom={zoom}
          onClick={this.setCoordinates}
          height={400}
          animate
        >
          {this.props.center && !isNil(this.props.center[0]) && (
            <CustomMarker key={this.props.center.join('/')} anchor={this.props.center} />
          )}
        </Map>
      </div>
    );
  }
}

MapAppendObject.defaultProps = {
  center: [],
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
