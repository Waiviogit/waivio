import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
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

  const sortRewards = useMemo(() => {
    if (filterKey === 'messages') {
      return [
        {
          key: 'inquiry',
          id: 'inquiry_date',
          defaultMessage: 'Inquiry date',
        },
        {
          key: 'date',
          id: 'latest',
          defaultMessage: 'Latest',
        },
        {
          key: 'reservation',
          id: 'paymentTable_reservation',
          defaultMessage: 'Reservation',
        },
      ];
    }
    if (filterKey === 'history') {
      return [
        {
          key: 'reservation',
          id: 'paymentTable_reservation',
          defaultMessage: 'Reservation',
        },
        {
          key: 'date',
          id: 'action_date',
          defaultMessage: 'Action (date)',
        },
      ];
    }
    return [
      {
        key: 'reward',
        id: 'amount_sort',
        defaultMessage: 'amount',
      },
      {
        key: 'date',
        id: 'expiry_sort',
        defaultMessage: 'expiry',
      },
      {
        key: 'proximity',
        id: 'proximity_sort',
        defaultMessage: 'proximity',
      },
    ];
  }, [filterKey]);

  return !loadingCampaigns ? (
    <React.Fragment>
      <RewardBreadcrumb
        tabText={getTextByFilterKey(intl, filterKey)}
        filterKey={filterKey}
        reqObject={
          !IsRequiredObjectWrap && propositions.length && propositions[0]
            ? propositions[0].required_object
            : null
        }
      />
      {isSearchAreaFilter && (
        <Tag className="ttc" key="search-area-filter" closable onClose={resetMapFilter}>
          <FormattedMessage id="search_area" defaultMessage="Search area" />
        </Tag>
      )}
      {!IsRequiredObjectWrap && propositions.length && propositions[0] ? (
        <div className="FilteredRewardsList__header">
          <Link
            to={`/object/${propositions[0].requiredObject}`}
            className="FilteredRewardsList__header-text"
          >
            {propositions[0].required_object.default_name}
          </Link>
        </div>
      ) : (
        <SortSelector sort={sort} onChange={handleSortChange}>
          {map(sortRewards, item => (
            <SortSelector.Item key={item.key}>
              <FormattedMessage id={item.id} defaultMessage={item.defaultMessage}>
                {msg => msg}
              </FormattedMessage>
            </SortSelector.Item>
          ))}
        </SortSelector>
      )}
      <div className="FilteredRewardsList">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, userName, match)}
        </ReduxInfiniteScroll>
      </div>
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
