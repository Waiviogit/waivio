import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import PropsType from 'prop-types';
import { useSelector } from 'react-redux';
import { round } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  const [selectUser, setUser] = useState(null);
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
                      symbol: values.currency === 'WP' ? 'WAIV' : values.currency,
                      to: selectUser,
                      quantity: parseFloat(values.amount).toString(),
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
      title={props.intl.formatMessage({ id: 'delegate', defaultMessage: 'Delegate' })}
      onCancel={props.onCancel}
      onOk={handleDelegate}
      okText={props.intl.formatMessage({ id: 'delegate', defaultMessage: 'Delegate' })}
      okButtonProps={{
        disabled: !selectUser || !props.form.getFieldValue('amount'),
      }}
    >
      <p>
        <FormattedMessage
          id="delegate_modal_info_part1"
          defaultMessage="Please enter the name of the account that you wish to delegate a portion of your voting
        power to."
        />
      </p>
      <div>
        <h3>
          <FormattedMessage id="target_account" defaultMessage="Target account" />:
        </h3>
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
        <h3>
          <FormattedMessage id="amount_to_delegate" defaultMessage="Amount to delegate" />:
        </h3>
        <PowerSwitcher
          handleBalanceClick={amount => props.form.setFieldsValue({ amount })}
          getFieldDecorator={props.form.getFieldDecorator}
          getFieldValue={props.form.getFieldValue}
          currencyList={props.stakeList}
          defaultType={props.token}
          withEst
          powerVote
        />
      </div>
      <div>
        <p>
          <FormattedMessage
            id="delegate_modal_info_part2"
            defaultMessage="Please note that delegations are instant, but it will take"
          />{' '}
          {props.token === 'HP' ? 3 : 7}{' '}
          <FormattedMessage
            id="delegate_modal_info_part3"
            defaultMessage="days for the amount to be returned to your account after undelegation."
          />
        </p>
        <p>
          <FormattedMessage
            id="delegate_modal_info_part4"
            defaultMessage="Click the button below to be redirected to HiveSinger to complete your transaction."
          />
        </p>
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
  intl: PropsType.shape().isRequired,
};

export default injectIntl(Form.create()(DelegateModal));
