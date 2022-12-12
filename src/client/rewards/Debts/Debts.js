import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { capitalize, isEmpty, round } from 'lodash';
import { useSelector } from 'react-redux';

import SortSelector from '../../components/SortSelector/SortSelector';
import { sortDebtObjsData } from '../rewardsHelper';
import PaymentList from '../Payment/PaymentList';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';

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
  const [sort, setSort] = useState('amount');
  const [sortedDebtObjsData, setSortedDebtObjsData] = useState([]);
  const currentUSDPrice = useSelector(state => getTokenRatesInUSD(state, payoutToken));
  const payable = debtObjsData?.payable || debtObjsData?.totalPayable;
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
