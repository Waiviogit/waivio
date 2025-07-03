import { Modal, Button, Checkbox, Form, Input, InputNumber, Select, DatePicker, Radio } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import RadioGroup from 'antd/es/radio/group';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getCurrentCurrencyRate as getCurrentCurrencyRateAct } from '../../../store/appStore/appActions';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import { getTokenBalance } from '../../../store/walletStore/walletActions';
import {
  getUserCurrencyBalance,
  getTokenRatesInUSD,
} from '../../../store/walletStore/walletSelectors';
import GiveawayBlockPreview from './GiveawayPreviewBlock/GiveawayBlockPreview';

const GiveawayModal = ({
  form,
  user,
  currency,
  currencyInfo,
  rateInUsd,
  getTokenBalanceAction,
}) => {
  const [filtered, setFiltered] = useState(false);
  const [isOpenGiveAwayModal, setIsiOpenGiveAwayModal] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [budget, setBudget] = React.useState(false);
  const { getFieldDecorator, resetFields, validateFields, getFieldsValue, getFieldValue } = form;

  useEffect(() => {
    if (currency.type && !budget && currencyInfo?.balance) {
      setBudget(currencyInfo?.balance * rateInUsd * currency.rate);
    } else {
      getTokenBalanceAction('WAIV', user.name);
    }
  }, [currency.type, currencyInfo?.balance]);

  const onClickGiveawayButton = () => setIsiOpenGiveAwayModal(true);
  const onClose = () => {
    setIsiOpenGiveAwayModal(false);
    resetFields();
  };

  // eslint-disable-next-line consistent-return
  const validateRewards = (rule, value, callback) => {
    const winners = getFieldValue('winners');

    if (winners * value > budget) return callback('Rewards more than user balance.');
    callback();
  };

  // eslint-disable-next-line consistent-return
  const validateWinnersQuantity = (rule, value, callback) => {
    const reward = getFieldValue('reward');

    if (reward * value > budget)
      return callback(
        'The total campaign budget exceeds your balance. Consider reducing the number of winners.',
      );

    callback();
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields(err => {
      if (!err) {
        setShowPreview(true);
        setIsiOpenGiveAwayModal(false);
      }
    });
  };

  return (
    <React.Fragment>
      {showPreview ? (
        <GiveawayBlockPreview formData={getFieldsValue()} onEdit={onClickGiveawayButton} />
      ) : (
        <Button onClick={onClickGiveawayButton} className={'edit-post__giveaway'} type="default">
          Add giveaway
        </Button>
      )}
      {
        <Modal visible={isOpenGiveAwayModal} title={'Giveaway'} onCancel={onClose} footer={null}>
          <Form onSubmit={handleSubmit} layout="vertical">
            <FormItem label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Enter campaign name' }],
              })(<Input placeholder="Enter campaign name" />)}
            </FormItem>
            <FormItem label="Reward (per winner, USD)">
              {getFieldDecorator('reward', {
                rules: [
                  { required: true },
                  {
                    validator: validateRewards,
                  },
                ],
                validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
              })(
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="Enter amount"
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
            <FormItem label="Number of winners">
              {getFieldDecorator('winners', {
                initialValue: 1,
                rules: [{ required: true }, { validator: validateWinnersQuantity }],
                validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
              })(
                <Input
                  type="number"
                  step={1}
                  min={1}
                  placeholder="Enter amount"
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
            <FormItem label="Payment currency">
              {getFieldDecorator('currency', {
                initialValue: 'WAIV',
              })(
                <Select disabled>
                  <Select.Option value="WAIV">WAIV</Select.Option>
                </Select>,
              )}
            </FormItem>

            <FormItem label="Expiry date">
              {getFieldDecorator('expiry', {
                rules: [{ required: true }],
              })(
                <DatePicker
                  disabledDate={currDate =>
                    moment()
                      // .add(1, 'days')
                      .unix() > currDate.unix()
                  }
                  showTime
                  format="YYYY-MM-DD hh:mm A"
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>

            <FormItem label="Giveaway requirements">
              {getFieldDecorator('requirements', {
                initialValue: ['like', 'comment', 'tag', 'reblog', 'follow'],
                rules: [
                  {
                    validator: (_, value, callback) => {
                      if (!value || value.length === 0) {
                        callback('Please select at least one requirement.');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Checkbox value="follow">Follow the author</Checkbox>
                  <Checkbox value="like">Like the post</Checkbox>
                  <Checkbox value="comment">Leave a comment</Checkbox>
                  <Checkbox value="tag">Tag 2 friends in a comment</Checkbox>
                  <Checkbox value="reblog">Re-blog the post</Checkbox>
                </Checkbox.Group>,
              )}
            </FormItem>

            <FormItem label="Eligible users">
              {getFieldDecorator('eligible', {
                initialValue: 'all',
              })(
                <RadioGroup onChange={e => setFiltered(e.target.value === 'filtered')}>
                  <Radio value="all">All users</Radio>
                  <Radio value="filtered">Filtered users</Radio>
                </RadioGroup>,
              )}
            </FormItem>

            {filtered && (
              <>
                <FormItem label="Minimum Waivio expertise (optional)">
                  {getFieldDecorator('minExpertise')(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>

                <FormItem label="Minimum number of followers (optional)">
                  {getFieldDecorator('minFollowers')(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>

                <FormItem label="Minimum number of posts (optional)">
                  {getFieldDecorator('minPosts')(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>
              </>
            )}

            <FormItem label="Commissions to Waivio and partners">
              {getFieldDecorator('commission', {
                initialValue: 5,
              })(
                <Input
                  style={{
                    width: '100%',
                  }}
                  min={5}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
                rules: [{ required: true }],
              })(
                <Checkbox>
                  I agree to the <a href="">Terms and Conditions</a> of the service and acknowledge
                  that this campaign does not violate any laws of British Columbia, Canada.
                </Checkbox>,
              )}
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" block>
                Create Giveaway
              </Button>
            </FormItem>
          </Form>
        </Modal>
      }
    </React.Fragment>
  );
};

GiveawayModal.propTypes = {
  form: PropTypes.shape(),
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  currency: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.string,
  }),
  currencyInfo: PropTypes.shape(),
  rateInUsd: PropTypes.string,
  getTokenBalanceAction: PropTypes.func,
};

export default injectIntl(
  Form.create()(
    connect(
      state => ({
        payoutToken: 'WAIV',
        user: getAuthenticatedUser(state),
        currency: getCurrentCurrency(state),
        currencyInfo: getUserCurrencyBalance(state, 'WAIV'),
        rateInUsd: getTokenRatesInUSD(state, 'WAIV'),
      }),
      {
        getTokenBalanceAction: getTokenBalance,
        getCurrentCurrencyRateAction: getCurrentCurrencyRateAct,
      },
    )(GiveawayModal),
  ),
);
