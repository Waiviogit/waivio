import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteSroll from 'react-infinite-scroller';
import { take, isEmpty } from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import UserCard from '../UserCard';
import USDDisplay from '../Utils/USDDisplay';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './ReactionsList.less';

@connect(state => ({
  isAuth: getIsAuthenticated(state),
}))
export default class UserList extends React.Component {
  static propTypes = {
    votes: PropTypes.arrayOf(PropTypes.shape()),
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    votes: [],
    ratio: 0,
    waivRatio: 0,
    name: '',
    isAuth: false,
  };

  state = {
    page: 1,
    usersList: [],
  };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  renderUserCards = (vote, isSponsor) => (
    <UserCard
      key={vote.voter}
      user={vote}
      showFollow={false}
      alt={
        <span>
          {vote.payout >= 0.001 && (
            <React.Fragment>
              <USDDisplay value={vote.payout} />
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

  upVotesModalPreview = (usersList, noOfItemsToShow) => {
    const sponsors = [];
    const currentUpvotes = [];
    const sortedUsersList = usersList.sort((a, b) => b.payout - a.payout);

    take(sortedUsersList, noOfItemsToShow).forEach(vote => {
      if (vote.sponsor) {
        sponsors.push(vote);
      } else {
        currentUpvotes.push(vote);
      }
    });

    return (
      <React.Fragment>
        {!isEmpty(sponsors) && sponsors.map(vote => this.renderUserCards(vote, true))}
        {!isEmpty(currentUpvotes) && currentUpvotes.map(vote => this.renderUserCards(vote, false))}
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
