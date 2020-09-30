import React from 'react';
import { Form, Input } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';
import { objectNameValidationRegExp } from '../../../../../common/constants/validation';

const ItemGalleryAlbum = (getFieldDecorator, loading, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(objectFields.galleryAlbum, {
        rules: [
          {
            required: true,
            message: intl.formatMessage({
              id: 'album_field_error',
              defaultMessage: 'Album name is required',
            }),
          },
          {
            max: 100,
            message: intl.formatMessage(
              {
                id: 'value_error_long',
                defaultMessage: "Value can't be longer than 100 characters.",
              },
              { value: 100 },
            ),
          },
          {
            pattern: objectNameValidationRegExp,
            message: intl.formatMessage({
              id: 'validation_special_symbols',
              defaultMessage: 'Please dont use special simbols like "/", "?", "%", "&"',
            }),
          },
        ],
      })(
        <Input
          className="CreateAlbum__input"
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'add_new_album_placeholder',
            defaultMessage: 'Add value',
          })}
        />,
      )}
    </Form.Item>
  </React.Fragment>
);
export default ItemGalleryAlbum;
