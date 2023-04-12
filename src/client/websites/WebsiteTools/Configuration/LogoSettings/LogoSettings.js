import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Modal } from 'antd';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';

const LogoSettings = ({
  src,
  openModal,
  closeLogoModal,
  handleSubmitLogoModal,
  visible,
  onImageLoaded,
  paramsSaving,
  title,
  className,
  buttonTitle,
}) => (
  <div>
    <h3>{title}</h3>
    <div className="Settings__profile-image">
      <Avatar icon="picture" shape="square" src={src} className={className} />
      <Button type="primary" onClick={openModal}>
        {buttonTitle}
      </Button>
    </div>
    <Modal
      wrapClassName="Settings__modal"
      title={`Choose logo`}
      closable
      onCancel={closeLogoModal}
      onOk={handleSubmitLogoModal}
      visible={visible}
      okButtonProps={{
        loading: paramsSaving,
      }}
    >
      {visible && <ImageSetter onImageLoaded={onImageLoaded} isRequired isMultiple={false} />}
    </Modal>
  </div>
);

LogoSettings.propTypes = {
  src: PropTypes.string,
  openModal: PropTypes.func,
  closeLogoModal: PropTypes.func,
  handleSubmitLogoModal: PropTypes.func,
  visible: PropTypes.bool,
  onImageLoaded: PropTypes.func,
  paramsSaving: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  buttonTitle: PropTypes.string,
};

export default LogoSettings;
