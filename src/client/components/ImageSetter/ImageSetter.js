import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { map, isEmpty } from 'lodash';
import uuidv4 from 'uuid/v4';
import './ImageSetter.less';

const ImageSetter = ({
  intl,
  isMultiple,
  images,
  onRemoveImage,
  handleAddImage,
  handleAddImageByLink,
  isLoading,
}) => {
  const imageLinkInput = useRef(null);
  const handleOnUploadImageByLink = () => {
    if (imageLinkInput.current && imageLinkInput.current.value) {
      const url = imageLinkInput.current.value;
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const newImage = {
        src: url,
        name: filename,
        id: uuidv4(),
      };
      handleAddImageByLink(newImage);
      imageLinkInput.current.value = '';
    }
  };

  return (
    <div className="ImageSetter">
      <div className="ImageSetter__label">
        {!isMultiple
          ? intl.formatMessage({
              id: 'imageSetter_add_image',
              defaultMessage: 'Add image',
            })
          : intl.formatMessage({
              id: 'imageSetter_add_images',
              defaultMessage: 'Add images',
            })}
      </div>
      {(!isEmpty(images) || isLoading) && (
        <div className="ImageSetter__imagebox">
          {map(images, image => (
            <div className="ImageSetter__imagebox-preview" key={image.id}>
              <div
                className="ImageSetter__imagebox-remove"
                onClick={() => onRemoveImage(image.id)}
                role="presentation"
              >
                <i className="iconfont icon-delete_fill ImageSetter__imagebox-remove-icon" />
              </div>
              <img src={image.src} width="86" height="86" alt={image.src} />
            </div>
          ))}
          {isLoading && (
            <div className="ImageSetter__imagebox-preview">
              <div className="ImageSetter__imagebox-preview-loader">
                <Icon type="loading" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="ImageSetter__upload">
        <input
          id="inputfile"
          className="ImageSetter__upload-file"
          type="file"
          accept="image/*"
          onInput={handleAddImage}
          onClick={e => {
            e.target.value = null;
          }}
        />
        <label htmlFor="inputfile">
          <div className="ImageSetter__upload-btn">
            <div className="ImageSetter__upload-btn-container">
              <Icon className="ImageSetter__upload-btn-container-img" type="plus" />
              <div className="ImageSetter__upload-btn-container-label">
                {intl.formatMessage({
                  id: 'imageSetter_upload',
                  defaultMessage: 'Upload',
                })}
              </div>
            </div>
          </div>
        </label>
        <span>{intl.formatMessage({ id: 'imageSetter_or', defaultMessage: 'or' })}</span>
        <div className="ImageSetter__upload-input">
          <input
            className="ImageSetter__upload-input-item"
            size="large"
            ref={imageLinkInput}
            placeholder={intl.formatMessage({
              id: 'imageSetter_paste_image_link',
              defaultMessage: 'Paste image link',
            })}
          />
          <button
            className="ImageSetter__upload-input-btn"
            type="button"
            onClick={handleOnUploadImageByLink}
          >
            <Icon type="upload" />
          </button>
        </div>
      </div>
    </div>
  );
};

ImageSetter.propTypes = {
  handleAddImage: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  isMultiple: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape()),
  onRemoveImage: PropTypes.func.isRequired,
  handleAddImageByLink: PropTypes.func.isRequired,
};

ImageSetter.defaultProps = {
  intl: {},
  isMultiple: false,
  images: [],
};

export default injectIntl(ImageSetter);
