import React from 'react';
import { has, size, attempt, isEmpty, reduce, get } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import { getUserAccountHistory } from '../../store/walletStore/walletActions';
import HorizontalBarChart from '../components/HorizontalBarChart';
import LetsGetStartedIcon from './LetsGetStartedIcon';
import {
  getAuthenticatedUser,
  getIsAuthenticated,
  getIsAuthFetching,
  getIsLoaded,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import {
  getFetchFollowListError,
  getFollowingFetched,
  getFollowingList,
  getIsFetchingFollowingList,
} from '../../store/userStore/userSelectors';
import { getUsersAccountHistory } from '../../store/walletStore/walletSelectors';

import './LetsGetStarted.less';
import { parseJSON } from '../../common/helpers/parseJSON';

@connect(
  state => ({
    authenticatedUser: getAuthenticatedUser(state),
    followingList: getFollowingList(state),
    isAuthFetching: getIsAuthFetching(state),
    isFetchingFollowingList: getIsFetchingFollowingList(state),
    loaded: getIsLoaded(state),
    authenticated: getIsAuthenticated(state),
    followingFetched: getFollowingFetched(state),
    fetchFollowListError: getFetchFollowListError(state),
    isGuest: isGuestUser(state),
    usersAccountHistory: getUsersAccountHistory(state),
  }),
  {
    getUserAccountHistory,
  },
)
class LetsGetStarted extends React.Component {
  static propTypes = {
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
    isFetchingFollowingList: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    loaded: PropTypes.bool.isRequired,
    followingFetched: PropTypes.bool.isRequired,
    fetchFollowListError: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool,
    usersAccountHistory: PropTypes.shape(),
    getUserAccountHistory: PropTypes.func,
  };

  static defaultProps = {
    isGuest: false,
    usersAccountHistory: {},
    getUserAccountHistory: () => {},
  };

  static getCurrentUserState(authenticatedUser, followingList, isGuest, usersAccountHistory) {
    const accountHistory = get(usersAccountHistory, authenticatedUser.name, []);
    const hasLikes = [];

    // eslint-disable-next-line array-callback-return,consistent-return,no-unused-expressions
    !isGuest &&
      // eslint-disable-next-line array-callback-return,consistent-return
      accountHistory.map(item => {
        const historyElement = item.op[0];

        if (historyElement === accountHistoryConstants.VOTE) {
          return hasLikes.push(historyElement);
        }
      });
    const hasPost =
      authenticatedUser.last_root_post &&
      authenticatedUser.last_root_post !== '1970-01-01T00:00:00';
    const hasVoted = !!(isGuest || hasLikes.length);
    const jsonMetadata = attempt(parseJSON, authenticatedUser.posting_json_metadata);
    const hasProfile =
      has(jsonMetadata, 'profile.name') &&
      has(jsonMetadata, 'profile.about') &&
      has(jsonMetadata, 'profile.profile_image');
    const hasFollowed = size(followingList) >= 5;

    return {
      hasProfile,
      hasPost,
      hasVoted,
      hasFollowed,
    };
  }

  constructor(props) {
    super(props);

    this.state = LetsGetStarted.getCurrentUserState(
      props.authenticatedUser,
      props.followingList,
      props.isGuest,
      props.usersAccountHistory,
    );
  }

  componentDidMount() {
    if (isEmpty(this.props.usersAccountHistory[this.props.authenticatedUser.name])) {
      this.props.getUserAccountHistory(this.props.authenticatedUser.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    const newUserState = LetsGetStarted.getCurrentUserState(
      nextProps.authenticatedUser,
      nextProps.followingList,
      nextProps.isGuest,
      nextProps.usersAccountHistory,
    );
    const diffHasProfile = this.state.hasProfile !== newUserState.hasProfile;
    const diffHasPost = this.state.hasPost !== newUserState.hasPost;
    const diffHasVoted = this.state.hasVoted !== newUserState.hasVoted;
    const diffHasFollowed = this.state.hasFollowed !== newUserState.hasFollowed;

    if (diffHasProfile) newState.hasProfile = newUserState.hasProfile;
    if (diffHasPost) newState.hasPost = newUserState.hasPost;
    if (diffHasVoted) newState.hasVoted = newUserState.hasVoted;
    if (diffHasFollowed) newState.hasFollowed = newUserState.hasFollowed;

    if (!isEmpty(newState)) {
      this.setState(newState);
    }
  }

  render() {
    const {
      authenticated,
      isFetchingFollowingList,
      isAuthFetching,
      loaded,
      followingFetched,
      fetchFollowListError,
      isGuest,
    } = this.props;
    const { hasProfile, hasPost, hasVoted, hasFollowed } = this.state;
    const totalOptions = isGuest ? 3 : 4;
    const actionsArray = isGuest
      ? [hasProfile, hasPost, hasFollowed]
      : [hasProfile, hasPost, hasVoted, hasFollowed];
    const currentSelected = reduce(
      actionsArray,
      (total, current) => {
        let newTotal = total;

        if (current) {
          newTotal = total + 1;
        }

        return newTotal;
      },
      0,
    );
    const ready = followingFetched && loaded;
    const hide = !authenticated || currentSelected === totalOptions;

    if (!ready || hide || fetchFollowListError) return <div />;

    return (
      <div className="LetsGetStarted">
        <h4 className="LetsGetStarted__title">
          <span className="LetsGetStarted__title__text">
            <FormattedMessage id="lets_get_started" defaultMessage="Let's get started" />
          </span>
          <HorizontalBarChart current={currentSelected} total={totalOptions} />
          <span className="LetsGetStarted__title__description">
            {`${currentSelected}/${totalOptions} `}
            <FormattedMessage id="completed" defaultMessage="Completed" />
          </span>
        </h4>
        <div className="LetsGetStarted__content">
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasProfile}
              isLoading={isAuthFetching}
              iconClassName="icon-mine"
            />
            <Link to="/edit-profile">
              <span
                className={classNames('LetsGetStarted__action__text', {
                  LetsGetStarted__action__completed: hasProfile,
                })}
              >
                <FormattedMessage
                  id="complete_your_profile"
                  defaultMessage="Complete your profile"
                />
              </span>
            </Link>
          </div>
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasFollowed}
              isLoading={isFetchingFollowingList}
              iconClassName="icon-addpeople"
            />
            <Link to="/discover">
              <span
                className={classNames('LetsGetStarted__action__text', {
                  LetsGetStarted__action__completed: hasFollowed,
                })}
              >
                <FormattedMessage
                  id="follow_users"
                  defaultMessage="Follow {amount} users"
                  values={{ amount: 5 }}
                />
              </span>
            </Link>
          </div>
          {!this.props.isGuest && (
            <div className="LetsGetStarted__action">
              <LetsGetStartedIcon
                renderCheck={hasVoted}
                isLoading={isAuthFetching}
                iconClassName="icon-praise"
              />
              <Link to="/trending">
                <span
                  className={classNames('LetsGetStarted__action__text', {
                    LetsGetStarted__action__completed: hasVoted,
                  })}
                >
                  <FormattedMessage id="like_good_posts" defaultMessage="Like some good posts" />
                </span>
              </Link>
            </div>
          )}
          <div className="LetsGetStarted__action">
            <LetsGetStartedIcon
              renderCheck={hasPost}
              isLoading={isAuthFetching}
              iconClassName="icon-order"
            />
            <Link to="/editor">
              <span
                className={classNames('LetsGetStarted__action__text', {
                  LetsGetStarted__action__completed: hasPost,
                })}
              >
                <FormattedMessage id="write_first_post" defaultMessage="Write your first post" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default LetsGetStarted;
