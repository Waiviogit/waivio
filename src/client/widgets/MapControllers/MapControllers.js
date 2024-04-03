import React from 'react';
import PropTypes from 'prop-types';

import './MapControllers.less';

const MapControllers = React.memo(props => {
  const setCurrentLocation = () =>
    navigator.geolocation.getCurrentPosition(props.successCallback, props.rejectCallback);

  return (
    <div className={props.className}>
      {!props.withoutZoom && (
        <div className={props.isMapObjType ? 'MapOS__zoom' : `${props.className}__zoom`}>
          <div
            role="presentation"
            className={
              props.isMapObjType ? 'MapOS__zoom-button' : 'MapConfigurationControl__zoom__button'
            }
            onClick={props.incrementZoom}
          >
            +
          </div>
          <div
            role="presentation"
            className={
              props.isMapObjType ? 'MapOS__zoom-button' : 'MapConfigurationControl__zoom__button'
            }
            onClick={props.decrementZoom}
          >
            -
          </div>
        </div>
      )}
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
  incrementZoom: PropTypes.func,
  decrementZoom: PropTypes.func,
  className: PropTypes.string,
  withoutZoom: PropTypes.bool,
  isMapObjType: PropTypes.bool,
  successCallback: PropTypes.func.isRequired,
  rejectCallback: PropTypes.func.isRequired,
};

MapControllers.defaultProps = {
  className: 'MapConfigurationControl',
  withoutZoom: false,
  isMapObjType: false,
  incrementZoom: () => {},
  decrementZoom: () => {},
};

export default MapControllers;
