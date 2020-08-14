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
  isSettings,
}) => {
  const [isCheck, setCheck] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentEmail = email || newEmail;
  const confirmationType = isSettings ? 'confirmEmail' : 'confirmTransaction';
  const isOpenConfirm = isSettings && email ? visible : isVisibleConfirm;
  const isOpenModal = isSettings && email ? false : visible;

  const handleChangeEmail = () => {
    setIsVisibleConfirm(true);
  };
  const emailInput = email ? (
    <p>
      <b className="email-change">{email}</b>(
      <a role="presentation" onClick={handleChangeEmail}>
        {intl.formatMessage({
          id: 'change',
          defaultMessage: 'change',
        })}
      </a>
      )
    </p>
  ) : (
    <Input
      onChange={e => setNewEmail(e.currentTarget.value)}
      placeholder={intl.formatMessage({
        id: 'enter_email',
        defaultMessage: 'Enter your email',
      })}
    />
  );

  const handleCancel = () => {
    handleClose(false);
  };

  const handleSendConfirmation = (changeEmail = '') => {
    const type = changeEmail === 'pullEmail' ? changeEmail : confirmationType;
    setIsLoading(true);

    sendEmailConfirmation(userName, type, currentEmail, isGuest)
      .then(r => {
        if (r.message) message.error(`${r.message}. Please, try again`);
        else
          Modal.success({
            title: intl.formatMessage({
              id: 'confirmation_email',
              defaultMessage: 'Confirmation email sent',
            }),
            content: intl.formatMessage(
              {
                id: 'confirm_transaction',
                defaultMessage: 'Please confirm this transaction from your email ({currentEmail})',
              },
              {
                currentEmail,
              },
            ),
            onOk: () => {
              closeWithdrawModal(false);
              handleClose(false);
            },
          });

        handleClose(false);
      })
      .catch(e => message.error(e.message))
      .finally(() => setIsLoading(false));
  };
  const onCancel = () => {
    if (isSettings && email) handleCancel();
    else setIsVisibleConfirm(false);
  };

  return (
    <React.Fragment>
      <Modal
        visible={isOpenModal}
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
        okButtonProps={{
          disabled: !((email || newEmail) && isCheck),
          loading: isLoading,
        }}
        cancelButtonProps={{
          disabled: isLoading,
        }}
      >
        <Form>
          <Form.Item
            label={intl.formatMessage({
              id: 'confirmed_by_email',
              defaultMessage: 'This transaction must be confirmed by email:',
            })}
          >
            {emailInput}
          </Form.Item>
          <PolicyConfirmation
            isChecked={isCheck}
            checkboxLabel={intl.formatMessage({
              id: 'legal_notice',
              defaultMessage: 'Legal notice',
            })}
            policyText={
              <span>
                {intl.formatMessage({ id: 'agree_to', defaultMessage: 'I agree to' })}{' '}
                <a href="https://blocktrades.us/en/terms-and-conditions-of-use">
                  {intl.formatMessage({
                    id: 'blocktrades_conditions',
                    defaultMessage: 'Blocktrades.us Terms and Conditions of Use',
                  })}
                </a>
                .{' '}
                {intl.formatMessage({
                  id: 'blocktrades_rules',
                  defaultMessage:
                    'I am at least 18 years of age and do not reside in Prohibited Jurisdictions (New York and Belarus, Burma, Cote D’Ivoire (Ivory Coast), Cuba, Democratic Republic of Congo, Iran, Iraq, Lebanon, Liberia, Libya, North Korea, Sudan, Syria, Somalia, and Zimbabwe).',
                })}
              </span>
            }
            onChange={setCheck}
          />
        </Form>
      </Modal>
      <Modal
        title={intl.formatMessage({
          id: 'email_change_request',
          defaultMessage: 'Email change request',
        })}
        visible={isOpenConfirm}
        onCancel={onCancel}
        onOk={() => handleSendConfirmation('pullEmail')}
      >
        <div>
          <div className="modal-row">
            {intl.formatMessage({
              id: 'email_change_message',
              defaultMessage:
                'To change the email address, you must first unlink the existing email address.',
            })}
          </div>
          <div className="modal-row">
            {intl.formatMessage({
              id: 'unlink_request',
              defaultMessage: 'Unlink request will be sent to:',
            })}{' '}
          </div>
          <b className="email-change modal-row">{email}</b>
          <div className="modal-row">
            <b>
              {intl.formatMessage({
                id: 'note',
                defaultMessage: 'Note',
              })}
              :
            </b>{' '}
            {intl.formatMessage(
              {
                id: 'unlink_email_warning',
                defaultMessage:
                  'if you no longer have access to this email, unfortunately you will not be able to unlink it from the @{userName} account.',
              },
              { userName },
            )}
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

EmailConfirmation.propTypes = {
  intl: PropTypes.shape().isRequired,
  visible: PropTypes.bool,
  handleClose: PropTypes.func,
  email: PropTypes.string,
  userName: PropTypes.string.isRequired,
  isGuest: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
  isSettings: PropTypes.bool,
};

EmailConfirmation.defaultProps = {
  visible: false,
  isSettings: false,
  handleClose: () => {},
  email: '',
};

export default connect(
  state => ({
    userName: getAuthenticatedUserName(state),
    isGuest: isGuestUser(state),
    email: getAuthenticatedUserPrivateEmail(state),
  }),
  { closeWithdrawModal: closeWithdraw },
)(injectIntl(EmailConfirmation));
