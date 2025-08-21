import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './MapControllers.less';

const MapControllers = React.memo(props => {
  const showImportIcon =
    props.showImportBtn &&
    props.isAuth &&
    (!props.settings?.objectControl || props.isAdmin || props.isUserMap);

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
      {showImportIcon && (
        <div className={'MapConfigurationControl__import'}>
          <div
            role="presentation"
            className="MapConfigurationControl__locateGPS"
            onClick={props.showImport}
          >
            <img
              style={{ width: '13px', marginTop: '2px' }}
              src="/images/import-object-icon.svg"
              alt="aim"
              className="MapConfigurationControl__import-button"
            />
          </div>
        </div>
      )}
      {props.showFullscreenBtn && (
        <div role="presentation" className="MapOS__fullScreen" onClick={props.openModal}>
          <Icon type="fullscreen" style={{ fontSize: '23px', color: '#000000' }} />
        </div>
      )}
    </div>
  );
});

MapControllers.propTypes = {
  incrementZoom: PropTypes.func,
  decrementZoom: PropTypes.func,
  showImport: PropTypes.bool,
  className: PropTypes.string,
  withoutZoom: PropTypes.bool,
  showImportBtn: PropTypes.bool,
  isUserMap: PropTypes.bool,
  showFullscreenBtn: PropTypes.bool,
  isMapObjType: PropTypes.bool,
  isAuth: PropTypes.bool,
  isAdmin: PropTypes.bool,
  settings: PropTypes.shape(),
  successCallback: PropTypes.func.isRequired,
  openModal: PropTypes.func,
  rejectCallback: PropTypes.func.isRequired,
};

MapControllers.defaultProps = {
  className: 'MapConfigurationControl',
  withoutZoom: false,
  isMapObjType: false,
  showFullscreenBtn: false,
  showImport: false,
  isAuth: false,
  isAdmin: false,
  settings: {},
  incrementZoom: () => {},
  decrementZoom: () => {},
};

export default MapControllers;
