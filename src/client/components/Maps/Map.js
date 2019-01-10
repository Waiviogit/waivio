import { GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow } from 'react-google-maps';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import ObjectAvatar from '../ObjectAvatar';
import './Map.less';

class Map extends React.Component {
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
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 37.0902, lng: 95 }}
        center={{ lat: this.props.lat, lng: this.props.lng }}
        onClick={this.props.setCoordinates}
      >
        {this.props.isMarkerShown && (
          <Marker
            onClick={this.toggleInfobox}
            position={{ lat: this.props.lat, lng: this.props.lng }}
          >
            {this.state.showInfobox && (
              <InfoWindow>
                <Link
                  className="tooltip-wrap"
                  to={{ pathname: `/object/@${this.props.wobject.author_permlink}` }}
                >
                  <ObjectAvatar item={this.props.wobject} size={34} />
                  <h4>{this.getObjectName(this.props.wobject)}</h4>
                </Link>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    );
  }
}

Map.defuultProps = {
  lat: 37.0902,
  lng: 95,
};

Map.propTypes = {
  isMarkerShown: PropTypes.bool.isRequired,
  wobject: PropTypes.shape().isRequired,
  setCoordinates: PropTypes.func.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default withScriptjs(withGoogleMap(Map));
