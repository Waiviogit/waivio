import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, message } from 'antd';
import { map, isEmpty, get, isEqual, isNil, size } from 'lodash';
import { EditorState } from 'draft-js';
import uuidv4 from 'uuid/v4';
import classNames from 'classnames';
import withEditor from '../Editor/withEditor';
import { isValidImage } from '../../helpers/image';
import {
  ALLOWED_IMG_FORMATS,
  MAX_IMG_SIZE,
  objectURLValidationRegExp,
} from '../../../common/constants/validation';
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
  isTitle,
  setEditorState,
  getEditorState,
  addNewBlockAt,
  Block,
  selection,
  isOkayBtn,
  isModal,
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

  const clearImageState = () => setCurrentImages([]);

  const addImage = () => {
    if (isModal && isOkayBtn) {
      currentImages.reverse().forEach(newImage => {
        if (selection && newImage) {
          setTimeout(() => {
            const selectionBlock = getEditorState().getSelection();
            const key = selectionBlock.getAnchorKey();

            setEditorState(addNewBlockAt(getEditorState(), key, Block.UNSTYLED, {}, true));
            setEditorState(
              addNewBlockAt(
                getEditorState(),
                key,
                Block.IMAGE,
                {
                  src: `${
                    newImage.src.startsWith('http') ? newImage.src : `https://${newImage.src}`
                  }`,
                  alt: newImage.name,
                },
                true,
              ),
            );
          }, 1000);
        }
      });
      setTimeout(() => {
        const es = getEditorState();

        setEditorState(EditorState.moveFocusToEnd(es));
      }, 1100);
    }

    return clearImageState();
  };

  useEffect(() => {
    addImage();
  }, [isOkayBtn, isModal]);

  // For image pasted for link
  const checkImage = (isValidLink, image) => {
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
      } else {
        setCurrentImages([...currentImages, image]);
      }
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };

  // For image pasted for link
  const handleOnUploadImageByLink = async image => {
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
      const urlValidation = url.match(objectURLValidationRegExp);

      if (urlValidation) {
        const onErrorLoadImage = () => {
          onLoadingImage(false);
        };
        let newImage = {};
        const insertImage = (currentLinkSrc, currentLinkName = 'image') => {
          newImage = {
            src: currentLinkSrc,
            name: currentLinkName,
            id: uuidv4(),
          };
        };

        await onImageUpload(url, insertImage, onErrorLoadImage, true);
        imageLinkInput.current.value = '';
        checkImage(true, newImage);
      } else {
        checkImage(false);
      }
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
      // eslint-disable-next-line no-unused-vars
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

  const handleRemoveImage = imageDetail => {
    const filteredImages = currentImages.filter(f => f.id !== imageDetail.id);

    setCurrentImages(filteredImages);
    const contentState = getEditorState().getCurrentContent();
    const allBlocks = contentState.getBlockMap();

    allBlocks.forEach((block, index) => {
      // eslint-disable-next-line no-underscore-dangle
      const currentImageSrc = get(block.data._root, 'entries[0][1]', '');

      if (!isNil(currentImageSrc) && isEqual(imageDetail.src, currentImageSrc)) {
        const blockBefore = contentState.getBlockBefore(index).getKey();
        const removeImage = contentState.getBlockMap().delete(index);
        const contentAfterRemove = removeImage.delete(blockBefore);
        const filtered = contentAfterRemove.filter(element => !isNil(element));

        const newContent = contentState.merge({
          blockMap: filtered,
        });

        setEditorState(EditorState.push(getEditorState(), newContent, 'split-block'));
      }
    });

    if (!size(filteredImages)) onImageLoaded([]);
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
        className={classNames('ImageSetter__label', {
          'ImageSetter__label--required': isRequired,
          'ImageSetter__label--no-visible': !isTitle,
        })}
      >
        {renderTitle()}
      </div>
      {(!isEmpty(currentImages) || isLoadingImage) && (
        <div className="image-box">
          {map(currentImages, image => (
            <div className="image-box__preview" key={image.id}>
              <div
                className="image-box__remove"
                onClick={() => handleRemoveImage(image)}
                role="presentation"
              >
                <i className="iconfont icon-delete_fill Image-box__remove-icon" />
              </div>
              <img src={image.src} height="86" alt={image.src} />
            </div>
          ))}
          {isLoadingImage &&
            map(fileImages, () => (
              <div key={`${fileImages.size}/${fileImages.name}`} className="image-box__preview">
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
          <label className="label" htmlFor="inputfile">
            <div className="button-upload">
              <div className="button-upload__container">
                <Icon className="button-upload__container-img" type="plus" />
                <div className="button-upload__container-label">
                  <span className="button-upload__for-desktop">
                    {intl.formatMessage({
                      id: 'imageSetter_upload',
                      defaultMessage: 'Upload',
                    })}
                  </span>
                  <span className="button-upload__for-mobile">
                    {intl.formatMessage({
                      id: 'imageSetter_upload_for_mobile',
                      defaultMessage: 'Take or select photo',
                    })}
                  </span>
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
              onInput={() => handleOnUploadImageByLink()}
            />
            <Icon type="upload" className="input-upload__btn" />
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
  onLoadingImage: PropTypes.func,
  onImageLoaded: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  defaultImage: PropTypes.string,
  isRequired: PropTypes.bool,
  isTitle: PropTypes.bool,
  setEditorState: PropTypes.func,
  getEditorState: PropTypes.func,
  addNewBlockAt: PropTypes.func,
  selection: PropTypes.func,
  Block: PropTypes.shape(),
  isOkayBtn: PropTypes.bool,
  isModal: PropTypes.bool,
};

ImageSetter.defaultProps = {
  isMultiple: true,
  defaultImage: '',
  isRequired: false,
  isTitle: true,
  setEditorState: () => {},
  getEditorState: () => {},
  addNewBlockAt: () => {},
  onLoadingImage: () => {},
  selection: undefined,
  Block: {},
  isOkayBtn: false,
  isModal: false,
};

export default withEditor(injectIntl(ImageSetter));
