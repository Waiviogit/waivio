import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import WAValidator from 'multicoin-address-validator';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import {
  cryptocurrenciesList,
  walletAddressFields,
} from '../../../../common/constants/listOfFields';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

const WalletAddressForm = ({
  getFieldDecorator,
  getFieldRules,
  isSomeValue,
  loading,
  intl,
  setFieldsValue,
  getFieldValue,
  selectedUserBlog,
  handleResetUserBlog,
  handleSelectUserBlog,
  isInvalid,
  setIsInvalid,
}) => {
  const walletAddressClassList = classNames('WithdrawModal__input', {
    'WithdrawModal__input--invalid': isInvalid,
    'validation-error': isSomeValue,
  });
  const validateWalletAddressClassList = classNames('WithdrawModal__addressValidate', {
    'WithdrawModal__addressValidate--invalid': isInvalid,
  });
  const currCryptocurrency = cryptocurrenciesList.find(c =>
    [c.abbreviation, c.name].includes(getFieldValue(walletAddressFields.cryptocurrency)),
  );

  const userSearchCurrencies = ['HIVE', 'WAIV', 'HBD']?.includes(currCryptocurrency?.abbreviation);
  const handleValidateWalletAddress = value => {
    if (!value) return setIsInvalid();

    if (value && currCryptocurrency?.abbreviation !== 'LBTC') {
      const isValid = WAValidator.validate(value, currCryptocurrency.abbreviation.toLowerCase());

      return setIsInvalid(!isValid);
    }

    return setIsInvalid(false);
  };

  const handleChange = currency => {
    setFieldsValue({ [walletAddressFields.cryptocurrency]: currency });
    setFieldsValue({ [walletAddressFields.walletAddress]: null });
  };

  const handleChangeAddress = e => {
    const address = e.currentTarget.value;

    handleValidateWalletAddress(address);
  };

  return (
    <div>
      <div className="AppendForm__wallet-address-title-wrap">
        <div
          className={classNames('AppendForm__appendTitles')}
          style={{ marginBottom: '2px', marginTop: '8px' }}
        >
          <FormattedMessage id="title" defaultMessage="Title" />
        </div>
        <Form.Item>
          {getFieldDecorator(
            walletAddressFields.walletTitle,
            {},
          )(
            <Input
              autoFocus
              disabled={loading}
              placeholder={intl.formatMessage({
                id: 'title_optional',
                defaultMessage: 'Title (optional)',
              })}
            />,
          )}
        </Form.Item>
      </div>
      <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
        <FormattedMessage id="cryptocurrency" defaultMessage="Cryptocurrency" />
      </div>
      <Form.Item>
        {getFieldDecorator(walletAddressFields.cryptocurrency, {
          initialValue: cryptocurrenciesList[0].abbreviation,
        })(
          <Select placeholder="Select a current status" onChange={handleChange}>
            {cryptocurrenciesList.map(c => (
              <Select.Option key={c.name} value={c.abbreviation}>
                {c.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {userSearchCurrencies ? (
        <>
          <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
            <FormattedMessage id="user" defaultMessage="User" />
          </div>
          <Form.Item>
            {getFieldDecorator(
              walletAddressFields.cryptocurrency,
              {},
            )(
              <>
                {isEmpty(selectedUserBlog) && (
                  <SearchUsersAutocomplete
                    handleSelect={handleSelectUserBlog}
                    placeholder={intl.formatMessage({
                      id: 'find_a_user',
                      defaultMessage: 'Find a user',
                    })}
                  />
                )}
              </>,
            )}
            {!isEmpty(selectedUserBlog) && (
              <SelectUserForAutocomplete
                account={selectedUserBlog}
                resetUser={handleResetUserBlog}
              />
            )}
          </Form.Item>
        </>
      ) : (
        <>
          <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
            <FormattedMessage id="address" defaultMessage="Address" />
          </div>
          <Form.Item>
            {getFieldDecorator(walletAddressFields.walletAddress, {
              rules: getFieldRules(walletAddressFields.walletAddress),
            })(
              <Input
                className={walletAddressClassList}
                onChange={handleChangeAddress}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'enter_address',
                  defaultMessage: 'Enter address',
                })}
              />,
            )}
          </Form.Item>
          {getFieldValue(walletAddressFields.walletAddress) &&
            !isNil(isInvalid) &&
            currCryptocurrency.abbreviation !== 'LBTC' && (
              <span className={validateWalletAddressClassList}>
                {isInvalid ? 'Invalid address' : 'Address is valid'}
              </span>
            )}
        </>
      )}
    </div>
  );
};

WalletAddressForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  handleResetUserBlog: PropTypes.func.isRequired,
  handleSelectUserBlog: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  setIsInvalid: PropTypes.func.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  isInvalid: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  selectedUserBlog: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.shape())]),
};

export default WalletAddressForm;
