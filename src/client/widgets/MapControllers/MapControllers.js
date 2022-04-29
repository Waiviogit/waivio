import React from 'react';
import PropTypes from 'prop-types';

import './MapControllers.less';

const MapControllers = React.memo(props => {
  const setCurrentLocation = () =>
    navigator.geolocation.getCurrentPosition(props.successCallback, props.rejectCallback);

  return (
    <div className={props.className}>
      <div className={`${props.className}__zoom`}>
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
      <div className={'MapConfigurationControl__gps'}>
        <div
          role="presentation"
          className="MapConfigurationControl__locateGPS"
          onClick={setCurrentLocation}
        >
          <img
            src="/images/focus.svg"
            alt="aim"
            className="MapConfigurationControl__locateGPS-button"
          />
        </div>
      </div>
    </div>
  );
});

MapControllers.propTypes = {
  incrementZoom: PropTypes.func.isRequired,
  decrementZoom: PropTypes.func.isRequired,
  className: PropTypes.string,
  successCallback: PropTypes.func.isRequired,
  rejectCallback: PropTypes.func.isRequired,
};

MapControllers.defaultProps = {
  className: 'MapConfigurationControl',
};

export default MapControllers;
