import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker/react';
// import Overlay from 'pigeon-overlay'
import './Map.less';

class MapOS extends React.Component {
  state = {
    showInfobox: false,
  };
  getObjectName = item => {
    const nameFields = _.filter(item.fields, o => o.name === 'name');
    const nameField = _.maxBy(nameFields, 'weight');
    return nameField ? nameField.body : null;
  };
  toggleInfobox = () => {
    this.setState({ showInfobox: !this.state.showInfobox });
  };
  render() {
    const { centerLat, centerLng, markers, mapHeigth, setCoordinates } = this.props;
    return (
      <Map
        center={[centerLat, centerLng]}
        zoom={8}
        height={mapHeigth}
        zoomSnap
        onClick={setCoordinates}
      >
        {_.map(markers, marker => (
          <Marker
            key={`${marker.lat}${marker.lng}`}
            anchor={[marker.lat, marker.lng]}
            payload={1}
          />
        ))}
      </Map>
    );
  }
}

MapOS.defaultProps = {
  centerLat: 37.0902,
  centerLng: 95,
  markers: {},
  mapHeigth: 200,
  setCoordinates: () => {},
};

MapOS.propTypes = {
  setCoordinates: PropTypes.func,
  mapHeigth: PropTypes.number,
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.shape()),
};

export default MapOS;
