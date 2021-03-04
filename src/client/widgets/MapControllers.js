import React from 'react';
import PropTypes from 'prop-types';

const MapControllers = props => (
  <div className="MapConfigurationControl">
    <div className="MapConfigurationControl__zoom">
      <div
        role="presentation"
        className="MapConfigurationControl__zoom__button"
        onClick={props.incrementZoom}
      >
        +
      </div>
      <div
        role="presentation"
        className="MapConfigurationControl__zoom__button"
        onClick={props.decrementZoom}
      >
        -
      </div>
    </div>
    <div className="MapConfigurationControl__gps">
      <div
        role="presentation"
        className="MapConfigurationZoom__locateGPS"
        onClick={props.setPosition}
      >
        <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
      </div>
    </div>
  </div>
);

MapControllers.propTypes = {
  incrementZoom: PropTypes.func.isRequired,
  decrementZoom: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired,
};

export default MapControllers;
