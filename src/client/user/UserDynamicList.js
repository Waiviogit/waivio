import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import {
  followUserInList,
  unfollowUserInList,
  getUsersList,
  getUsersMoreList,
  resetLists,
} from '../../store/dynamicList/dynamicListActions';
import {
  getDynamicList,
  getDynamicListLoading,
} from '../../store/dynamicList/dynamicListSelectors';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import SortSelector from '../components/SortSelector/SortSelector';
import UserCard from '../components/UserCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import { changeCounterFollow } from '../../store/usersStore/usersActions';
import { SORT_OPTIONS } from '../../common/constants/waivioFiltres';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';

import './UserDynamicList.less';

class UserDynamicList extends React.Component {
  state = {
    sort: SORT_OPTIONS.RECENCY,
  };
  componentDidMount() {
    this.getList([]);
  }

  componentDidUpdate(prevProps) {
    const { authUser, searchLine } = this.props;
    const { list } = this.props.dynamicListInfo;

    if (!prevProps.authUser && authUser) {
      this.getList(list);
    }
    if (prevProps.searchLine !== searchLine) {
      this.getList(searchLine, undefined);
    }
  }

  componentWillUnmount() {
    this.props.resetLists();
  }

  getList = (usersList, sorting, skip) =>
    this.props.getUsersList(
      this.props.fetcher,
      30,
      skip,
      this.props.match.params[0],
      usersList,
      sorting || this.state.sort,
    );

  getListMore = (usersList, sorting, skip) =>
    this.props.getUsersMoreList(
      this.props.fetcher,
      30,
      skip,
      this.props.match.params[0],
      usersList,
      this.state.sort,
    );
  handleLoadMore = () => {
    const { list } = this.props.dynamicListInfo;

    this.getListMore(list, this.props.sort || undefined, list?.length);
  };

  unFollow = name => {
    this.props.unfollowUser(name);
  };

  follow = name => {
    this.props.followUser(name);
  };

  handleChangeSorting = sorting => {
    if (this.props.sort !== sorting) {
      this.props
        .handleChange(sorting)
        .then(() => {
          this.handleSorting(sorting);
        })
        .catch(err => {
          message.error(err.message);
        });
    }
  };

  handleSorting(sorting) {
    this.setState(
      {
        sort: sorting,
      },
      () => {
        this.getList([], sorting, 0).catch(err => {
          message.error(err.message);
        });
      },
    );
  }

  render() {
    const { loading } = this.props;
    const { hasMore, list } = this.props.dynamicListInfo;
    const empty = !hasMore && list?.length === 0;
    const { sort, hideSort } = this.props;

    return (
      <React.Fragment>
        {!hideSort && (
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
        )}
        <div className="UserDynamicList">
          <ReduxInfiniteScroll
            elementIsScrollable={false}
            loadingMore={loading}
            hasMore={hasMore}
            loader={<Loading />}
            loadMore={this.handleLoadMore}
            threshold={500}
          >
            {list?.map(user => {
              if (!this.props.showAuthorizedUser || user.name !== this.props.userName) {
                return (
                  <UserCard
                    key={`${user.name}-${user._id}`}
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

UserDynamicList.propTypes = {
  fetcher: PropTypes.func.isRequired,
  showAuthorizedUser: PropTypes.bool,
  hideSort: PropTypes.bool,
  loading: PropTypes.bool,
  userName: PropTypes.string,
  searchLine: PropTypes.string,
  unfollowUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  getUsersList: PropTypes.func.isRequired,
  getUsersMoreList: PropTypes.func.isRequired,
  resetLists: PropTypes.func.isRequired,
  authUser: PropTypes.string,
  sort: PropTypes.string,
  handleChange: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  dynamicListInfo: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({})),
    hasMore: PropTypes.bool,
  }),
};
UserDynamicList.defaultProps = {
  authUser: '',
  searchLine: '',
  showAuthorizedUser: false,
  hideSort: false,
  userName: '',
  sort: 'recency',
};

export default withRouter(
  connect(
    (state, ownProps) => ({
      isGuest: isGuestUser(state),
      authUser: getAuthenticatedUserName(state),
      dynamicListInfo: getDynamicList(state, ownProps.match.params[0]),
      loading: getDynamicListLoading(state),
    }),
    {
      unfollowUser: unfollowUserInList,
      followUser: followUserInList,
      changeCounterFollow,
      getUsersList,
      getUsersMoreList,
      resetLists,
    },
  )(UserDynamicList),
);
