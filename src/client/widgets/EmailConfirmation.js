import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import PolicyConfirmation from '../components/PolicyConfirmation/PolicyConfirmation';
import { sendEmailConfirmation } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, isGuestUser } from '../reducers';

// eslint-disable-next-line no-unused-vars
const EmailConfirmation = ({ visible, intl, handleClose, email, userName, isGuest, history }) => {
  const [isCheck, setCheck] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const confirmationType = email ? 'confirmTransaction' : 'confirmEmail';
  const emailInput = email ? (
    <p>
      <b>{email}</b>(<a>change</a>)
    </p>
  ) : (
    <Input onChange={e => setNewEmail(e.currentTarget.value)} placeholder={'Enter your email'} />
  );

  const handleCancel = () => {
    handleClose(false);
  };

  const handleSendConfirmation = () => {
    const currentEmail = email || newEmail;
    sendEmailConfirmation(userName, confirmationType, currentEmail, isGuest);
    // .then(() => history.push(`/@${userName}`));
    handleClose(false);
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({
        id: 'blocktrades_exchange_request',
        defaultMessage: 'Blocktrades.us exchange request',
      })}
      okText={intl.formatMessage({ id: 'send_confirmation', defaultMessage: 'Send confirmation' })}
      cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
      onOk={handleSendConfirmation}
      onCancel={handleCancel}
      okButtonProps={{ disabled: (!email || !newEmail) && !isCheck }}
    >
      <Form>
        <Form.Item label="This transaction must be confirmed by email:">{emailInput}</Form.Item>
        <PolicyConfirmation
          isChecked={isCheck}
          checkboxLabel="Legal notice"
          policyText={
            <span>
              I agree to{' '}
              <a href="https://blocktrades.us/en/terms-and-conditions-of-use">
                Blocktrades.us Terms and Conditions of Use
              </a>
              . I am at least 18 years of age and do not reside in Prohibited Jurisdictions (New
              York and Belarus, Burma, Cote D’Ivoire (Ivory Coast), Cuba, Democratic Republic of
              Congo, Iran, Iraq, Lebanon, Liberia, Libya, North Korea, Sudan, Syria, Somalia, and
              Zimbabwe).
            </span>
          }
          onChange={setCheck}
        />
      </Form>
    </Modal>
  );
};

EmailConfirmation.propTypes = {
  intl: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  isGuest: PropTypes.bool.isRequired,
  history: PropTypes.shape().isRequired,
};

export default connect(state => ({
  userName: getAuthenticatedUserName(state),
  isGuest: isGuestUser(state),
}))(injectIntl(EmailConfirmation));
