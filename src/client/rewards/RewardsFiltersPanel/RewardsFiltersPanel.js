import { Checkbox } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { payablesFilterData } from '../rewardsHelper';
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
  activeMessagesFilters,
  messagesSponsors,
  setActiveMessagesFilters,
}) => {
  const handleChange = useCallback(
    (filterName, key) => {
      if (location.pathname !== '/rewards/history' && location.pathname !== '/rewards/messages') {
        setFilterValue(filterName, key);
      } else {
        setActiveMessagesFilters(filterName, key);
      }
    },
    [location.pathname, setFilterValue, setActiveMessagesFilters],
  );

  const filterLayout = useCallback(
    (filterName, key, checked) => (
      <div key={`${key}-${filterName}`} className="RewardsFiltersPanel__item-wrap">
        <Checkbox onChange={() => handleChange(filterName, key)} checked={checked} />
        <div className="RewardsFiltersPanel__name">{filterName}</div>
      </div>
    ),
    [handleChange],
  );

  const filterPaymentLayout = useCallback(
    (obj, checked) => (
      <div key={`${obj.filterName}`} className="RewardsFiltersPanel__item-wrap">
        <Checkbox onChange={() => setPayablesFilterValue(obj)} checked={checked} />
        <div className="RewardsFiltersPanel__name">
          {intl.formatMessage(
            { id: `filter_${obj.filterName}`, defaultMessage: obj.defaultMessage },
            { value: obj.value },
          )}
        </div>
      </div>
    ),
    [setPayablesFilterValue, intl.formatMessage],
  );

  // const statusTypesMessages = [
  //   'pending',
  //   'active',
  //   'inactive',
  //   'expired',
  //   'deleted',
  //   'payed',
  //   'reachedLimit',
  //   'onHold',
  //   'suspended',
  // ];

  const { campaignsTypesMessages, rewardsTypesMessages, sponsorsData } = useMemo(
    () => ({
      campaignsTypesMessages: ['all', 'open', 'close'],
      rewardsTypesMessages: ['assigned', 'unassigned', 'completed', 'rejected', 'expired'],
      sponsorsData: location.pathname !== '/rewards/history' ? sponsors : messagesSponsors,
    }),
    [sponsors, messagesSponsors, location.pathname],
  );

  return (
    <div className="RewardsFiltersPanel">
      <div className="RewardsFiltersPanel__container">
        <div className="RewardsFiltersPanel__title">
          <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
          <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
        </div>
        {_.includes(location.pathname, 'all') ||
        _.includes(location.pathname, 'active') ||
        _.includes(location.pathname, 'reserved') ? (
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
            {_.map(sponsorsData, sponsor =>
              filterLayout(sponsor, 'guideNames', _.includes(activeFilters.guideNames, sponsor)),
            )}
          </React.Fragment>
        ) : (
          !_.includes(location.pathname, 'messages') &&
          !_.includes(location.pathname, 'history') && (
            <React.Fragment>
              <div className="RewardsFiltersPanel__title-text">
                {location.pathname === '/rewards/payables'
                  ? intl.formatMessage({
                      id: 'payables',
                      defaultMessage: 'Payables',
                    })
                  : intl.formatMessage({
                      id: 'sidenav_rewards_receivables',
                      defaultMessage: 'Receivables',
                    })}
              </div>
              {_.map(payablesFilterData(location), payable =>
                filterPaymentLayout(
                  payable,
                  activePayableFilters.some(f => f.filterName === payable.filterName),
                ),
              )}
            </React.Fragment>
          )
        )}
        {location.pathname === '/rewards/messages' || location.pathname === '/rewards/history' ? (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'mobnav_rewards',
                defaultMessage: `Rewards`,
              })}:`}
            </div>
            {_.map(rewardsTypesMessages, type =>
              filterLayout(type, 'rewards', _.includes(activeMessagesFilters.rewards, type)),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {location.pathname === '/rewards/messages'
                ? intl.formatMessage({
                    id: 'case_status',
                    defaultMessage: 'Case status',
                  })
                : intl.formatMessage({
                    id: 'sponsors',
                    defaultMessage: 'Sponsors',
                  })}
            </div>
            {location.pathname === '/rewards/messages'
              ? _.map(campaignsTypesMessages, type =>
                  filterLayout(type, 'caseStatus', activeMessagesFilters.caseStatus === type),
                )
              : _.map(sponsorsData, sponsor =>
                  filterLayout(
                    sponsor,
                    'messagesSponsors',
                    _.includes(activeMessagesFilters.messagesSponsors, sponsor),
                  ),
                )}
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

RewardsFiltersPanel.propTypes = {
  sponsors: PropTypes.arrayOf(PropTypes.string).isRequired,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape().isRequired,
  activeMessagesFilters: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  setFilterValue: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  setPayablesFilterValue: PropTypes.func.isRequired,
  setActiveMessagesFilters: PropTypes.func.isRequired,
  activePayableFilters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  messagesSponsors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RewardsFiltersPanel.defaultProps = {
  sponsors: [],
  campaignsTypes: [],
  activeFilters: {},
  activeMessagesFilters: {},
};

export default injectIntl(RewardsFiltersPanel);
