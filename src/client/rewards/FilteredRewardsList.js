import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty, map, get } from 'lodash';
import { getTextByFilterKey, getSort } from './rewardsHelper';
import { setMapFullscreenMode } from '../components/Maps/mapActions';
import RewardBreadcrumb from './RewardsBreadcrumb/RewardBreadcrumb';
import SortSelector from '../components/SortSelector/SortSelector';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import FilterModal from './FilterModal';

const FilteredRewardsList = props => {
  const {
    hasMore,
    loading,
    filterKey,
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
    sortMessages,
    handleSortChange,
    loadingCampaigns,
    campaignsLayoutWrapLayout,
    handleLoadMore,
    sponsors,
    activeFilters,
    setFilterValue,
    campaignsTypes,
    messages,
    location,
    activeMessagesFilters,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const sort = getSort(match, sortAll, sortEligible, sortReserved, sortHistory, sortMessages);

  const showMap = () => dispatch(setMapFullscreenMode(true));
  const IsRequiredObjectWrap =
    !match.params.campaignParent &&
    match.params.filterKey !== 'history' &&
    match.params.filterKey !== 'messages';

  const sortRewards = useMemo(() => {
    if (location === '/rewards/messages') {
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
    if (location === '/rewards/history') {
      return [
        {
          key: 'reservation',
          id: 'paymentTable_reservation',
          defaultMessage: 'Reservation',
        },
        {
          key: 'inquiryDate',
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
  }, [location]);

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
        location={location}
      />
      {isSearchAreaFilter && (
        <Tag className="ttc" key="search-area-filter" closable onClose={resetMapFilter}>
          <FormattedMessage id="search_area" defaultMessage="Search area" />
        </Tag>
      )}
      {!IsRequiredObjectWrap &&
      filterKey !== 'history' &&
      propositions.length &&
      propositions[0] ? (
        <div className="FilteredRewardsList__header">
          <Link
            to={`/object/${propositions[0].requiredObject}`}
            className="FilteredRewardsList__header-text"
          >
            {get(propositions, ['0', 'required_object', 'default_name'])}
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
      {!isEmpty(sponsors) && (
        <div className="FilteredRewardsList__filters-tags-block">
          <span className="FilteredRewardsList__filters-topic ttc">
            {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
          </span>
          {map(activeFilters, (filterValues, filterName) =>
            map(filterValues, filterValue => (
              <Tag
                key={`${filterName}:${filterValue}`}
                closable
                onClose={() => setFilterValue(filterValue, filterName)}
              >
                {filterValue}
              </Tag>
            )),
          )}
          <span
            className="FilteredRewardsList__filters-selector underline ttl"
            role="presentation"
            onClick={() => setIsModalOpen(true)}
          >
            {intl.formatMessage({ id: 'add_new_proposition', defaultMessage: 'Add' })}
          </span>
        </div>
      )}
      {!isEmpty(sponsors) && (
        <div className="FilteredRewardsList__filters-toggle-map tc">
          <Button icon="compass" size="large" className="map-btn" onClick={showMap}>
            {intl.formatMessage({ id: 'view_map', defaultMessage: 'View map' })}
          </Button>
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
          {campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, userName, match, messages)}
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
          setFilterValue={setFilterValue}
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
  activeFilters: {},
  activeMessagesFilters: {},
  userName: '',
  sortHistory: 'reservation',
  sortMessages: 'inquiry date',
};

FilteredRewardsList.propTypes = {
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  filterKey: PropTypes.string.isRequired,
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
  location: PropTypes.string.isRequired,
  sortHistory: PropTypes.string,
  sortMessages: PropTypes.string,
};

export default FilteredRewardsList;
