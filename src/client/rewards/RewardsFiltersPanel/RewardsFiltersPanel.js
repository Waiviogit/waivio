import { Checkbox } from 'antd';
import { map, includes } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { payablesFilterData } from '../rewardsHelper';
import {
  REWARDS_TYPES_MESSAGES,
  CAMPAIGNS_TYPES_MESSAGES,
  MESSAGES,
  HISTORY,
  GUIDE_HISTORY,
} from '../../../common/constants/rewards';
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
  activeHistoryFilters,
  messagesSponsors,
  setActiveMessagesFilters,
  activeGuideHistoryFilters,
}) => {
  const handleChange = useCallback(
    (filterName, key) => {
      if (
        location.pathname !== '/rewards/history' &&
        location.pathname !== '/rewards/messages' &&
        location.pathname !== '/rewards/guideHistory'
      ) {
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

  const { campaignsTypesMessages, rewardsTypesMessages, sponsorsData } = useMemo(
    () => ({
      campaignsTypesMessages: Object.values(CAMPAIGNS_TYPES_MESSAGES),
      rewardsTypesMessages: Object.values(REWARDS_TYPES_MESSAGES),
      sponsorsData:
        location.pathname !== '/rewards/history' && location.pathname !== '/rewards/guideHistory'
          ? sponsors
          : messagesSponsors,
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
        {includes(location.pathname, 'all') ||
        includes(location.pathname, 'active') ||
        includes(location.pathname, 'reserved') ? (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'rewards_for',
                defaultMessage: `Rewards for`,
              })}:`}
            </div>
            {map(campaignsTypes, type =>
              filterLayout(type, 'types', includes(activeFilters.types, type)),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'sponsors',
                defaultMessage: `Sponsors`,
              })}:`}
            </div>
            {map(sponsorsData, sponsor =>
              filterLayout(sponsor, 'guideNames', includes(activeFilters.guideNames, sponsor)),
            )}
          </React.Fragment>
        ) : (
          !includes(location.pathname, MESSAGES) &&
          !includes(location.pathname, HISTORY) &&
          !includes(location.pathname, GUIDE_HISTORY) && (
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
              {map(payablesFilterData(location), payable =>
                filterPaymentLayout(
                  payable,
                  activePayableFilters.some(f => f.filterName === payable.filterName),
                ),
              )}
            </React.Fragment>
          )
        )}
        {location.pathname === '/rewards/messages' && (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'case_status',
                defaultMessage: 'Case status',
              })}:`}
            </div>
            {map(campaignsTypesMessages, type =>
              filterLayout(type, 'caseStatus', activeMessagesFilters.caseStatus === type),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'mobnav_rewards',
                defaultMessage: `Rewards`,
              })}:`}
            </div>
            {map(rewardsTypesMessages, type =>
              filterLayout(type, 'rewards', includes(activeMessagesFilters.rewards, type)),
            )}
          </React.Fragment>
        )}
        {location.pathname === '/rewards/history' && (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'mobnav_rewards',
                defaultMessage: `Rewards`,
              })}:`}
            </div>
            {map(rewardsTypesMessages, type =>
              filterLayout(type, 'rewards', includes(activeHistoryFilters.rewards, type)),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {intl.formatMessage({
                id: 'sponsors',
                defaultMessage: 'Sponsors',
              })}
            </div>
            {map(sponsorsData, sponsor =>
              filterLayout(
                sponsor,
                'messagesSponsors',
                includes(activeHistoryFilters.messagesSponsors, sponsor),
              ),
            )}
          </React.Fragment>
        )}
        {location.pathname === '/rewards/guideHistory' && (
          <React.Fragment>
            <div className="RewardsFiltersPanel__title-text">
              {`${intl.formatMessage({
                id: 'mobnav_rewards',
                defaultMessage: `Rewards`,
              })}:`}
            </div>
            {map(rewardsTypesMessages, type =>
              filterLayout(type, 'rewards', includes(activeGuideHistoryFilters.rewards, type)),
            )}
            <div className="RewardsFiltersPanel__title-text">
              {intl.formatMessage({
                id: 'sponsors',
                defaultMessage: 'Sponsors',
              })}
            </div>
            {map(sponsorsData, sponsor =>
              filterLayout(
                sponsor,
                'messagesSponsors',
                includes(activeGuideHistoryFilters.messagesSponsors, sponsor),
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
  activeMessagesFilters: PropTypes.shape(),
  activeHistoryFilters: PropTypes.shape(),
  activeGuideHistoryFilters: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  setFilterValue: PropTypes.func.isRequired,
  location: PropTypes.shape(),
  setPayablesFilterValue: PropTypes.func,
  setActiveMessagesFilters: PropTypes.func,
  activePayableFilters: PropTypes.arrayOf(PropTypes.shape()),
  messagesSponsors: PropTypes.arrayOf(PropTypes.string),
};

RewardsFiltersPanel.defaultProps = {
  sponsors: [],
  campaignsTypes: [],
  activeFilters: {},
  activeMessagesFilters: {},
  activeHistoryFilters: {},
  activeGuideHistoryFilters: {},
  location: {},
  messagesSponsors: [],
  setActiveMessagesFilters: () => {},
  setPayablesFilterValue: () => {},
  activePayableFilters: {},
};

export default injectIntl(RewardsFiltersPanel);
