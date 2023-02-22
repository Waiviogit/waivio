import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import AppendForm from './AppendForm';

const AppendModal = ({
  showModal,
  history,
  hideModal,
  chosenLocale,
  field,
  objName,
  intl,
  post,
}) => (
  <Modal
    title={`${intl.formatMessage({
      id: 'suggestion_add_field',
      defaultMessage: 'Update object',
    })}: ${objName}`}
    footer={null}
    visible={showModal}
    onCancel={hideModal}
    maskClosable={false}
    width={767}
  >
    <AppendForm
      post={post}
      chosenLocale={chosenLocale}
      currentField={field}
      hideModal={hideModal}
      intl={intl}
      history={history}
    />
  </Modal>
);

AppendModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  field: PropTypes.string,
  chosenLocale: PropTypes.string,
  objName: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
};

AppendModal.defaultProps = {
  showModal: false,
  field: 'auto',
  chosenLocale: '',
  objName: '',
  post: {},
};

export default injectIntl(withRouter(AppendModal));
