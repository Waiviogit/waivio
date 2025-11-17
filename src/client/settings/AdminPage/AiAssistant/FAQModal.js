import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { createAssistantFaq, patchAssistantFaq } from '../../../../waivioApi/ApiClient';
import { addSpacesToCamelCase, removeSpacesFromCamelCase } from './FAQTab';
import './FAQModal.less';

const { TextArea } = Input;
const { Option } = Select;

const SafeImage = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (error) {
    return null;
  }

  return (
    <div className="FAQModal__image-preview">
      <a href={src} target="_blank" rel="noopener noreferrer" className="FAQModal__image-link">
        <img
          src={src}
          alt={alt}
          height="86"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
          className="FAQModal__image"
        />
      </a>
    </div>
  );
};

SafeImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

SafeImage.defaultProps = {
  alt: 'image',
};

const FAQModal = ({ visible, onClose, onSuccess, editingFaq, authUserName, form, topics }) => {
  const [loading, setLoading] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [answerValue, setAnswerValue] = useState('');
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
        setAnswerValue(editingFaq.answer || '');
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
        setAnswerValue('');
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

  const extractImages = text => {
    if (!text || typeof text !== 'string') return [];

    const images = [];

    const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = markdownRegex.exec(text)) !== null) {
      let imageUrl = match[2].trim();

      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://${imageUrl}`;
      }
      images.push({
        url: imageUrl,
        alt: match[1] || 'image',
        type: 'markdown',
      });
    }

    const imageUrlRegex = /(https?:\/\/[^\s]*waivio\.nyc3\.digitaloceanspaces[^\s]*)|(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp|gif|svg))/gi;
    const urlMatches = text.matchAll(imageUrlRegex);

    // eslint-disable-next-line no-restricted-syntax
    for (const urlMatch of urlMatches) {
      const imageUrl = urlMatch[0];
      // Check if this URL is not already in images (from markdown)
      const isAlreadyIncluded = images.some(img => img.url === imageUrl);

      if (!isAlreadyIncluded) {
        images.push({
          url: imageUrl,
          alt: 'image',
          type: 'url',
        });
      }
    }

    return images;
  };

  const extractedImages = useMemo(() => extractImages(answerValue), [answerValue]);

  const handleAnswerChange = e => {
    const value = e.target.value;

    setAnswerValue(value);

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
          {extractedImages.length > 0 && (
            <div className="FAQModal__image-box">
              {extractedImages.map((image, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <SafeImage key={`${image.url}-${index}`} src={image.url} alt={image.alt} />
              ))}
            </div>
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
