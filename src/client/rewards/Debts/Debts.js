import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, map, round, get } from 'lodash';
import { Modal, Tag } from 'antd';
import SortSelector from '../../components/SortSelector/SortSelector';
import { sortDebtObjsData, getCurrentUSDPrice, payablesFilterData } from '../rewardsHelper';
import FilterModal from '../FilterModal';
import { PATH_NAME_PAYABLES } from '../../../common/constants/rewards';
import PaymentList from '../Payment/PaymentList';

import './Debts.less';

const Debts = ({
  intl,
  debtObjsData,
  componentLocation,
  activeFilters,
  setPayablesFilterValue,
  handleLoadingMore,
  loading,
}) => {
  const [sort, setSort] = useState('amount');
  const [sortedDebtObjsData, setSortedDebtObjsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const currentUSDPrice = getCurrentUSDPrice();

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
            : {get(debtObjsData, 'payable') && round(get(debtObjsData, 'payable'), 2)}
            {' HIVE '}
            {currentUSDPrice && debtObjsData.payable
              ? `($${round(currentUSDPrice * debtObjsData.payable, 2)})`
              : ''}
          </div>
        </div>
        <div className="Debts__sort">{sortSelector}</div>
        <div className="Debts__filters-tags-block">
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
        </div>
        <PaymentList
          renderData={renderData}
          debtObjsData={debtObjsData}
          componentLocation={componentLocation}
          handleLoadingMore={handleLoadingMore}
          loading={loading}
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
  activeFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPayablesFilterValue: PropTypes.func,
  handleLoadingMore: PropTypes.func,
  loading: PropTypes.bool,
};

Debts.defaultProps = {
  setPayablesFilterValue: () => {},
  handleLoadingMore: () => {},
  loading: false,
};

export default injectIntl(Debts);
