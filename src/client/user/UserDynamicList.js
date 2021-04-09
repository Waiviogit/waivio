import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import SortSelector from '../components/SortSelector/SortSelector';
import UserCard from '../components/UserCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import { changeCounterFollow, followUser, unfollowUser } from '../store/usersStore/usersActions';
import { changeSorting } from '../store/authStore/authActions';
import { SORT_OPTIONS } from '../../common/constants/waivioFiltres';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
  isGuestUser,
} from '../store/authStore/authSelectors';

import './UserDynamicList.less';

class UserDynamicList extends React.Component {
  static propTypes = {
    dispatchChangeFollowSorting: PropTypes.func.isRequired,
    fetcher: PropTypes.func.isRequired,
    showAuthorizedUser: PropTypes.bool,
    userName: PropTypes.string,
    unfollowUser: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    authUser: PropTypes.string,
    isGuest: PropTypes.bool.isRequired,
    changeCounterFollow: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
  };
  static defaultProps = {
    authUser: '',
    showAuthorizedUser: false,
    userName: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasMore: true,
      users: [],
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { fetcher, authUser, sort } = this.props;
    const { users } = this.state;

    if (!prevProps.authUser && authUser) {
      fetcher(users, authUser).then(newUsers =>
        this.setState({
          loading: false,
          hasMore: newUsers.hasMore,
          users: [...newUsers.users],
        }),
      );
    }
    if (!prevProps.sort && sort) {
      fetcher(users, authUser, sort).then(newUsers =>
        this.setState({
          loading: false,
          users: [...newUsers.users],
        }),
      );
    }
  }

  handleLoadMore() {
    const { fetcher, authUser } = this.props;
    const { users } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        fetcher(users, authUser)
          .then(newUsers =>
            this.setState(state => ({
              loading: false,
              hasMore: newUsers.hasMore,
              users: [...state.users, ...newUsers.users],
            })),
          )
          .catch(err => {
            message.error(err.message);
          });
      },
    );
  }

  unFollow = name => {
    const matchUserIndex = this.state.users.findIndex(user => user.name === name);
    const usersArray = [...this.state.users];

    usersArray.splice(matchUserIndex, 1, {
      ...usersArray[matchUserIndex],
      pending: true,
    });

    this.setState({ users: [...usersArray] });
    this.props.unfollowUser(name).then(res => {
      if ((res.value.ok && this.props.isGuest) || !res.message) {
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          youFollows: false,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          pending: false,
        });
      }

      this.props.changeCounterFollow(this.props.match.params.name, 'user');
      this.setState({ users: [...usersArray] });
    });
  };

  follow = name => {
    const matchUserIndex = this.state.users.findIndex(user => user.name === name);
    const usersArray = [...this.state.users];

    usersArray.splice(matchUserIndex, 1, {
      ...usersArray[matchUserIndex],
      pending: true,
    });

    this.setState({ users: [...usersArray] });
    this.props.followUser(name).then(res => {
      if ((this.props.isGuest && res.value.ok) || !res.message) {
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          youFollows: true,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          pending: false,
        });
      }

      this.props.changeCounterFollow(this.props.match.params.name, 'user', true);
      this.setState({ users: [...usersArray] });
    });
  };

  handleChangeSorting = sorting => {
    if (this.props.sort !== sorting) {
      this.props
        .dispatchChangeFollowSorting(sorting)
        .then(() => {
          this.handleSorting(sorting);
        })
        .catch(err => {
          message.error(err.message);
        });
    }
  };

  handleSorting(sorting) {
    const { fetcher } = this.props;

    this.setState(
      {
        loading: true,
        sort: sorting,
      },
      () => {
        fetcher([], sorting)
          .then(newUsers =>
            this.setState({
              loading: false,
              hasMore: newUsers.hasMore,
              users: [...newUsers.users],
            }),
          )
          .catch(err => {
            message.error(err.message);
          });
      },
    );
  }

  render() {
    const { loading, hasMore, users } = this.state;
    const empty = !hasMore && users.length === 0;
    const { sort } = this.props;

    return (
      <React.Fragment>
        <div className="sortSelector">
          <SortSelector sort={sort} onChange={this.handleChangeSorting}>
            <SortSelector.Item key={SORT_OPTIONS.RANK}>
              <FormattedMessage id="rank" defaultMessage="Rank" />
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS.ALPHABET}>
              <FormattedMessage id="alphabet" defaultMessage="A..Z" />
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS.FOLLOWERS}>
              <FormattedMessage id="followers" defaultMessage="Followers" />
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS.RECENCY}>
              <FormattedMessage id="recency" defaultMessage="Recency" />
            </SortSelector.Item>
          </SortSelector>
        </div>
        <div className="UserDynamicList">
          <ReduxInfiniteScroll
            elementIsScrollable={false}
            loadingMore={loading}
            hasMore={hasMore}
            loader={<Loading />}
            loadMore={this.handleLoadMore}
          >
            {users.map(user => {
              if (!this.props.showAuthorizedUser || user.name !== this.props.userName) {
                return (
                  <UserCard
                    key={user.name}
                    user={user}
                    unfollow={this.unFollow}
                    follow={this.follow}
                    alt={<WeightTag weight={user.wobjects_weight || user.weight} />}
                  />
                );
              }

              return null;
            })}
          </ReduxInfiniteScroll>
          {empty && (
            <div className="UserDynamicList__empty">
              <FormattedMessage id="empty_follow_list" defaultMessage="This list is empty" />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      isGuest: isGuestUser(state),
      authUser: getAuthenticatedUserName(state),
      sort: getAuthorizationUserFollowSort(state),
    }),
    {
      unfollowUser,
      followUser,
      changeCounterFollow,
      dispatchChangeFollowSorting: changeSorting,
    },
  )(UserDynamicList),
);
