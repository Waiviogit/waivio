import React, { useCallback, useEffect, useMemo } from 'react';
import { Checkbox } from 'antd';
import { map, includes, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  filterSelectedRewardsType,
  filterSponsorsName,
  handleFilters,
  payablesFilterData,
} from '../rewardsHelper';
import {
  REWARDS_TYPES_MESSAGES,
  CAMPAIGNS_TYPES_MESSAGES,
  MESSAGES,
  HISTORY,
  GUIDE_HISTORY,
  PATH_NAME_GUIDE_HISTORY,
  PATH_NAME_MESSAGES,
  PATH_NAME_PAYABLES,
  PATH_NAME_HISTORY,
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
  messagesCampaigns,
  setActiveMessagesFilters,
  activeGuideHistoryFilters,
}) => {
  const campaignDataKey = 'messagesCampaigns';
  const handleChange = useCallback(
    (filterName, key) => {
      if (
        location.pathname !== PATH_NAME_HISTORY &&
        location.pathname !== PATH_NAME_MESSAGES &&
        location.pathname !== PATH_NAME_GUIDE_HISTORY
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

  const guideHistoryNotifyName = new URLSearchParams(location.search).get('campaign');
  const guideHistoryNotifyFilterReleased = new URLSearchParams(location.search).get('released');
  const guideHistoryNotifyFilterReserved = new URLSearchParams(location.search).get('reserved');

  // Filters for widget:
  const filterSponsorNames = filterSponsorsName(location);
  const filterRewardsType = filterSelectedRewardsType(location);

  useEffect(() => {
    if (guideHistoryNotifyName) {
      setActiveMessagesFilters(guideHistoryNotifyName, campaignDataKey);
    }
    if (guideHistoryNotifyFilterReleased) {
      setActiveMessagesFilters(guideHistoryNotifyFilterReleased, 'rewards');
    }
    if (guideHistoryNotifyFilterReserved) {
      setActiveMessagesFilters(guideHistoryNotifyFilterReserved, 'rewards');
    }
    if (!isEmpty(filterSponsorNames)) {
      handleFilters(setFilterValue, filterSponsorNames, 'guideNames');
    }
    if (!isEmpty(filterRewardsType)) {
      handleFilters(setFilterValue, filterRewardsType, 'types');
    }
  }, [location.search]);

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

  const { campaignsTypesMessages, rewardsTypesMessages, sponsorsData, campaignsData } = useMemo(
    () => ({
      campaignsTypesMessages: Object.values(CAMPAIGNS_TYPES_MESSAGES),
      rewardsTypesMessages: Object.values(REWARDS_TYPES_MESSAGES),
      sponsorsData: location.pathname !== PATH_NAME_HISTORY ? sponsors : messagesSponsors,
      campaignsData: messagesCampaigns,
    }),
    [sponsors, messagesSponsors, messagesCampaigns, location.pathname],
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
                {location.pathname === PATH_NAME_PAYABLES
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
        {location.pathname === PATH_NAME_MESSAGES && (
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
        {location.pathname === PATH_NAME_HISTORY && (
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
        {location.pathname === PATH_NAME_GUIDE_HISTORY && (
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
                id: 'mobnav_campaigns',
                defaultMessage: 'Campaigns',
              })}
            </div>
            {map(campaignsData, campaign =>
              filterLayout(
                campaign,
                campaignDataKey,
                includes(activeGuideHistoryFilters.messagesCampaigns, campaign),
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
  messagesCampaigns: PropTypes.arrayOf(PropTypes.string),
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
  messagesCampaigns: [],
  setActiveMessagesFilters: () => {},
  setPayablesFilterValue: () => {},
  activePayableFilters: {},
};

export default injectIntl(RewardsFiltersPanel);
