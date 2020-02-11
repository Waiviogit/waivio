import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, message } from 'antd';
import { isEmpty, map } from 'lodash';
import uuidv4 from 'uuid/v4';
import classNames from 'classnames';
import withEditor from '../Editor/withEditor';
import { isValidImage } from '../../helpers/image';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { objectFields } from '../../../common/constants/listOfFields';

import './ImageSetter.less';

const ImageSetter = ({
  intl,
  isMultiple,
  onImageInvalid,
  onImageUpload,
  onLoadingImage,
  onImageLoaded,
  defaultImage,
  isRequired,
  title,
}) => {
  const imageLinkInput = useRef(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [isLoadingImage, setLoadingImage] = useState(false);
  const [fileImages, setFileImages] = useState([]);

  useEffect(() => {
    if (currentImages.length) {
      onImageLoaded(currentImages);
    }
  }, [currentImages]);

  const checkIsImage = (isValidLink, image) => {
    const isSameLink = currentImages.some(currentImage => currentImage.src === image.src);
    if (isSameLink) {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_link_is_already_added',
          defaultMessage: 'The link you are trying to add is already added',
        }),
      );
      return;
    }
    if (isValidLink) {
      if (!isMultiple) {
        setCurrentImages([image]);
      } else setCurrentImages([...currentImages, image]);
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };

  const handleOnUploadImageByLink = image => {
    if (currentImages.length >= 25) {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_cannot',
          defaultMessage: 'You cannot upload more then 25 images',
        }),
      );
      return;
    }
    if (image || (imageLinkInput.current && imageLinkInput.current.value)) {
      const url = image || imageLinkInput.current.value;
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const newImage = {
        src: url,
        name: filename,
        id: uuidv4(),
      };
      const img = new Image();
      img.src = newImage.src;
      img.onload = () => checkIsImage(true, newImage);
      img.onerror = () => checkIsImage(false, newImage);
      imageLinkInput.current.value = '';
    }
  };

  useEffect(() => {
    handleOnUploadImageByLink(defaultImage);
  }, []);

  const handleChangeImage = async e => {
    if (e.target.files && e.target.files[0]) {
      const uploadedImages = [];
      const images = Object.values(e.target.files);
      setFileImages(images);
      if (images.length > 25 || currentImages.length + images.length > 25) {
        message.error(
          intl.formatMessage({
            id: 'imageSetter_cannot',
            defaultMessage: 'You cannot upload more then 25 images',
          }),
        );
        return;
      }
      const disableAndInsertImage = (image, imageName = 'image') => {
        const newImage = {
          src: image,
          name: imageName,
          id: uuidv4(),
        };
        uploadedImages.push(newImage);
      };
      const onErrorLoadImage = () => {
        setLoadingImage(false);
        onLoadingImage(false);
      };
      setLoadingImage(true);
      onLoadingImage(true);
      /* eslint-disable no-restricted-syntax */
      for (const image of images) {
        if (!isValidImage(image, MAX_IMG_SIZE[objectFields.background], ALLOWED_IMG_FORMATS)) {
          onImageInvalid(
            MAX_IMG_SIZE[objectFields.background],
            `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
          );
        } else {
          /* eslint-disable no-await-in-loop */
          await onImageUpload(image, disableAndInsertImage, onErrorLoadImage);
        }
      }
      setCurrentImages([...currentImages, ...uploadedImages]);
      setLoadingImage(false);
      onLoadingImage(false);
    }
  };

  const handleRemoveImage = imageId => {
    const filteredImages = currentImages.filter(image => image.id !== imageId);
    setCurrentImages(filteredImages);
    if (!filteredImages.length) onImageLoaded([]);
  };

  const renderTitle = () => {
    if (defaultImage) {
      return intl.formatMessage({
        id: 'profile_picture',
        defaultMessage: 'Profile picture',
      });
    } else if (isMultiple) {
      return intl.formatMessage({
        id: 'imageSetter_add_images',
        defaultMessage: 'Add images',
      });
    }
    return intl.formatMessage({
      id: 'imageSetter_add_image',
      defaultMessage: 'Add image',
    });
  };

  return (
    <div className="ImageSetter">
      <div
        className={classNames(
          'ImageSetter__label',
          { 'ImageSetter__label--required': isRequired },
          { 'ImageSetter__label--no-visible': !title },
        )}
      >
        {renderTitle()}
      </div>
      {(!isEmpty(currentImages) || isLoadingImage) && (
        <div className="image-box">
          {map(currentImages, image => (
            <div className="image-box__preview" key={image.id}>
              <div
                className="image-box__remove"
                onClick={() => handleRemoveImage(image.id)}
                role="presentation"
              >
                <i className="iconfont icon-delete_fill Image-box__remove-icon" />
              </div>
              <img src={image.src} width="86" height="86" alt={image.src} />
            </div>
          ))}
          {isLoadingImage &&
            map(fileImages, () => (
              <div className="image-box__preview">
                <div className="image-box__preview-loader">
                  <Icon type="loading" />
                </div>
              </div>
            ))}
        </div>
      )}
      {(isMultiple || !currentImages.length) && (
        <div className="image-upload">
          <input
            id="inputfile"
            className="image-upload__file-input"
            type="file"
            accept="image/*"
            multiple={isMultiple}
            onChange={handleChangeImage}
            onClick={e => {
              e.target.value = null;
            }}
          />
          <label className="button-upload__label" htmlFor="inputfile">
            <div className="button-upload">
              <div className="button-upload__container">
                <Icon className="button-upload__container-img" type="plus" />
                <div className="button-upload__container-label">
                  {intl.formatMessage({
                    id: 'imageSetter_upload',
                    defaultMessage: 'Upload',
                  })}
                </div>
              </div>
            </div>
          </label>
          <span className="ImageSetter__center-text">
            {intl.formatMessage({ id: 'imageSetter_or', defaultMessage: 'or' })}
          </span>
          <div className="input-upload">
            <input
              className="input-upload__item"
              size="large"
              ref={imageLinkInput}
              placeholder={intl.formatMessage({
                id: 'imageSetter_paste_image_link',
                defaultMessage: 'Paste image link',
              })}
            />
            <button
              className="input-upload__btn"
              type="button"
              onClick={() => handleOnUploadImageByLink()}
            >
              <Icon type="upload" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
ImageSetter.propTypes = {
  intl: PropTypes.shape().isRequired,
  onImageInvalid: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onLoadingImage: PropTypes.func.isRequired,
  onImageLoaded: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  defaultImage: PropTypes.string,
  isRequired: PropTypes.bool,
  title: PropTypes.bool,
};

ImageSetter.defaultProps = {
  isMultiple: false,
  defaultImage: '',
  isRequired: false,
  title: true,
};

export default withEditor(injectIntl(ImageSetter));
