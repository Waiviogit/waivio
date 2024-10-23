import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './MapControllers.less';
import { getSettingsSite } from '../../../store/websiteStore/websiteSelectors';
import { getUserAdministrator } from '../../../store/appStore/appSelectors';

const MapControllers = React.memo(props => {
  const isAuth = useSelector(getIsAuthenticated);
  const settings = useSelector(getSettingsSite);
  const isAdmin = useSelector(getUserAdministrator);
  const showImportIcon = props.showImportBtn && isAuth && (!settings?.objectControl || isAdmin);

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
            onClick={props.importObjects}
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
  importObjects: PropTypes.func,
  className: PropTypes.string,
  withoutZoom: PropTypes.bool,
  showImportBtn: PropTypes.bool,
  showFullscreenBtn: PropTypes.bool,
  isMapObjType: PropTypes.bool,
  successCallback: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  rejectCallback: PropTypes.func.isRequired,
};

MapControllers.defaultProps = {
  className: 'MapConfigurationControl',
  withoutZoom: false,
  isMapObjType: false,
  showFullscreenBtn: false,
  importObjects: false,
  showImportBtn: false,
  incrementZoom: () => {},
  decrementZoom: () => {},
};

export default MapControllers;
