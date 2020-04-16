import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, map } from 'lodash';
import PaymentCard from '../PaymentCard/PaymentCard';
import SortSelector from '../../components/SortSelector/SortSelector';
import { sortDebtObjsData } from '../rewardsHelper';
import './Debts.less';

const Debts = ({ intl, currentSteemPrice, debtObjsData, componentLocation }) => {
  const [sort, setSort] = useState('amount');
  const [sortedDebtObjsData, setSortedDebtObjsData] = useState([]);

  const handleSortChange = sortBy => {
    const sortedData = sortDebtObjsData(debtObjsData.histories, sortBy);
    setSort(sortBy);
    setSortedDebtObjsData(sortedData);
  };

  const sortSelector = !isEmpty(debtObjsData.histories) && (
    <SortSelector sort={sort} onChange={handleSortChange}>
      <SortSelector.Item key="amount">
        <FormattedMessage id="amount_sort" defaultMessage="amount">
          {msg => msg}
        </FormattedMessage>
      </SortSelector.Item>
      <SortSelector.Item key="time">
        <FormattedMessage id="time_sort" defaultMessage="time">
          {msg => msg}
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
    <div className="Debts">
      <div className="Debts__information-row">
        <div className="Debts__information-row-total-title">
          {intl.formatMessage({
            id: 'debts_total',
            defaultMessage: 'Total',
          })}
          : {debtObjsData && debtObjsData.payable && debtObjsData.payable.toFixed(2)}
          {' HIVE '}
          {currentSteemPrice && debtObjsData.payable
            ? `($${(currentSteemPrice * debtObjsData.payable).toFixed(2)})`
            : ''}
        </div>
      </div>
      <div className="Debts__sort">{sortSelector}</div>
      {map(renderData, debtObjData => {
        const name =
          componentLocation === '/rewards/payables' ? debtObjData.userName : debtObjData.guideName;
        return (
          <PaymentCard
            key={name}
            name={name}
            payable={debtObjData.payable}
            alias={debtObjData.alias}
            path={`${componentLocation}/@${name}`}
          />
        );
      })}
    </div>
  );
};

Debts.propTypes = {
  intl: PropTypes.shape().isRequired,
  debtObjsData: PropTypes.shape().isRequired,
  currentSteemPrice: PropTypes.number.isRequired,
  componentLocation: PropTypes.string.isRequired,
};

Debts.defaultProps = {
  filterData: [],
};

export default injectIntl(Debts);
