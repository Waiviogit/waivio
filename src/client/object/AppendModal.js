import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AppendForm from './AppendForm';
import { supportedObjectFields } from '../../common/constants/listOfFields';

const AppendModal = ({ showModal, hideModal, locale, location }) => {
  const { pathname } = location;
  const parsedArray = pathname.split('/');
  const field = parsedArray[parsedArray.length - 1];

  let currentField = 'auto';
  if (supportedObjectFields.includes(field)) currentField = field;

  return (
    <Modal
      title={null}
      footer={null}
      visible={showModal}
      onCancel={hideModal}
      width={767}
      destroyOnClose
    >
      <AppendForm hideModal={hideModal} currentLocale={locale} currentField={currentField} />
    </Modal>
  );
};
AppendModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  locale: PropTypes.string,
  location: PropTypes.shape,
};

AppendModal.defaultProps = {
  showModal: false,
  locale: 'auto',
  location: {},
};

export default withRouter(AppendModal);
