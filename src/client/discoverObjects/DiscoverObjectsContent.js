import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _, { isEmpty, omit } from 'lodash';
import { connect } from 'react-redux';
import { Button, message, Modal, Tag } from 'antd';
import { isNeedFilters, updateActiveFilters } from './helper';
import {
  getActiveFilters,
  getObjectTypeSorting,
  getObjectTypeState,
  getObjectTypeLoading,
  getFilteredObjects,
  getHasMoreRelatedObjects,
  getAvailableFilters,
  getHasMap,
  getAuthenticatedUserName,
  getIsMapModalOpen,
} from '../reducers';
import {
  getObjectTypeByStateFilters,
  clearType,
  setFiltersAndLoad,
  changeSortingAndLoad,
  getObjectTypeMap,
} from '../objectTypes/objectTypeActions';
import { setMapFullscreenMode } from '../components/Maps/mapActions';
import Loading from '../components/Icon/Loading';
import ObjectCardView from '../objectCard/ObjectCardView';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import DiscoverObjectsFilters from './DiscoverFiltersSidebar/FiltersContainer';
import SidenavDiscoverObjects from './SidenavDiscoverObjects';
import SortSelector from '../components/SortSelector/SortSelector';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import Campaign from '../rewards/Campaign/Campaign';
import Proposition from '../rewards/Proposition/Proposition';
import { assignProposition, declineProposition, getCoordinates } from '../user/userActions';
// eslint-disable-next-line import/extensions
import * as apiConfig from '../../waivioApi/config';
import { RADIUS, ZOOM } from '../../common/constants/map';

const modalName = {
  FILTERS: 'filters',
  OBJECTS: 'objects',
};
const SORT_OPTIONS = {
  WEIGHT: 'weight',
  PROXIMITY: 'proximity',
};

@connect(
  (state, props) => ({
    availableFilters: getAvailableFilters(state),
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
  }),
  {
    dispatchClearObjectTypeStore: clearType,
    dispatchGetObjectType: getObjectTypeByStateFilters,
    dispatchSetActiveFilters: setFiltersAndLoad,
    dispatchChangeSorting: changeSortingAndLoad,
    dispatchSetMapFullscreenMode: setMapFullscreenMode,
    assignProposition,
    declineProposition,
    getObjectTypeMap,
    getCoordinates,
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
    getCoordinates: PropTypes.func.isRequired,
    /* passed props */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    typeName: PropTypes.string,
    userName: PropTypes.string.isRequired,
    assignProposition: PropTypes.func.isRequired,
    declineProposition: PropTypes.func.isRequired,
    isFullscreenMode: PropTypes.bool.isRequired,
    getObjectTypeMap: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    searchString: '',
    typeName: '',
    userLocation: {},
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
    };
  }

  componentDidMount() {
    const { dispatchGetObjectType, typeName, match } = this.props;
    if (match.params.typeName !== 'restaurant') dispatchGetObjectType(typeName, { skip: 0 });
    this.getCoordinates().then(() => {
      const { radius, center } = this.state;
      this.setMapArea({ radius, coordinates: center });
    });
  }

  componentWillUnmount() {
    this.props.dispatchClearObjectTypeStore();
  }

  getCoordinates = async () => {
    const coordinates = await this.props.getCoordinates();
    if (!isEmpty(coordinates))
      this.setState({ center: [Number(coordinates.value.lat), Number(coordinates.value.lon)] });
  };

  setMapArea = map => this.props.getObjectTypeMap(map, this.props.isFullscreenMode);

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
    dispatchGetObjectType(theType.name, {
      skip: filteredObjects.length || 0,
    });
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
    const { activeFilters, dispatchSetActiveFilters } = this.props;
    e.preventDefault();
    const updatedFilters = updateActiveFilters(activeFilters, filter, filterValue, false);
    dispatchSetActiveFilters(updatedFilters);
  };

  resetMapFilter = () => {
    const { activeFilters, dispatchSetActiveFilters } = this.props;
    const updatedFilters = omit(activeFilters, ['map']);
    dispatchSetActiveFilters(updatedFilters);
  };

  resetNameSearchFilter = () => this.props.history.push(this.props.history.location.pathname);

  showMap = () => this.props.dispatchSetMapFullscreenMode(true);

  assignPropositionHandler = ({ companyAuthor, companyPermlink, resPermlink, objPermlink }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    this.setState({ loadingAssign: true });
    this.props
      .assignProposition({ companyAuthor, companyPermlink, objPermlink, resPermlink, appName })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully',
            defaultMessage: 'Assigned successfully',
          }),
        );
        this.setState({ loadingAssign: false });
      })
      .catch(() => {
        message.error(
          this.props.intl.formatMessage({
            id: 'cannot_reserve_company',
            defaultMessage: 'You cannot reserve the campaign at the moment',
          }),
        );
        this.setState({ loadingAssign: false });
      });
  };

  discardProposition = ({
    companyAuthor,
    companyPermlink,
    companyId,
    objPermlink,
    unreservationPermlink,
    reservationPermlink,
  }) => {
    this.setState({ loadingAssign: true });
    this.props
      .declineProposition({
        companyAuthor,
        companyPermlink,
        companyId,
        objPermlink,
        unreservationPermlink,
        reservationPermlink,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'discarded_successfully',
            defaultMessage: 'Discarded successfully',
          }),
        );
        this.setState({ loadingAssign: false });
      })
      .catch(e => {
        console.log(e.toString());
        message.error(
          this.props.intl.formatMessage({
            id: 'cannot_reject_campaign',
            defaultMessage: 'You cannot reject the campaign at the moment',
          }),
        );
        this.setState({ loadingAssign: false });
      });
  };

  render() {
    const { isTypeHasFilters, isModalOpen, modalTitle, loadingAssign } = this.state;
    const {
      intl,
      isFetching,
      hasMap,
      availableFilters,
      activeFilters: { map, ...chosenFilters },
      sort,
      filteredObjects,
      hasMoreObjects,
      userName,
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
      <SortSelector sort="weight" onChange={e => console.log('onSortChange', e)}>
        <SortSelector.Item key={SORT_OPTIONS.WEIGHT}>
          {intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
        </SortSelector.Item>
      </SortSelector>
    );
    return (
      <React.Fragment>
        <div className="discover-objects-header__selection-block">
          <MobileNavigation />
          {_.size(SORT_OPTIONS) - Number(!hasMap) > 1 ? sortSelector : null}
        </div>
        {isTypeHasFilters ? (
          <React.Fragment>
            {!isEmpty(availableFilters) ? (
              <div className="discover-objects-header__tags-block">
                <span className="discover-objects-header__topic ttc">
                  {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
                </span>
                {this.getCommonFiltersLayout()}
                {_.map(chosenFilters, (filterValues, filterName) =>
                  filterValues.map(filterValue => (
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
                  className={isEmpty(map) ? 'map-btn' : 'map-btn active'}
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
                  <Campaign
                    proposition={wObj}
                    filterKey={'all'}
                    key={wObj.id}
                    userName={userName}
                  />
                );
              }
              if (wObj.propositions && wObj.propositions.length) {
                return wObj.propositions.map(proposition => (
                  <Proposition
                    guide={proposition.guide}
                    proposition={proposition}
                    wobj={wObj}
                    assignCommentPermlink={wObj.permlink}
                    assignProposition={this.assignPropositionHandler}
                    discardProposition={this.discardProposition}
                    authorizedUserName={userName}
                    loading={loadingAssign}
                    key={`${wObj.author_permlink}`}
                    assigned={proposition.assigned}
                  />
                ));
              }
              return <ObjectCardView key={wObj.id} wObject={wObj} intl={intl} />;
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
              <DiscoverObjectsFilters intl={intl} filters={availableFilters} />
            )}
            {modalTitle === modalName.OBJECTS && <SidenavDiscoverObjects withTitle={false} />}
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default DiscoverObjectsContent;
