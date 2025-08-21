import React from 'react';
import { Icon, Input, Select } from 'antd';
import { injectIntl } from 'react-intl';
import { Map } from 'pigeon-maps';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import mapProvider from '../../../common/helpers/mapProvider';
import { supportedGoogleTypes } from '../../components/Maps/mapHelpers';

const FirstPage = ({
  settingMap,
  lat,
  lon,
  openModal,
  setCoordinates,
  setMarker,
  onBoundsChanged,
  marker,
  setName,
  setType,
  name,
  type,
  zoomButtonsLayout,
  intl,
}) => (
  <div>
    <p>Find objects on Google Maps and import to Waivio</p>
    <div className={'MapObjectImportModal__title-text'}>Set map point:</div>
    <div className="MapDesktopMobileWrap">
      {zoomButtonsLayout()}
      <div
        role="presentation"
        className="MapOS__locateGPS"
        onClick={setCoordinates}
        title="find me"
      >
        <div className={'MapOS__locateGPS-button-container'}>
          <img src={'/images/focus.svg'} alt="aim" className="MapOS__locateGPS-button" />
        </div>
      </div>
      <div role="presentation" className="MapOS__fullScreen" onClick={openModal}>
        <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
      </div>

      <Map
        center={get(settingMap, 'center', [+lat, +lon])}
        zoom={get(settingMap, 'zoom', 8)}
        height={300}
        provider={mapProvider}
        onBoundsChanged={state => onBoundsChanged(state)}
        onClick={setMarker}
      >
        {marker}
      </Map>
    </div>
    <div>
      Focus the map on the area where the place you want to add is located. For a more precise
      search, click on the map to set a pointer.
    </div>
    <br />
    <div className={'MapObjectImportModal__title-text'}>
      Search by name in Google Maps (optional):
    </div>
    <Input defaultValue={name} placeholder={'Enter name'} onInput={e => setName(e.target.value)} />
    <br />
    <div className={'MapObjectImportModal__select-wrap'}>
      <div className={'MapObjectImportModal__title-text'}>Choose Google Maps type (optional):</div>
      <Select
        value={type || undefined}
        showSearch
        onChange={v => {
          setType(v);
        }}
        placeholder={intl.formatMessage({
          id: 'select_type',
          defaultMessage: 'Select type',
        })}
      >
        {supportedGoogleTypes.map(t => (
          <Select.Option key={t.value} value={t.value}>
            {t.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  </div>
);

FirstPage.propTypes = {
  openModal: PropTypes.func,
  setCoordinates: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  onBoundsChanged: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  zoomButtonsLayout: PropTypes.func.isRequired,
  marker: PropTypes.node.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  settingMap: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(FirstPage);
