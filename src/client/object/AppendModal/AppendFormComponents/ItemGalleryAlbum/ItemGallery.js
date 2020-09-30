import React from 'react';
import { Form, Select } from 'antd';
import { map } from 'lodash';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';

const ItemGallery = (
  getFieldDecorator,
  loading,
  intl,
  selectedAlbum,
  albums,
  getImage,
  fileList,
  onLoadingImage,
) => {
  const albumInitialValue = selectedAlbum
    ? selectedAlbum.id || selectedAlbum.body
    : 'Choose an album';
  return (
    <React.Fragment>
      <Form.Item>
        {getFieldDecorator('id', {
          initialValue: albumInitialValue,
          rules: [
            {
              required: true,
              message: intl.formatMessage(
                {
                  id: 'field_error',
                  defaultMessage: 'Field is required',
                },
                { field: 'Album' },
              ),
            },
          ],
        })(
          <Select
            disabled={loading || selectedAlbum}
            // onSelect={value => this.setState(() => ({currentAlbum: value}))}
          >
            {map(albums, album => (
              <Select.Option
                key={`${album.id || album.weight}${album.body}`}
                value={album.id || album.body}
              >
                {album.body}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('upload', {
          rules: [
            {
              required: !fileList.length,
              message: intl.formatMessage({
                id: 'upload_photo_error',
                defaultMessage: 'You need to upload at least one image',
              }),
            },
          ],
        })(
          <div className="clearfix">
            <ImageSetter
              onImageLoaded={getImage}
              onLoadingImage={onLoadingImage}
              isMultiple
              isRequired
            />
            {/* TODO: Possible will use */}
            {/* <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}> */}
            {/*  <img */}
            {/*    alt="example" */}
            {/*    style={{ width: '100%', 'max-height': '90vh' }} */}
            {/*    src={previewImage} */}
            {/*  /> */}
            {/* </Modal> */}
          </div>,
        )}
      </Form.Item>
    </React.Fragment>
  );
};

export default ItemGallery;
