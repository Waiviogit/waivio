import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import {
  getObjectTypesList,
  getObjectTypeState,
  getObjectTypeLoading,
  getFilteredObjects,
  getHasMoreRelatedObjects,
} from '../reducers';
import { getObjectType, getObjectTypeMore } from '../objectTypes/objectTypeActions';
import { getObjectTypes } from '../objectTypes/objectTypesActions';
import Loading from '../components/Icon/Loading';
import ObjectCardView from '../objectCard/ObjectCardView';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';

@connect(
  state => ({
    typesList: getObjectTypesList(state),
    theType: getObjectTypeState(state),
    filteredObjects: getFilteredObjects(state),
    isFetching: getObjectTypeLoading(state),
    hasMoreObjects: getHasMoreRelatedObjects(state),
  }),
  {
    dispatchGetObjectType: getObjectType,
    dispatchGetObjectTypeMore: getObjectTypeMore,
    dispatchGetObjectTypes: getObjectTypes,
  },
)
class DiscoverObjectsContent extends Component {
  static propTypes = {
    /* from connect */
    typesList: PropTypes.shape().isRequired,
    theType: PropTypes.shape().isRequired,
    filteredObjects: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool.isRequired,
    hasMoreObjects: PropTypes.bool.isRequired,
    dispatchGetObjectType: PropTypes.func.isRequired,
    dispatchGetObjectTypeMore: PropTypes.func.isRequired,
    dispatchGetObjectTypes: PropTypes.func.isRequired,
    /* passed props */
    intl: PropTypes.shape().isRequired,
    typeName: PropTypes.string,
  };

  static defaultProps = {
    typeName: '',
  };

  componentDidMount() {
    const { dispatchGetObjectType, dispatchGetObjectTypes, typeName, typesList } = this.props;
    dispatchGetObjectType(typeName, {});
    if (isEmpty(typesList)) dispatchGetObjectTypes();
  }

  loadMoreRelatedObjects = () => {
    const { dispatchGetObjectTypeMore, theType, filteredObjects } = this.props;
    dispatchGetObjectTypeMore(theType.name, {
      skip: filteredObjects.length || 0,
    });
  };

  render() {
    const { intl, isFetching, typeName, filteredObjects, hasMoreObjects } = this.props;
    return (
      <React.Fragment>
        <div className="discover-objects__title f4 fw5">
          <span className="ttc">
            {intl.formatMessage({ id: 'objects', defaultMessage: 'Objects' })}:&nbsp;
          </span>
          <span className="ttc">{typeName}</span>
        </div>
        {filteredObjects.length ? (
          <ReduxInfiniteScroll
            className="Feed"
            loadMore={this.loadMoreRelatedObjects}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMoreObjects}
            elementIsScrollable={false}
            threshold={1500}
          >
            {filteredObjects.map(wObj => (
              <ObjectCardView key={wObj.id} wObject={wObj} showSmallVersion intl={intl} />
            ))}
          </ReduxInfiniteScroll>
        ) : (
          <Loading />
        )}
      </React.Fragment>
    );
  }
}

export default DiscoverObjectsContent;
