import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { message, Modal } from 'antd';
import { findKey, find, get, isEmpty, map, includes, filter, size } from 'lodash';
import Slider from '../../components/Slider/Slider';
import CampaignButtons from './CampaignButtons';
import Comments from '../../comments/Comments';
import { ASSIGNED, IS_RESERVED } from '../../../common/constants/rewards';
import CommentsMessages from './Comments';
import { getVoteValue } from '../../helpers/user';
import { getDaysLeft } from '../rewardsHelper';
import {
  getRate,
  getAppUrl,
  isGuestUser,
  getCommentsFromReserved,
  getAuthenticatedUserName,
} from '../../reducers';
import Confirmation from '../../components/StoryFooter/Confirmation';
import { getReservedComments } from '../../comments/commentsActions';
import withAuthActions from '../../auth/withAuthActions';
import { getContent } from '../../../waivioApi/ApiClient';
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
  }),
  {
    getReservedComments,
  },
)
class CampaignFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    proposedWobj: PropTypes.shape().isRequired,
    proposition: PropTypes.shape().isRequired,
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
    };
    this.handlePostPopoverMenuClick = this.handlePostPopoverMenuClick.bind(this);

    this.isReserved = this.props.match.params.filterKey === IS_RESERVED;
  }

  componentWillMount() {
    const { user, post, defaultVotePercent } = this.props;
    if (user) {
      const userVote = find(post.active_votes, { voter: user.name }) || {};

      if (userVote.percent && userVote.percent > 0) {
        this.setState({
          sliderValue: userVote.percent / 100,
        });
      } else {
        this.setState({
          sliderValue: defaultVotePercent / 100,
        });
      }
    }
  }

  componentDidMount() {
    const { proposition, match } = this.props;
    const currentUser = this.getCurrentUser();
    const author = this.isReserved
      ? get(currentUser, ['0', 'name'])
      : get(proposition, ['users', '0', 'name']);
    const permlink = this.isReserved
      ? get(currentUser, ['0', 'permlink'])
      : get(proposition, ['users', '0', 'permlink']);
    this.getReservedComments();

    if (!isEmpty(author) && !isEmpty(permlink)) {
      getContent(author, permlink).then(res => this.setState({ currentPost: res }));
    }
    const isRewards = match.params.filterKey === 'reserved' || match.params.filterKey === 'all';
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      daysLeft: getDaysLeft(
        isRewards
          ? get(proposition, ['objects', '0', 'reservationCreated'])
          : get(currentUser, ['0', 'createdAt']),
        proposition.count_reservation_days,
      ),
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
      currentUser = filter(proposition.users, usersItem => usersItem.name === userName);
    }

    return currentUser;
  };

  getReservedComments = () => {
    const { proposition, isGuest } = this.props;
    const currentUser = this.getCurrentUser();
    const author = isGuest ? get(currentUser, ['0', 'rootName']) : get(currentUser, ['0', 'name']);
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
    const { userFollowed } = this.props.postState;
    const { proposition } = this.props;

    if (userFollowed) {
      this.props.unfollowUser(proposition.guideName);
    } else {
      this.props.followUser(proposition.guideName);
    }
  }

  handleFollowObjectClick() {
    const { objectFollowed } = this.props.postState;
    if (objectFollowed) {
      this.props.unfollowObject(this.props.requiredObjectPermlink);
    } else {
      this.props.followObject(this.props.requiredObjectPermlink);
    }
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
        this.props.history.push('/rewards/active'),
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

  render() {
    const {
      commentsVisible,
      modalVisible,
      daysLeft,
      sliderVisible,
      currentPostReserved,
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
    } = this.props;
    const isRewards =
      match.params.filterKey === 'reserved' ||
      match.params.filterKey === 'all' ||
      includes(match.path, 'object');
    const propositionStatus = isRewards
      ? get(proposition, ['status'])
      : get(proposition, ['users', '0', 'status']);
    const hasComments = !isEmpty(proposition.conversation) || !isEmpty(reservedComments);
    const postCurrent = proposition.conversation;
    const commentsAll = get(postCurrent, ['all']) || reservedComments;
    const postAll = postCurrent || { all: commentsAll };
    const rootKey = findKey(commentsAll, ['depth', 2]);
    const repliesKeys = get(commentsAll, [rootKey, 'replies']);
    const commentsArr = map(repliesKeys, key => get(commentsAll, [key]));
    const numberOfComments = postCurrent
      ? size(commentsAll) - 1
      : size(currentPostReserved.content) - 1;
    const currentUser = this.getCurrentUser();
    const parentAuthor = get(currentUser, ['0', 'rootName']);
    const parentPermlink = !this.isReserved
      ? get(proposition, ['users', '0', 'permlink'])
      : get(currentUser, ['0', 'permlink']);

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
        {hasComments &&
          map(commentsArr, currentComment => (
            <div key={currentComment.post_id}>
              <CommentsMessages
                show={commentsVisible}
                user={user}
                post={postAll}
                getMessageHistory={getMessageHistory}
                currentComment={currentComment}
                history
              />
            </div>
          ))}
        {!singlePostVew && (
          <Comments
            show={commentsVisible}
            isQuickComments={!singlePostVew}
            post={this.state.currentPost}
            getMessageHistory={getMessageHistory}
            match={match}
            history
            parentAuthorIfGuest={parentAuthor}
            parentPermlinkIfGuest={parentPermlink}
            getReservedComments={this.getReservedComments}
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
