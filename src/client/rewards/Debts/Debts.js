import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { capitalize, isEmpty, round } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';
import { useRouteMatch } from 'react-router';

import SortSelector from '../../components/SortSelector/SortSelector';
import { sortDebtObjsData } from '../rewardsHelper';
import PaymentList from '../Payment/PaymentList';
import {
  getTokenRatesInUSD,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import { fixedNumber } from '../../../common/helpers/parser';
import { createQuery } from '../../../common/helpers/apiHelpers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Action from '../../components/Button/Action';
import { getTokenBalance } from '../../../store/walletStore/walletActions';
import USDDisplay from '../../components/Utils/USDDisplay';
import Avatar from '../../components/Avatar';
import routes from '../../../waivioApi/routes';

import './Debts.less';

const Debts = ({
  intl,
  debtObjsData,
  componentLocation,
  handleLoadingMore,
  loading,
  payoutToken,
  setVisible,
}) => {
  const dispatch = useDispatch();
  const [sort, setSort] = useState('amount');
  const [showModal, setShowModal] = useState(false);
  const [sortedDebtObjsData, setSortedDebtObjsData] = useState([]);
  const currentUSDPrice = useSelector(state => getTokenRatesInUSD(state, payoutToken));
  const balance = useSelector(state => getUserCurrencyBalance(state, 'WAIV')?.balance);
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const payable = debtObjsData?.payable || debtObjsData?.totalPayable;
  const pathPaybles = match.path.includes('payable');

  useEffect(() => {
    dispatch(getTokenBalance('WAIV', authUserName));
  }, []);

  const handleSortChange = sortBy => {
    const sortedData = sortDebtObjsData(debtObjsData.histories, sortBy);

    setSort(sortBy);
    setSortedDebtObjsData(sortedData);
  };

  const sortSelector = !isEmpty(debtObjsData.histories) && (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="amount">
        <FormattedMessage id="amount_sort" defaultMessage="amount">
          {msg => capitalize(msg)}
        </FormattedMessage>
      </SortSelector.Item>
      <SortSelector.Item key="time">
        <FormattedMessage id="time_sort" defaultMessage="time">
          {msg => capitalize(msg)}
        </FormattedMessage>
      </SortSelector.Item>
    </SortSelector>
  );

  const getRenderData = () => {
    if (isEmpty(sortedDebtObjsData)) return debtObjsData.histories;

    return sortedDebtObjsData;
  };

  const renderData = getRenderData();

  const handlePayAll = () => {
    const jsons = renderData?.reduce((acc, curr) => {
      if (!curr.payable) return acc;

      const id = guestUserRegex.test(curr?.userName) ? 'guestCampaignReward' : 'campaignReward';
      const json = {
        contractName: 'tokens',
        contractAction: 'transfer',
        contractPayload: {
          symbol: 'WAIV',
          to: curr?.userName,
          memo: JSON.stringify({ id, app: routes.appName }),
          quantity: fixedNumber(parseFloat(curr.payable), 8).toString(),
        },
      };

      return [...acc, json];
    }, []);

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
  };

  return (
    <React.Fragment>
      <div className="Debts">
        <div className="Debts__information-row">
          <div className="Debts__information-row-total-title">
            {intl.formatMessage({
              id: 'debts_total',
              defaultMessage: 'Total',
            })}
            : {payable ? round(payable, 2) : 0} {payoutToken}{' '}
            {currentUSDPrice && payable ? `($${round(currentUSDPrice * payable, 2)})` : ''}
          </div>
          {pathPaybles && Boolean(payable) && (
            <Action
              disabled={!payable}
              className="Debts__payAll"
              primary
              onClick={() => setShowModal(true)}
            >
              Pay all
            </Action>
          )}
        </div>
        <div className="Debts__sort">{sortSelector}</div>
        <div className="Debts__filters-tags-block">
          <FiltersForMobile setVisible={setVisible} />
        </div>
        <PaymentList
          renderData={renderData}
          debtObjsData={debtObjsData}
          componentLocation={componentLocation}
          handleLoadingMore={handleLoadingMore}
          loading={loading}
          currency={payoutToken}
        />
      </div>
      {showModal && (
        <Modal
          title={'Do you want to pay all payable?'}
          visible={showModal}
          onOk={handlePayAll}
          okText={'Submit'}
          onCancel={() => setShowModal(false)}
          okButtonProps={{
            disabled: balance < payable,
          }}
        >
          <b>Payable list:</b>
          {renderData
            ?.filter(item => item.payable)
            .map(item => (
              <div key={item.userName} className="Debts__transferUser">
                <Avatar username={item.userName} size={40} />
                <b>{item.userName}</b>
              </div>
            ))}
          <div className="Debts__payableInfo">
            <p>
              <b>Total amount:</b> {payable} WAIV.
            </p>
            <p>
              <b>Your balanse:</b> {balance} WAIV.
            </p>
            <p>
              <b>Est. transaction value:</b> <USDDisplay value={payable * currentUSDPrice} />.
            </p>
          </div>
          <p>Click the button below to be redirected to HiveSigner to complete your transaction.</p>
          {balance < payable && (
            <p style={{ color: 'red', textAlign: 'center' }}>Insufficient funds</p>
          )}
        </Modal>
      )}
    </React.Fragment>
  );
};

Debts.propTypes = {
  intl: PropTypes.shape().isRequired,
  debtObjsData: PropTypes.shape().isRequired,
  componentLocation: PropTypes.string.isRequired,
  payoutToken: PropTypes.string,
  handleLoadingMore: PropTypes.func,
  setVisible: PropTypes.func,
  loading: PropTypes.bool,
};

Debts.defaultProps = {
  setPayablesFilterValue: () => {},
  handleLoadingMore: () => {},
  setVisible: () => {},
  loading: false,
  payoutToken: 'HIVE',
};

export default injectIntl(Debts);
