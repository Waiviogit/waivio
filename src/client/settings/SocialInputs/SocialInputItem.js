import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { isNil } from 'lodash';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import WAValidator from 'multicoin-address-validator';
import PropTypes from 'prop-types';
import './SocialInputItem.less';
import { socialWallets } from '../../../common/helpers/socialProfiles';

const SocialInputItem = ({
  profile,
  intl,
  getFieldValue,
  getFieldDecorator,
  setErrors,
  errors,
  metadata,
}) => {
  const [isInvalid, setIsInvalid] = useState();
  const validateWalletAddressClassList = classNames('SocialInputItem__addressValidate', {
    'SocialInputItem__addressValidate--invalid': isInvalid,
  });
  const walletsIds = socialWallets.map(w => w.id);
  const idsToValidate = walletsIds.filter(w => w !== 'lightningBitcoin');
  const isWallet = walletsIds?.includes(profile.id);
  const invalidText = 'Invalid address';
  const validText = 'Address is valid';
  const addressValue = getFieldValue(profile.id);
  let icons;
  const isWhatsapp = profile.icon === 'whatsapp';

  switch (profile.icon) {
    case 'tiktok':
      icons = (
        <div className="tiktok-icon-container">
          <ReactSVG className="tiktok-icon" src="/images/icons/tiktok.svg" wrapper="span" />
        </div>
      );
      break;
    case 'snapchat':
      icons = (
        <div className="tiktok-icon-container">
          <ReactSVG className="snapchat-icon" src="/images/icons/snapchat.svg" wrapper="span" />
        </div>
      );
      break;
    case 'twitch':
    case 'pinterest':
    case 'reddit':
    case 'telegram':
    case 'whatsapp':
      icons = (
        <img
          style={{
            width: isWhatsapp ? '18px' : '14px',
            height: isWhatsapp ? '18px' : '14px',
            marginLeft: isWhatsapp ? '-2px' : '0',
          }}
          src={`/images/icons/${profile.icon}.png`}
          alt="Twitch icon"
        />
      );
      break;

    default:
      icons = (
        <i
          className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
          style={{
            color: profile.color,
          }}
        />
      );
      break;
  }

  useEffect(() => {
    setErrors({ ...errors, [profile.id]: isInvalid });
  }, [isInvalid, addressValue]);

  const handleValidateWalletAddress = value => {
    if (!value) return setIsInvalid();

    if (value && idsToValidate?.includes(profile.id)) {
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
          initialValue: metadata?.profile?.[profile?.id] || '',
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
              isWallet ? (
                <img
                  className={'SocialInputItem__icon'}
                  src={`/images/icons/cryptocurrencies/${profile.icon}`}
                  alt={''}
                />
              ) : (
                icons
              )
            }
            placeholder={isWallet ? profile.shortName : profile.name}
          />,
        )}
      </Form.Item>
      {addressValue && !isNil(isInvalid) && idsToValidate?.includes(profile.id) && (
        <span className={validateWalletAddressClassList}>
          {isInvalid ? invalidText : validText}
        </span>
      )}
    </>
  );
};

SocialInputItem.propTypes = {
  profile: PropTypes.shape().isRequired,
  metadata: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
};

export default SocialInputItem;
