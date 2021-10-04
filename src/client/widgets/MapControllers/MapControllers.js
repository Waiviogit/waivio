import React from 'react';
import PropTypes from 'prop-types';

import './MapControllers.less';

const MapControllers = React.memo(props => {
  const currClass = props.className || 'MapConfigurationControl';
  const setCurrentLocation = () =>
    navigator.geolocation.getCurrentPosition(props.successCallback, props.rejectCallback);

  return (
    <div className={currClass}>
      <div className={`${currClass}__zoom`}>
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
  // eslint-disable-next-line react/require-default-props
  className: PropTypes.string,
  successCallback: PropTypes.func.isRequired,
  rejectCallback: PropTypes.func.isRequired,
};

export default MapControllers;
