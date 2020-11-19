import React from 'react';
import { Button, DatePicker, Form } from 'antd';
import PropTypes from 'prop-types';

import { selectFormatDate, validateDate } from '../WalletHelper';

const TableFilter = ({
  intl,
  isloadingTableTransactions,
  locale,
  history,
  user,
  getFieldDecorator,
  handleOnClick,
  changeStartDate,
  changeEndDate,
}) => {
  const formatDate = selectFormatDate(locale);

  return (
    <React.Fragment>
      <span
        className="WalletTable__back-btn"
        role="presentation"
        onClick={() => history.push(`/@${user.name}/transfers`)}
      >
        {intl.formatMessage({
          id: 'table_back',
          defaultMessage: 'Back',
        })}
      </span>
      <Form layout="inline">
        <Form.Item>
          <div className="WalletTable__title-wrap">
            <div className="WalletTable__star-flag">*</div>
            <div className="WalletTable__from">
              {intl.formatMessage({
                id: 'table_date_from',
                defaultMessage: 'From:',
              })}
            </div>
          </div>
          <div>
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
              />,
            )}
          </div>
        </Form.Item>
        <Form.Item>
          <div className="WalletTable__title-wrap">
            <div className="WalletTable__star-flag">*</div>
            <div className="WalletTable__till">
              {intl.formatMessage({
                id: 'table_date_till',
                defaultMessage: 'Till:',
              })}
            </div>
          </div>
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
            />,
          )}
        </Form.Item>
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
    </React.Fragment>
  );
};

TableFilter.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  isloadingTableTransactions: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  changeStartDate: PropTypes.func.isRequired,
  changeEndDate: PropTypes.func.isRequired,
};

export default TableFilter;
