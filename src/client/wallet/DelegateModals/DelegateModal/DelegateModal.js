import React, { useMemo, useState } from 'react';
import { Form, Modal } from 'antd';
import PropsType from 'prop-types';

import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import PowerSwitcher from '../../PowerUpOrDown/PowerSwitcher/PowerSwitcher';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

const DelegateModal = props => {
  const [selectUser, setUser] = useState();
  const searchComponent = useMemo(() => {
    if (props.requiredUser) return <SelectUserForAutocomplete account={props.requiredUser.name} />;

    return selectUser ? (
      <SelectUserForAutocomplete account={selectUser} resetUser={setUser} />
    ) : (
      <SearchUsersAutocomplete
        allowClear={false}
        handleSelect={user => setUser(user.name)}
        style={{ width: '100%' }}
        autoFocus={false}
      />
    );
  }, [props.requiredUser, selectUser, setUser]);

  return (
    <Modal
      className="DelegateModal"
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
    >
      <p>
        Please enter the name of the account that you wish to delegate a portion of your voting
        power to.
      </p>
      <div>
        <h3>Target account:</h3>
        {searchComponent}
      </div>
      <div>
        <h3>Amount to delegate:</h3>
        <PowerSwitcher
          handleAmountChange={() => {}}
          handleBalanceClick={() => {}}
          getFieldDecorator={props.form.getFieldDecorator}
          currencyList={props.stakeList}
          onAmoundValidate={() => {}}
          defaultType={props.token}
          defaultAmount={props.requiredUser ? props.requiredUser.quantity : 0}
          withEst
        />
      </div>
      <div>
        <p>
          Please note that delegations are instant, but it will take 7 days for the amount to be
          returned to your account after undelegation.
        </p>
        <p>Click the button below to be redirected to HiveSinger to complete your transaction.</p>
      </div>
    </Modal>
  );
};

DelegateModal.propTypes = {
  title: PropsType.string.isRequired,
  onCancel: PropsType.func.isRequired,
  visible: PropsType.bool.isRequired,
  stakeList: PropsType.shape().isRequired,
};

export default Form.create()(DelegateModal);
