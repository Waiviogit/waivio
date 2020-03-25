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
  getSearchUsersResults,
} from '../reducers';
import Loading from '../components/Icon/Loading';
import { getObjectTypes } from '../objectTypes/objectTypesActions';
import { searchUsersAutoCompete } from '../search/searchActions';

const displayLimit = 20;

@connect(
  state => ({
    topExperts: getTopExperts(state),
    topExpertsLoading: getTopExpertsLoading(state),
    hasMoreExperts: getTopExpertsHasMore(state),
    typesList: getObjectTypesList(state),
    searchUsersList: getSearchUsersResults(state),
  }),
  {
    getTopExperts: getTopExpertsApi,
    getObjectTypes,
    searchUsersAutoCompete,
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
    searchUsersAutoCompete: PropTypes.func.isRequired,
    params: PropTypes.string,
    searchUsersList: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    params: '',
    searchUsersList: [],
  };

  componentDidMount() {
    const { typesList, params } = this.props;
    if (params) {
      this.props.searchUsersAutoCompete(params, 100);
    }

    if (isEmpty(typesList)) this.props.getObjectTypes();
  }

  componentDidUpdate() {
    if (!this.props.params && isEmpty(this.props.topExperts)) {
      this.props.getObjectTypes();
    }
  }

  handleLoadMore = () => {
    if (!this.props.topExpertsLoading) {
      this.props.getTopExperts(displayLimit, this.props.topExperts.length);
    }
  };

  render() {
    const { topExperts, topExpertsLoading, hasMoreExperts, params, searchUsersList } = this.props;
    const mapSearchUsersList =
      !isEmpty(searchUsersList) &&
      searchUsersList.map(user => ({
        name: user.account,
        wobjects_weight: user.wobjects_weight,
        followers_count: user.followers_count,
      }));
    const renderedList = params ? mapSearchUsersList : topExperts;

    return (
      <div>
        <ReduxInfiniteScroll
          hasMore={!params && hasMoreExperts}
          loadMore={this.handleLoadMore}
          elementIsScrollable={false}
          loadingMore={topExpertsLoading}
          loader={<Loading />}
        >
          {renderedList &&
            renderedList.map(expert => (
              <DiscoverUser user={expert} key={expert.name} isReblogged />
            ))}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default DiscoverContent;
