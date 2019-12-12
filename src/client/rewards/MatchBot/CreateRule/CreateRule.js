import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Input, Modal, Slider } from 'antd';
import { isEmpty } from 'lodash';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../../Create-Edit/ReviewItem';
import '../MatchBot.less';

const CreateRule = ({ intl, form, modalVisible, handleChangeModalVisible, isEdit }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const [sponsor, setSponsor] = useState({});
  const [sliderValue, setSliderValue] = useState(1);
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
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err && !isEmpty(sponsor)) {
        const prepareObjData = {
          sponsor,
          enabled: true,
          upvote: sliderValue,
        };
        if (values.noticeField) prepareObjData.notes = values.noticeField;
      }
      if (err) {
        console.error(err);
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
      title="Basic Modal"
      visible={modalVisible}
      onCancel={handleChangeModalVisible}
      footer={null}
    >
      <div className="MatchBot__modal-wrap">
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item label="Set sponsor">
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
                disabled={false}
                handleSelect={handleSetSponsor}
                placeholder={'Find sponsor'}
                style={{ width: '100%' }}
                autoFocus={false}
              />,
            )}
            {!isEmpty(sponsor) && (
              <ReviewItem
                key={sponsor.account}
                object={sponsor}
                loading={false}
                removeReviewObject={handleRemoveSponsor}
                isUser
              />
            )}
          </Form.Item>
          <Form.Item label="Set voting power">
            <Slider min={1} defaultValue={100} marks={marks} onChange={handleChangeSliderValue} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'matchBot_set_notice',
              defaultMessage: 'Set notice',
            })}
          >
            {getFieldDecorator('noticeField', {
              rules: [
                {
                  max: 255,
                  message: intl.formatMessage({
                    id: 'matchBot_description_longer_250_symbols',
                    defaultMessage: 'Notice should be no longer then 250 symbols!',
                  }),
                },
              ],
            })(<Input.TextArea />)}
          </Form.Item>
          {!isEdit ? (
            <Button type="primary" htmlType="submit" loading={false} disabled={false}>
              {intl.formatMessage({
                id: 'matchBot_btn_create_rule',
                defaultMessage: 'Create rule',
              })}
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={false} disabled={false}>
              {intl.formatMessage({
                id: 'matchBot_btn_edit_rule',
                defaultMessage: 'Edit rule',
              })}
            </Button>
          )}
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
};
CreateRule.defaultProps = {
  isEdit: false,
};

export default Form.create()(injectIntl(CreateRule));
