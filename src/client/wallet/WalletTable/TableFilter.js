import React from 'react';
import { Button, DatePicker, Form } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import { selectFormatDate, validateDate } from '../WalletHelper';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';

const TableFilter = ({
  intl,
  isloadingTableTransactions,
  locale,
  getFieldDecorator,
  handleOnClick,
  changeStartDate,
  changeEndDate,
  filterUsersList,
  handleSelectUser,
  deleteUser,
}) => {
  const formatDate = selectFormatDate(locale);
  const disabledDate = current => current > moment().endOf('day');

  return (
    <Form layout="inline" className="WalletTable__tableFilter">
      <Form.Item
        rules={[
          {
            required: true,
          },
        ]}
        label={intl.formatMessage({
          id: 'accounts',
          defaultMessage: 'Accounts:',
        })}
      >
        <div>
          {getFieldDecorator('filterAccounts', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_accounts_validation',
                  defaultMessage: 'Field "Accounts" is required',
                }),
              },
            ],
          })(
            <SearchUsersAutocomplete
              handleSelect={handleSelectUser}
              className="WalletTable__userSearch"
              itemsIdsToOmit={filterUsersList}
            />,
          )}
        </div>
        <div className="WalletTable__selectedUserWrap">
          {filterUsersList.map(acc => (
            <SelectUserForAutocomplete key={acc} account={acc} resetUser={deleteUser} />
          ))}
        </div>
      </Form.Item>
      <div className="WalletTable__date-wrap">
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
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
              format={formatDate}
              placeholder={intl.formatMessage({
                id: 'table_start_date_picker',
                defaultMessage: 'Select start date',
              })}
              onChange={changeStartDate}
              disabledDate={disabledDate}
            />,
          )}
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
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
              format={formatDate}
              placeholder={intl.formatMessage({
                id: 'table_end_date_picker',
                defaultMessage: 'Select end date',
              })}
              onChange={changeEndDate}
              disabledDate={disabledDate}
            />,
          )}
        </Form.Item>
      </div>
      <Button
        className="WalletTable__submit"
        onClick={handleOnClick}
        type="primary"
        htmlType="submit"
        loading={isloadingTableTransactions}
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
  isloadingTableTransactions: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  filterUsersList: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnClick: PropTypes.func.isRequired,
  changeStartDate: PropTypes.func.isRequired,
  changeEndDate: PropTypes.func.isRequired,
  handleSelectUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default TableFilter;
