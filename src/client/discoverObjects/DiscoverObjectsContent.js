import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, omit, size, map } from 'lodash';
import { connect } from 'react-redux';
import { Button, Modal, Tag } from 'antd';
import {
  changeUrl,
  isNeedFilters,
  parseTagsFilters,
  parseUrl,
  updateActiveFilters,
  updateActiveTagsFilters,
} from './helper';
import {
  getObjectTypeByStateFilters,
  clearType,
  setFiltersAndLoad,
  changeSortingAndLoad,
  getObjectTypeMap,
  setActiveFilters,
  setTagsFiltersAndLoad,
  setActiveTagsFilters,
  setObjectSortType,
} from '../../store/objectTypeStore/objectTypeActions';
import { setMapFullscreenMode } from '../../store/mapStore/mapActions';
import Loading from '../components/Icon/Loading';
import ObjectCardView from '../objectCard/ObjectCardView';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import DiscoverObjectsFilters from './DiscoverFiltersSidebar/FiltersContainer';
import SidenavDiscoverObjects from './SidenavDiscoverObjects';
import SortSelector from '../components/SortSelector/SortSelector';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import PropositionNew from '../newRewards/reuseble/Proposition/Proposition';

import { getCoordinates } from '../../store/userStore/userActions';
import { RADIUS, ZOOM } from '../../common/constants/map';
import { getCryptoPriceHistory } from '../../store/appStore/appActions';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import {
  getActiveFilters,
  getActiveFiltersTags,
  getAvailableFilters,
  getFilteredObjects,
  getFiltersTags,
  getHasMap,
  getHasMoreRelatedObjects,
  getObjectTypeLoading,
  getObjectTypeSorting,
  getObjectTypeState,
} from '../../store/objectTypeStore/objectTypeSelectors';
import { getIsMapModalOpen } from '../../store/mapStore/mapSelectors';
import Campaing from '../newRewards/reuseble/Campaing';

const modalName = {
  FILTERS: 'filters',
  OBJECTS: 'objects',
};

export const SORT_OPTIONS = {
  WEIGHT: 'weight',
  PROXIMITY: 'proximity',
};

@connect(
  (state, props) => ({
    availableFilters: getAvailableFilters(state),
    tagsFilters: getFiltersTags(state),
    activeFilters: getActiveFilters(state),
    sort: getObjectTypeSorting(state),
    theType: getObjectTypeState(state),
    hasMap: getHasMap(state),
    filteredObjects: getFilteredObjects(state),
    isFetching: getObjectTypeLoading(state),
    hasMoreObjects: getHasMoreRelatedObjects(state),
    searchString: new URLSearchParams(props.history.location.search).get('search'),
    userName: getAuthenticatedUserName(state),
    isFullscreenMode: getIsMapModalOpen(state),
    activeTagsFilters: getActiveFiltersTags(state),
  }),
  {
    dispatchClearObjectTypeStore: clearType,
    dispatchGetObjectType: getObjectTypeByStateFilters,
    dispatchSetActiveFilters: setFiltersAndLoad,
    dispatchChangeSorting: changeSortingAndLoad,
    dispatchSetMapFullscreenMode: setMapFullscreenMode,
    getObjectTypeMap,
    getCoordinates,
    getCryptoPriceHistoryAction: getCryptoPriceHistory,
    setActiveFilters,
    setActiveTagsFilters,
    setTagsFiltersAndLoad,
    setObjectSortType,
  },
)
class DiscoverObjectsContent extends Component {
  static propTypes = {
    /* from connect */
    searchString: PropTypes.string,
    availableFilters: PropTypes.shape().isRequired,
    activeFilters: PropTypes.shape().isRequired,
    sort: PropTypes.string.isRequired,
    theType: PropTypes.shape().isRequired,
    hasMap: PropTypes.bool.isRequired,
    filteredObjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired,
    hasMoreObjects: PropTypes.bool.isRequired,
    dispatchGetObjectType: PropTypes.func.isRequired,
    dispatchClearObjectTypeStore: PropTypes.func.isRequired,
    dispatchSetActiveFilters: PropTypes.func.isRequired,
    dispatchChangeSorting: PropTypes.func.isRequired,
    dispatchSetMapFullscreenMode: PropTypes.func.isRequired,
    /* passed props */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    typeName: PropTypes.string,
    setObjectSortType: PropTypes.func.isRequired,
    getCryptoPriceHistoryAction: PropTypes.func.isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    setActiveTagsFilters: PropTypes.func.isRequired,
    setTagsFiltersAndLoad: PropTypes.func.isRequired,
    activeTagsFilters: PropTypes.shape({}),
    tagsFilters: PropTypes.arrayOf(PropTypes.shape()),
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    searchString: '',
    typeName: '',
    userLocation: {},
    match: {},
    userName: '',
    tagsFilters: [],
    activeTagsFilters: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isTypeHasFilters: isNeedFilters(props.typeName),
      isModalOpen: false,
      modalTitle: '',
      loadingAssign: false,
      infoboxData: false,
      zoom: ZOOM,
      center: [],
      isInitial: true,
      radius: RADIUS,
      match: {},
    };
  }

  componentDidMount() {
    const { dispatchGetObjectType, typeName, getCryptoPriceHistoryAction, location } = this.props;
    const activeFilters = parseUrl(location.search);
    const activeTagsFilter = parseTagsFilters(location.search);

    const searchFilters = {};

    if (activeFilters.searchString) searchFilters.searchString = activeFilters.searchString;
    if (activeFilters.rating) searchFilters.rating = activeFilters.rating.split(',');
    if (activeFilters.mapX)
      searchFilters.map = {
        zoom: +activeFilters.zoom,
        radius: +activeFilters.radius,
        coordinates: [+activeFilters.mapX, +activeFilters.mapY],
      };
    this.props.setActiveFilters(searchFilters);
    if (searchFilters.map) {
      this.props.setObjectSortType(SORT_OPTIONS.PROXIMITY);
    }
    if (!isEmpty(activeFilters)) this.props.setActiveTagsFilters(activeTagsFilter);
    dispatchGetObjectType(typeName, { skip: 0 });
    getCryptoPriceHistoryAction([HIVE.coinGeckoId, HBD.coinGeckoId]);
  }

  componentWillUnmount() {
    this.props.dispatchClearObjectTypeStore();
  }

  getCommonFiltersLayout = () => (
    <React.Fragment>
      {this.props.searchString && (
        <Tag
          className="filter-highlighted"
          key="search-string-filter"
          closable
          onClose={this.resetNameSearchFilter}
        >
          {this.props.searchString}
        </Tag>
      )}
      {this.props.activeFilters.map ? (
        <Tag
          className="filter-highlighted"
          key="map-search-area-filter"
          closable
          onClose={this.resetMapFilter}
        >
          {this.props.intl.formatMessage({ id: 'search_area', defaultMessage: 'Search area' })}
        </Tag>
      ) : null}
    </React.Fragment>
  );

  loadMoreRelatedObjects = () => {
    const { dispatchGetObjectType, theType, filteredObjects } = this.props;

    dispatchGetObjectType(theType.name, { skip: filteredObjects.length || 0 });
  };

  showFiltersModal = () =>
    this.setState({
      isModalOpen: true,
      modalTitle: modalName.FILTERS,
    });

  showTypesModal = () =>
    this.setState({
      isModalOpen: true,
      modalTitle: modalName.OBJECTS,
    });

  closeModal = () => this.setState({ isModalOpen: false });

  handleChangeSorting = sorting => this.props.dispatchChangeSorting(sorting);

  handleRemoveTag = (filter, filterValue) => e => {
    const {
      activeFilters,
      dispatchSetActiveFilters,
      activeTagsFilters,
      history,
      location,
    } = this.props;

    e.preventDefault();
    if (filter === 'rating') {
      const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, false);

      dispatchSetActiveFilters(updatedFilters);

      changeUrl({ ...activeTagsFilters, ...updatedFilters }, history, location);
    } else {
      const updateTagsFilter = updateActiveTagsFilters(
        activeTagsFilters,
        filterValue,
        filter,
        false,
      );

      this.props.setTagsFiltersAndLoad(updateTagsFilter);
      changeUrl({ ...activeFilters, ...updateTagsFilter }, history, location);
    }
  };

  resetMapFilter = () => {
    const { activeFilters, dispatchSetActiveFilters } = this.props;
    const updatedFilters = omit(activeFilters, ['map']);

    dispatchSetActiveFilters(updatedFilters);
  };

  resetNameSearchFilter = () => {
    const { history, activeFilters, location, dispatchSetActiveFilters } = this.props;
    const updatedFilters = { ...activeFilters };

    delete updatedFilters.searchString;

    dispatchSetActiveFilters(updatedFilters);
    changeUrl(updatedFilters, history, location);
  };

  showMap = () => this.props.dispatchSetMapFullscreenMode(true);

  render() {
    const { isTypeHasFilters, isModalOpen, modalTitle } = this.state;
    const {
      intl,
      isFetching,
      hasMap,
      availableFilters,
      tagsFilters,
      activeFilters: { map: mapFilters },
      sort,
      filteredObjects,
      hasMoreObjects,
      activeTagsFilters,
    } = this.props;
    const sortSelector = hasMap ? (
      <SortSelector sort={sort} onChange={this.handleChangeSorting}>
        <SortSelector.Item key={SORT_OPTIONS.WEIGHT}>
          {intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
        </SortSelector.Item>
        <SortSelector.Item key={SORT_OPTIONS.PROXIMITY}>
          {intl.formatMessage({ id: 'proximity', defaultMessage: 'Proximity' })}
        </SortSelector.Item>
      </SortSelector>
    ) : (
      <SortSelector sort="weight">
        <SortSelector.Item key={SORT_OPTIONS.WEIGHT}>
          {intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
        </SortSelector.Item>
      </SortSelector>
    );

    return (
      <React.Fragment>
        <div className="discover-objects-header__selection-block">
          <MobileNavigation />
          <div className="discover-objects-header__tags-block common">
            {this.getCommonFiltersLayout()}
          </div>
          {size(SORT_OPTIONS) - Number(!hasMap) > 1 ? sortSelector : null}
        </div>
        {isTypeHasFilters ? (
          <React.Fragment>
            {!isEmpty(availableFilters) ? (
              <div className="discover-objects-header__tags-block">
                <span className="discover-objects-header__topic ttc">
                  {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
                </span>
                {this.getCommonFiltersLayout()}
                {map(activeTagsFilters, (filterValues, filterName) =>
                  map(filterValues, filterValue => (
                    <Tag
                      className="ttc"
                      key={`${filterName}:${filterValue}`}
                      closable
                      onClose={this.handleRemoveTag(filterName, filterValue)}
                    >
                      {filterValue}
                    </Tag>
                  )),
                )}
                <span
                  className="discover-objects-header__selector underline ttl"
                  role="presentation"
                  onClick={this.showFiltersModal}
                >
                  {intl.formatMessage({ id: 'add_new_proposition', defaultMessage: 'Add' })}
                </span>
              </div>
            ) : null}
            {hasMap ? (
              <div className="discover-objects-header__toggle-map tc">
                <Button
                  icon="compass"
                  size="large"
                  className={isEmpty(mapFilters) ? 'map-btn' : 'map-btn active'}
                  onClick={this.showMap}
                >
                  {intl.formatMessage({ id: 'view_map', defaultMessage: 'View map' })}
                </Button>
              </div>
            ) : null}
          </React.Fragment>
        ) : null}
        {!isEmpty(filteredObjects) ? (
          <ReduxInfiniteScroll
            className="Feed"
            loadMore={this.loadMoreRelatedObjects}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMoreObjects}
            elementIsScrollable={false}
            threshold={1500}
          >
            {filteredObjects.map(wObj => {
              if (wObj.campaigns) {
                return (
                  <Campaing
                    key={wObj.author_permlink}
                    campain={{ ...wObj.campaigns, object: wObj }}
                  />
                );
              }

              if (wObj.propositions && wObj.propositions.length) {
                // eslint-disable-next-line array-callback-return,consistent-return
                return wObj.propositions.map(proposition => (
                  <PropositionNew
                    key={proposition._id}
                    proposition={{ ...proposition, object: wObj }}
                  />
                ));
              }

              return (
                <ObjectCardView
                  key={wObj.id}
                  wObject={wObj}
                  passedParent={wObj.parent}
                  intl={intl}
                />
              );
            })}
          </ReduxInfiniteScroll>
        ) : (
          (isFetching && <Loading />) || (
            <div className="tc">
              {intl.formatMessage({
                id: 'no_results_found_for_search',
                defaultMessage: 'No results were found for your filters.',
              })}
            </div>
          )
        )}
        {modalTitle ? (
          <Modal
            className="discover-filters-modal"
            footer={null}
            title={intl.formatMessage({
              id: modalTitle,
              defaultMessage: modalTitle,
            })}
            closable
            visible={isModalOpen}
            onCancel={this.closeModal}
          >
            {modalTitle === modalName.FILTERS && (
              <DiscoverObjectsFilters
                intl={intl}
                filters={availableFilters}
                tagsFilters={tagsFilters}
              />
            )}
            {modalTitle === modalName.OBJECTS && <SidenavDiscoverObjects withTitle={false} />}
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default DiscoverObjectsContent;
