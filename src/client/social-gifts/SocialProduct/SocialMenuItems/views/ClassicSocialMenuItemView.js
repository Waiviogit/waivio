import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { checkAndOpenWaivioLink } from '../../../../../common/helpers/urlHelpers';

const ClassicSocialMenuItemView = ({
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
      {isNestedObjType && <Icon type={open ? 'minus' : 'plus'} style={{ fontSize: '24px' }} />}
      <div
        className={
          isNestedObjType ? 'SocialMenuItems__item-title--nested' : 'SocialMenuItems__item-title'
        }
      >
        {isImageButton ? getimagesLayout() : itemBody.title}
      </div>
    </>
  );

  return webLink ? (
    <a
      className="SocialMenuItems__item"
      onClick={() => {
        if (!checkAndOpenWaivioLink(itemBody.linkToWeb)) {
          dispatch(setLinkSafetyInfo(itemBody.linkToWeb));
        }
      }}
    >
      {content}
    </a>
  ) : (
    <div className="SocialMenuItems__item" onClick={handleOpenItem}>
      {content}
    </div>
  );
};

ClassicSocialMenuItemView.propTypes = {
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

export default ClassicSocialMenuItemView;
