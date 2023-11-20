import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty, get, size } from 'lodash';
import DiscoverUser from './DiscoverUser';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import {
  followUser,
  getTopExperts as getTopExpertsApi,
  unfollowUser,
} from '../../store/usersStore/usersActions';
import Loading from '../components/Icon/Loading';
import { getObjectTypes } from '../../store/objectTypesStore/objectTypesActions';
import {
  followSearchUser,
  resetSearchUsersForDiscoverPage,
  searchUsersForDiscoverPage,
  unfollowSearchUser,
} from '../../store/searchStore/searchActions';
import { searchUsers } from '../../waivioApi/ApiClient';
import withAuthActions from '../auth/withAuthActions';
import { getObjectTypesList } from '../../store/objectTypesStore/objectTypesSelectors';
import {
  getTopExperts,
  getTopExpertsHasMore,
  getTopExpertsLoading,
} from '../../store/usersStore/usersSelectors';
import { getSearchUsersResultsForDiscoverPage } from '../../store/searchStore/searchSelectors';
import UserDynamicList from '../user/UserDynamicList';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';

const displayLimit = 20;
const userLimit = 30;

@withAuthActions
@connect(
  state => ({
    topExperts: getTopExperts(state),
    userName: getAuthenticatedUserName(state),
    isGuest: isGuestUser(state),
    topExpertsLoading: getTopExpertsLoading(state),
    hasMoreExperts: getTopExpertsHasMore(state),
    typesList: getObjectTypesList(state),
    searchUsersList: getSearchUsersResultsForDiscoverPage(state),
  }),
  {
    getTopExperts: getTopExpertsApi,
    getObjectTypes,
    searchUsersForDiscoverPage,
    resetSearchUsersForDiscoverPage,
    followTopUser: followUser,
    unfollowTopUser: unfollowUser,
    unfollowSearchUser,
    followSearchUser,
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
    isGuest: PropTypes.string,
    userName: PropTypes.string,
    searchUsersList: PropTypes.shape({
      result: PropTypes.arrayOf(PropTypes.shape()),
      loading: PropTypes.bool,
    }),
    resetSearchUsersForDiscoverPage: PropTypes.func.isRequired,
    unfollowTopUser: PropTypes.func,
    followTopUser: PropTypes.func,
    onActionInitiated: PropTypes.func.isRequired,
    followSearchUser: PropTypes.func.isRequired,
    unfollowSearchUser: PropTypes.func.isRequired,
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

  unfollowTopUser = (name, top) => {
    if (this.props.searchString) {
      this.props.onActionInitiated(() => this.props.unfollowSearchUser(name));
    } else {
      this.props.onActionInitiated(() => this.props.unfollowTopUser(name, top));
    }
  };

  followTopUser = (name, top) => {
    if (this.props.searchString) {
      this.props.onActionInitiated(() => this.props.followSearchUser(name));
    } else {
      this.props.onActionInitiated(() => this.props.followTopUser(name, top));
    }
  };
  userFetcher = async (users, authUser, sort, skip) => {
    const response = await searchUsers(
      this.props.searchString,
      this.props.userName,
      userLimit,
      !this.props.isGuest,
      skip,
    );
    const newUsers = response.users.map(u => ({ ...u, name: u.account }));

    return { users: newUsers, hasMore: response.hasMore };
  };

  render() {
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

    const mapSearchUsersList = get(searchUsersList, 'result', []).map(user => ({
      name: user.account,
      ...user,
    }));

    const searchUsersResult = size(mapSearchUsersList) ? (
      <UserDynamicList
        hideSort
        limit={userLimit}
        fetcher={this.userFetcher}
        searchLine={searchString}
      />
    ) : (
      noUserError
    );

    return (
      <div>
        {searchString ? (
          searchUsersResult
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

export default DiscoverContent;
