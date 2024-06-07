import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { isNil } from 'lodash';
import classNames from 'classnames';
import WAValidator from 'multicoin-address-validator';
import PropTypes from 'prop-types';
import './SocialInputItem.less';

const SocialInputItem = ({ profile, intl, getFieldValue, getFieldDecorator, setHasErrors }) => {
  const [isInvalid, setIsInvalid] = useState();
  const validateWalletAddressClassList = classNames('SocialInputItem__addressValidate', {
    'SocialInputItem__addressValidate--invalid': isInvalid,
  });

  useEffect(() => {
    setHasErrors(isInvalid);
  }, [isInvalid]);

  const handleValidateWalletAddress = value => {
    if (!value) return setIsInvalid();

    if (value && ['bitcoin', 'ethereum'].includes(profile.id)) {
      const isValid = WAValidator.validate(value, profile.id);

      return setIsInvalid(!isValid);
    }

    return setIsInvalid(false);
  };

  const handleChangeAddress = e => {
    const address = e.currentTarget.value;

    handleValidateWalletAddress(address, profile);
  };

  return (
    <>
      <Form.Item key={profile.id}>
        {getFieldDecorator(profile.id, {
          rules: [
            {
              message: intl.formatMessage({
                id: 'profile_social_profile_incorrect',
                defaultMessage:
                  "This doesn't seem to be valid username. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
              }),
              pattern: /^[0-9A-Za-z-_.]+$/,
            },
          ],
        })(
          <Input
            size="large"
            onChange={handleChangeAddress}
            prefix={
              <i
                className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                style={{
                  color: profile.color,
                }}
              />
            }
            placeholder={profile.name}
          />,
        )}
      </Form.Item>
      {getFieldValue(profile.id) &&
        !isNil(isInvalid) &&
        ['bitcoin', 'ethereum'].includes(profile.id) && (
          <span className={validateWalletAddressClassList}>
            {isInvalid ? 'Invalid address' : 'Address is valid'}
          </span>
        )}
    </>
  );
};

SocialInputItem.propTypes = {
  profile: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  setHasErrors: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
};

export default SocialInputItem;
