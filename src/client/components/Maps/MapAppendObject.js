import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker/react';
import { connect } from 'react-redux';
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
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      let location = defaultCoords;
      if (_.size(nextProps.userLocation) > 0 && this.state.isInitial) {
        location = [nextProps.userLocation.lat, nextProps.userLocation.lon];
        this.setState({ userCoordinates: location, isInitial: false });
      } else if (!_.isNan(this.props.center[0])) {
        location = [nextProps.center[0], nextProps.center[1]];
        this.setState({ userCoordinates: location });
      }
    }
  }

  onBoundsChanged = ({ center, zoom, bounds, initial }) =>
    this.setState({ center, zoom, bounds, initial });

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
    const { heigth } = this.props;
    const { infoboxData, zoom, userCoordinates } = this.state;
    return userCoordinates ? (
      <div className="MapOS">
        <Map
          onBoundsChanged={this.onBoundsChanged}
          center={userCoordinates}
          zoom={zoom}
          height={heigth}
          onClick={this.setCoordinates}
          animate
        >
          {this.props.center && !_.isNan(this.props.center[0]) && (
            <Marker
              key={`${this.props.center[0]}${this.props.center[1]}`}
              anchor={this.props.center}
            />
          )}
          {infoboxData && this.getOverlayLayout()}
        </Map>
        {this.zoomButtonsLayout()}
      </div>
    ) : (
      <Loading />
    );
  }
}

MapAppendObject.defaultProps = {
  center: defaultCoords,
  heigth: 200,
  userLocation: {},
  setCoordinates: () => {},
  getCoordinates: () => {},
};

MapAppendObject.propTypes = {
  setCoordinates: PropTypes.func,
  getCoordinates: PropTypes.func,
  heigth: PropTypes.number,
  userLocation: PropTypes.shape(),
  center: PropTypes.arrayOf(PropTypes.number),
};

export default MapAppendObject;
