import Cookie from 'js-cookie';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import PropsType from 'prop-types';
import { round } from 'lodash';
import { useSelector } from 'react-redux';

import {
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../../store/walletStore/walletSelectors';
import formatter from '../../../../common/helpers/steemitFormatter';
import { createQuery } from '../../../../common/helpers/apiHelpers';
import api from '../../../steemConnectAPI';
import PowerSwitcher from '../../PowerUpOrDown/PowerSwitcher/PowerSwitcher';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './EditDelegationModal.less';

const EditDelegationModal = props => {
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const authUserName = useSelector(getAuthenticatedUserName);
  const [loading, setLoading] = useState(false);
  const [undeligateLoading, setUndeligateLoading] = useState(false);
  const isHiveAuth = Cookie.get('auth');

  const handleEditDelegate = () => {
    props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const vests = round(
          values.amount / formatter.vestToSteem(1, totalVestingShares, totalVestingFundSteem),
          6,
        );
        const transferQuery = {
          delegator: authUserName,
          delegatee: props.requiredUser.name,
          vesting_shares: `${vests} VESTS`,
        };

        const json = JSON.stringify({
          contractName: 'tokens',
          contractAction: 'delegate',
          contractPayload: {
            symbol: values.currency === 'WP' ? 'WAIV' : values.currency,
            to: props.requiredUser.name,
            quantity: round(values.amount, 5).toString(),
          },
        });
        const isHp = values.currency === 'HP';

        if (isHiveAuth) {
          const brodc = () =>
            isHp
              ? api.broadcast([['delegate_vesting_shares', { ...transferQuery }]], null, 'active')
              : api.broadcast(
                  [
                    [
                      'custom_json',
                      {
                        required_auths: [authUserName],
                        required_posting_auths: [],
                        id: 'ssc-mainnet-hive',
                        json,
                      },
                    ],
                  ],
                  null,
                  'active',
                );

          setLoading(true);

          brodc().then(() => {
            setLoading(false);
            props.onCancel();
          });
        } else {
          const win = isHp
            ? window &&
              window.open(
                `https://hivesigner.com/sign/delegate_vesting_shares?${createQuery(transferQuery)}`,
                '_blank',
              )
            : window &&
              window.open(
                `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${authUserName}"]&required_posting_auths=[]&${createQuery(
                  {
                    id: 'ssc-mainnet-hive',
                    json,
                  },
                )}`,
                '_blank',
              );

          win.focus();
          props.onCancel();
        }
      }
    });
  };
  const handleUndelegate = e => {
    e.preventDefault();
    props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          delegator: authUserName,
          delegatee: props.requiredUser.name,
          vesting_shares: `0 VESTS`,
        };
        const json = JSON.stringify({
          contractName: 'tokens',
          contractAction: 'undelegate',
          contractPayload: {
            symbol: values.currency === 'WP' ? 'WAIV' : values.currency,
            from: props.requiredUser.name,
            quantity: props.requiredUser.quantity,
          },
        });
        const isHp = values.currency === 'HP';

        if (isHiveAuth) {
          const brodc = () =>
            isHp
              ? api.broadcast([['delegate_vesting_shares', { ...transferQuery }]], null, 'active')
              : api.broadcast(
                  [
                    [
                      'custom_json',
                      {
                        required_auths: [authUserName],
                        required_posting_auths: [],
                        id: 'ssc-mainnet-hive',
                        json,
                      },
                    ],
                  ],
                  null,
                  'active',
                );

          setUndeligateLoading(true);

          brodc().then(() => {
            setUndeligateLoading(false);
            props.onCancel();
          });
        } else {
          const win = isHp
            ? window &&
              window.open(
                `https://hivesigner.com/sign/delegate_vesting_shares?${createQuery(transferQuery)}`,
                '_blank',
              )
            : window &&
              window.open(
                `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${authUserName}"]&required_posting_auths=[]&${createQuery(
                  {
                    id: 'ssc-mainnet-hive',
                    json,
                  },
                )}`,
                '_blank',
              );

          win.focus();
          props.onCancel();
        }
      }
    });
  };

  return (
    <Modal
      className="EditDelegationModal"
      visible={props.visible}
      title={'Edit delegation'}
      onCancel={props.onCancel}
      footer={null}
    >
      <div>
        <h3>Target account:</h3>
        <SelectUserForAutocomplete account={props.requiredUser.name} />
      </div>
      <div>
        <h3>Amount to delegate:</h3>
        <PowerSwitcher
          handleBalanceClick={amount => props.form.setFieldsValue({ amount })}
          getFieldDecorator={props.form.getFieldDecorator}
          getFieldValue={props.form.getFieldValue}
          currencyList={props.stakeList}
          defaultType={props.token}
          selestDisable
          withEst
          powerVote
        />
      </div>
      <div>
        <p>
          Please note that delegations are instant, but it will take {props.token === 'HP' ? 5 : 7}{' '}
          days for the amount to be returned to your account after undelegation.
        </p>
        <p>Click the button below to be redirected to HiveSigner to complete your transaction.</p>
      </div>
      <div className="EditDelegationModal__buttons-wrap">
        <Button onClick={props.onCancel} className="EditDelegationModal__cancel-button">
          Cancel
        </Button>
        <Button
          type={'primary'}
          disabled={!props.form.getFieldValue('amount') || undeligateLoading}
          onClick={() => handleEditDelegate()}
          loading={loading}
        >
          Submit
        </Button>
      </div>
      <div className="EditDelegationModal__footer">
        <p>To remove delegation, click undelegate.</p>
        <Button
          type={'danger'}
          className="EditDelegationModal__undelegate"
          onClick={handleUndelegate}
          loading={undeligateLoading}
          disabled={loading}
        >
          Undelegate
        </Button>
      </div>
    </Modal>
  );
};

EditDelegationModal.propTypes = {
  onCancel: PropsType.func.isRequired,
  visible: PropsType.bool.isRequired,
  stakeList: PropsType.shape().isRequired,
  form: PropsType.shape().isRequired,
  requiredUser: PropsType.shape().isRequired,
  token: PropsType.string.isRequired,
};

export default Form.create()(EditDelegationModal);
