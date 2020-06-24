import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import PolicyConfirmation from '../components/PolicyConfirmation/PolicyConfirmation';
import { sendEmailConfirmation } from '../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  isGuestUser,
  getAuthenticatedUserPrivateEmail,
} from '../reducers';
import { closeWithdraw } from '../wallet/walletActions';

import './widgetsStyle.less';

const EmailConfirmation = ({
  visible,
  intl,
  handleClose,
  email,
  userName,
  isGuest,
  closeWithdrawModal,
}) => {
  const [isCheck, setCheck] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const currentEmail = email || newEmail;
  const confirmationType = email ? 'confirmTransaction' : 'confirmEmail';
  const confirmText =
    confirmationType === 'confirmTransaction'
      ? {
          title: 'Confirmation email sent',
          content: `Please confirm this transaction from your email (${currentEmail})`,
          onOk: () => {
            closeWithdrawModal(false);
            handleClose(false);
          },
        }
      : {
          title: 'Confirmation email sent',
          content: `Please confirm your email (${currentEmail})`,
          onOk: () => {
            handleClose(false);
          },
        };
  const handleChangeEmail = () => {
    setIsVisibleConfirm(true);
  };
  const emailInput = email ? (
    <p>
      <b className="email-change">{email}</b>(
      <a role="presentation" onClick={handleChangeEmail}>
        change
      </a>
      )
    </p>
  ) : (
    <Input onChange={e => setNewEmail(e.currentTarget.value)} placeholder={'Enter your email'} />
  );

  const handleCancel = () => {
    handleClose(false);
  };

  const handleSendConfirmation = () => {
    sendEmailConfirmation(userName, confirmationType, currentEmail, isGuest)
      .then(r => {
        if (r.message) message.error(`${r.message}. Please, try again`);
        else Modal.success(confirmText);
      })
      .catch(e => message.error(e.message));
    handleClose(false);
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={intl.formatMessage({
          id: 'blocktrades_exchange_request',
          defaultMessage: 'Blocktrades.us exchange request',
        })}
        okText={intl.formatMessage({
          id: 'send_confirmation',
          defaultMessage: 'Send confirmation',
        })}
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
      <Modal
        title="Email change request"
        visible={isVisibleConfirm}
        onCancel={() => setIsVisibleConfirm(false)}
      >
        <div>
          <div className="modal-row">
            To change the email address, you must first unlink the existing email address.
          </div>
          <div className="modal-row">Unlink request will be sent to: </div>
          <b className="email-change modal-row">{email}</b>
          <div className="modal-row">
            <b>Note:</b> if you no longer have access to this email, unfortunately you will not be
            able to unlink it from the @{userName} account.
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

EmailConfirmation.propTypes = {
  intl: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  isGuest: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
};

export default injectIntl(
  connect(
    state => ({
      userName: getAuthenticatedUserName(state),
      isGuest: isGuestUser(state),
      email: getAuthenticatedUserPrivateEmail(state),
    }),
    { closeWithdrawModal: closeWithdraw },
  )(EmailConfirmation),
);
