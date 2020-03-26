import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import UserCard from '../components/UserCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import './UserDynamicList.less';

export default class UserDynamicList extends React.Component {
  static propTypes = {
    fetcher: PropTypes.func.isRequired,
    showAuthorizedUser: PropTypes.bool,
    userName: PropTypes.string,
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

  handleLoadMore() {
    const { fetcher } = this.props;
    const { users } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        fetcher(users)
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
                  alt={<WeightTag weight={user.wobjects_weight} />}
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
