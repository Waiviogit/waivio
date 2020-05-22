import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import DiscoverUser from './DiscoverUser';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { getTopExperts as getTopExpertsApi } from '../user/usersActions';
import {getTopExperts, getTopExpertsLoading, getTopExpertsHasMore, getObjectTypesList, getSearchUsersResultsForDiscoverPage} from '../reducers';
import Loading from '../components/Icon/Loading';
import {resetSearchUsersForDiscoverPage, searchUsersForDiscoverPage} from '../search/searchActions';
import {getObjectTypes} from "../objectTypes/objectTypesActions";

const displayLimit = 20;

@connect(
  state => ({
    topExperts: getTopExperts(state),
    topExpertsLoading: getTopExpertsLoading(state),
    hasMoreExperts: getTopExpertsHasMore(state),
    typesList: getObjectTypesList(state),
    searchUsersList: getSearchUsersResultsForDiscoverPage(state),
  }),
  {
    getTopExperts: getTopExpertsApi,
    resetSearchUsersForDiscoverPage,
    searchUsersForDiscoverPage,
    getObjectTypes
  },
)
class DiscoverContent extends React.Component {
  static propTypes = {
    topExperts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        posting_json_metadata: PropTypes.string,
      }),
    ).isRequired,
    getTopExperts: PropTypes.func.isRequired,
    topExpertsLoading: PropTypes.bool.isRequired,
    hasMoreExperts: PropTypes.bool.isRequired,
    typesList: PropTypes.shape().isRequired,
    getObjectTypes: PropTypes.func.isRequired,
    searchUsersForDiscoverPage: PropTypes.func.isRequired,
    searchString: PropTypes.string,
    searchUsersList: PropTypes.shape({
      result: PropTypes.arrayOf(PropTypes.shape()),
      loading: PropTypes.bool,
    }),
    resetSearchUsersForDiscoverPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    searchString: '',
    searchUsersList: {
      result: [],
      loading: true,
    },
    unfollowTopUser: () => {},
    followTopUser: () => {},
  };

  componentDidMount() {
    const { typesList, searchString } = this.props;
    if (searchString) {
      this.props.searchUsersForDiscoverPage(searchString, 100);
    }

    if (isEmpty(typesList)) this.props.getObjectTypes();
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchString && prevProps.searchString !== this.props.searchString) {
      this.props.searchUsersForDiscoverPage(this.props.searchString, 100);
    }
  }

  componentWillUnmount() {
    this.props.resetSearchUsersForDiscoverPage();
  }

  handleLoadMore = () => {
    if (!this.props.topExpertsLoading) {
      this.props.getTopExperts(displayLimit, this.props.topExperts.length);
    }
  };

  render() {
    {
      const {
        topExperts,
        topExpertsLoading,
        hasMoreExperts,
        searchString,
        searchUsersList,
      } = this.props;
      const noUserError = (
        <div className="Discover__message">
          <FormattedMessage
            id="no_user_message"
            defaultMessage="We have not users with this name, please try again."
          />
        </div>
      );
      const mapSearchUsersList =
        searchUsersList &&
        searchUsersList.result &&
        searchUsersList.result.map(user => ({
          name: user.account,
          ...user,
        }));
      const searchUsers =
        mapSearchUsersList && mapSearchUsersList.length
          ? mapSearchUsersList.map(expert => (
            <DiscoverUser
              user={expert}
              key={expert.name}
              unfollow={this.unfollowTopUser}
              follow={this.followTopUser}
              isReblogged
            />
          ))
          : noUserError;
      const renderItem = searchUsersList.loading ? <Loading /> : searchUsers;

      return (
        <div>
          {searchString ? (
            renderItem
          ) : (
            <ReduxInfiniteScroll
              hasMore={hasMoreExperts}
              loadMore={this.handleLoadMore}
              elementIsScrollable={false}
              loadingMore={topExpertsLoading}
              loader={<Loading />}
            >
              {topExperts.map(expert => (
                <DiscoverUser
                  user={expert}
                  key={expert.name}
                  unfollow={this.unfollowTopUser}
                  follow={this.followTopUser}
                  isReblogged
                />
              ))}
            </ReduxInfiniteScroll>
          )}
        </div>
      );
    }
  }
}

export default DiscoverContent;
