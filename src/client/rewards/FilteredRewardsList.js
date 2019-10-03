import React from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { getTextByFilterKey } from './rewardsHelper';
import RewardBreadcrumb from './RewardsBreadcrumb/RewardBreadcrumb';
import SortSelector from '../components/SortSelector/SortSelector';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';

const FilteredRewardsList = props => {
  const {
    hasMore,
    IsRequiredObjectWrap,
    loading,
    filterKey,
    userName,
    match,
    propositions,
    intl,
    isSearchAreaFilter,
    resetMapFilter,
    sort,
    handleSortChange,
    loadingCampaigns,
    campaignsLayoutWrapLayout,
    handleLoadMore,
  } = props;

  return !loadingCampaigns ? (
    <React.Fragment>
      <RewardBreadcrumb
        tabText={getTextByFilterKey(intl, filterKey)}
        filterKey={filterKey}
        reqObject={
          !IsRequiredObjectWrap && propositions && propositions[0]
            ? propositions[0].required_object
            : null
        }
      />
      {isSearchAreaFilter && (
        <Tag className="ttc" key="search-area-filter" closable onClose={resetMapFilter}>
          <FormattedMessage id="search_area" defaultMessage="Search area" />
        </Tag>
      )}
      <SortSelector sort={sort} onChange={handleSortChange}>
        <SortSelector.Item key="reward">
          <FormattedMessage id="amount_sort" defaultMessage="amount">
            {msg => msg}
          </FormattedMessage>
        </SortSelector.Item>
        <SortSelector.Item key="date">
          <FormattedMessage id="expiry_sort" defaultMessage="expiry">
            {msg => msg}
          </FormattedMessage>
        </SortSelector.Item>
        <SortSelector.Item key="proximity">
          <FormattedMessage id="proximity_sort" defaultMessage="proximity">
            {msg => msg}
          </FormattedMessage>
        </SortSelector.Item>
      </SortSelector>
      <ReduxInfiniteScroll
        elementIsScrollable={false}
        hasMore={hasMore}
        loadMore={handleLoadMore}
        loadingMore={loading}
        loader={<Loading />}
      >
        {campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, userName, match)}
      </ReduxInfiniteScroll>
    </React.Fragment>
  ) : (
    <Loading />
  );
};

FilteredRewardsList.defaultProps = {
  hasMore: false,
  propositions: [],
  isSearchAreaFilter: false,
  sort: 'reward',
  loadingCampaigns: false,
  loading: false,
};

FilteredRewardsList.propTypes = {
  hasMore: PropTypes.bool,
  IsRequiredObjectWrap: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  filterKey: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  propositions: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  isSearchAreaFilter: PropTypes.bool,
  resetMapFilter: PropTypes.func.isRequired,
  sort: PropTypes.string,
  handleSortChange: PropTypes.func.isRequired,
  loadingCampaigns: PropTypes.bool,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
};

export default FilteredRewardsList;
