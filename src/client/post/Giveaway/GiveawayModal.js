import { Modal, Button, Checkbox, Form, Input, InputNumber, Select, DatePicker, Radio } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import RadioGroup from 'antd/es/radio/group';
// import { DateTime } from 'luxon';
// import timezones from 'timezones-list';
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
  isEdit,
  saveData,
  initData,
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
    if (initData?.eligible === 'all' || !initData.eligible) setFiltered(false);
    else setFiltered(true);
  };

  const onDelete = () => {
    resetFields();
    setShowPreview(false);
  };

  // eslint-disable-next-line consistent-return
  const validateRewards = (rule, value, callback) => {
    const winners = getFieldValue('winners');

    if (winners * value > budget) return callback('Rewards more than user balance.');
    if (value * currency.rate < 0.5) return callback('Minimum reward of $0.5 is required.');
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
    validateFields((err, values) => {
      if (!err) {
        // const expiryString = moment(values.expiry).format('YYYY-MM-DD hh:mm A');

        setShowPreview(true);
        setIsiOpenGiveAwayModal(false);

        saveData({
          ...values,
          guideName: user.name,
          currency: currency.type,
          expiredAt: moment(values.expiry),
          // expiredAt: DateTime.fromFormat(expiryString, 'yyyy-MM-dd hh:mm a', {
          //   zone: values.timezone,
          // })
          //   .toUTC()
          //   .toISO(),
        });
      }
    });
  };

  return (
    <React.Fragment>
      {showPreview ? (
        <GiveawayBlockPreview
          formData={getFieldsValue()}
          onEdit={onClickGiveawayButton}
          onDelete={onDelete}
          isEditable={!isEdit}
        />
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
                initialValue: initData?.name,
                rules: [{ required: true, message: 'Campaign name is required.' }],
              })(<Input placeholder="Enter campaign name" />)}
            </FormItem>
            <FormItem label="Reward (per winner, USD)">
              {getFieldDecorator('reward', {
                initialValue: initData?.reward,
                rules: [
                  { required: true, message: 'Reward is required.' },
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
                initialValue: initData?.winners || 1,
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormItem label="Expiry date" style={{ width: '50%' }}>
                {getFieldDecorator('expiry', {
                  initialValue: initData?.expiry,
                  rules: [{ required: true, message: 'Expiry date is required.' }],
                })(
                  <DatePicker
                    disabledDate={currDate => {
                      const tomorrow = moment()
                        // .add(1, 'days')
                        .startOf('day');
                      const maxDate = moment()
                        .add(30, 'days')
                        .endOf('day');

                      return currDate.isBefore(tomorrow) || currDate.isAfter(maxDate);
                    }}
                    showTime
                    format="YYYY-MM-DD hh:mm A"
                    style={{ width: '100%', marginRight: '10px' }}
                  />,
                )}
              </FormItem>
              {/* <Form.Item label="Time zone" style={{ width: '50%' }}> */}
              {/*   {getFieldDecorator('timezone', { */}
              {/*     initialValue: initData?.timezone || DateTime.local().zoneName, // автоматично визначає зону користувача */}
              {/*     rules: [{ required: true, message: 'Please select a timezone' }], */}
              {/*   })( */}
              {/*     <Select */}
              {/*       showSearch */}
              {/*       optionFilterProp="label" */}
              {/*       style={{ width: 'calc(100% - 10px)', marginLeft: '10px' }} */}
              {/*     > */}
              {/*       {timezones.map(tz => ( */}
              {/*         <Select.Option key={tz.tzCode} value={tz.tzCode} label={tz.label}> */}
              {/*           {tz.label} */}
              {/*         </Select.Option> */}
              {/*       ))} */}
              {/*     </Select>, */}
              {/*   )} */}
              {/* </Form.Item> */}
            </div>

            <FormItem label="Giveaway requirements">
              {getFieldDecorator('giveawayRequirements', {
                initialValue: initData?.giveawayRequirements || [
                  'likePost',
                  'comment',
                  'tag',
                  'reblog',
                  'follow',
                ],
                rules: [
                  {
                    validator: (_, value, callback) => {
                      if (!value || value.length === 0) {
                        callback('At least one giveaway rule is required.');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Checkbox value="follow">Follow the author</Checkbox>
                  <Checkbox value="likePost">Like the post</Checkbox>
                  <Checkbox value="comment">Leave a comment</Checkbox>
                  <Checkbox value="tag">Tag 2 friends in a comment</Checkbox>
                  <Checkbox value="reblog">Re-blog the post</Checkbox>
                </Checkbox.Group>,
              )}
            </FormItem>

            <FormItem label="Eligible users">
              {getFieldDecorator('eligible', {
                initialValue: initData?.eligible || 'all',
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
                  {getFieldDecorator('minExpertise', { initialValue: initData?.minExpertise || 0 })(
                    <InputNumber style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="Minimum number of followers (optional)">
                  {getFieldDecorator('minFollowers', { initialValue: initData?.minFollowers || 0 })(
                    <InputNumber style={{ width: '100%' }} />,
                  )}
                </FormItem>

                <FormItem label="Minimum number of posts (optional)">
                  {getFieldDecorator('minPosts', { initialValue: initData?.minPosts || 0 })(
                    <InputNumber style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </>
            )}

            <FormItem label="Commissions to Waivio and partners">
              {getFieldDecorator('commission', {
                initialValue: initData?.commission || 5,
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value < 5) {
                        callback('Minimum commission of 5% is required.');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
                validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
              })(
                <InputNumber
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
                rules: [
                  { required: true, message: 'Accepting the Terms and Conditions is required.' },
                ],
                validateTrigger: ['onChange', 'onBlur', 'onSubmit'],
              })(
                <Checkbox>
                  I agree to the{' '}
                  <a href="/object/xrj-terms-and-conditions/page">Terms and Conditions</a> of the
                  service and acknowledge that this campaign does not violate any laws of British
                  Columbia, Canada.
                </Checkbox>,
              )}
            </FormItem>

            <FormItem>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  style={{
                    width: 'auto',
                    fontWeight: '500',
                  }}
                  type="primary"
                  htmlType="submit"
                  block
                >
                  Create giveaway
                </Button>
              </div>
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
  initData: PropTypes.shape(),
  rateInUsd: PropTypes.string,
  getTokenBalanceAction: PropTypes.func,
  saveData: PropTypes.func,
  isEdit: PropTypes.bool,
};

GiveawayModal.defaultProps = {
  initData: {},
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
