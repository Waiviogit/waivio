import React from 'react';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { mapFields } from '../../../../../common/constants/listOfFields';
import MapAppendObject from '../../../../components/Maps/MapAppendObject';

const ItemMap = (
  onUpdateCoordinate,
  getFieldDecorator,
  getFieldRules,
  setCoordinates,
  getFieldValue,
  isSomeValue,
  loading,
  intl,
) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(mapFields.latitude, {
        rules: getFieldRules(mapFields.latitude),
      })(
        <Input
          onBlur={onUpdateCoordinate(mapFields.latitude)}
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_latitude',
            defaultMessage: 'Latitude',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(mapFields.longitude, {
        rules: getFieldRules(mapFields.longitude),
      })(
        <Input
          onBlur={onUpdateCoordinate(mapFields.longitude)}
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_longitude',
            defaultMessage: 'Longitude',
          })}
        />,
      )}
    </Form.Item>
    <MapAppendObject
      setCoordinates={setCoordinates}
      heigth={400}
      center={[
        Number(getFieldValue(mapFields.latitude)),
        Number(getFieldValue(mapFields.longitude)),
      ]}
    />
  </React.Fragment>
);
export default ItemMap;
