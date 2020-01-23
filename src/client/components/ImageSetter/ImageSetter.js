import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, message } from 'antd';
import { map, isEmpty } from 'lodash';
import uuidv4 from 'uuid/v4';
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
  getImages,
}) => {
  const imageLinkInput = useRef(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [isLoadingImage, setLoadingImage] = useState(false);

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

  const handleOnUploadImageByLink = () => {
    if (imageLinkInput.current && imageLinkInput.current.value) {
      const url = imageLinkInput.current.value;
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

  const disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    if (isMultiple) {
      setCurrentImages([...currentImages, newImage]);
    } else setCurrentImages([newImage]);
    setLoadingImage(false);
    onLoadingImage(false);
  };

  const handleChangeImage = e => {
    if (e.target.files && e.target.files[0]) {
      if (
        !isValidImage(e.target.files[0], MAX_IMG_SIZE[objectFields.background], ALLOWED_IMG_FORMATS)
      ) {
        onImageInvalid(
          MAX_IMG_SIZE[objectFields.background],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      if (!isMultiple) {
        setCurrentImages([]);
      }
      setLoadingImage(true);
      onLoadingImage(true);

      onImageUpload(e.target.files[0], disableAndInsertImage, () => {
        setLoadingImage(false);
        onLoadingImage(false);
      });
    }
  };

  const handleRemoveImage = imageId => {
    const filteredImages = currentImages.filter(f => f.id !== imageId);
    setCurrentImages(filteredImages);
  };

  getImages(currentImages);

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
          {isLoadingImage && (
            <div className="image-box__preview">
              <div className="image-box__preview-loader">
                <Icon type="loading" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="image-upload">
        <input
          id="inputfile"
          className="image-upload__file-input"
          type="file"
          accept="image/*"
          onInput={handleChangeImage}
          onClick={e => {
            e.target.value = null;
          }}
        />
        <label htmlFor="inputfile">
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
        <span>{intl.formatMessage({ id: 'imageSetter_or', defaultMessage: 'or' })}</span>
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
          <button className="input-upload__btn" type="button" onClick={handleOnUploadImageByLink}>
            <Icon type="upload" />
          </button>
        </div>
      </div>
    </div>
  );
};
ImageSetter.propTypes = {
  intl: PropTypes.shape().isRequired,
  onImageInvalid: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onLoadingImage: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
};

ImageSetter.defaultProps = {
  isMultiple: false,
};

export default withEditor(injectIntl(ImageSetter));
