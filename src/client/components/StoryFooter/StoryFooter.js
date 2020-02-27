import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import Slider from '../Slider/Slider';
import Payout from './Payout';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import Comments from '../../../client/comments/Comments';
import { getVoteValue } from '../../helpers/user';
import { getRate, isGuestUser } from '../../reducers';
import './StoryFooter.less';

@connect(state => ({
  rate: getRate(state),
  isGuest: isGuestUser(state),
}))
class StoryFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
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
    onEditClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
    isGuest: PropTypes.bool,
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
    onEditClick: () => {},
    handlePostPopoverMenuClick: () => {},
    onReportClick: () => {},
    isGuest: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      sliderVisible: false,
      commentsVisible: !props.post.children,
      sliderValue: 100,
      voteWorth: 0,
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
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.props.onLikeClick(this.props.post, this.props.postState);
    }
  };

  handleLikeConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      this.props.onLikeClick(this.props.post, this.props.postState, this.state.sliderValue * 100);
    });
  };

  handleShareClick = () => this.props.onShareClick(this.props.post);

  handleEditClick = () => this.props.onEditClick(this.props.post);

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = value => {
    const { user, rewardFund, rate, isGuest } = this.props;
    const voteWorth = isGuest
      ? 0
      : getVoteValue(user, rewardFund.recent_claims, rewardFund.reward_balance, rate, value * 100);
    this.setState({ sliderValue: value, voteWorth });
  };

  toggleCommentsVisibility = isVisible => {
    if (this.props.post.children > 0) {
      this.setState(prevState => ({ commentsVisible: isVisible || !prevState.commentsVisible }));
    }
  };

  render() {
    const { commentsVisible } = this.state;
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
      handlePostPopoverMenuClick,
      onReportClick,
    } = this.props;

    return (
      <div className="StoryFooter">
        <div className="StoryFooter__actions">
          <Payout post={post} />
          {this.state.sliderVisible && !postState.isLiked && (
            <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
          )}
          {(!this.state.sliderVisible || postState.isLiked) && (
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
              onReportClick={onReportClick}
              onShareClick={this.handleShareClick}
              onEditClick={this.handleEditClick}
              onCommentClick={this.toggleCommentsVisibility}
              handlePostPopoverMenuClick={handlePostPopoverMenuClick}
            />
          )}
        </div>
        {this.state.sliderVisible && !postState.isLiked && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
          />
        )}
        {!singlePostVew && (
          <Comments show={commentsVisible} isQuickComments={!singlePostVew} post={post} />
        )}
      </div>
    );
  }
}

export default StoryFooter;
