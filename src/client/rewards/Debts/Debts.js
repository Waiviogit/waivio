import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { capitalize, isEmpty, map, round } from 'lodash';
import { useSelector } from 'react-redux';
import { Modal, Tag } from 'antd';
import SortSelector from '../../components/SortSelector/SortSelector';
import { sortDebtObjsData, getCurrentUSDPrice, payablesFilterData } from '../rewardsHelper';
import FilterModal from '../FilterModal';
import { PATH_NAME_PAYABLES } from '../../../common/constants/rewards';
import PaymentList from '../Payment/PaymentList';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';

import './Debts.less';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';

const Debts = ({
  intl,
  debtObjsData,
  componentLocation,
  activeFilters,
  setPayablesFilterValue,
  handleLoadingMore,
  loading,
  payoutToken,
  setVisible,
}) => {
  const [sort, setSort] = useState('amount');
  const [sortedDebtObjsData, setSortedDebtObjsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUSDPrice =
    payoutToken === 'HIVE'
      ? getCurrentUSDPrice()
      : useSelector(state => getTokenRatesInUSD(state, payoutToken));
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

  const createFilterData = () =>
    componentLocation === PATH_NAME_PAYABLES
      ? { payables: payablesFilterData(componentLocation) }
      : { receivables: payablesFilterData(componentLocation) };

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
          {payoutToken === 'HIVE' ? (
            <>
              <span className="Debts__filters-topic ttc">
                {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
              </span>
              {map(activeFilters, filter => (
                <Tag
                  className="ttc"
                  key={filter.filterName}
                  closable
                  onClose={() => setPayablesFilterValue(filter)}
                >
                  {intl.formatMessage(
                    { id: `filter_${filter.filterName}`, defaultMessage: filter.defaultMessage },
                    { value: filter.value },
                  )}
                </Tag>
              ))}
              <span
                className="Debts__filters-selector underline ttl"
                role="presentation"
                onClick={() => setIsModalOpen(true)}
              >
                {intl.formatMessage({ id: 'add_new_proposition', defaultMessage: 'Add' })}
              </span>
            </>
          ) : (
            <FiltersForMobile setVisible={setVisible} />
          )}
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
      <Modal
        className="Debts__filters-modal"
        footer={null}
        title={intl.formatMessage({
          id: 'filter_rewards',
          defaultMessage: 'Filter rewards',
        })}
        closable
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <FilterModal
          intl={intl}
          activePayablesFilters={activeFilters}
          filters={createFilterData()}
          setFilterValue={setPayablesFilterValue}
        />
      </Modal>
    </React.Fragment>
  );
};

Debts.propTypes = {
  intl: PropTypes.shape().isRequired,
  debtObjsData: PropTypes.shape().isRequired,
  componentLocation: PropTypes.string.isRequired,
  payoutToken: PropTypes.string,
  activeFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPayablesFilterValue: PropTypes.func,
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
