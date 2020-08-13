import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { message, Modal } from 'antd';
import { findKey, find, get, isEmpty, map, includes } from 'lodash';
import Slider from '../../components/Slider/Slider';
import CampaignButtons from './CampaignButtons';
import Comments from '../../comments/Comments';
import CommentsMessages from './Comments';
import { getVoteValue } from '../../helpers/user';
import { getDaysLeft } from '../rewardsHelper';
import { getRate, getAppUrl } from '../../reducers';
import Confirmation from '../../components/StoryFooter/Confirmation';
import withAuthActions from '../../auth/withAuthActions';
import { getContent } from '../../../waivioApi/ApiClient';
import './CampaignFooter.less';

@injectIntl
@withAuthActions
@connect(state => ({
  rate: getRate(state),
  appUrl: getAppUrl(state),
}))
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
    };
    this.handlePostPopoverMenuClick = this.handlePostPopoverMenuClick.bind(this);
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
    const author = get(proposition, ['objects', '0', 'author']);
    const permlink = get(proposition, ['objects', '0', 'permlink']);

    if (author && permlink) {
      getContent(author, permlink).then(res => this.setState({ currentPost: res }));
    }
    const isRewards = match.params.filterKey === 'reserved' || match.params.filterKey === 'all';
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      daysLeft: getDaysLeft(
        isRewards
          ? get(proposition, ['objects', '0', 'reservationCreated'])
          : get(proposition, ['users', '0', 'createdAt']),
        proposition.count_reservation_days,
      ),
    });
  }

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

  toggleCommentsVisibility = isVisible => {
    const { proposition } = this.props;
    const hasComments = !isEmpty(proposition.conversation);
    if (hasComments) {
      this.setState(prevState => ({ commentsVisible: isVisible || !prevState.commentsVisible }));
    }
    this.setState({ isComment: !this.state.isComment });
  };

  render() {
    const { commentsVisible, modalVisible, daysLeft, sliderVisible } = this.state;
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
    } = this.props;
    const isRewards =
      match.params.filterKey === 'reserved' ||
      match.params.filterKey === 'all' ||
      includes(match.path, 'object');
    const propositionStatus = isRewards
      ? get(proposition, ['status'])
      : get(proposition, ['users', '0', 'status']);
    const postCurrent = proposition.conversation;
    const hasComments = !isEmpty(proposition.conversation);
    const commentsAll = get(postCurrent, ['all']);
    const rootKey = findKey(commentsAll, ['depth', 2]);
    const repliesKeys = get(commentsAll, [rootKey, 'replies']);
    const commentsArr = map(repliesKeys, key => get(commentsAll, [key]));
    const numberOfComments = commentsArr.length;

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
              onCommentClick={this.toggleCommentsVisibility}
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
                post={postCurrent}
                getMessageHistory={getMessageHistory}
                currentComment={currentComment}
              />
            </div>
          ))}
        {!singlePostVew && (
          <Comments
            show={commentsVisible}
            isQuickComments={!singlePostVew}
            post={this.state.currentPost}
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
