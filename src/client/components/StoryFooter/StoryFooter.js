import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import Slider from '../Slider/Slider';
import Payout from './Payout';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import Comments from '../../../client/comments/Comments';
import { calculateVotePowerForSlider } from '../../vendor/steemitHelpers';
import {
  getSocialInfoPost,
  handleHidePost,
  muteAuthorPost,
} from '../../../store/postsStore/postActions';
import withAuthActions from '../../auth/withAuthActions';
import MuteModal from '../../widgets/MuteModal';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';

import './StoryFooter.less';

@withAuthActions
@connect(
  state => ({
    isGuest: isGuestUser(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getSocialInfoPostAction: getSocialInfoPost,
    handleHidePost,
    muteAuthorPost,
  },
)
class StoryFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.bool,
    pendingLike: PropTypes.bool,
    pendingFlag: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    singlePostVew: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onActionInitiated: PropTypes.func.isRequired,
    muteAuthorPost: PropTypes.func.isRequired,
    isGuest: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    getSocialInfoPostAction: PropTypes.func,
    handleEditClick: PropTypes.func.isRequired,
    handleFollowClick: PropTypes.func,
    toggleBookmark: PropTypes.func.isRequired,
    handleHidePost: PropTypes.func.isRequired,
    userComments: PropTypes.bool,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFlag: false,
    ownPost: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    singlePostVew: false,
    sliderMode: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    handlePostPopoverMenuClick: () => {},
    handleFollowClick: () => {},
    onReportClick: () => {},
    userName: '',
    getSocialInfoPostAction: () => {},
    userComments: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      sliderVisible: false,
      sliderState: 'confirm',
      commentsVisible: !props.post.children,
      sliderValue: 100,
      voteWorth: 0,
      visible: false,
    };
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

  handleLikeClick = () => {
    if (this.props.sliderMode && !this.props.postState.isLiked) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderType: 'confirm',
        }));
      }
    } else {
      this.props.onLikeClick(this.props.post, this.props.postState);
    }
  };

  handleFlagClick = () => {
    if (this.props.sliderMode && !this.props.postState.isReported) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderType: 'flag',
        }));
      }
    } else {
      this.props.onReportClick(this.props.post, this.props.postState);
    }
  };

  handleClickConfirm = () => {
    const confirmMethod =
      this.state.sliderType === 'confirm' ? this.props.onLikeClick : this.props.onReportClick;

    this.setState({ sliderVisible: false }, () => {
      confirmMethod(this.props.post, this.props.postState, this.state.sliderValue * 100);
    });
  };

  handleShareClick = () => this.props.onShareClick(this.props.post);

  handleSliderCancel = () => this.setState({ sliderVisible: false, sliderType: 'Confirm' });

  handleMutePostAuthor = post =>
    post.muted ? this.props.muteAuthorPost(post) : this.setState({ visible: true });

  handlePostPopoverMenuClick = key => {
    const { post, postState, handleEditClick, handleFollowClick, toggleBookmark } = this.props;

    switch (key) {
      case 'follow':
        handleFollowClick(post);
        break;
      case 'save':
        toggleBookmark(`${post.author}/${post.permlink}`);
        break;
      case 'report':
        this.handleFlagClick(post, postState);
        break;
      case 'edit':
        handleEditClick(post);
        break;
      case 'hide':
        this.props.handleHidePost(post);
        break;
      case 'mute':
        this.handleMutePostAuthor(post);
        break;
      default:
    }
  };

  handlePopoverClick = key =>
    this.props.onActionInitiated(this.handlePostPopoverMenuClick.bind(this, key));

  handleSliderChange = async value => {
    const { user, isGuest, post } = this.props;
    const voteWorth = isGuest
      ? 0
      : await calculateVotePowerForSlider(user.name, value, post.author, post.permlink);

    this.setState({ sliderValue: value, voteWorth });
  };

  toggleCommentsVisibility = isVisible => {
    if (this.props.post.children > 0) {
      this.setState(prevState => ({ commentsVisible: isVisible || !prevState.commentsVisible }));
    }
  };

  render() {
    const { commentsVisible, sliderType } = this.state;
    const {
      post,
      postState,
      pendingLike,
      pendingFlag,
      ownPost,
      defaultVotePercent,
      pendingFollow,
      pendingBookmark,
      saving,
      singlePostVew,
      getSocialInfoPostAction,
      userComments,
    } = this.props;

    return (
      <div className="StoryFooter">
        <div className="StoryFooter__actions">
          <Payout post={post} />
          {this.state.sliderVisible && (!postState.isLiked || !postState.isReported) && (
            <Confirmation
              onConfirm={this.handleClickConfirm}
              onCancel={this.handleSliderCancel}
              type={sliderType}
            />
          )}
          {!this.state.sliderVisible && (
            <Buttons
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              pendingFlag={pendingFlag}
              pendingFollow={pendingFollow}
              pendingBookmark={pendingBookmark}
              saving={saving}
              ownPost={ownPost}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={this.handleLikeClick}
              onShareClick={this.handleShareClick}
              onCommentClick={this.toggleCommentsVisibility}
              handlePostPopoverMenuClick={this.handlePopoverClick}
              username={this.props.userName}
              getSocialInfoPost={getSocialInfoPostAction}
              isGuest={this.props.isGuest}
              userComments={userComments}
            />
          )}
        </div>
        {this.state.sliderVisible && (!postState.isLiked || !postState.isReported) && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
            post={post}
            type={sliderType}
          />
        )}
        {!singlePostVew && (
          <Comments show={commentsVisible} isQuickComments={!singlePostVew} post={post} />
        )}
        <MuteModal
          item={post}
          type={'post'}
          visible={this.state.visible}
          setVisibleMuteModal={state => this.setState({ visible: state })}
          username={post.author}
        />
      </div>
    );
  }
}

export default StoryFooter;
