import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

const QuickPostEditorFooter = ({
  currentImages,
  imageUploading,
  handleImageChange,
  onRemoveImage,
  handleFooterFocus,
  children,
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="QuickPostEditor__footer" tabIndex="0" onFocus={handleFooterFocus}>
    <div className="QuickPostEditor__imagebox">
      {_.map(currentImages, image => (
        <div className="QuickPostEditor__imagebox__preview__image" key={image.id}>
          <div
            className="QuickPostEditor__imagebox__remove"
            onClick={() => onRemoveImage(image)}
            role="presentation"
          >
            <i className="iconfont icon-delete_fill QuickPostEditor__imagebox__remove__icon" />
          </div>
          <img src={image.src} width="38" height="38" alt={image.src} />
        </div>
      ))}
      <input
        id="inputfile"
        className="QuickPostEditor__footer__file"
        type="file"
        accept="image/*"
        onInput={handleImageChange}
        onClick={e => {
          e.target.value = null;
        }}
      />
      <label htmlFor="inputfile">
        {imageUploading ? (
          <div className="QuickPostEditor__imagebox__loading">
            <Icon type="loading" />
          </div>
        ) : (
          <div
            className={classNames({
              QuickPostEditor__imagebox__upload: !_.isEmpty(currentImages),
            })}
          >
            <i
              className={classNames('iconfont QuickPostEditor__imagebox__upload__icon', {
                'icon-picture': _.isEmpty(currentImages),
                'icon-add': !_.isEmpty(currentImages),
              })}
            >
              {_.isEmpty(currentImages) && (
                <FormattedMessage id="add_photo" defaultMessage="Add photo">
                  {value => <div className="add-button">{value}</div>}
                </FormattedMessage>
              )}
            </i>
          </div>
        )}
      </label>
    </div>
    {children}
  </div>
);

QuickPostEditorFooter.propTypes = {
  currentImages: PropTypes.arrayOf(PropTypes.shape()),
  imageUploading: PropTypes.bool,
  handleImageChange: PropTypes.func,
  onRemoveImage: PropTypes.func,
  handleFooterFocus: PropTypes.func,
  children: PropTypes.node,
};

QuickPostEditorFooter.defaultProps = {
  currentImages: [],
  imageUploading: false,
  handleImageChange: () => {},
  onRemoveImage: () => {},
  handleFooterFocus: () => {},
  children: null,
};

export default QuickPostEditorFooter;
