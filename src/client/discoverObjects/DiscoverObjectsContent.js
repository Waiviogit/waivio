import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, size, map } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Tag } from 'antd';
import { isNeedFilters, updateActiveFilters } from './helper';
import {
  getActiveFilters,
  getAvailableFilters,
  getFilteredObjects,
  getHasMoreRelatedObjects,
  getObjectTypeLoading,
  getObjectTypesList,
  getObjectTypeSorting,
} from '../reducers';
import {
  changeSortingAndLoad,
  clearType,
  getObjectType,
  setFiltersAndLoad,
} from '../objectTypes/objectTypeActions';
import { getObjectTypes } from '../objectTypes/objectTypesActions';
import { BROKER } from '../../investarena/constants/platform';
import {tradingObject} from '../../investarena/constants/objectsInvestarena';
import Loading from '../components/Icon/Loading';
import ObjectCardView from '../objectCard/ObjectCardView';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import DiscoverObjectsFilters from './DiscoverFiltersSidebar/FiltersContainer';
import SidenavDiscoverObjects from './SidenavDiscoverObjects';
import SortSelector from '../components/SortSelector/SortSelector';
import InstrumentCardView from '../../investarena/components/InstrumentsPage/Instrument/InstrumentCardView/InstrumentCardView';

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
    typesList: getObjectTypesList(state),
    filteredObjects: getFilteredObjects(state),
    isFetching: getObjectTypeLoading(state),
    hasMoreObjects: getHasMoreRelatedObjects(state),
    searchString: new URLSearchParams(props.history.location.search).get('search'),
  }),
  {
    dispatchClearObjectTypeStore: clearType,
    dispatchGetObjectType: getObjectType,
    dispatchGetObjectTypes: getObjectTypes,
    dispatchSetActiveFilters: setFiltersAndLoad,
    dispatchChangeSorting: changeSortingAndLoad,
  },
)
class DiscoverObjectsContent extends Component {
  static propTypes = {
    /* from connect */
    searchString: PropTypes.string,
    availableFilters: PropTypes.shape().isRequired,
    activeFilters: PropTypes.shape().isRequired,
    typesList: PropTypes.shape().isRequired,
    filteredObjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired,
    hasMoreObjects: PropTypes.bool.isRequired,
    dispatchGetObjectType: PropTypes.func.isRequired,
    dispatchClearObjectTypeStore: PropTypes.func.isRequired,
    dispatchGetObjectTypes: PropTypes.func.isRequired,
    dispatchSetActiveFilters: PropTypes.func.isRequired,
    dispatchChangeSorting: PropTypes.func.isRequired,
    /* passed props */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    typeName: PropTypes.string,
  };

  static defaultProps = {
    searchString: '',
    typeName: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      isTypeHasFilters: isNeedFilters(props.typeName),
      isModalOpen: false,
      modalTitle: '',
    };
  }

  componentDidMount() {
    const { dispatchGetObjectType, dispatchGetObjectTypes, typesList, typeName } = this.props;
    dispatchGetObjectType(this.typeNameReplacer(typeName), { skip: 0 });
    if (isEmpty(typesList)) dispatchGetObjectTypes();
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
    </React.Fragment>
  );

  // eslint-disable-next-line class-methods-use-this
  typeNameReplacer(name) {
    if (name === 'brokers') return 'business';
    return name;
  }

  loadMoreRelatedObjects = () => {
    const { dispatchGetObjectType, filteredObjects, typeName } = this.props;
    dispatchGetObjectType(this.typeNameReplacer(typeName), {
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

  resetNameSearchFilter = () => this.props.history.push(this.props.history.location.pathname);

  render() {
    const { isTypeHasFilters, isModalOpen, modalTitle } = this.state;
    const {
      intl,
      isFetching,
      typeName,
      availableFilters,
      activeFilters: { ...chosenFilters },
      filteredObjects,
      hasMoreObjects,
    } = this.props;


    const sortSelector = (
      <SortSelector sort="weight" onChange={() => {}}>
        <SortSelector.Item key={SORT_OPTIONS.WEIGHT}>
          {intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
        </SortSelector.Item>
      </SortSelector>
    );

    const tradingTypes = ['commodity', 'crypto', 'currencies', 'indices', 'stocks'];


    let objectsRenderer;
    if (tradingTypes.includes(typeName)) {
      const validFilteredObjects = !isEmpty(filteredObjects)
        ? filteredObjects.filter(obj => !isEmpty(obj.chartid))
        : [];
      objectsRenderer = validFilteredObjects.map(wObj => (
        <InstrumentCardView
          key={wObj.id}
          wObject={wObj}
          showSmallVersion
          quoteSecurity={wObj.chartid}
        />
      ));
    } else if (typeName === 'brokers') {
      const brokerNames = Object.values(BROKER);
      objectsRenderer = filteredObjects
        .filter(obj => brokerNames.includes(obj.name.toLowerCase()))
        .map(wObj => <ObjectCardView key={wObj.id} wObject={wObj} showSmallVersion intl={intl} />);
    } else {
      objectsRenderer = filteredObjects.map(wObj => (
        <ObjectCardView key={wObj.id} wObject={wObj} showSmallVersion intl={intl} />
      ));
    }

    return (
      <React.Fragment>
        <div className="discover-objects-header">
          <div className="flex justify-between">
            <span className="discover-objects-header__title">
              <span className="discover-objects-header__topic ttc">
                {intl.formatMessage({ id: 'objects', defaultMessage: 'Objects' })}:&nbsp;
              </span>
              <span className="ttc">{intl.formatMessage({
                id: tradingObject[typeName].intl.id,
                defaultMessage: tradingObject[typeName].intl.defaultMessage,
              })}</span>&nbsp;
              <span className="discover-objects-header__selector">
                (
                <span className="underline" role="presentation" onClick={this.showTypesModal}>
                  {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
                </span>
                )
              </span>
            </span>
            {size(SORT_OPTIONS) > 1 ? sortSelector : null}
          </div>
          <div className="discover-objects-header__tags-block common">
            {this.getCommonFiltersLayout()}
          </div>
          {isTypeHasFilters ? (
            <React.Fragment>
              {!isEmpty(availableFilters) ? (
                <div className="discover-objects-header__tags-block">
                  <span className="discover-objects-header__topic ttc">
                    {intl.formatMessage({ id: 'filters', defaultMessage: 'Filters' })}:&nbsp;
                  </span>
                  {this.getCommonFiltersLayout()}
                  {map(chosenFilters, (filterValues, filterName) =>
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
            </React.Fragment>
          ) : null}
        </div>
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
            {objectsRenderer}
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
