import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import PropsType from 'prop-types';
import { useSelector } from 'react-redux';
import { round } from 'lodash';

import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import PowerSwitcher from '../../PowerUpOrDown/PowerSwitcher/PowerSwitcher';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import formatter from '../../../../common/helpers/steemitFormatter';
import { createQuery } from '../../../../common/helpers/apiHelpers';
import {
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../../store/walletStore/walletSelectors';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './DelegateModal.less';

const DelegateModal = props => {
  const [selectUser, setUser] = useState();
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const authUserName = useSelector(getAuthenticatedUserName);

  const handleDelegate = () => {
    props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const vests = round(
          values.amount / formatter.vestToSteem(1, totalVestingShares, totalVestingFundSteem),
          6,
        );
        const transferQuery = {
          delegator: authUserName,
          delegatee: selectUser,
          vesting_shares: `${vests} VESTS`,
        };

        const win = ['HP'].includes(values.currency)
          ? window.open(
              `https://hivesigner.com/sign/delegate_vesting_shares?${createQuery(transferQuery)}`,
              '_blank',
            )
          : window.open(
              `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${authUserName}"]&required_posting_auths=[]&${createQuery(
                {
                  id: 'ssc-mainnet-hive',
                  json: JSON.stringify({
                    contractName: 'tokens',
                    contractAction: 'delegate',
                    contractPayload: {
                      symbol: values.currency,
                      to: selectUser,
                      quantity: round(parseFloat(values.amount), 5).toString(),
                    },
                  }),
                },
              )}`,
              '_blank',
            );

        win.focus();
        props.onCancel();
      }
    });
  };

  return (
    <Modal
      className="DelegateModal"
      visible={props.visible}
      title={'Delegate'}
      onCancel={props.onCancel}
      onOk={handleDelegate}
      okText={'Delegate'}
      okButtonProps={{
        disabled: !selectUser && !props.form.getFieldValue('amount'),
      }}
    >
      <p>
        Please enter the name of the account that you wish to delegate a portion of your voting
        power to.
      </p>
      <div>
        <h3>Target account:</h3>
        {selectUser ? (
          <SelectUserForAutocomplete account={selectUser} resetUser={setUser} />
        ) : (
          <SearchUsersAutocomplete
            allowClear={false}
            handleSelect={user => setUser(user.account)}
            style={{ width: '100%' }}
            autoFocus={false}
          />
        )}
      </div>
      <div>
        <h3>Amount to delegate:</h3>
        <PowerSwitcher
          handleBalanceClick={amount => props.form.setFieldsValue({ amount })}
          getFieldDecorator={props.form.getFieldDecorator}
          getFieldValue={props.form.getFieldValue}
          currencyList={props.stakeList}
          defaultType={props.token}
          withEst
        />
      </div>
      <div>
        <p>
          Please note that delegations are instant, but it will take {props.token === 'HP' ? 5 : 7}{' '}
          days for the amount to be returned to your account after undelegation.
        </p>
        <p>Click the button below to be redirected to HiveSinger to complete your transaction.</p>
      </div>
    </Modal>
  );
};

DelegateModal.propTypes = {
  onCancel: PropsType.func.isRequired,
  visible: PropsType.bool.isRequired,
  token: PropsType.string.isRequired,
  stakeList: PropsType.shape().isRequired,
  form: PropsType.shape().isRequired,
};

export default Form.create()(DelegateModal);
