import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, Modal, Slider } from 'antd';
import { isEmpty } from 'lodash';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../../Create-Edit/ReviewItem';
import { setMatchBotRules } from '../../rewardsActions';
import './CreateRule.less';

const CreateRule = ({ intl, form, modalVisible, handleChangeModalVisible, isEdit, ...props }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const [sponsor, setSponsor] = useState({});
  const [sliderValue, setSliderValue] = useState(1);
  const [isLoading, setLoaded] = useState(false);
  const handleSetSponsor = obj => {
    setSponsor(obj);
    setFieldsValue({ sponsorField: obj });
  };
  const handleRemoveSponsor = () => setSponsor({});
  const handleChangeSliderValue = value => {
    setSliderValue(value);
  };
  const checkSponsor = (rule, value, callback) =>
    isEmpty(sponsor)
      ? callback(
          intl.formatMessage({
            id: 'matchBot_add_sponsor',
            defaultMessage: 'Add sponsor',
          }),
        )
      : callback();

  const handleSubmit = e => {
    setLoaded(true);
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !isEmpty(sponsor)) {
        const prepareObjData = {
          sponsor: sponsor.account,
          enabled: true,
          upvote: sliderValue,
        };
        if (values.noticeField) prepareObjData.notes = values.noticeField;
        props
          .setMatchBotRules(prepareObjData)
          .then(() => {
            setLoaded(false);
            handleChangeModalVisible();
          })
          .catch(error => {
            setLoaded(false);
            handleChangeModalVisible();
            console.error(error);
          });
      }
      if (err) {
        console.error(err);
        setLoaded(false);
      }
    });
  };

  const marks = {
    1: '1%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: 'matchBot_title_create_rule',
        defaultMessage: 'Create rule',
      })}
      visible={modalVisible}
      onCancel={handleChangeModalVisible}
      footer={null}
    >
      <div className="CreateRule">
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_title_sponsor',
              defaultMessage: 'Sponsor',
            })}
          >
            {getFieldDecorator('sponsorField', {
              rules: [
                {
                  validator: checkSponsor,
                },
              ],
              initialValue: sponsor,
            })(
              <SearchUsersAutocomplete
                allowClear={false}
                disabled={isLoading}
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
                loading={isLoading}
                removeReviewObject={handleRemoveSponsor}
                isUser
              />
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_voting_power',
              defaultMessage: 'Voting power',
            })}
          >
            <Slider
              min={1}
              defaultValue={100}
              disabled={isLoading}
              marks={marks}
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
            })(<Input.TextArea disabled={isLoading} />)}
          </Form.Item>
          <div className="CreateRule__button">
            {!isEdit ? (
              <Button type="primary" htmlType="submit" loading={isLoading} disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_create',
                  defaultMessage: 'Create',
                })}
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" loading={isLoading} disabled={false}>
                {intl.formatMessage({
                  id: 'matchBot_btn_edit_rule',
                  defaultMessage: 'Edit',
                })}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

CreateRule.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  modalVisible: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  handleChangeModalVisible: PropTypes.func.isRequired,
  setMatchBotRules: PropTypes.func.isRequired,
};
CreateRule.defaultProps = {
  isEdit: false,
};

export default Form.create()(injectIntl(connect(null, { setMatchBotRules })(CreateRule)));
