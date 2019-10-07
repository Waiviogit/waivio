import { Checkbox } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import './RewardsFiltersPanel.less';

const RewardsFiltersPanel = ({
  sponsors,
  activeFilters,
  activePayableFilters,
  setFilterValue,
  campaignsTypes,
  setPayablesFilterValue,
  intl,
  location,
}) => {
  const filterLayout = (filterName, key, checked) => (
    <div key={`${key}-${filterName}`} className="RewardsFiltersPanel__item-wrap">
      <Checkbox onChange={() => setFilterValue(filterName, key)} checked={checked} />
      <div className="RewardsFiltersPanel__name">{filterName}</div>
    </div>
  );

  const filterPaymentLayout = (obj, checked) => (
    <div key={`${obj.filterName}`} className="RewardsFiltersPanel__item-wrap">
      <Checkbox onChange={() => setPayablesFilterValue(obj)} checked={checked} />
      <div className="RewardsFiltersPanel__name">
        {intl.formatMessage(
          { id: `filter_${obj.filterName}`, defaultMessage: obj.defaultMessage },
          { value: obj.value },
        )}
      </div>
    </div>
  );

  const payablesFilterData = [
    { filterName: 'days', value: 15, defaultMessage: `Over ${15} days` },
    { filterName: 'payable', value: 10, defaultMessage: `Over ${10} SBD` },
  ];

  return (
    <div className="RewardsFiltersPanel">
      <div className="RewardsFiltersPanel__container">
        <div className="RewardsFiltersPanel__title">
          <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
          <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
        </div>
        {location.pathname !== '/rewards/payables' ? (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'rewards_for',
                defaultMessage: `Rewards for`,
              })}:`}
            </div>
            {_.map(campaignsTypes, type =>
              filterLayout(type, 'types', _.includes(activeFilters.types, type)),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'sponsors',
                defaultMessage: `Sponsors`,
              })}:`}
            </div>
            {_.map(sponsors, sponsor =>
              filterLayout(sponsor, 'guideNames', _.includes(activeFilters.guideNames, sponsor)),
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'payables',
                defaultMessage: 'Payables',
              })}:`}
            </div>
            {_.map(payablesFilterData, payable =>
              filterPaymentLayout(
                payable,
                activePayableFilters.some(f => f.filterName === payable.filterName),
              ),
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

RewardsFiltersPanel.propTypes = {
  sponsors: PropTypes.arrayOf(PropTypes.string).isRequired,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  setFilterValue: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  setPayablesFilterValue: PropTypes.func.isRequired,
  activePayableFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

RewardsFiltersPanel.defaultProps = {
  sponsors: [],
  campaignsTypes: [],
  activeFilters: {},
};

export default injectIntl(RewardsFiltersPanel);
