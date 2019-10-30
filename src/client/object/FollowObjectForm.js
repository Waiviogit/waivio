import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox } from 'antd';
import { injectIntl } from 'react-intl';

const FollowObjectForm = ({ form, intl, loading }) => (
  <Form.Item
    extra={intl.formatMessage({
      id: 'follow_extra',
      defaultMessage: 'Stay informed about topic updates submitted by other users',
    })}
  >
    {form.getFieldDecorator('follow', {
      valuePropName: 'checked',
      initialValue: false,
    })(
      <Checkbox disabled={loading}>
        {intl.formatMessage({
          id: 'follow',
          defaultMessage: 'Follow',
        })}
      </Checkbox>,
    )}
  </Form.Item>
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
