import React from 'react';
import { Form, Select } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemAuthority = (getFieldDecorator, getFieldRules, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(objectFields.authority, {
        rules: getFieldRules(objectFields.authority),
      })(
        <Select
          placeholder={intl.formatMessage({
            id: 'claim_authority',
            defaultMessage: 'Claim authority',
          })}
        >
          <Select.Option value="administrative">
            {intl.formatMessage({
              id: 'administrative',
              defaultMessage: 'Administrative',
            })}
          </Select.Option>
          <Select.Option value="ownership">
            {intl.formatMessage({
              id: 'ownership',
              defaultMessage: 'Ownership',
            })}
          </Select.Option>
        </Select>,
      )}
    </Form.Item>
  </React.Fragment>
);
export default ItemAuthority;
