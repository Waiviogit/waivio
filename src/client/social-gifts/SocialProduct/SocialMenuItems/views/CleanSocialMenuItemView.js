import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import '../SocialMenuItems.clean.less';

const CleanSocialMenuItemView = ({
  isNestedObjType,
  open,
  itemBody,
  isImageButton,
  getimagesLayout,
  handleOpenItem,
  webLink,
  dispatch,
  setLinkSafetyInfo,
}) => {
  const content = (
    <>
      <div className="SocialMenuItemsClean__item-title">
        {isImageButton ? getimagesLayout() : itemBody.title}
      </div>
      {isNestedObjType && (
        <Icon type={open ? 'minus' : 'plus'} className="SocialMenuItemsClean__icon" />
      )}
    </>
  );

  return webLink ? (
    <a
      className="SocialMenuItemsClean__item"
      onClick={() => dispatch(setLinkSafetyInfo(itemBody.linkToWeb))}
    >
      {content}
    </a>
  ) : (
    <div className="SocialMenuItemsClean__item" onClick={handleOpenItem}>
      {content}
    </div>
  );
};

CleanSocialMenuItemView.propTypes = {
  isNestedObjType: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  itemBody: PropTypes.shape().isRequired,
  isImageButton: PropTypes.bool.isRequired,
  getimagesLayout: PropTypes.func.isRequired,
  handleOpenItem: PropTypes.func.isRequired,
  webLink: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  setLinkSafetyInfo: PropTypes.func.isRequired,
};

export default CleanSocialMenuItemView;
