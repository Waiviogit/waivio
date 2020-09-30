import React from 'react';
import { Form } from 'antd';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';

const ItemAvatar = (getFieldDecorator, getImages, onLoadingImage, currentField, getFieldRules) => (
  <Form.Item>
    {getFieldDecorator(currentField, { rules: getFieldRules(currentField) })(
      <ImageSetter onImageLoaded={getImages} onLoadingImage={onLoadingImage} isRequired />,
    )}
  </Form.Item>
);
export default ItemAvatar;
