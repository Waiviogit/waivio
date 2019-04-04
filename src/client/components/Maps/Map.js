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
    const { lat, lng, isMarkerShown, mapHeigth, setCoordinates } = this.props;
    return (
      <Map center={[lat, lng]} zoom={8} height={mapHeigth} zoomSnap onClick={setCoordinates}>
        {isMarkerShown && <Marker anchor={[lat, lng]} payload={1} />}
        {/* <Overlay anchor={[50.879, 4.6997]} offset={[120, 79]}> */}
        {/* <img src='/images/hero-2.svg' width={240} height={158} alt='' /> */}
        {/* </Overlay> */}
      </Map>
    );
  }
}

MapOS.defuultProps = {
  lat: 37.0902,
  lng: 95,
};

MapOS.propTypes = {
  isMarkerShown: PropTypes.bool.isRequired,
  setCoordinates: PropTypes.func.isRequired,
  mapHeigth: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default MapOS;
