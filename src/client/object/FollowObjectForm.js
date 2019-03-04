import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox } from 'antd';
import { injectIntl } from 'react-intl';

const FollowObjectForm = ({ form, intl, loading }) => (
  <div>
    <Form.Item
      extra={intl.formatMessage({
        id: 'follow_extra',
        defaultMessage: 'Stay informed about object updates submitted by other users',
      })}
    >
      {form.getFieldDecorator('follow', {
        valuePropName: 'checked',
        initialValue: true,
      })(
        <Checkbox disabled={loading}>
          {intl.formatMessage({
            id: 'follow',
            defaultMessage: 'Follow',
          })}
        </Checkbox>,
      )}
    </Form.Item>
  </div>
);

FollowObjectForm.propTypes = {
  form: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  loading: PropTypes.bool,
};

FollowObjectForm.defaultProps = {
  loading: false,
};

export default injectIntl(FollowObjectForm);
