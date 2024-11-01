import React from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../../common/constants/listOfFields';

const LastActivityForm = ({ getFieldDecorator, intl, handleSelectChange }) => {
  const activityDays = [
    { label: '7', value: 604800000 },
    { label: '30', value: 2592000000 },
    { label: '90', value: 7776000000 },
    { label: '120', value: 10368000000 },
    { label: '180', value: 15552000000 },
  ];

  return (
    <div>
      <Form.Item>
        <div className="NewsFiltersRule-title AppendForm__appendTitles">
          {intl.formatMessage({
            id: 'activity',
            defaultMessage: 'Activity',
          })}
        </div>
        {getFieldDecorator(objectFields.groupLastActivity)(
          <Select
            placeholder={intl.formatMessage({
              id: 'select_amount',
              defaultMessage: 'Select amount',
            })}
            onChange={handleSelectChange}
          >
            {activityDays.map(d => (
              <Select.Option value={d.value} key={d.label}>
                {d.label}
              </Select.Option>
            ))}
          </Select>,
        )}
        <Input value={'Days'} disabled />
      </Form.Item>
      <p>Select the preferred last activity period for the group&apos;s users.</p>
    </div>
  );
};

LastActivityForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(LastActivityForm);
