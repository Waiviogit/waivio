import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, message, Modal, Slider } from 'antd';
import { isEmpty } from 'lodash';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../../Create-Edit/ReviewItem';
import { setMatchBotRules } from '../../rewardsActions';
import './CreateRule.less';

const CreateRule = ({
  intl,
  form,
  modalVisible,
  handleChangeModalVisible,
  editRule,
  setEditRule,
  ...props
}) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const [sponsor, setSponsor] = useState({});
  const [sliderValue, setSliderValue] = useState(100);
  const [isConfirmModalLoading, setConfirmModalLoaded] = useState(false);
  const [isConfirmModal, setConfirmModal] = useState(false);

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
          upvote: sliderValue / 100,
        };
        if (values.noticeField) prepareObjData.notes = values.noticeField;
        props
          .setMatchBotRules(prepareObjData)
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
          upvote: sliderValue / 100,
        };
        props
          .setMatchBotRules(prepareObjData)
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
        isEmpty(editRule)
          ? intl.formatMessage({
              id: 'matchBot_title_create_rule',
              defaultMessage: 'Create rule',
            })
          : intl.formatMessage({
              id: 'matchBot_title_edit_rule',
              defaultMessage: 'Edit rule',
            })
      }
      visible={modalVisible}
      onCancel={handleCloseModal}
      footer={null}
    >
      <div className="CreateRule">
        <Form layout="vertical" onSubmit={handleSubmit}>
          {isEmpty(editRule) && (
            <Form.Item
              label={intl.formatMessage({
                id: 'matchBot_title_sponsor',
                defaultMessage: 'Sponsor',
              })}
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
            label={intl.formatMessage({
              id: 'matchBot_voting_power',
              defaultMessage: 'Voting power',
            })}
          >
            <Slider
              min={1}
              defaultValue={sliderValue}
              marks={marks}
              tipFormatter={formatTooltip}
              onChange={handleChangeSliderValue}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_set_note',
              defaultMessage: 'Set note',
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
            {isEmpty(editRule) ? (
              <Button type="primary" htmlType="submit" disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_create',
                  defaultMessage: 'Create',
                })}
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_edit_rule',
                  defaultMessage: 'Edit',
                })}
              </Button>
            )}
          </div>
        </Form>
      </div>
      <Modal
        title={
          isEmpty(editRule)
            ? intl.formatMessage({
                id: 'matchBot_rule_creation_confirmation',
                defaultMessage: 'Rule creation confirmation',
              })
            : intl.formatMessage({
                id: 'matchBot_rule_editing_confirmation',
                defaultMessage: 'Rule editing confirmation',
              })
        }
        visible={isConfirmModal}
        onCancel={handleCloseConfirmModal}
        onOk={handleSetRule}
        confirmLoading={isConfirmModalLoading}
      >
        {isEmpty(editRule)
          ? intl.formatMessage(
              {
                id: 'matchBot_modal_create_rule_with_sponsor_and_upvote',
                defaultMessage:
                  "Do you want to create rule with sponsor '{sponsor}' and with upvote {upvote}%",
              },
              {
                sponsor: sponsor.account,
                upvote: sliderValue,
              },
            )
          : intl.formatMessage({
              id: 'matchBot_modal_edit_rule_with_current_changes',
              defaultMessage: 'Do you want to edit rule with current changes',
            })}
      </Modal>
    </Modal>
  );
};

CreateRule.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  modalVisible: PropTypes.bool.isRequired,
  editRule: PropTypes.shape(),
  handleChangeModalVisible: PropTypes.func.isRequired,
  setMatchBotRules: PropTypes.func.isRequired,
  setEditRule: PropTypes.func.isRequired,
};
CreateRule.defaultProps = {
  editRule: {},
};

export default Form.create()(injectIntl(connect(null, { setMatchBotRules })(CreateRule)));
