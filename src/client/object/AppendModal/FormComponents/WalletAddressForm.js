import React, { useCallback, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import WAValidator from 'multicoin-address-validator';
import PropTypes from 'prop-types';
import { debounce, isEmpty, isNil } from 'lodash';
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
  handleSelectChange,
  getFieldValue,
  selectedUserBlog,
  handleResetUserBlog,
  handleSelectUserBlog,
}) => {
  const [invalidAddress, setInvalidAddress] = useState();
  const walletAddressClassList = classNames('WithdrawModal__input', {
    'WithdrawModal__input--invalid': invalidAddress,
    'validation-error': isSomeValue,
  });
  const validateWalletAddressClassList = classNames('WithdrawModal__addressValidate', {
    'WithdrawModal__addressValidate--invalid': invalidAddress,
  });
  const currCryptocurrency = cryptocurrenciesList.find(
    c => c.name === getFieldValue(walletAddressFields.cryptocurrency),
  );

  const handleValidateWalletAddress = useCallback(
    debounce(async value => {
      if (!value) return setInvalidAddress();

      if (value) {
        const isValid = WAValidator.validate(value, currCryptocurrency.abbreviation.toLowerCase());

        return setInvalidAddress(!isValid);
      }

      return setInvalidAddress(false);
    }, 500),
    [currCryptocurrency],
  );

  const handleChange = e => {
    const address = e.currentTarget.value;

    handleValidateWalletAddress(address);
  };

  return (
    <div>
      <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
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
      <div className={classNames('AppendForm__appendTitles')} style={{ marginBottom: '2px' }}>
        <FormattedMessage id="cryptocurrency" defaultMessage="Cryptocurrency" />
      </div>
      <Form.Item>
        {getFieldDecorator(walletAddressFields.cryptocurrency, {
          initialValue: cryptocurrenciesList[0].name,
        })(
          <Select placeholder="Select a current status" onChange={handleSelectChange}>
            {cryptocurrenciesList.map(c => (
              <Select.Option key={c.name}> {c.name}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {currCryptocurrency === 'HIVE' ? (
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
                onChange={handleChange}
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'enter_address',
                  defaultMessage: 'Enter address',
                })}
              />,
            )}
          </Form.Item>
          {getFieldValue(walletAddressFields.walletAddress) && !isNil(invalidAddress) && (
            <span className={validateWalletAddressClassList}>
              {invalidAddress ? 'Invalid address' : 'Address is valid'}
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
  handleSelectChange: PropTypes.func.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  selectedUserBlog: PropTypes.shape().isRequired,
};

export default WalletAddressForm;
