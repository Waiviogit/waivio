import React from 'react';
import { isNil } from 'lodash';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import { regOrigin } from '../../../../common/constants/validation';

const LinkUrlForm = ({ getFieldDecorator, loading, intl, getFieldValue }) => {
  const urlValidation =
    getFieldValue(objectFields.url) && getFieldValue(objectFields.url).match(regOrigin);
  const hasError = isNil(urlValidation) && getFieldValue(objectFields.url);

  return (
    <>
      <Form.Item validateStatus={hasError ? 'error' : 'success'}>
        <div className="AppendForm__appendTitles mt2">
          <FormattedMessage id="Link" defaultMessage="Link" />
        </div>
        {getFieldDecorator(
          objectFields.url,
          {},
        )(
          <Input
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'enter_the_url',
              defaultMessage: 'Enter the URL',
            })}
          />,
        )}
        {hasError && (
          <span className={' mt2 append-combined-value__validation-msg'}>Invalid url</span>
        )}
      </Form.Item>
    </>
  );
};

LinkUrlForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default injectIntl(LinkUrlForm);
