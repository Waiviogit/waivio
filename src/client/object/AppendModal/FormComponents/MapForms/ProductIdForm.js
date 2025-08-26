import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { objectFields, productIdFields } from '../../../../../common/constants/listOfFields';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';
import GenerateIdButton from '../GenerateIdButton';

const ProductIdForm = ({
  getFieldDecorator,
  loading,
  intl,
  getFieldRules,
  isSomeValue,
  onLoadingImage,
  getImages,
  setFieldsValue,
  form,
}) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(productIdFields.productIdType, {
        rules: getFieldRules(objectFields.productIdType),
      })(
        <Input
          autoFocus
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'product_id_type',
            defaultMessage: 'Product ID type',
          })}
        />,
      )}
    </Form.Item>
    <p>
      {intl.formatMessage({
        id: 'product_id_type_text',
        defaultMessage:
          'Some product ID types are recognized globally, such as UPC, EAN, ISBN, GTIN-8. But manufactures can use their own systems for naming products.',
      })}
    </p>
    <br />
    <Form.Item>
      {getFieldDecorator(objectFields.productId, {
        rules: getFieldRules(objectFields.productId),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'product_id',
            defaultMessage: 'Product ID',
          })}
        />,
      )}
    </Form.Item>
    <p className={'flex justify-between'}>
      {intl.formatMessage({
        id: 'product_id_text',
        defaultMessage:
          'Product identifiers are often alphanumeric, but there are no limitations on this text field.',
      })}
      <GenerateIdButton field={productIdFields.productId} setFieldsValue={setFieldsValue} />
    </p>
    <br />
    <div className="image-wrapper">
      <Form.Item>
        {getFieldDecorator(objectFields.productIdImage, {
          rules: getFieldRules(objectFields.productIdImage),
        })(
          <ImageSetter
            shouldValidate
            field={objectFields.productIdImage}
            form={form}
            onImageLoaded={getImages}
            onLoadingImage={onLoadingImage}
            labeledImage={'product_id_image'}
            isMultiple={false}
          />,
        )}
      </Form.Item>
    </div>
    <p>
      {intl.formatMessage({
        id: 'product_id_image_text',
        defaultMessage:
          'Visual representation of the product ID, such as a bar code, label, QR code, etc.',
      })}
    </p>
  </React.Fragment>
);

ProductIdForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
  onLoadingImage: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

export default injectIntl(ProductIdForm);
