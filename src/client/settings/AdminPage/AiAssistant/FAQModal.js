import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { createAssistantFaq, updateAssistantFaq } from '../../../../waivioApi/ApiClient';

const { TextArea } = Input;
const { Option } = Select;

const FAQModal = ({ visible, onClose, onSuccess, editingFaq, authUserName, form, topics }) => {
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator, resetFields, validateFields, setFieldsValue } = form;

  useEffect(() => {
    if (visible) {
      if (editingFaq) {
        setFieldsValue({
          question: editingFaq.question,
          answer: editingFaq.answer,
          topic: editingFaq.topic || 'general',
        });
      } else {
        resetFields();
        setFieldsValue({ topic: 'general' });
      }
    }
  }, [visible, editingFaq, resetFields, setFieldsValue]);

  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }

      setLoading(true);

      try {
        if (editingFaq) {
          await updateAssistantFaq(
            authUserName,
            editingFaq._id || editingFaq.id,
            values.question,
            values.answer,
            values.topic,
          );
          message.success('FAQ updated successfully');
        } else {
          await createAssistantFaq(authUserName, values.question, values.answer, values.topic);
          message.success('FAQ created successfully');
        }

        onSuccess();
      } catch (error) {
        console.error('Error saving FAQ:', error);
        message.error(`Failed to ${editingFaq ? 'update' : 'create'} FAQ`);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Modal
      title={editingFaq ? 'Edit Q&A' : 'Add Q&A'}
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form layout="vertical">
        <Form.Item label="Question">
          {getFieldDecorator('question', {
            rules: [{ message: 'Please enter a question' }],
          })(<Input placeholder="Enter question" />)}
        </Form.Item>
        <Form.Item label="Answer">
          {getFieldDecorator('answer', {
            rules: [{ message: 'Please enter an answer' }],
          })(
            <TextArea
              autoSize={{ minRows: 5, maxRows: 10 }}
              placeholder="Enter answer"
              showCount
              maxLength={1000}
            />,
          )}
        </Form.Item>
        <Form.Item label="Topic">
          {getFieldDecorator('topic', {
            rules: [{ message: 'Please select a topic' }],
            initialValue: 'general',
          })(
            <Select placeholder="Select topic">
              {topics?.map(topic => (
                <Option key={topic} value={topic}>
                  {topic}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

FAQModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf().isRequired,
  editingFaq: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    question: PropTypes.string,
    answer: PropTypes.string,
    topic: PropTypes.string,
  }),
  authUserName: PropTypes.string.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
};

FAQModal.defaultProps = {
  editingFaq: null,
};

export default Form.create()(FAQModal);
