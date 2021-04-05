import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import Slider from '../Slider/Slider';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import {
  calculateVotePowerForSlider,
  isFlaggedPost,
  isPostCashout,
} from '../../vendor/steemitHelpers';
import { isGuestUser } from '../../reducers';
import { getDownvotes } from '../../helpers/voteHelpers';
import MuteModal from '../../widgets/MuteModal';
import { muteAuthorComment } from '../../comments/commentsActions';

import './CommentFooter.less';

@connect(
  state => ({
    isGuest: isGuestUser(state),
  }),
  {
    muteAuthorComment,
  },
)
export default class CommentFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    comment: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    sliderMode: PropTypes.bool,
    editable: PropTypes.bool,
    editing: PropTypes.bool,
    replying: PropTypes.bool,
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        percent: PropTypes.number,
      }),
    ),
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onReplyClick: PropTypes.func,
    handleHideComment: PropTypes.func,
    onEditClick: PropTypes.func,
    muteAuthorComment: PropTypes.func,
    isGuest: PropTypes.bool,
  };

  static defaultProps = {
    pendingLike: false,
    ownPost: false,
    sliderMode: false,
    editable: false,
    editing: false,
    replying: false,
    pendingVotes: [],
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onReplyClick: () => {},
    onEditClick: () => {},
    handleHideComment: () => {},
    muteAuthorComment: () => {},
    isGuest: false,
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
    voteWorth: 0,
    replyFormVisible: false,
    isLiked: false,
    isFlagged: false,
    sliderType: 'confirm',
    visible: false,
  };

  componentWillMount() {
    const { user, comment, defaultVotePercent } = this.props;

    if (user) {
      const userVote = find(comment.active_votes, { voter: user.name }) || {};

      if (userVote.percent && userVote.percent > 0) {
        this.setState({
          sliderValue: userVote.percent / 100,
          isLiked: true,
        });
      } else {
        this.setState({
          sliderValue: defaultVotePercent / 100,
        });
      }
    }
  }

  handleLikeClick = () => {
    const { sliderMode, comment } = this.props;
    const { isLiked } = this.state;

    if (sliderMode || (isPostCashout(this.props.comment) && !isLiked)) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderType: 'Confirm',
        }));
      }
    } else {
      this.props.onLikeClick(comment.id);
      this.setState({ isLiked: !this.state.isLiked });
    }
  };

  handleDislikeClick = () => {
    const isReported = getDownvotes(this.props.comment.active_votes).some(
      ({ voter }) => voter === this.props.user.name,
    );

    if (this.props.sliderMode && !isReported) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderType: 'flag',
        }));
      }
    } else {
      this.props.onDislikeClick(this.props.comment.id);
    }
  };

  handleLikeConfirm = () => {
    const confirmMethod =
      this.state.sliderType === 'Confirm' ? this.props.onLikeClick : this.props.onDislikeClick;

    this.setState({ sliderVisible: false }, () => {
      confirmMethod(this.props.comment.id, this.state.sliderValue * 100);
    });
  };

  handleHideComment = () => this.props.handleHideComment(this.props.comment);

  handleSliderCancel = () => this.setState({ sliderVisible: false, sliderType: 'Confirm' });

  handleMutePostAuthor = post =>
    post.muted ? this.props.muteAuthorComment(post) : this.setState({ visible: true });

  handleClickPopoverMenu = key => {
    switch (key) {
      case 'flag':
        return this.handleDislikeClick();
      case 'hide':
        return this.handleHideComment();
      case 'mute':
        return this.handleMutePostAuthor(this.props.comment);
      default:
        return () => {};
    }
  };

  handleSliderChange = async value => {
    const { isGuest, user, comment } = this.props;
    const voteWorth = isGuest
      ? 0
      : await calculateVotePowerForSlider(user.name, value, comment.root_author, comment.permlink);

    this.setState({ sliderValue: value, voteWorth });
  };

  render() {
    const {
      user,
      comment,
      defaultVotePercent,
      editable,
      editing,
      replying,
      pendingVotes,
    } = this.props;
    const { sliderVisible, isLiked, sliderType } = this.state;
    const isCashout = isPostCashout(comment);
    const isFlagged = isFlaggedPost(comment.active_votes, user.name);

    return (
      <div className="CommentFooter">
        {!comment.isFakeComment && (
          <React.Fragment>
            {sliderVisible && (!isLiked || !isFlagged) && (
              <Confirmation
                onConfirm={this.handleLikeConfirm}
                onCancel={this.handleSliderCancel}
                isCashout={isCashout}
                type={sliderType}
              />
            )}
            {(!sliderVisible || isLiked) && (
              <Buttons
                editable={editable}
                editing={editing}
                replying={replying}
                user={user}
                comment={comment}
                pendingVotes={pendingVotes}
                defaultVotePercent={defaultVotePercent}
                onLikeClick={this.handleLikeClick}
                onDislikeClick={this.handleDislikeClick}
                handlePopoverClick={this.handleClickPopoverMenu}
                onReplyClick={this.props.onReplyClick}
                onEditClick={this.props.onEditClick}
              />
            )}
          </React.Fragment>
        )}
        {sliderVisible && !isLiked && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
            isPostCashout={isPostCashout(comment)}
          />
        )}
        <MuteModal
          item={comment}
          type="comment"
          visible={this.state.visible}
          setVisibleMuteModal={state => this.setState({ visible: state })}
          username={comment.author}
        />
      </div>
    );
  }
}
