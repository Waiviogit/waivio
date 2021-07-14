import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty, map, get, every } from 'lodash';
import { getTextByFilterKey, getSort } from './rewardsHelper';
import { setMapFullscreenMode } from '../../store/mapStore/mapActions';
import RewardBreadcrumb from './RewardsBreadcrumb/RewardBreadcrumb';
import SortSelector from '../components/SortSelector/SortSelector';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import FilterModal from './FilterModal';
import {
  REWARDS_TYPES_MESSAGES,
  CAMPAIGNS_TYPES_MESSAGES,
  PATH_NAME_GUIDE_HISTORY,
  PATH_NAME_MESSAGES,
  PATH_NAME_HISTORY,
} from '../../common/constants/rewards';
import ViewMapButton from '../widgets/ViewMapButton';

const FilteredRewardsList = props => {
  const {
    hasMore,
    loading,
    filterKey,
    tabType,
    userName,
    match,
    propositions,
    intl,
    isSearchAreaFilter,
    resetMapFilter,
    sortEligible,
    sortAll,
    sortReserved,
    sortHistory,
    sortGuideHistory,
    sortMessages,
    handleSortChange,
    loadingCampaigns,
    campaignsLayoutWrapLayout,
    handleLoadMore,
    sponsors,
    messagesCampaigns,
    activeFilters,
    setFilterValue,
    campaignsTypes,
    messages,
    location,
    activeMessagesFilters,
    getHistory,
    activeHistoryFilters,
    setActiveMessagesFilters,
    activeGuideHistoryFilters,
    blacklistUsers,
    pendingUpdate,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const sort = getSort(
    match,
    sortAll,
    sortEligible,
    sortReserved,
    sortHistory,
    sortGuideHistory,
    sortMessages,
  );

  const historyLocation = PATH_NAME_HISTORY;
  const messagesLocation = PATH_NAME_MESSAGES;
  const guideHistoryLocation = PATH_NAME_GUIDE_HISTORY;
  const notifyHistoryLocation = `${historyLocation}/${match.params.campaignId}/${match.params.permlink}/${match.params.username}`;
  const messageHistoryLocation = `${messagesLocation}/${match.params.campaignId}/${match.params.permlink}`;

  const arrLocations = [
    historyLocation,
    messagesLocation,
    guideHistoryLocation,
    notifyHistoryLocation,
    messageHistoryLocation,
  ];
  const IsRequiredObjectWrap =
    !match.params.campaignParent && every(arrLocations, arrLocation => location !== arrLocation);

  const showMap = () => dispatch(setMapFullscreenMode(true));

  const getFiltersForTags = useMemo(() => {
    if (location === historyLocation) {
      return activeHistoryFilters;
    } else if (location === messagesLocation) {
      return activeMessagesFilters;
    } else if (location === guideHistoryLocation) {
      return activeGuideHistoryFilters;
    }

    return activeFilters;
  }, [location, activeHistoryFilters, activeMessagesFilters, activeFilters]);

  const setFilters = useMemo(
    () =>
      location === historyLocation ||
      location === messagesLocation ||
      location === guideHistoryLocation
        ? setActiveMessagesFilters
        : setFilterValue,
    [location, setActiveMessagesFilters, setFilterValue],
  );

  const sortRewards = useMemo(() => {
    if (location === messagesLocation) {
      return [
        {
          key: 'inquiryDate',
          id: 'inquiry_date',
          defaultMessage: 'Inquiry date',
        },
        {
          key: 'latest',
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
    if (location === historyLocation || location === guideHistoryLocation) {
      return [
        {
          key: 'reservation',
          id: 'paymentTable_reservation',
          defaultMessage: 'Reservation',
        },
        {
          key: 'lastAction',
          id: 'action_date',
          defaultMessage: 'Action (date)',
        },
      ];
    }

    if (match.params.filterKey === 'reserved') {
      return [
        {
          key: 'payout',
          id: 'payouts',
          defaultMessage: 'payouts',
        },
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
    }

    return [
      {
        key: 'default',
        id: 'default_sort',
        defaultMessage: 'default',
      },
      {
        key: 'payout',
        id: 'payouts',
        defaultMessage: 'payouts',
      },
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
  }, [location, intl]);

  return !loadingCampaigns && !pendingUpdate ? (
    <React.Fragment>
      <RewardBreadcrumb
        tabText={getTextByFilterKey(intl, filterKey || tabType)}
        filterKey={filterKey || tabType}
        reqObject={
          !IsRequiredObjectWrap && propositions.length && propositions[0]
            ? propositions[0].required_object
            : null
        }
        match={match}
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
            {get(propositions, ['0', 'required_object', 'default_name'])}
          </Link>
        </div>
      ) : (
        <SortSelector sort={sort} onChange={handleSortChange} match={match}>
          {map(sortRewards, item => (
            <SortSelector.Item key={item.key}>
              <FormattedMessage id={item.id} defaultMessage={item.defaultMessage}>
                {msg => msg}
              </FormattedMessage>
            </SortSelector.Item>
          ))}
        </SortSelector>
      )}
      {(!isEmpty(sponsors) ||
        location === historyLocation ||
        location === messagesLocation ||
        location === guideHistoryLocation) && (
        <div className="FilteredRewardsList__filters-tags-block">
          <span className="FilteredRewardsList__filters-topic ttc">
            {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
          </span>
          {map(getFiltersForTags, (filterValues, filterName) => {
            if (filterName !== 'caseStatus') {
              return map(filterValues, filterValue => (
                <Tag
                  key={`${filterName}:${filterValue}`}
                  closable
                  onClose={() => setFilters(filterValue, filterName)}
                >
                  {filterValue}
                </Tag>
              ));
            } else if (!isEmpty(filterValues)) {
              return (
                <Tag
                  key={`${filterName}:${filterValues}`}
                  closable
                  onClose={() => setFilters(filterValues, filterName)}
                >
                  {filterValues}
                </Tag>
              );
            }

            return null;
          })}
          <span
            className="FilteredRewardsList__filters-selector underline ttl"
            role="presentation"
            onClick={() => setIsModalOpen(true)}
          >
            {intl.formatMessage({ id: 'add_new_proposition', defaultMessage: 'Add' })}
          </span>
        </div>
      )}
      {!isEmpty(sponsors) &&
        location !== historyLocation &&
        location !== messagesLocation &&
        location !== guideHistoryLocation && (
          <div className="FilteredRewardsList__filters-toggle-map tc">
            <ViewMapButton handleClick={showMap} />
          </div>
        )}
      <div className="FilteredRewardsList">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {campaignsLayoutWrapLayout(
            IsRequiredObjectWrap,
            filterKey,
            userName,
            match,
            messages,
            getHistory,
            blacklistUsers,
          )}
        </ReduxInfiniteScroll>
      </div>

      <Modal
        className="FilteredRewardsList__filters-modal"
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
          activeFilters={activeFilters}
          activeMessagesFilters={activeMessagesFilters}
          filters={{ types: campaignsTypes, guideNames: sponsors }}
          filtersHistory={{
            rewards: Object.values(REWARDS_TYPES_MESSAGES),
            messagesSponsors: sponsors,
          }}
          filtersMessages={{
            caseStatus: CAMPAIGNS_TYPES_MESSAGES,
            rewards: Object.values(REWARDS_TYPES_MESSAGES),
          }}
          filtersGuideHistory={{
            rewards: Object.values(REWARDS_TYPES_MESSAGES),
            messagesCampaigns,
          }}
          setFilterValue={setFilterValue}
          match={match}
          activeHistoryFilters={activeHistoryFilters}
          activeGuideHistoryFilters={activeGuideHistoryFilters}
          setActiveMessagesFilters={setActiveMessagesFilters}
        />
      </Modal>
    </React.Fragment>
  ) : (
    <Loading />
  );
};

FilteredRewardsList.defaultProps = {
  hasMore: false,
  propositions: [],
  isSearchAreaFilter: false,
  sortReserved: 'proximity',
  sortAll: 'proximity',
  sortEligible: 'proximity',
  loadingCampaigns: false,
  loading: false,
  sponsors: [],
  campaignsTypes: [],
  messages: [],
  setFilterValue: () => {},
  handleLoadMore: () => {},
  resetMapFilter: () => {},
  getHistory: () => {},
  activeFilters: {},
  activeMessagesFilters: {},
  userName: '',
  sortHistory: 'reservation',
  sortGuideHistory: 'reservation',
  sortMessages: 'inquiryDate',
  blacklistUsers: [],
  activeHistoryFilters: {},
  activeGuideHistoryFilters: {},
  setActiveMessagesFilters: () => {},
  tabType: '',
  pendingUpdate: false,
  location: '',
  filterKey: '',
  messagesCampaigns: [],
};

FilteredRewardsList.propTypes = {
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  filterKey: PropTypes.string,
  tabType: PropTypes.string,
  userName: PropTypes.string,
  match: PropTypes.shape().isRequired,
  propositions: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  isSearchAreaFilter: PropTypes.bool,
  resetMapFilter: PropTypes.func,
  sortAll: PropTypes.string,
  sortReserved: PropTypes.string,
  sortEligible: PropTypes.string,
  handleSortChange: PropTypes.func.isRequired,
  loadingCampaigns: PropTypes.bool,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func,
  sponsors: PropTypes.arrayOf(PropTypes.string),
  activeFilters: PropTypes.shape(),
  activeMessagesFilters: PropTypes.shape(),
  setFilterValue: PropTypes.func,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string),
  messages: PropTypes.arrayOf(PropTypes.shape()),
  location: PropTypes.string,
  sortHistory: PropTypes.string,
  sortGuideHistory: PropTypes.string,
  sortMessages: PropTypes.string,
  getHistory: PropTypes.func,
  blacklistUsers: PropTypes.arrayOf(PropTypes.string),
  activeHistoryFilters: PropTypes.shape(),
  activeGuideHistoryFilters: PropTypes.shape(),
  setActiveMessagesFilters: PropTypes.func,
  pendingUpdate: PropTypes.bool,
  messagesCampaigns: PropTypes.arrayOf(PropTypes.string),
};

export default FilteredRewardsList;
