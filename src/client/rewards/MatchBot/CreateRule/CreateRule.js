import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, DatePicker, Form, Input, message, Modal, Slider } from 'antd';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../../Create-Edit/ReviewItem';
import { setMatchBotRules } from '../../rewardsActions';
import DeleteRuleModal from './DeleteRuleModal/DeleteRuleModal';
import ConfirmModal from './ConfirmModal';
import './CreateRule.less';

const CreateRule = ({
  intl,
  form,
  modalVisible,
  handleChangeModalVisible,
  editRule,
  setEditRule,
}) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const [sponsor, setSponsor] = useState({});
  const [sliderValue, setSliderValue] = useState(100);
  const [isConfirmModalLoading, setConfirmModalLoaded] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(editRule)) {
      setSliderValue(editRule.voting_percent * 100);
    }
  }, []);

  const handleSetSponsor = obj => {
    setSponsor(obj);
    setFieldsValue({ sponsorField: obj });
  };
  const handleRemoveSponsor = () => setSponsor({});
  const handleChangeSliderValue = value => {
    setSliderValue(value);
  };
  const handleCloseConfirmModal = () => {
    if (!isConfirmModalLoading) setConfirmModal(!isConfirmModal);
  };
  const handleCloseModal = () => {
    setEditRule({});
    handleChangeModalVisible();
  };

  const handleDeleteModalVisibility = () => setDeleteModal(!isDeleteModal);
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !isEmpty(values.sponsorField)) {
        setConfirmModal(true);
      }
      if (!err && !isEmpty(editRule)) {
        setConfirmModal(true);
      }
      if (err) {
        console.error(err);
      }
    });
  };
  const handleSetRule = () => {
    setConfirmModalLoaded(true);
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !isEmpty(values.sponsorField)) {
        const prepareObjData = {
          sponsor: sponsor.account,
          enabled: true,
          voting_percent: sliderValue / 100,
          expiry_date: values.expiryDate,
        };
        if (values.noticeField) prepareObjData.note = values.noticeField;
        dispatch(setMatchBotRules(prepareObjData))
          .then(() => {
            setConfirmModalLoaded(false);
            handleChangeModalVisible();
            message.success(
              intl.formatMessage({
                id: 'matchBot_success_created',
                defaultMessage: 'Rule created successfully',
              }),
            );
          })
          .catch(() => {
            setConfirmModalLoaded(false);
            handleChangeModalVisible();
          });
      }
      if (!err && !isEmpty(editRule)) {
        const prepareObjData = {
          sponsor: editRule.sponsor,
          voting_percent: sliderValue / 100,
        };
        if (values.noticeField) prepareObjData.note = values.noticeField;
        dispatch(setMatchBotRules(prepareObjData))
          .then(() => {
            setConfirmModalLoaded(false);
            handleChangeModalVisible();
            message.success(
              intl.formatMessage({
                id: 'matchBot_success_edited',
                defaultMessage: 'Rule edited successfully',
              }),
            );
          })
          .catch(() => {
            setConfirmModalLoaded(false);
            handleChangeModalVisible();
          });
      }
      if (err) {
        console.error(err);
        setConfirmModalLoaded(false);
      }
    });
  };

  const checkSponsor = (rule, value, callback) => {
    if (isEmpty(sponsor)) {
      callback(
        intl.formatMessage({
          id: 'matchBot_add_sponsor',
          defaultMessage: 'Add sponsor',
        }),
      );
    }
    callback();
  };

  const checkExpireDate = (rule, value, callback) => {
    const currentDay = new Date().getDate();
    if ((value && value.unix() * 1000 < Date.now()) || (value && value.date() === currentDay)) {
      callback(
        intl.formatMessage({
          id: 'matchBot_expiry_date_after_current',
          defaultMessage: 'The expiry date must be after the current date',
        }),
      );
    } else {
      callback();
    }
  };

  const formatTooltip = value => `${value}%`;

  const marks = {
    1: '1%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  return (
    <Modal
      title={
        isEmpty(editRule) ? (
          <span>
            {intl.formatMessage({
              id: 'matchBot_title_add_new_sponsor',
              defaultMessage: 'Add new sponsor',
            })}
          </span>
        ) : (
          <span>
            {intl.formatMessage({
              id: 'matchBot_title_edit_rule',
              defaultMessage: 'Edit match bot rules for',
            })}
            <Link to={`/@${editRule.sponsor}`}>{` @${editRule.sponsor}`}</Link>
          </span>
        )
      }
      visible={modalVisible}
      onCancel={handleCloseModal}
      footer={null}
    >
      <div className="CreateRule">
        <Form layout="vertical" onSubmit={handleSubmit}>
          {isEmpty(editRule) && (
            <Form.Item
              label={
                <span className="CreateRule__label">
                  {intl.formatMessage({ id: 'matchBot_title_sponsor', defaultMessage: 'Sponsor' })}
                </span>
              }
            >
              {isEmpty(editRule) &&
                getFieldDecorator('sponsorField', {
                  rules: [
                    {
                      validator: checkSponsor,
                    },
                  ],
                  initialValue: sponsor,
                })(
                  <SearchUsersAutocomplete
                    allowClear={false}
                    disabled={!isEmpty(editRule)}
                    handleSelect={handleSetSponsor}
                    placeholder={intl.formatMessage({
                      id: 'matchBot_placeholder_find_sponsor',
                      defaultMessage: 'Find sponsor',
                    })}
                    style={{ width: '100%' }}
                    autoFocus={false}
                  />,
                )}
              {!isEmpty(sponsor) && (
                <ReviewItem
                  key={sponsor.account}
                  object={sponsor}
                  removeReviewObject={handleRemoveSponsor}
                  loading={!isEmpty(editRule)}
                  isUser
                />
              )}
            </Form.Item>
          )}
          <Form.Item
            label={
              <React.Fragment>
                <div>
                  {intl.formatMessage({
                    id: 'matchBot_define_value_match_upvote',
                    defaultMessage: 'Define value of the match upvote:',
                  })}
                </div>
                <div>
                  {intl.formatMessage({
                    id: 'matchBot_as_of_eligible_reward',
                    defaultMessage: '(as a % of the eligible reward)',
                  })}
                </div>
              </React.Fragment>
            }
          >
            <Slider
              min={1}
              defaultValue={sliderValue}
              marks={marks}
              tipFormatter={formatTooltip}
              onChange={handleChangeSliderValue}
            />
            <span className="CreateRule__text f9">
              {intl.formatMessage({
                id: 'matchBot_match_bot_will_upvote_posts_eligible_receive_rewards',
                defaultMessage:
                  'Match bot will upvote posts eligible to receive rewards offered by the specified sponsor.',
              })}
            </span>
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_expiry_date',
              defaultMessage: 'Expiry date',
            })}
          >
            {getFieldDecorator('expiryDate', {
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: intl.formatMessage({
                    id: 'matchBot_select_time',
                    defaultMessage: 'Please, select time!',
                  }),
                },
                {
                  validator: checkExpireDate,
                },
              ],
              // initialValue: expiredAt,
            })(<DatePicker allowClear={false} />)}
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_set_note',
              defaultMessage: 'Note (not visible to the public):',
            })}
          >
            {getFieldDecorator('noticeField', {
              rules: [
                {
                  max: 255,
                  message: intl.formatMessage({
                    id: 'matchBot_description_longer_255_symbols',
                    defaultMessage: 'Note should be no longer then 255 symbols!',
                  }),
                },
              ],
            })(<Input.TextArea />)}
          </Form.Item>
          <div className="CreateRule__button">
            <Button disabled={false} onClick={handleCloseModal}>
              {intl.formatMessage({
                id: 'matchBot_btn_cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
            {isEmpty(editRule) ? (
              <Button type="primary" htmlType="submit" disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_add_sponsor',
                  defaultMessage: 'Add sponsor',
                })}
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_edit_rule',
                  defaultMessage: 'Save changes',
                })}
              </Button>
            )}
          </div>
          {!isEmpty(editRule) && (
            <div className="CreateRule__edit-footer">
              <div className="CreateRule__text f9">
                {intl.formatMessage({
                  id: 'matchBot_remove_match_bot_rule_click_button',
                  defaultMessage: 'To remove the match bot rule, click the delete button',
                })}
                :
              </div>
              <div className="CreateRule__button-delete">
                <Button disabled={false} onClick={handleDeleteModalVisibility}>
                  {intl.formatMessage({
                    id: 'matchBot_btn_delete_rule',
                    defaultMessage: 'Delete rule',
                  })}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
      <ConfirmModal
        sponsor={sponsor}
        editRule={editRule}
        onCancel={handleCloseConfirmModal}
        onOk={handleSetRule}
        visible={isConfirmModal}
        confirmLoading={isConfirmModalLoading}
        sliderValue={sliderValue}
      />
      <DeleteRuleModal
        isDeleteModal={isDeleteModal}
        handleModalVisibility={handleDeleteModalVisibility}
        sponsor={editRule.sponsor}
      />
    </Modal>
  );
};

CreateRule.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  modalVisible: PropTypes.bool.isRequired,
  editRule: PropTypes.shape(),
  handleChangeModalVisible: PropTypes.func.isRequired,
  setEditRule: PropTypes.func.isRequired,
};
CreateRule.defaultProps = {
  editRule: {},
};

export default Form.create()(injectIntl(CreateRule));
