import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Modal, Form, Input, Select, message, Icon } from 'antd';
import PropTypes from 'prop-types';
import { createAssistantFaq, patchAssistantFaq } from '../../../../waivioApi/ApiClient';
import { addSpacesToCamelCase, removeSpacesFromCamelCase } from './FAQTab';
import './FAQModal.less';

const { TextArea } = Input;
const { Option } = Select;

const SafeImage = ({ src, alt, onError }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  // Don't render if error or if src is empty/invalid
  if (error || !src || src.trim() === '' || src === '()') {
    return null;
  }

  return (
    <div className="image-box__preview">
      <a href={src} target="_blank" rel="noopener noreferrer">
        <img
          src={src}
          height="86"
          alt={alt || src}
          onError={handleError}
          onLoad={handleLoad}
          style={{ display: loaded ? 'block' : 'none' }}
        />
        {!loaded && !error && (
          <div
            style={{
              width: '86px',
              height: '86px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon type="loading" />
          </div>
        )}
      </a>
    </div>
  );
};

SafeImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onError: PropTypes.func,
};

SafeImage.defaultProps = {
  alt: 'image',
};

const FAQModal = ({ visible, onClose, onSuccess, editingFaq, authUserName, form, topics }) => {
  const [loading, setLoading] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [answerValue, setAnswerValue] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [failedImages, setFailedImages] = useState([]);
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const answerValueRef = useRef('');
  const cursorPositionRef = useRef(null);
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
        const answer = editingFaq.answer || '';

        setAnswerValue(answer);
        answerValueRef.current = answer;
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
        answerValueRef.current = '';
        setAnswerError('');
        setQuestionError('');
        setFailedImages([]);
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
    const seenUrls = new Set();

    const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = markdownRegex.exec(text)) !== null) {
      let imageUrl = match[2].trim();

      if (!imageUrl || imageUrl === '' || imageUrl === '()') {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (!imageUrl.startsWith('http')) {
        imageUrl = `https://${imageUrl}`;
      }

      if (seenUrls.has(imageUrl)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      seenUrls.add(imageUrl);
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
      const imageUrl = urlMatch[0].trim();

      if (!imageUrl || seenUrls.has(imageUrl)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      seenUrls.add(imageUrl);
      images.push({
        url: imageUrl,
        alt: 'image',
        type: 'url',
      });
    }

    return images;
  };

  const extractedImages = useMemo(() => {
    const images = extractImages(answerValue);

    return images.filter(img => !failedImages.includes(img.url));
  }, [answerValue, failedImages]);

  const handleImageUpload = (blob, linkMethod = false, cursorPos = null) => {
    setUploadingImage(true);
    message.info('Uploading image');

    const formData = new FormData();
    const currentMethod = linkMethod ? 'imageUrl' : 'file';

    formData.append(currentMethod, blob);

    const currentLocation = window && window.location.hostname;

    let url;

    if (currentLocation === 'waiviodev.com') {
      url = `https://waiviodev.com/api/image`;
    } else if (currentLocation === 'waivio') {
      url = `https://waivio.com/api/image`;
    } else {
      url = `https://www.waivio.com/api/image`;
    }

    return fetch(url, {
      body: formData,
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        const imageMarkdown = `![image](${res.image})`;
        const currentAnswer = answerValueRef.current || '';
        let newAnswer;
        let newCursorPos;

        // Insert at cursor position if provided, otherwise append
        if (cursorPos !== null && cursorPos >= 0) {
          const before = currentAnswer.substring(0, cursorPos);
          const after = currentAnswer.substring(cursorPos);

          newAnswer = `${before}${imageMarkdown}${after}`;
          newCursorPos = cursorPos + imageMarkdown.length;
        } else {
          newAnswer = currentAnswer ? `${currentAnswer} ${imageMarkdown}` : imageMarkdown;
          newCursorPos = newAnswer.length;
        }

        setAnswerValue(newAnswer);
        answerValueRef.current = newAnswer;
        setFieldsValue({ answer: newAnswer });

        // Restore cursor position after state update
        setTimeout(() => {
          const textArea = textAreaRef.current?.resizableTextArea?.textArea;

          if (textArea && newCursorPos !== null) {
            textArea.setSelectionRange(newCursorPos, newCursorPos);
            textArea.focus();
          }
        }, 0);

        setUploadingImage(false);
        message.success('Image uploaded successfully');
      })
      .catch(error => {
        console.error('Component error:', error);
        message.error("Couldn't upload image");
        setUploadingImage(false);
      });
  };

  const handleFileSelect = e => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      message.error('Please select an image file');

      return;
    }

    handleImageUpload(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const pasteImageAndText = (blob, cursorPos) => {
    handleImageUpload(blob, false, cursorPos);
  };

  const handlePaste = async e => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;

    if (!textArea) return;

    // Capture cursor position before processing paste
    const cursorPos = textArea.selectionStart || 0;

    cursorPositionRef.current = cursorPos;

    // Get clipboard data from the paste event
    const clipboardData = e.clipboardData || e.originalEvent?.clipboardData;

    if (!clipboardData) return;

    let imageBlob = null;

    // Check clipboardData.items first (most reliable for paste events)
    if (clipboardData.items && clipboardData.items.length > 0) {
      const imageItem = clipboardData.items.find(
        item => item.type && item.type.indexOf('image') !== -1,
      );

      if (imageItem) {
        imageBlob = imageItem.getAsFile();
      }
    }

    // Fallback: check clipboardData.files
    if (!imageBlob && clipboardData.files && clipboardData.files.length > 0) {
      const file = clipboardData.files[0];

      if (file.type && file.type.startsWith('image/')) {
        imageBlob = file;
      }
    }

    // If we found an image, upload it and insert markdown
    if (imageBlob) {
      pasteImageAndText(imageBlob, cursorPos);
      e.preventDefault();
      e.stopPropagation();

      return;
    }

    // Fallback: try Clipboard API (requires permissions)
    try {
      const clipboardItems = await navigator.clipboard.read();

      if (clipboardItems && clipboardItems.length > 0) {
        const item = clipboardItems[0];

        if (item.types) {
          // Check for image types using array methods instead of loop
          const imageType = item.types.find(type => type.startsWith('image/'));

          if (imageType) {
            const blob = await item.getType(imageType);

            pasteImageAndText(blob, cursorPos);
            e.preventDefault();
            e.stopPropagation();

            return;
          }

          if (item.types.includes('text/html')) {
            const htmlBlob = await item.getType('text/html');
            const htmlText = await htmlBlob.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const img = doc.querySelector('img');

            if (img?.src) {
              if (img.src.startsWith('blob:')) {
                const response = await fetch(img.src);
                const blob = await response.blob();

                pasteImageAndText(blob, cursorPos);
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        }
      }
    } catch (error) {
      // Clipboard API might not be available or require permissions
      // This is fine, we've already tried clipboardData
    }
  };

  useEffect(() => {
    if (!visible) return;

    // Use a small delay to ensure the textarea is fully mounted
    const timeoutId = setTimeout(() => {
      const textArea = textAreaRef.current?.resizableTextArea?.textArea;

      if (!textArea) return;

      textArea.addEventListener('paste', handlePaste, false);
    }, 200);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeoutId);
      const textArea = textAreaRef.current?.resizableTextArea?.textArea;

      if (textArea) {
        textArea.removeEventListener('paste', handlePaste, false);
      }
    };
  }, [visible]);

  const handleAnswerChange = e => {
    const value = e.target.value;

    setAnswerValue(value);
    answerValueRef.current = value;

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
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="md-sb-button-plus md-add-button md-add-button--comments"
              type="button"
              disabled={uploadingImage}
            >
              <Icon
                type="plus-circle"
                style={{
                  fontSize: '26px',
                  marginLeft: '16px',
                  marginRight: '4px',
                  background: 'white',
                  borderRadius: '50%',
                }}
              />
            </button>
            <div style={{ flex: 1, marginLeft: '8px' }}>
              {getFieldDecorator('answer', {
                rules: [{ message: 'Please enter an answer', max: 2000 }],
              })(
                <TextArea
                  ref={textAreaRef}
                  autoSize={{ minRows: 10, maxRows: 30 }}
                  placeholder="Enter answer"
                  showCount
                  maxLength={2000}
                  onChange={handleAnswerChange}
                  onPaste={handlePaste}
                  style={answerError ? { borderColor: '#ff4d4f' } : {}}
                />,
              )}
            </div>
          </div>
          {extractedImages.length > 0 && (
            <div className="ImageSetter">
              <div className="image-box">
                {extractedImages.map((image, index) => (
                  <SafeImage
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={image.alt}
                    onError={() => {
                      setFailedImages(prev => {
                        if (prev.includes(image.url)) {
                          return prev;
                        }

                        return [...prev, image.url];
                      });
                    }}
                  />
                ))}
              </div>
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
