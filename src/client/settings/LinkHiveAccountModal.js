import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { message, Modal } from 'antd';

import PolicyConfirmation from '../components/PolicyConfirmation/PolicyConfirmation';
import SearchUsersAutocomplete from '../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../components/Avatar';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import { saveSettings } from '../../store/settingsStore/settingsActions';

import './Settings.less';

const LinkHiveAccountModal = ({ intl, showModal, hiveBeneficiaryAccount, user, handleClose }) => {
  const [isCheck, setCheck] = useState(false);
  const [showSelectAccount, setShowSelectAccount] = useState(Boolean(hiveBeneficiaryAccount));
  const [selectedUser, setSelectedUser] = useState(hiveBeneficiaryAccount);
  const dispatch = useDispatch();

  const handleOkModal = () =>
    dispatch(
      saveSettings({
        hiveBeneficiaryAccount: selectedUser,
      }),
    ).then(() => {
      message.success('Saved');
      setSelectedUser('');
      handleClose();
    });
  const addHiveAccount =
    selectedUser && showSelectAccount ? (
      <div className="Settings__search-account">
        <div className="Settings__account-info">
          <Avatar username={selectedUser} size={40} />
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`/@${selectedUser}`}
            className="Settings__account-name"
          >
            {selectedUser}
          </a>
        </div>
        <span
          role="presentation"
          onClick={() => {
            setSelectedUser('');
            setShowSelectAccount(false);
          }}
          className="iconfont icon-delete Settings__delete-icon"
        />
      </div>
    ) : (
      <SearchUsersAutocomplete
        handleSelect={value => {
          setSelectedUser(value.account);
          setShowSelectAccount(true);
        }}
        placeholder={intl.formatMessage({
          id: 'find_account',
          defaultMessage: 'Find your account',
        })}
        style={{ width: '100%' }}
        notGuest
      />
    );

  return (
    <Modal
      visible={showModal}
      title={intl.formatMessage({ id: 'link_hive_account', defaultMessage: 'Link Hive account' })}
      onOk={handleOkModal}
      onCancel={handleClose}
      okButtonProps={{ disabled: !(isCheck && selectedUser) }}
    >
      <p className="Settings__margin-add">
        {intl.formatMessage({
          id: 'link_hive_account_info',
          defaultMessage:
            'Guests are only allowed to make transfers to their own Hive accounts. This account should be first linked to the guest account.Once you have linked your Hive account, that account will be also registered as the beneficiary of all author and other rewards for guest account',
        })}{' '}
        <b>@{user}</b>
      </p>
      <div className="Settings__margin-add">{addHiveAccount}</div>
      <PolicyConfirmation
        isChecked={isCheck}
        checkboxLabel={intl.formatMessage({
          id: 'legal_notice',
          defaultMessage: 'Legal notice',
        })}
        policyText={
          <span>
            {intl.formatMessage({
              id: 'hive_account_link_rules',
              defaultMessage:
                'I hereby confirm that this Hive account belongs to me and that I have full control of ' +
                'this account, including all the private keys associated with it.',
            })}
          </span>
        }
        onChange={setCheck}
      />
    </Modal>
  );
};

LinkHiveAccountModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  showModal: PropTypes.bool.isRequired,
  hiveBeneficiaryAccount: PropTypes.string,
  user: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

LinkHiveAccountModal.defaultProps = {
  hiveBeneficiaryAccount: '',
};

export default connect(state => ({
  user: getAuthenticatedUserName(state),
}))(injectIntl(LinkHiveAccountModal));
