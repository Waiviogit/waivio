import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import find from 'lodash/find';
import Slider from '../../components/Slider/Slider';
import CampaignButtons from './CampaignButtons';
import Comments from '../../comments/Comments';
import { getVoteValue } from '../../helpers/user';
import { getDaysLeft } from '../rewardsHelper';
import { getRate, getAppUrl } from '../../reducers';
import Confirmation from '../../components/StoryFooter/Confirmation';
import withAuthActions from '../../auth/withAuthActions';
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
    defaultVotePercent: PropTypes.number.isRequired,
    likeComment: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    unfollowObject: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    followObject: PropTypes.func.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
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
  };

  constructor(props) {
    super(props);

    this.state = {
      sliderVisible: false,
      commentsVisible: !props.post.children,
      sliderValue: 100,
      voteWorth: 0,
      modalVisible: false,
      reservedUser: {},
      daysLeft: 0,
      loading: false
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
    const { proposition } = this.props;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      daysLeft: getDaysLeft(
        proposition.objects[0].reservationCreated,
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

  handleFollowClick(post) {
    const { userFollowed } = this.props.postState;
    if (userFollowed) {
      this.props.unfollowUser(post.parent_author);
    } else {
      this.props.followUser(post.parent_author);
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

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  modalOnOklHandler = () => {
    const { proposedWobj, discardPr } = this.props;
    setTimeout(() => this.toggleModal(), 6000);
    discardPr(proposedWobj);
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
    if (this.props.post.children > 0) {
      this.setState(prevState => ({ commentsVisible: isVisible || !prevState.commentsVisible }));
    }
    this.setState({ isComment: !this.state.isComment });
  };

  render() {
    const { commentsVisible, modalVisible, isComment, daysLeft } = this.state;
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
    } = this.props;
    return (
      <div className="CampaignFooter">
        <div className="CampaignFooter__actions">
          {this.state.sliderVisible && (
            <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
          )}
          {!this.state.sliderVisible && (
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
            />
          )}
        </div>
        {this.state.sliderVisible && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
          />
        )}
        {!singlePostVew && isComment && (
          <Comments show={commentsVisible} isQuickComments={!singlePostVew} post={post} />
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
