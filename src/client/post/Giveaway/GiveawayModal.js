import { Modal, Button, Checkbox, Form, Input, InputNumber, Select, DatePicker, Radio } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import RadioGroup from 'antd/es/radio/group';
import React, { useState } from 'react';
import GiveawayPreviewBlock from './GiveawayPreviewBlock/GiveawayPreviewBlock';

const GiveawayModal = ({ form }) => {
  const [filtered, setFiltered] = useState(false);
  const [isOpenGiveAwayModal, setIsiOpenGiveAwayModal] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const onClickGiveawayButton = () => setIsiOpenGiveAwayModal(true);
  const onClose = () => setIsiOpenGiveAwayModal(false);
  const { getFieldDecorator } = form;
  console.log(form.formData);
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Form values:', values);
      }
    });
  };

  return (
    <React.Fragment>
      {showPreview ? (
        <GiveawayPreviewBlock formData={form.getFieldsValue()} onEdit={onClickGiveawayButton} />
      ) : (
        <Button onClick={onClickGiveawayButton} className={'edit-post__giveaway'} type="default">
          Add giveaway
        </Button>
      )}

      {isOpenGiveAwayModal && (
        <Modal visible={isOpenGiveAwayModal} title={'Giveaway'} onCancel={onClose} footer={null}>
          <Form onSubmit={handleSubmit}>
            <FormItem label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Enter campaign name' }],
              })(<Input placeholder="Enter campaign name" />)}
            </FormItem>

            <FormItem label="Reward (per winner, USD)">
              {getFieldDecorator('reward', {
                rules: [{ required: true }],
              })(<InputNumber placeholder="Enter amount" style={{ width: '100%' }} />)}
            </FormItem>

            <FormItem label="Number of winners">
              {getFieldDecorator('winners', {
                rules: [{ required: true }],
              })(<InputNumber placeholder="Enter amount" style={{ width: '100%' }} />)}
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
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>

            <FormItem label="Giveaway requirements">
              {getFieldDecorator('requirements', {
                initialValue: ['like', 'comment', 'tag', 'reblog'],
              })(
                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Checkbox value="like">Follow the author</Checkbox>
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
                <InputNumber
                  min={0}
                  max={100}
                  formatter={v => `${v}%`}
                  style={{ width: '100%' }}
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
      )}
    </React.Fragment>
  );
};

export default Form.create()(GiveawayModal);
