import React, { useEffect, useState } from 'react';
import { some, find } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelative,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import WeightTag from '../components/WeightTag';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import StoryPreview from '../components/Story/StoryPreview';
import Comments from '../comments/Comments';
import Slider from '../components/Slider/Slider';
import AppendObjButtons from '../components/StoryFooter/AppendObjButtons';
import {
  getAuthenticatedUser,
  getRate,
  getRewardFund,
  getShowNSFWPosts,
  getVotePercent,
  getVotingPower,
  isGuestUser,
} from '../reducers';
import { getAppendDownvotes, getAppendUpvotes } from '../helpers/voteHelpers';
import { voteAppends } from './wobjActions';
import Payout from '../components/StoryFooter/Payout';
import Confirmation from '../components/StoryFooter/Confirmation';
import { getVoteValue } from '../helpers/user';
import ApprovingCard from './ApprovingCard';

const AppendCard = props => {
  const [visibleSlider, showSlider] = useState(false);
  const [reactionsModalVisible, showReactionModal] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(props.post.child);
  const [sliderValue, setSliderValue] = useState(100);
  const [voteWorth, setVoteWorth] = useState(100);
  const author =
    props.post.guestInfo && !props.post.depth ? props.post.root_author : props.post.author;
  const postId = `${props.post.author}/${props.post.permlink}`;

  const calculateSliderValue = () => {
    const { user, post, defaultVotePercent } = props;

    if (user) {
      const userVote = find(post.active_votes, { voter: user.name }) || {};

      if (userVote.percent && userVote.percent > 0) {
        setSliderValue(userVote.percent / 100);
      } else {
        setSliderValue(defaultVotePercent / 100);
      }
    }
  };

  useEffect(() => calculateSliderValue(), []);
  const upVotes = props.post.active_votes && getAppendUpvotes(props.post.active_votes);
  const isLiked = props.post.isLiked || some(upVotes, { voter: props.user.name });

  function handleLikeClick(post, weight = 10000, type) {
    const { sliderMode } = props;

    if (isLiked) {
      props.voteAppends(postId, author, props.post.permlink, 0, type);
    } else if (sliderMode && !isLiked) {
      showSlider(true);
    } else {
      props.voteAppends(postId, author, props.post.permlink, weight, type);
    }
  }

  function handleSliderChange(value) {
    const { user, rewardFund, rate, isGuest } = props;
    const voteWorthCalc = isGuest
      ? 0
      : getVoteValue(user, rewardFund.recent_claims, rewardFund.reward_balance, rate, value * 100);

    setVoteWorth(voteWorthCalc);
    setSliderValue(value);
  }

  function handleReportClick(post, myWeight, type) {
    const { user } = props;
    const downVotes = getAppendDownvotes(post.active_votes);
    const isReject = post.isReject || some(downVotes, { voter: user.name });

    if (isReject) {
      props.voteAppends(postId, post.author, post.permlink, 0, type);
    } else {
      props.voteAppends(postId, post.author, post.permlink, myWeight, type);
    }
  }

  function handleCommentsClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!commentsVisible) {
      setCommentsVisible(true);
    } else {
      setCommentsVisible(false);
    }
  }

  function handleLikeConfirm() {
    showSlider(false);
    props.voteAppends(postId, author, props.post.permlink, sliderValue * 100, 'approve');
  }

  return (
    <div className="Story">
      <div className="Story__content">
        <div className="Story__header">
          <Link to={`/@${props.post.creator}`}>
            <Avatar username={props.post.creator} size={40} />
          </Link>
          <div className="Story__header__text">
            <span className="Story__header__flex">
              <h4>
                <Link to={`/@${props.post.creator}`}>
                  <span className="username">{props.post.creator}</span>
                </Link>
              </h4>
              <WeightTag weight={props.post.weight} />
            </span>
            <span>
              <BTooltip
                title={
                  <span>
                    <FormattedDate value={`${props.post.created}Z`} />{' '}
                    <FormattedTime value={`${props.post.created}Z`} />
                  </span>
                }
              >
                <span className="Story__date">
                  <FormattedRelative value={`${props.post.created}Z`} />
                </span>
              </BTooltip>
            </span>
          </div>
        </div>
      </div>
      <div className="Story__content">
        <a
          href={`/@${props.post.author_original}/${props.post.permlink}`}
          rel="noopener noreferrer"
          className="Story__content__title"
        >
          <h2>
            <FormattedMessage
              id={`object_field_${props.post.append_field_name}`}
              defaultMessage={props.post.append_field_name}
            />
          </h2>
        </a>
        <a
          href={`/@${props.post.author_original}/${props.post.permlink}`}
          rel="noopener noreferrer"
          target="_blank"
          className="Story__content__preview"
        >
          <StoryPreview post={props.post} />
        </a>
        <ApprovingCard post={props.post} />
      </div>
      <div className="Story__footer">
        <div className="StoryFooter__actions">
          <Payout post={props.post} />
          {visibleSlider && !isLiked && (
            <Confirmation onConfirm={handleLikeConfirm} onCancel={() => showSlider(false)} />
          )}
          {!visibleSlider && (
            <AppendObjButtons
              post={props.post}
              handleLikeClick={handleLikeClick}
              onFlagClick={handleReportClick}
              handleShowReactions={() => showReactionModal(true)}
              handleCommentsClick={handleCommentsClick}
              handleCloseReactions={() => showReactionModal(false)}
              reactionsModalVisible={reactionsModalVisible}
              defaultVotePercent={props.defaultVotePercent}
            />
          )}
        </div>
        {visibleSlider && !isLiked && (
          <Slider value={sliderValue} voteWorth={voteWorth} onChange={handleSliderChange} />
        )}
        <Comments show={commentsVisible} isQuickComments post={props.post} />
      </div>
    </div>
  );
};

AppendCard.propTypes = {
  post: PropTypes.shape().isRequired,
  defaultVotePercent: PropTypes.number.isRequired,
  voteAppends: PropTypes.func.isRequired,
  user: PropTypes.shape().isRequired,
  sliderMode: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  rewardFund: PropTypes.shape().isRequired,
  rate: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  defaultVotePercent: getVotePercent(state),
  sliderMode: getVotingPower(state),
  showNSFWPosts: getShowNSFWPosts(state),
  user: getAuthenticatedUser(state),
  isGuest: isGuestUser(state),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
});

export default connect(mapStateToProps, {
  voteAppends,
})(injectIntl(AppendCard));
