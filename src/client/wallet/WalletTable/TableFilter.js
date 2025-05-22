import React, { useState, useRef } from 'react';
import { Button, Checkbox, DatePicker, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

import { validateDate } from '../WalletHelper';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import { getCreationAccDate } from '../../../store/advancedReports/advancedSelectors';
import { currencyTypes } from '../../websites/constants/currencyTypes';
import useQuery from '../../../hooks/useQuery';

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
  startDate,
  endDate,
  inModal,
}) => {
  const disabledDate = current => current > moment().endOf('day');
  const disabledTillDate = (current, from) => current > moment().endOf('day') || current < from;
  const creationAccDate = useSelector(getCreationAccDate);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef();

  const onOpenChange = () => setIsOpen(!isOpen);
  const invalidFields = endDate < startDate;
  const { from } = form.getFieldsValue();
  const query = useQuery();
  const tab = query?.get('tab');
  const isGenerate = tab === 'generate';
  const isStandard = tab === 'standard';

  const handleDeleteUser = acc => {
    deleteUser(acc);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSubmitClick = e => {
    setSubmitted(true);
    handleOnClick(e);
  };

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
              autoFocus={isEmpty(filterUsersList)}
              handleSelect={acc => {
                handleSelectUser(acc);
                inputRef.current?.blur();
              }}
              className="WalletTable__userSearch"
              itemsIdsToOmit={filterUsersList}
              ref={inputRef}
            />,
          )}
        </div>
        {isEmpty(filterUsersList) && submitted && (
          <span className="WalletTable__error">
            {intl.formatMessage({
              id: 'table_accounts_validation',
              defaultMessage: 'Field "Accounts" is required',
            })}
          </span>
        )}
        <div className="WalletTable__selectedUserWrap">
          {filterUsersList.map(acc => (
            <SelectUserForAutocomplete key={acc} account={acc} resetUser={handleDeleteUser} />
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
      {isGenerate && (
        <>
          <Form.Item>
            <div className="WalletTable__exclude flex flex-row">
              {getFieldDecorator('mergeRewards', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox />)}
              <div className={'WalletTable__checkbox-text'}>
                {' '}
                Merge author and curations rewards
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <div className="WalletTable__exclude--last flex flex-row">
              {getFieldDecorator('addSwaps', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox />)}
              <div className={'WalletTable__checkbox-text'}> Exclude swaps and trades records</div>
            </div>
          </Form.Item>
        </>
      )}

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
                    const f = creationAccDate
                      .map(date => Object.values(date))
                      .sort((a, b) => a - b)[0];

                    form.setFieldsValue({ from: moment.unix(f) });
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
          })(
            <DatePicker
              format={'MM/DD/YYYY'}
              placeholder={intl.formatMessage({
                id: 'table_end_date_picker',
                defaultMessage: 'Select end date',
              })}
              disabled={!from}
              disabledDate={curr => disabledTillDate(curr, from)}
            />,
          )}
        </Form.Item>
      </div>
      {invalidFields && (
        <span style={{ color: 'red' }}>The From date must be earlier than the Till date</span>
      )}
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
          <Select style={{ width: '90px' }}>
            {currencyTypes.map(curr => (
              <Select.Option key={curr} value={curr}>
                {curr}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      {isStandard && (
        <Form.Item>
          <div className="WalletTable__exclude flex flex-row">
            {getFieldDecorator('addSwaps', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox />)}
            <div className={'WalletTable__checkbox-text'}> Exclude swaps and trades records</div>
          </div>
        </Form.Item>
      )}
      {!inModal && (
        <Button
          className="WalletTable__submit"
          onClick={handleSubmitClick}
          type="primary"
          htmlType="submit"
          loading={isLoadingTableTransactions}
        >
          {intl.formatMessage({
            id: 'append_send',
            defaultMessage: 'Submit',
          })}
        </Button>
      )}
    </Form>
  );
};

TableFilter.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func,
    getFieldsValue: PropTypes.func,
  }).isRequired,
  isLoadingTableTransactions: PropTypes.bool.isRequired,
  inModal: PropTypes.bool,
  getFieldDecorator: PropTypes.func.isRequired,
  filterUsersList: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnClick: PropTypes.func,
  handleSelectUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  startDate: PropTypes.number.isRequired,
  endDate: PropTypes.number.isRequired,
};

export default TableFilter;
