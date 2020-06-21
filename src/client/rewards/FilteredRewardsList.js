import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty, map, get } from 'lodash';
import { getTextByFilterKey } from './rewardsHelper';
import { setMapFullscreenMode } from '../components/Maps/mapActions';
import RewardBreadcrumb from './RewardsBreadcrumb/RewardBreadcrumb';
import SortSelector from '../components/SortSelector/SortSelector';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import FilterModal from './FilterModal';

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
    sponsors,
    activeFilters,
    setFilterValue,
    campaignsTypes,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const showMap = () => dispatch(setMapFullscreenMode(true));

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
            {get(propositions, ['0', 'required_object', 'default_name'])}
          </Link>
        </div>
      ) : (
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
          {campaignsLayoutWrapLayout(IsRequiredObjectWrap, filterKey, userName, match)}
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
  sort: 'proximity',
  loadingCampaigns: false,
  loading: false,
  sponsors: [],
  campaignsTypes: [],
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
  sponsors: PropTypes.arrayOf(PropTypes.string),
  activeFilters: PropTypes.shape().isRequired,
  setFilterValue: PropTypes.func.isRequired,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string),
};

export default FilteredRewardsList;
