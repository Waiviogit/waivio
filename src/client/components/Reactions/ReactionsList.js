import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take, isNil } from 'lodash';
import { FormattedNumber } from 'react-intl';
import UserCard from '../UserCard';
import USDDisplay from '../Utils/USDDisplay';
import { checkFollowing } from '../../../waivioApi/ApiClient';
import { followUser, unfollowUser } from '../../user/usersActions';
import { getIsAuthenticated, getObjectAdmins, getObjectModerators } from '../../reducers';

import './ReactionsList.less';

@connect(
  state => ({
    isAuth: getIsAuthenticated(state),
    moderatorsList: getObjectModerators(state),
    adminsList: getObjectAdmins(state),
  }),
  {
    unfollow: unfollowUser,
    follow: followUser,
  },
)
export default class UserList extends React.Component {
  static propTypes = {
    votes: PropTypes.arrayOf(PropTypes.shape()),
    ratio: PropTypes.number,
    moderatorsList: PropTypes.arrayOf(PropTypes.string),
    adminsList: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    unfollow: PropTypes.func,
    follow: PropTypes.func,
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    votes: [],
    ratio: 0,
    moderatorsList: [],
    adminsList: [],
    name: '',
    unfollow: () => {},
    follow: () => {},
    isAuth: false,
  };

  state = {
    page: 1,
    usersList: [],
  };

  componentDidMount() {
    const { votes, moderatorsList, adminsList, name, isAuth } = this.props;
    const usersList = votes.map(vote => vote.voter);

    if (isAuth) {
      checkFollowing(name, usersList).then(res => {
        const mappedList = votes.map(vote => {
          const follow = res.find(r => !isNil(r[vote.voter]));

          return {
            ...vote,
            name: vote.voter,
            admin: adminsList.includes(vote.voter),
            moderator: moderatorsList.includes(vote.voter),
            youFollows: follow[vote.voter],
            pending: false,
          };
        });

        this.setState({ usersList: mappedList });
      });
    }
  }

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  followUser = user => {
    const usersList = [...this.state.usersList];
    const findUserIndex = usersList.findIndex(usr => user === usr.name);

    usersList.splice(findUserIndex, 1, {
      ...usersList[findUserIndex],
      pending: true,
    });

    this.setState({
      usersList,
    });
    this.props.follow(user).then(() => {
      usersList.splice(findUserIndex, 1, {
        ...usersList[findUserIndex],
        youFollows: true,
        pending: false,
      });

      this.setState({
        usersList,
      });
    });
  };

  unfollowUser = user => {
    const usersList = [...this.state.usersList];
    const findUserIndex = usersList.findIndex(usr => user === usr.name);

    usersList.splice(findUserIndex, 1, {
      ...usersList[findUserIndex],
      pending: true,
    });

    this.setState({
      usersList,
    });

    this.props.unfollow(user).then(() => {
      usersList.splice(findUserIndex, 1, {
        ...usersList[findUserIndex],
        youFollows: false,
        pending: false,
      });

      this.setState({
        usersList,
      });
    });
  };

  render() {
    const { votes, ratio, isAuth, adminsList, moderatorsList } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;
    const voteValue = vote => (vote.rshares_weight || vote.rshares) * ratio || 0;
    const votesList = votes.map(vote => ({
      ...vote,
      name: vote.voter,
      admin: adminsList.includes(vote.voter),
      moderator: moderatorsList.includes(vote.voter),
      pending: false,
      youFollows: false,
    }));

    const currentVoterList =
      isAuth && this.state.usersList.length ? this.state.usersList : votesList;
    const moderators = currentVoterList.filter(v => v.moderator);
    const admins = currentVoterList.filter(v => !v.moderator && v.admin);
    const users = currentVoterList.filter(v => !v.moderator && !v.admin);
    const usersList = [...moderators, ...admins, ...users];

    return (
      <Scrollbars autoHide style={{ height: '400px' }}>
        <InfiniteSroll
          pageStart={0}
          loadMore={this.paginate}
          hasMore={votes.length > noOfItemsToShow}
          useWindow={false}
        >
          <div className="ReactionsList__content">
            {take(usersList, noOfItemsToShow).map(vote => (
              <UserCard
                key={vote.voter}
                user={vote}
                admin={vote.admin}
                moderator={vote.moderator}
                follow={this.followUser}
                unfollow={this.unfollowUser}
                showFollow={false}
                alt={
                  <span>
                    <USDDisplay value={voteValue(vote)} />
                    <span className="ReactionsList__bullet" />
                    <FormattedNumber
                      style="percent" // eslint-disable-line react/style-prop-object
                      value={vote.percent / 10000}
                      maximumFractionDigits={2}
                    />
                  </span>
                }
              />
            ))}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
