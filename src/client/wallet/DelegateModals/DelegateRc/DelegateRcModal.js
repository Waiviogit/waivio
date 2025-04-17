import React, { useEffect } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import _ from 'lodash';
import {
  getDelegateRcModalVisible,
  getEditRcInfo,
} from '../../../../store/walletStore/walletSelectors';
import api from '../../../steemConnectAPI';
import {
  resetDelegateRcModal,
  toggleDelegateRcModal,
} from '../../../../store/walletStore/walletActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import { getRcByAccount } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import './DelegateRc.less';

const DelegateRcModal = () => {
  const modalInfo = useSelector(getEditRcInfo);
  const authUserName = useSelector(getAuthenticatedUserName);
  const visible = useSelector(getDelegateRcModalVisible);
  const [amount, setAmount] = React.useState('');
  const [user, setUser] = React.useState(modalInfo?.isEdit ? modalInfo?.info?.to : '');
  const [rcInfo, setRcInfo] = React.useState({ rc_manabar: { current_mana: 0 } });
  const dispatch = useDispatch();

  useEffect(() => {
    getRcByAccount(authUserName).then(r => setRcInfo(r?.rc_accounts[0]));
  }, []);

  const billion = 1000000000;
  const billionRc = rcInfo ? rcInfo?.rc_manabar?.current_mana / billion : 0;

  const delegateRC = (isEdit = false) => {
    const jsonData = JSON.stringify([
      'delegate_rc',
      {
        from: authUserName,
        delegatees: [user],
        max_rc: isEdit ? 0 : Number(amount * billion),
      },
    ]);

    api
      .broadcast(
        [
          [
            'custom_json',
            {
              id: 'rc',
              json: jsonData,
              required_auths: [],
              required_posting_auths: [authUserName],
            },
          ],
        ],
        null,
        'active',
      )
      .then(() => {
        message.success(
          isEdit ? 'Your RC undelegation is successful' : 'Your RC delegation is successful',
        );
      })
      .catch(err => {
        message.error(err.error_description);
      });
  };
  const cancelModal = () => {
    dispatch(resetDelegateRcModal());
    dispatch(toggleDelegateRcModal());
  };

  const setBalance = () => {
    setAmount(billionRc - billionRc * 0.05);
  };

  return (
    <Modal
      footer={null}
      visible={visible}
      title={'Delegate RC'}
      wrapClassName={'DelegateRcModal'}
      onCancel={cancelModal}
    >
      <>
        <p>
          Please enter the name of the account that you wish to delegate a portion of your Resource
          Credits to.
        </p>
        <br />
        <div>
          <div style={{ marginBottom: '5px' }}>
            <b>Target account:</b>
          </div>
          {!_.isEmpty(user) ? (
            <>
              {modalInfo?.isEdit ? (
                <SelectUserForAutocomplete account={user} />
              ) : (
                <SelectUserForAutocomplete resetUser={() => setUser('')} account={user} />
              )}
            </>
          ) : (
            <SearchUsersAutocomplete
              handleSelect={u => setUser(u.account)}
              style={{ width: '100%' }}
              autoFocus
            />
          )}
        </div>
        <br />
        <div>
          <div style={{ marginBottom: '5px' }}>
            {' '}
            <b className={'mb2'}>Amount to delegate:</b>
          </div>
          <div className={'TokenSelect__inputWrap'}>
            <Input
              value={amount}
              placeholder={'0'}
              onChange={e => setAmount(e.currentTarget.value)}
              type="number"
              className="TokenSelect__input"
              suffix={
                <span className={'TokenSelect__max-button'} onClick={setBalance}>
                  <FormattedMessage id="max" defaultMessage="max" />
                </span>
              }
            />
            <Input className={'TokenSelect__selector'} value={'Billion RC'} disabled />
          </div>
        </div>
        <p>
          Your balance:
          <span className="PowerSwitcher__current-currency-balance" onClick={setBalance}>
            {' '}
            <FormattedNumber value={billionRc} />
          </span>
          b RC
        </p>
        <br />

        <div className="EditDelegationModal__buttons-wrap">
          <Button onClick={cancelModal} className="EditDelegationModal__cancel-button">
            Cancel
          </Button>
          <Button
            type={'primary'}
            disabled={
              _.isEmpty(user) ||
              (modalInfo?.isEdit && !amount && _.isEmpty(amount)) ||
              (_.isEmpty(amount) && !amount)
            }
            onClick={() => {
              delegateRC();
              dispatch(resetDelegateRcModal());
              dispatch(toggleDelegateRcModal());
            }}
          >
            Delegate
          </Button>
        </div>
        {modalInfo?.isEdit && (
          <div className="EditDelegationModal__footer">
            <p>To remove delegation, click undelegate.</p>
            <Button
              type={'danger'}
              className="EditDelegationModal__undelegate"
              onClick={() => {
                delegateRC(true);
                dispatch(resetDelegateRcModal());
                dispatch(toggleDelegateRcModal());
              }}
            >
              Undelegate
            </Button>
          </div>
        )}
      </>
    </Modal>
  );
};

export default DelegateRcModal;
