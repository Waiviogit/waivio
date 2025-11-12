import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { createAssistantFaq, patchAssistantFaq } from '../../../../waivioApi/ApiClient';
import { addSpacesToCamelCase, removeSpacesFromCamelCase } from './FAQTab';

const { TextArea } = Input;
const { Option } = Select;

const FAQModal = ({ visible, onClose, onSuccess, editingFaq, authUserName, form, topics }) => {
  const [loading, setLoading] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const { getFieldDecorator, resetFields, validateFields, setFieldsValue } = form;

  useEffect(() => {
    if (visible) {
      if (editingFaq) {
        const topicForDisplay = addSpacesToCamelCase(editingFaq.topic || 'WaivioGeneral');

        setFieldsValue({
          question: editingFaq.question,
          answer: editingFaq.answer,
          topic: topicForDisplay,
        });
        if (editingFaq.answer && editingFaq.answer.length > 2000) {
          setAnswerError(
            'The maximum length is 2000 characters. Please make your answer more concise.',
          );
        } else {
          setAnswerError('');
        }
        if (editingFaq.question && editingFaq.question.length > 500) {
          setQuestionError(
            'The maximum length is 500 characters. Please make your question more concise.',
          );
        } else {
          setQuestionError('');
        }
      } else {
        resetFields();
        setFieldsValue({ topic: addSpacesToCamelCase('WaivioGeneral') });
        setAnswerError('');
        setQuestionError('');
      }
    }
  }, [visible, editingFaq, resetFields, setFieldsValue]);

  const handleQuestionChange = e => {
    const value = e.target.value;

    if (value.length >= 500) {
      setQuestionError(
        'The maximum length is 500 characters. Please make your question more concise.',
      );
    } else {
      setQuestionError('');
    }

    setFieldsValue({ question: value });
  };

  const handleAnswerChange = e => {
    const value = e.target.value;

    if (value.length >= 2000) {
      setAnswerError(
        'The maximum length is 2000 characters. Please make your answer more concise.',
      );
    } else {
      setAnswerError('');
    }

    setFieldsValue({ answer: value });
  };

  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err || answerError || questionError) {
        return;
      }

      setLoading(true);

      try {
        const topicWithoutSpaces = removeSpacesFromCamelCase(values.topic);

        if (editingFaq) {
          await patchAssistantFaq(
            authUserName,
            editingFaq._id || editingFaq.id,
            values.question,
            values.answer,
            topicWithoutSpaces,
          );
          message.success('FAQ updated successfully');
        } else {
          await createAssistantFaq(
            authUserName,
            values.question,
            values.answer,
            topicWithoutSpaces,
          );
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
      okText={editingFaq ? 'Save' : 'Add'}
      destroyOnClose
      width={600}
      okButtonProps={{ disabled: answerError || questionError }}
    >
      <Form layout="vertical">
        <Form.Item
          label="Question"
          validateStatus={questionError ? 'error' : ''}
          help={questionError}
        >
          {getFieldDecorator('question', {
            rules: [{ message: 'Please enter a question' }],
          })(
            <Input
              placeholder="Enter question"
              maxLength={500}
              onChange={handleQuestionChange}
              style={questionError ? { borderColor: '#ff4d4f' } : {}}
            />,
          )}
        </Form.Item>
        <Form.Item label="Answer" validateStatus={answerError ? 'error' : ''} help={answerError}>
          {getFieldDecorator('answer', {
            rules: [{ message: 'Please enter an answer', max: 2000 }],
          })(
            <TextArea
              autoSize={{ minRows: 10, maxRows: 30 }}
              placeholder="Enter answer"
              showCount
              maxLength={2000}
              onChange={handleAnswerChange}
              style={answerError ? { borderColor: '#ff4d4f' } : {}}
            />,
          )}
        </Form.Item>
        <Form.Item label="Topic">
          {getFieldDecorator('topic', {
            rules: [{ message: 'Please select a topic' }],
            initialValue: addSpacesToCamelCase('WaivioGeneral'),
          })(
            <Select placeholder="Select topic">
              {topics.map(topic => {
                const topicWithSpaces = addSpacesToCamelCase(topic);

                return (
                  <Option key={topic} value={topicWithSpaces}>
                    {topicWithSpaces}
                  </Option>
                );
              })}
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
