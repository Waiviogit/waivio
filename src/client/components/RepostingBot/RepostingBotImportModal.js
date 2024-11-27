import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { changeRepostingBotHost } from '../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import '../DataImport/ImportModal/ImportModal.less';

const RepostingBotModal = ({
  visible,
  toggleModal,
  intl,
  onClose,
  updateRepostingList,
  host,
  setHost,
}) => {
  const authName = useSelector(getAuthenticatedUserName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    changeRepostingBotHost(authName, host).then(() => {
      onClose();
      setLoading(false);
      updateRepostingList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'reposting_bot', defaultMessage: 'Reposting bot' })}
      className={'RepostingBot'}
      onCancel={toggleModal}
      onOk={handleSubmit}
      okButtonProps={{
        disabled: isEmpty(host),
        loading,
      }}
      okText={intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
    >
      <div>
        <h4>{intl.formatMessage({ id: 'site', defaultMessage: 'Site' })}:</h4>
        <Input
          onChange={e => setHost(e.target.value)}
          value={host}
          placeholder={'Enter a site (e.g., example.com)'}
        />
      </div>
    </Modal>
  );
};

RepostingBotModal.propTypes = {
  visible: PropTypes.string,
  host: PropTypes.string,
  toggleModal: PropTypes.func,
  setHost: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  updateRepostingList: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RepostingBotModal);
