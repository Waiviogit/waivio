import React from 'react';
import { Form, Input, Select } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { dimensionsFields } from '../../../../../common/constants/listOfFields';

const unitOptions = [
  { value: 'in', id: 'inch', defaultMessage: 'Inch' },
  { value: 'cm', id: 'centimeter', defaultMessage: 'Centimeter' },
  { value: 'ft', id: 'foot', defaultMessage: 'Foot' },
  { value: 'm', id: 'meter', defaultMessage: 'Meter' },
  { value: 'mm', id: 'millimeter', defaultMessage: 'Millimeter' },
  { value: 'μm', id: 'micrometer', defaultMessage: 'Micrometer' },
  { value: 'nm', id: 'nanometer', defaultMessage: 'Nanometer' },
  { value: 'mi', id: 'mile', defaultMessage: 'Mile' },
  { value: 'nmi', id: 'nautical_mile', defaultMessage: 'Nautical Mile' },
  { value: 'yd', id: 'yard', defaultMessage: 'Yard' },
  { value: 'km', id: 'kilometer', defaultMessage: 'Kilometer' },
];

const dimensionInputFields = [
  { key: dimensionsFields.length, id: 'length', defaultMessage: 'Length' },
  { key: dimensionsFields.width, id: 'width', defaultMessage: 'Width' },
  { key: dimensionsFields.depth, id: 'depth', defaultMessage: 'Depth' },
];

const DimensionsForm = ({
  getFieldDecorator,
  getFieldRules,
  isSomeValue,
  handleSelectChange,
  intl,
  loading,
}) => (
  <React.Fragment>
    {dimensionInputFields.map(field => (
      <Form.Item key={field.key}>
        {getFieldDecorator(field.key, {
          rules: getFieldRules(field.key),
        })(
          <Input
            type="number"
            className={classNames('AppendForm__input', {
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: field.id,
              defaultMessage: field.defaultMessage,
            })}
          />,
        )}
      </Form.Item>
    ))}

    <Form.Item>
      {getFieldDecorator(dimensionsFields.unitOfLength)(
        <Select
          placeholder={intl.formatMessage({
            id: 'select_unit_of_length',
            defaultMessage: 'Select unit of length',
          })}
          onChange={handleSelectChange}
        >
          {unitOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {intl.formatMessage({
                id: option.id,
                defaultMessage: option.defaultMessage,
              })}
            </Select.Option>
          ))}
        </Select>,
      )}
    </Form.Item>
  </React.Fragment>
);

DimensionsForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
};

export default DimensionsForm;
