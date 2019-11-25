import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import DiscoverUser from './DiscoverUser';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { getTopExperts as getTopExpertsApi } from '../user/usersActions';
import {
  getTopExperts,
  getTopExpertsLoading,
  getTopExpertsHasMore,
  getObjectTypesList,
} from '../reducers';
import Loading from '../components/Icon/Loading';
import { getObjectTypes } from '../objectTypes/objectTypesActions';

const displayLimit = 20;

@connect(
  state => ({
    topExperts: getTopExperts(state),
    topExpertsLoading: getTopExpertsLoading(state),
    hasMoreExperts: getTopExpertsHasMore(state),
    typesList: getObjectTypesList(state),
  }),
  {
    getTopExperts: getTopExpertsApi,
    getObjectTypes,
  },
)
class DiscoverContent extends React.Component {
  static propTypes = {
    topExperts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        json_metadata: PropTypes.string,
      }),
    ).isRequired,
    getTopExperts: PropTypes.func.isRequired,
    topExpertsLoading: PropTypes.bool.isRequired,
    hasMoreExperts: PropTypes.bool.isRequired,
    typesList: PropTypes.shape().isRequired,
    getObjectTypes: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { typesList } = this.props;
    if (isEmpty(typesList)) this.props.getObjectTypes();
  }

  handleLoadMore = () => {
    if (!this.props.topExpertsLoading) {
      this.props.getTopExperts(displayLimit, this.props.topExperts.length);
    }
  };

  render() {
    const { topExperts, topExpertsLoading, hasMoreExperts } = this.props;
    return (
      <div>
        <ReduxInfiniteScroll
          hasMore={hasMoreExperts}
          loadMore={this.handleLoadMore}
          elementIsScrollable={false}
          loadingMore={topExpertsLoading}
          loader={<Loading />}
        >
          {topExperts.map(expert => (
            <DiscoverUser user={expert} key={expert.name} />
          ))}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default DiscoverContent;
