import React, { useState } from 'react';
import { Button, DatePicker, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

import { validateDate } from '../WalletHelper';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import { getCreationAccDate } from '../../../store/advancedReports/advancedSelectors';
import { currencyTypes } from '../../websites/constants/currencyTypes';

const TableFilter = ({
  intl,
  isLoadingTableTransactions,
  getFieldDecorator,
  handleOnClick,
  filterUsersList,
  handleSelectUser,
  deleteUser,
  form,
  currency,
}) => {
  const disabledDate = current => current > moment().endOf('day');
  const creationAccDate = useSelector(getCreationAccDate);
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = () => setIsOpen(!isOpen);

  return (
    <Form layout="inline" className="WalletTable__tableFilter">
      <Form.Item
        label={
          <span className="WalletTable__accountsLabel">
            {intl.formatMessage({
              id: 'accounts',
              defaultMessage: 'Accounts',
            })}
          </span>
        }
      >
        <div>
          {getFieldDecorator('filterAccounts')(
            <SearchUsersAutocomplete
              handleSelect={handleSelectUser}
              className="WalletTable__userSearch"
              itemsIdsToOmit={filterUsersList}
            />,
          )}
        </div>
        {isEmpty(filterUsersList) && (
          <span className="WalletTable__error">
            {intl.formatMessage({
              id: 'table_accounts_validation',
              defaultMessage: 'Field "Accounts" is required',
            })}
          </span>
        )}
        <div className="WalletTable__selectedUserWrap">
          {filterUsersList.map(acc => (
            <SelectUserForAutocomplete key={acc} account={acc} resetUser={deleteUser} />
          ))}
        </div>
      </Form.Item>
      <div className="WalletTable__exclude">
        {intl.formatMessage({
          id: 'multiple_accounts_included',
          defaultMessage:
            'If multiple accounts are included in the report, transactions between the specified accounts are excluded from the totals calculations for withdrawals and deposits.',
        })}
      </div>
      <div className="WalletTable__date-wrap">
        <Form.Item
          label={intl.formatMessage({
            id: 'table_date_from',
            defaultMessage: 'From:',
          })}
        >
          {getFieldDecorator('from', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_from_validation',
                  defaultMessage: 'Field "from" is required',
                }),
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_after_till_validation',
                  defaultMessage: 'The selected date must be before or equal the current date',
                }),
                validator: validateDate,
              },
            ],
            initialValue: moment(),
          })(
            <DatePicker
              format={'MM/DD/YYYY'}
              showToday={false}
              open={isOpen}
              onOpenChange={onOpenChange}
              placeholder={intl.formatMessage({
                id: 'table_start_date_picker',
                defaultMessage: 'Select start date',
              })}
              disabledDate={disabledDate}
              renderExtraFooter={() => (
                <button
                  className="WalletTable__datepickerFooter"
                  onClick={() => {
                    const from = creationAccDate
                      .map(date => Object.values(date))
                      .sort((a, b) => a - b)[0];

                    form.setFieldsValue({ from: moment.unix(from) });
                    setIsOpen(false);
                  }}
                >
                  {intl.formatMessage({
                    id: 'account_creation',
                    defaultMessage: 'Account creation',
                  })}
                </button>
              )}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'table_date_till',
            defaultMessage: 'Till:',
          })}
        >
          {getFieldDecorator('end', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_till_validation',
                  defaultMessage: 'Field "till" is required',
                }),
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_after_till_validation',
                  defaultMessage: 'The selected date must be before or equal the current date',
                }),
                validator: validateDate,
              },
            ],
            initialValue: moment(),
          })(
            <DatePicker
              format={'MM/DD/YYYY'}
              placeholder={intl.formatMessage({
                id: 'table_end_date_picker',
                defaultMessage: 'Select end date',
              })}
              disabledDate={disabledDate}
            />,
          )}
        </Form.Item>
      </div>
      <Form.Item
        label={intl.formatMessage({
          id: 'base_currency',
          defaultMessage: 'Base currency:',
        })}
      >
        {getFieldDecorator('currency', {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: currency,
        })(
          <Select defaultValue={currency} style={{ width: '90px' }}>
            {currencyTypes.map(curr => (
              <Select.Option key={curr} value={curr}>
                {curr}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Button
        className="WalletTable__submit"
        onClick={handleOnClick}
        type="primary"
        htmlType="submit"
        loading={isLoadingTableTransactions}
      >
        {intl.formatMessage({
          id: 'append_send',
          defaultMessage: 'Submit',
        })}
      </Button>
    </Form>
  );
};

TableFilter.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func,
  }).isRequired,
  isLoadingTableTransactions: PropTypes.bool.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  filterUsersList: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnClick: PropTypes.func.isRequired,
  handleSelectUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
};

export default TableFilter;
