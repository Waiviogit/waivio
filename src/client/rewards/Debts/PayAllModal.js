import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { round, take } from 'lodash';
import PropTypes from 'prop-types';

import Avatar from '../../components/Avatar';
import USDDisplay from '../../components/Utils/USDDisplay';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import { BANK_ACCOUNT } from '../../../common/constants/waivio';
import routes from '../../../waivioApi/routes';
import { fixedNumber } from '../../../common/helpers/parser';
import { createQuery } from '../../../common/helpers/apiHelpers';
import { getUserCurrencyBalance } from '../../../store/walletStore/walletSelectors';
import api from '../../steemConnectAPI';

const PayAllModal = ({ showModal, renderData, setShowModal, currentUSDPrice, authUserName }) => {
  const [payable, setPayable] = useState(0);
  const [loading, setLoading] = useState(0);
  const [payblesList, setPayblesList] = useState([]);
  const balance = useSelector(state => getUserCurrencyBalance(state, 'WAIV')?.balance);
  const filteredData = take(
    renderData?.filter(item => item.payable && item.payable > 0),
    20,
  );

  useEffect(() => {
    const amount = filteredData.reduce((acc, curr) => {
      if (!curr.payable || curr.payable < 0) return acc;

      return acc + curr.payable;
    }, 0);

    setPayable(amount);
    setPayblesList(filteredData);
  }, []);

  const handlePayAll = () => {
    const jsons = payblesList?.reduce((acc, curr) => {
      const isGuestUser = guestUserRegex.test(curr?.userName);

      const memo = isGuestUser
        ? { id: 'guestCampaignReward', to: curr?.userName }
        : { id: 'campaignReward' };
      const json = {
        contractName: 'tokens',
        contractAction: 'transfer',
        contractPayload: {
          symbol: 'WAIV',
          to: isGuestUser ? BANK_ACCOUNT : curr?.userName,
          memo: JSON.stringify({ ...memo, app: routes.appName }),
          quantity: fixedNumber(parseFloat(curr.payable), 8).toString(),
        },
      };

      return [...acc, json];
    }, []);

    const hiveAuth = Cookie.get('auth');

    if (hiveAuth) {
      setLoading(true);

      api
        .broadcast(
          [
            [
              'custom_json',
              {
                required_auths: [authUserName],
                required_posting_auths: [],
                id: 'ssc-mainnet-hive',
                json: JSON.stringify(jsons),
              },
            ],
          ],
          null,
          'active',
        )
        .then(res => {
          setLoading(false);

          if (!res.error) setShowModal(false);
        });
    } else {
      if (typeof window !== 'undefined')
        window.open(
          `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${authUserName}"]&required_posting_auths=[]&${createQuery(
            {
              id: 'ssc-mainnet-hive',
              json: JSON.stringify(jsons),
            },
          )}`,
          '_blank',
        );

      setShowModal(false);
    }
  };

  const handleCheck = (e, item) => {
    if (e.target.checked) {
      setPayable(payable + item.payable);
      setPayblesList([...payblesList, item]);
    } else {
      const total = payable - item.payable;
      const filteredList = payblesList.filter(paybl => item.userName !== paybl.userName);

      setPayable(total > 0 ? total : 0);
      setPayblesList(filteredList);
    }
  };

  return (
    <Modal
      title={'Do you want to pay all payable?'}
      visible={showModal}
      onOk={handlePayAll}
      okText={'Submit'}
      onCancel={() => setShowModal(false)}
      okButtonProps={{
        disabled: balance < payable || !payable,
        loading,
      }}
    >
      <b>Payable list:</b>
      {filteredData.map(item => (
        <div key={item.userName} className="Debts__transferCard">
          <div className="Debts__transferUser">
            <Checkbox defaultChecked onClick={e => handleCheck(e, item)} />
            <Avatar username={item.userName} size={40} />
            <b>{item.userName}</b>
          </div>
          <span>{item.payable} WAIV</span>
        </div>
      ))}
      <div className="Debts__payableInfo">
        <p>
          <b>Total amount:</b> {round(payable, 8)} WAIV.
        </p>
        <p>
          <b>Your balance:</b> {balance} WAIV.
        </p>
        <p>
          <b>Est. transaction value:</b> <USDDisplay value={payable * currentUSDPrice} />.
        </p>
      </div>
      <p>Click the button below to be redirected to HiveSigner to complete your transaction.</p>
      {balance < payable && <p style={{ color: 'red', textAlign: 'center' }}>Insufficient funds</p>}
    </Modal>
  );
};

PayAllModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  renderData: PropTypes.arrayOf(PropTypes.shape()),
  setShowModal: PropTypes.func.isRequired,
  currentUSDPrice: PropTypes.number.isRequired,
  authUserName: PropTypes.string.isRequired,
};

export default PayAllModal;
