import React from 'react';
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
import PowerSwitcher from '../../PowerUpOrDown/PowerSwitcher/PowerSwitcher';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './EditDelegationModal.less';

const EditDelegationModal = props => {
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const authUserName = useSelector(getAuthenticatedUserName);

  const handleEditDelegate = (undelegate = false) => {
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
                      symbol: values.currency === 'WP' ? 'WAIV' : values.currency,
                      to: props.requiredUser.name,
                      quantity: undelegate ? 0 : round(parseFloat(values.amount), 5).toString(),
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
  const handleUndelegate = e => {
    e.preventDefault();
    handleEditDelegate(true);
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
          defaultAmount={props.requiredUser.quantity}
          withEst
          powerVote
        />
      </div>
      <div>
        <p>
          Please note that delegations are instant, but it will take {props.token === 'HP' ? 5 : 7}{' '}
          days for the amount to be returned to your account after undelegation.
        </p>
        <p>Click the button below to be redirected to HiveSinger to complete your transaction.</p>
      </div>
      <div className="EditDelegationModal__buttons-wrap">
        <Button onClick={props.onCancel} className="EditDelegationModal__cancel-button">
          Cancel
        </Button>
        <Button
          type={'primary'}
          disabled={!props.form.getFieldValue('amount')}
          onClick={handleEditDelegate}
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
