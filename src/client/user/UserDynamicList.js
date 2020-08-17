import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import UserCard from '../components/UserCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import { changeCounterFollow, followUser, unfollowUser } from './usersActions';
import { getAuthenticatedUserName, isGuestUser } from '../reducers';

import './UserDynamicList.less';

class UserDynamicList extends React.Component {
  static propTypes = {
    fetcher: PropTypes.func.isRequired,
    showAuthorizedUser: PropTypes.bool,
    userName: PropTypes.string,
    unfollowUser: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    authUser: PropTypes.string.isRequired,
    isGuest: PropTypes.bool.isRequired,
    changeCounterFollow: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
  };
  static defaultProps = {
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
    const { fetcher, authUser } = this.props;
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
            console.error(err.message);
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

  render() {
    const { loading, hasMore, users } = this.state;
    const empty = !hasMore && users.length === 0;

    return (
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
            <FormattedMessage id="list_empty" defaultMessage="No data" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(state => ({ isGuest: isGuestUser(state), authUser: getAuthenticatedUserName(state) }), {
    unfollowUser,
    followUser,
    changeCounterFollow,
  })(UserDynamicList),
);
