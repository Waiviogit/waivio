import React from 'react';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, message, Modal, Select } from 'antd';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import { addCreditsByAdmin } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

const CreditsModal = ({
  setAmount,
  setShowCredits,
  creditsUser,
  amount,
  intl,
  showCredits,
  updateTable,
}) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const disabled = Number(amount) <= 0 || Number(amount) > 10000;

  return (
    <Modal
      destroyOnClose
      wrapClassName={'CreditsModal'}
      onCancel={() => {
        setAmount('');
        setShowCredits(false);
      }}
      okButtonProps={{ disabled }}
      okText={'Confirm'}
      onOk={() => {
        addCreditsByAdmin(authUserName, creditsUser, Number(amount));
        message.success(
          'Credits were successfully added. Changes will be visible after a page reload.',
        );
        setShowCredits(false);
        setAmount('');
        setTimeout(() => updateTable(), 2000);
      }}
      title={intl.formatMessage({
        id: 'credits',
        defaultMessage: 'Credits',
      })}
      visible={showCredits}
    >
      <div className={'mb2'}>
        <b>To :</b>
      </div>

      <SelectUserForAutocomplete account={creditsUser} />
      <br />
      <div className={'mb2'}>
        <b className={'mb1'}>Amount :</b>
      </div>

      <div className={'TokenSelect__inputWrap'}>
        <Input
          autoFocus
          value={amount}
          placeholder={'0'}
          onChange={e => setAmount(e.currentTarget.value)}
          type="number"
          className="TokenSelect__input"
        />
        <Select className={'TokenSelect__selector'} showSearch value={'USD'} disabled />
      </div>
      <p>
        This amount will be added to the user&apos;s sites balance. No transaction will be recorded,
        as it constitutes credits.
      </p>
    </Modal>
  );
};

CreditsModal.propTypes = {
  setAmount: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  showCredits: PropTypes.func.isRequired,
  updateTable: PropTypes.func.isRequired,
  setShowCredits: PropTypes.func.isRequired,
  creditsUser: PropTypes.string.isRequired,
  intl: PropTypes.shape(),
};

export default injectIntl(CreditsModal);
