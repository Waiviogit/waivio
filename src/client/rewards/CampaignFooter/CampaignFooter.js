import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { message, Modal } from 'antd';
import { findKey, find, get, isEmpty, map, includes, filter, size, isEqual } from 'lodash';
import Slider from '../../components/Slider/Slider';
import CampaignButtons from './CampaignButtons';
import CommentsMessages from './CommentsMessages';
import { ASSIGNED, IS_RESERVED, PATH_NAME_ACTIVE, IS_ALL } from '../../../common/constants/rewards';
import { getVoteValue } from '../../helpers/user';
import { getDaysLeft } from '../rewardsHelper';
import {
  getRate,
  getAppUrl,
  getLocale,
  isGuestUser,
  getCommentsFromReserved,
  getAuthenticatedUserName,
} from '../../reducers';
import Confirmation from '../../components/StoryFooter/Confirmation';
import { getReservedComments, sendCommentMessages } from '../../comments/commentsActions';
import withAuthActions from '../../auth/withAuthActions';
import { getContent } from '../../../waivioApi/ApiClient';
import QuickCommentEditor from '../../components/Comments/QuickCommentEditor';
import './CampaignFooter.less';

@injectIntl
@withAuthActions
@connect(
  state => ({
    rate: getRate(state),
    appUrl: getAppUrl(state),
    reservedComments: getCommentsFromReserved(state),
    userName: getAuthenticatedUserName(state),
    isGuest: isGuestUser(state),
    locale: getLocale(state),
    follower: getAuthenticatedUserName(state),
  }),
  {
    getReservedComments,
    sendCommentMessages,
  },
)
class CampaignFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    proposedWobj: PropTypes.shape().isRequired,
    proposition: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    requiredObjectPermlink: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    defaultVotePercent: PropTypes.number,
    likeComment: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    unfollowObject: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    followObject: PropTypes.func.isRequired,
    onActionInitiated: PropTypes.func,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.bool,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingFollowObject: PropTypes.bool,
    saving: PropTypes.bool,
    singlePostVew: PropTypes.bool,
    onLikeClick: PropTypes.func,
    discardPr: PropTypes.func,
    toggleModalDetails: PropTypes.func,
    requiredObjectName: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    getMessageHistory: PropTypes.func,
    blacklistUsers: PropTypes.arrayOf(PropTypes.string),
    getReservedComments: PropTypes.func,
    reservedComments: PropTypes.shape(),
    userName: PropTypes.string,
    isGuest: PropTypes.bool,
    sendCommentMessages: PropTypes.func,
    sortFraudDetection: PropTypes.string,
    locale: PropTypes.string,
    follower: PropTypes.string,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFlag: false,
    ownPost: false,
    pendingFollow: false,
    pendingFollowObject: false,
    pendingBookmark: false,
    saving: false,
    singlePostVew: false,
    sliderMode: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    handlePostPopoverMenuClick: () => {},
    discardPr: () => {},
    toggleModalDetails: () => {},
    isComment: false,
    getMessageHistory: () => {},
    blacklistUsers: [],
    defaultVotePercent: 0,
    onActionInitiated: () => {},
    getReservedComments: () => {},
    reservedComments: {},
    userName: '',
    isGuest: false,
    sendCommentMessages: () => {},
    proposition: {},
    sortFraudDetection: 'reservation',
    locale: 'en-US',
    follower: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      sliderVisible: false,
      commentsVisible: false,
      sliderValue: 100,
      voteWorth: 0,
      modalVisible: false,
      reservedUser: {},
      daysLeft: 0,
      loading: false,
      currentPost: {},
      currentPostReserved: {},
      commentFromText: '',
      commentSubmitted: false,
      loadingComments: false,
      userFollowed: this.props.postState.userFollowed,
      objectFollowed: this.props.postState.objectFollowed,
    };
    this.handlePostPopoverMenuClick = this.handlePostPopoverMenuClick.bind(this);

    this.isReserved = !isEmpty(this.props.match)
      ? this.props.match.params.filterKey === IS_RESERVED ||
        this.props.match.params.filterKey === IS_ALL ||
        includes(this.props.match.path, 'object')
      : '';
  }

  componentDidMount() {
    const { user, post, defaultVotePercent, proposition, locale, follower } = this.props;
    if (user) {
      const userVote = find(post.active_votes, { voter: user.name }) || {};

      if (userVote.percent && userVote.percent > 0) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          sliderValue: userVote.percent / 100,
        });
      } else {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          sliderValue: defaultVotePercent / 100,
        });
      }
    }
    const currentUser = this.getCurrentUser();
    const author = this.isReserved
      ? get(currentUser, ['0', 'rootName'])
      : get(proposition, ['users', '0', 'rootName']);
    const permlink = this.isReserved
      ? get(currentUser, ['0', 'permlink'])
      : get(proposition, ['users', '0', 'permlink']);
    this.getReservedComments();
    if (!isEmpty(author) && !isEmpty(permlink)) {
      getContent(author, permlink, locale, follower).then(res =>
        this.setState({ currentPost: res }),
      );
    }
    const reservationsTime =
      get(currentUser, ['0', 'createdAt']) || get(currentUser, ['createdAt']);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      daysLeft: getDaysLeft(reservationsTime, proposition.count_reservation_days),
    });
  }

  getCurrentUser = () => {
    const { proposition, userName } = this.props;
    let currentUser;
    if (this.isReserved) {
      currentUser = filter(
        proposition.users,
        usersItem => usersItem.name === userName && usersItem.status === ASSIGNED,
      );
    } else {
      currentUser = get(proposition, ['users']);
    }

    return currentUser;
  };

  getReservedComments = () => {
    const { proposition } = this.props;
    const currentUser = this.getCurrentUser();
    const currentUserName = get(currentUser, ['0', 'name']);
    const author = includes(currentUserName, 'waivio')
      ? get(currentUser, ['0', 'rootName'])
      : get(currentUser, ['0', 'name']);
    const permlink = get(currentUser, ['0', 'permlink']);
    const { campaign_server: category } = proposition;
    if (!isEmpty(author) && !isEmpty(permlink)) {
      return this.props.getReservedComments({ category, author, permlink }).then(res => {
        this.setState({ currentPostReserved: res.value });
      });
    }
    return null;
  };

  onLikeClick = (post, postState, weight = 10000) => {
    const { sliderMode, defaultVotePercent } = this.props;

    if (sliderMode) {
      this.props.likeComment(post.id, weight);
    } else if (postState.isLiked) {
      this.props.likeComment(post.id, 0);
    } else {
      this.props.likeComment(post.id, defaultVotePercent);
    }
  };

  handleLikeClick = () => {
    if (this.props.sliderMode) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.onLikeClick(this.props.post, this.props.postState);
    }
  };

  handleFollowClick() {
    const { userFollowed } = this.state;
    const { proposition } = this.props;

    if (userFollowed) {
      this.props.unfollowUser(proposition.guideName);
    } else {
      this.props.followUser(proposition.guideName);
    }
    this.setState(prevState => ({ userFollowed: !prevState.userFollowed }));
  }

  handleFollowObjectClick() {
    const { objectFollowed } = this.state;
    if (objectFollowed) {
      this.props.unfollowObject(this.props.requiredObjectPermlink);
    } else {
      this.props.followObject(this.props.requiredObjectPermlink);
    }
    this.setState(prevState => ({ objectFollowed: !prevState.objectFollowed }));
  }

  clickMenuItem(key) {
    const { post } = this.props;
    switch (key) {
      case 'follow':
        this.handleFollowClick(post);
        break;
      case 'followObject':
        this.handleFollowObjectClick(post);
        break;
      case 'release':
        this.toggleModal();
        break;
      default:
    }
  }

  toggleModal = () => this.setState({ modalVisible: !this.state.modalVisible });

  modalOnOklHandler = () => {
    const { proposedWobj, discardPr } = this.props;
    discardPr(proposedWobj).then(() => {
      this.toggleModal();
      message.success(
        this.props.intl.formatMessage({
          id: 'discarded_successfully',
          defaultMessage: 'Reservation released. It will be available for reservation soon.',
        }),
        this.props.history.push(PATH_NAME_ACTIVE),
      );
    });
  };

  handlePostPopoverMenuClick(key) {
    this.props.onActionInitiated(this.clickMenuItem.bind(this, key));
  }

  handleLikeConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      this.props.onLikeClick(this.props.post, this.props.postState, this.state.sliderValue * 100);
    });
  };

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = value => {
    const { user, rewardFund, rate } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );
    this.setState({ sliderValue: value, voteWorth });
  };

  toggleCommentsVisibility = () => {
    const { proposition, reservedComments } = this.props;
    const hasComments = !isEmpty(proposition.conversation) || !isEmpty(reservedComments);
    if (hasComments) {
      this.setState(prevState => ({ commentsVisible: !prevState.commentsVisible }));
    }
    this.setState({ isComment: !this.state.isComment });
  };

  handleCommentClick = () => {
    const { currentPost, commentsVisible } = this.state;
    const { category, author, permlink } = currentPost;
    if (!commentsVisible) {
      this.props
        .getReservedComments({ category, author, permlink })
        .then(() => {
          this.setState({ reservedComments: this.props.reservedComments });
          this.toggleCommentsVisibility();
        })
        .catch(() => {
          message.error(
            this.props.intl.formatMessage({
              id: 'error_boundary_page',
              defaultMessage: 'Something went wrong',
            }),
          );
        });
    } else {
      this.toggleCommentsVisibility();
    }
  };

  onCommentSend = () => {
    const { match, getMessageHistory, isGuest } = this.props;
    return isGuest || !match.params[0] ? this.getReservedComments() : getMessageHistory();
  };

  handleSubmitComment = (parentP, commentValue) => {
    const { proposition } = this.props;
    const currentUser = this.getCurrentUser();
    const parentAuthorIfGuest =
      get(currentUser, ['0', 'rootName']) || get(currentUser, ['rootName']);
    const parentPermlinkIfGuest = !this.isReserved
      ? get(proposition, ['users', '0', 'permlink'])
      : get(currentUser, ['0', 'permlink']);
    const { intl } = this.props;
    const parentComment = parentP;
    if (parentComment.author_original) parentComment.author = parentComment.author_original;
    this.setState({ loadingComments: true });
    const commentObj = get(parentComment, ['firstAppeal']);
    return this.props
      .sendCommentMessages(
        parentComment,
        commentValue,
        false,
        commentObj,
        parentAuthorIfGuest,
        parentPermlinkIfGuest,
      )
      .then(() => {
        setTimeout(() => {
          this.onCommentSend().then(() => {
            message.success(
              intl.formatMessage({
                id: 'notify_comment_sent',
                defaultMessage: 'Comment submitted',
              }),
            );
            this.setState({ loadingComments: false, commentFromText: '', commentSubmitted: true });
          });
        }, 12000);
      })
      .catch(() => {
        this.setState({ commentFromText: commentValue, loadingComments: false });
        return {
          error: true,
        };
      });
  };

  handleNotificationComments = (
    commentsArr,
    hasComments,
    postAll,
    rootComment,
    isNotifyComment,
  ) => {
    const { match, user, getMessageHistory, isGuest, proposition } = this.props;
    const { commentsVisible } = this.state;

    const currentFilteredComments =
      hasComments && !commentsVisible && isNotifyComment
        ? filter(
            commentsArr,
            comment => isEqual(match.params.permlink, comment.permlink) && comment,
          )
        : commentsArr;

    const isShow = (!commentsVisible && isNotifyComment) || commentsVisible;

    const reversedComments = currentFilteredComments.reverse();

    return map(reversedComments, currentComment => (
      <div key={currentComment.post_id}>
        <CommentsMessages
          show={isShow}
          user={user}
          post={postAll}
          getMessageHistory={getMessageHistory}
          currentComment={currentComment}
          getReservedComments={this.getReservedComments}
          parent={rootComment}
          matchPath={match.params[0]}
          match={match}
          isGuest={isGuest}
          proposition={proposition}
        />
      </div>
    ));
  };

  render() {
    const {
      modalVisible,
      daysLeft,
      sliderVisible,
      currentPost,
      currentPostReserved,
      commentFormText,
      commentSubmitted,
      loadingComments,
      userFollowed,
      objectFollowed,
    } = this.state;
    const {
      post,
      postState,
      pendingLike,
      ownPost,
      defaultVotePercent,
      pendingFollow,
      saving,
      singlePostVew,
      pendingFollowObject,
      intl,
      toggleModalDetails,
      requiredObjectName,
      loading,
      proposition,
      match,
      user,
      getMessageHistory,
      blacklistUsers,
      reservedComments,
      sortFraudDetection,
    } = this.props;
    const isRewards = !isEmpty(match)
      ? match.params.filterKey === 'reserved' ||
        match.params.filterKey === 'all' ||
        includes(match.path, 'object')
      : '';
    const propositionStatus = isRewards
      ? get(proposition, ['status'])
      : get(proposition, ['users', '0', 'status']);
    const hasComments = !isEmpty(proposition.conversation) || !isEmpty(reservedComments);
    const postCurrent = proposition.conversation;
    const commentsAll = get(postCurrent, ['all']) || reservedComments;
    const postAll = postCurrent || { all: commentsAll };
    const rootKey = findKey(commentsAll, ['depth', 2]);
    const rootComment = commentsAll[rootKey];
    const repliesKeys = get(commentsAll, [rootKey, 'replies']);
    const commentsArr = map(repliesKeys, key => get(commentsAll, [key]));
    const numberOfComments = postCurrent
      ? size(commentsAll) - 1
      : size(currentPostReserved.content) - 1;
    const isNotifyComment = Boolean(this.props.match.params.campaignId);
    return (
      <div className="CampaignFooter">
        <div className="CampaignFooter__actions">
          {sliderVisible && (
            <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
          )}
          {!sliderVisible && (
            <CampaignButtons
              daysLeft={daysLeft}
              toggleModalDetails={toggleModalDetails}
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              pendingFollow={pendingFollow}
              pendingFollowObject={pendingFollowObject}
              saving={saving}
              ownPost={ownPost}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={this.handleLikeClick}
              onEditClick={this.handleEditClick}
              onCommentClick={this.handleCommentClick}
              handlePostPopoverMenuClick={this.handlePostPopoverMenuClick}
              requiredObjectName={requiredObjectName}
              propositionGuideName={proposition.guide.name}
              propositionStatus={propositionStatus}
              proposition={proposition}
              match={match}
              user={user}
              toggleModal={this.toggleModal}
              numberOfComments={numberOfComments}
              getMessageHistory={getMessageHistory}
              blacklistUsers={blacklistUsers}
              sortFraudDetection={sortFraudDetection}
              userFollowed={userFollowed}
              objectFollowed={objectFollowed}
            />
          )}
        </div>
        {sliderVisible && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
          />
        )}
        {this.handleNotificationComments(
          commentsArr,
          hasComments,
          postAll,
          rootComment,
          isNotifyComment,
        )}
        {!singlePostVew && (
          <QuickCommentEditor
            parentPost={currentPost}
            username={user.name}
            onSubmit={this.handleSubmitComment}
            isLoading={loadingComments}
            inputValue={commentFormText}
            submitted={commentSubmitted}
          />
        )}
        <Modal
          closable
          maskClosable={false}
          title={intl.formatMessage({
            id: 'reject_campaign',
            defaultMessage: `Reject rewards campaign`,
          })}
          visible={modalVisible}
          onOk={this.modalOnOklHandler}
          onCancel={this.toggleModal}
          confirmLoading={loading}
        >
          {intl.formatMessage({
            id: 'reject_campaign_accept',
            defaultMessage: `Do you want to reject rewards campaign?`,
          })}
        </Modal>
      </div>
    );
  }
}

export default CampaignFooter;
