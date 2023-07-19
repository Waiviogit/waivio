import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { objectFields } from '../../../../common/constants/listOfFields';

const AffiliateProductIdTypesForm = ({
  getFieldDecorator,
  isSomeValue,
  getFieldRules,
  loading,
  intl,
}) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(objectFields.affiliateProductIdTypes, {
        rules: getFieldRules(objectFields.affiliateProductIdTypes),
      })(
        <Input
          autoFocus
          className={classNames({
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'product_id_type',
            defaultMessage: 'Product ID type',
          })}
        />,
      )}
    </Form.Item>
  </React.Fragment>
);

AffiliateProductIdTypesForm.propTypes = {
  getFieldDecorator: PropTypes.func,
  getFieldRules: PropTypes.func,
  loading: PropTypes.bool,
  isSomeValue: PropTypes.bool,
  intl: PropTypes.shape(),
};
export default injectIntl(AffiliateProductIdTypesForm);
