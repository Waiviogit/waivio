import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take, isNil, isEmpty } from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import UserCard from '../UserCard';
import USDDisplay from '../Utils/USDDisplay';
import { checkFollowing } from '../../../waivioApi/ApiClient';
import { followUser, unfollowUser } from '../../store/usersStore/usersActions';
import { getIsAuthenticated } from '../../store/authStore/authSelectors';

import './ReactionsList.less';

@connect(
  state => ({
    isAuth: getIsAuthenticated(state),
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
    name: PropTypes.string,
    unfollow: PropTypes.func,
    follow: PropTypes.func,
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    votes: [],
    ratio: 0,
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
    const { votes, name, isAuth } = this.props;
    const usersList = votes.map(vote => vote.voter);

    if (isAuth) {
      checkFollowing(name, usersList).then(res => {
        const mappedList = votes.map(vote => {
          const follow = res.find(r => !isNil(r[vote.voter]));

          return {
            ...vote,
            name: vote.voter,
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

  renderUserCards = (vote, ratio, isSponsor) => (
    <UserCard
      key={vote.voter}
      user={vote}
      follow={this.followUser}
      unfollow={this.unfollowUser}
      showFollow={false}
      alt={
        <span>
          {Boolean(ratio) && (
            <React.Fragment>
              <USDDisplay value={this.voteValue(vote, ratio)} />
              <span className="ReactionsList__bullet" />
            </React.Fragment>
          )}
          {isSponsor ? (
            <FormattedMessage id="sponsor" defaultMessage="Sponsor" />
          ) : (
            <FormattedNumber
              style="percent" // eslint-disable-line react/style-prop-object
              value={vote.percent / 10000}
              maximumFractionDigits={2}
            />
          )}
        </span>
      }
    />
  );

  voteValue = (vote, ratio) => vote.rshares * ratio || 0;

  upVotesModalPreview = (usersList, noOfItemsToShow) => {
    const { ratio } = this.props;
    const sponsors = [];
    const currentUpvotes = [];

    // eslint-disable-next-line array-callback-return
    take(usersList, noOfItemsToShow).map(vote => {
      if (vote.sponsor) {
        sponsors.push(vote);
      } else {
        currentUpvotes.push(vote);
      }
    });

    return (
      <React.Fragment>
        {!isEmpty(sponsors) && sponsors.map(vote => this.renderUserCards(vote, ratio, true))}
        {!isEmpty(currentUpvotes) &&
          currentUpvotes.map(vote => this.renderUserCards(vote, ratio, false))}
      </React.Fragment>
    );
  };

  render() {
    const { votes, isAuth } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;
    const votesList = votes.map(vote => ({
      ...vote,
      name: vote.voter,
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
            {this.upVotesModalPreview(usersList, noOfItemsToShow)}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
