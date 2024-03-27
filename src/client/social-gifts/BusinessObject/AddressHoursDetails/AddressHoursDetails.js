import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MapObjectInfo from '../../../components/Maps/MapObjectInfo';
import { isCoordinatesValid } from '../../../components/Maps/mapHelper';
import './AddressHoursDetails.less';

const AddressHoursDetails = ({ address, map, workTime, wobject, history, intl }) => {
  const isRenderMap = map && isCoordinatesValid(map.latitude, map.longitude);

  return (
    <div className={'AddressHoursDetails'}>
      {address && (
        <div className={`AddressHoursDetails__block${isRenderMap ? '--with-map' : ''}`}>
          <div className={'AddressHoursDetails__block-title'}>
            {intl.formatMessage({ id: 'object_field_address', defaultMessage: 'Address' })}
          </div>
          <div className={'AddressHoursDetails__block-content'}>
            <span>
              <Icon type="environment-o" className="text-icon coordinates" />
              {address}
            </span>
          </div>
          {isRenderMap ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${map.latitude},${map.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link "
            >
              {intl.formatMessage({ id: 'directions', defaultMessage: 'Directions' })}
            </a>
          ) : (
            <div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="address-link "
              >
                {intl.formatMessage({ id: 'directions', defaultMessage: 'Directions' })}
              </a>
            </div>
          )}
        </div>
      )}
      {isRenderMap && (
        <div className={'AddressHoursDetails__block-map'}>
          <div className={'AddressHoursDetails__block-title'}>
            {intl.formatMessage({ id: 'object_field_map', defaultMessage: 'Map' })}
          </div>
          <MapObjectInfo
            isSocial
            mapHeigth={250}
            center={[Number(map.latitude), Number(map.longitude)]}
            width={250}
            wobject={wobject}
            history={history}
            isWaivio
          />
        </div>
      )}
      {workTime && (
        <div className={`AddressHoursDetails__block${isRenderMap ? '--with-map' : ''}`}>
          <div className={'AddressHoursDetails__block-title'}>
            {intl.formatMessage({ id: 'object_field_workTime', defaultMessage: 'Hours' })}
          </div>
          <div className={'AddressHoursDetails__block-content'}>
            <div className="field-work-time">
              <Icon type="clock-circle-o" className="text-icon text-icon--time" />
              {workTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AddressHoursDetails.propTypes = {
  address: PropTypes.string,
  map: PropTypes.shape(),
  wobject: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  workTime: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(AddressHoursDetails);
