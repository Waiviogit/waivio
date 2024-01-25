import React, { useEffect, useState } from 'react';
import { some, find, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { FormattedDate, FormattedRelative, FormattedTime, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import WeightTag from '../../components/WeightTag';
import BTooltip from '../../components/BTooltip';
import Avatar from '../../components/Avatar';
import StoryPreview from '../../components/Story/StoryPreview';
import Comments from '../../comments/Comments';
import Slider from '../../components/Slider/Slider';
import AppendObjButtons from '../../components/StoryFooter/AppendObjButtons';
import { getAppendDownvotes, getAppendUpvotes } from '../../../common/helpers/voteHelpers';
import Payout from '../../components/StoryFooter/Payout';
import Confirmation from '../../components/StoryFooter/Confirmation';
import ApprovingCard from './ApprovingCard';
import { calculateVotePowerForSlider } from '../../vendor/steemitHelpers';
import { getAuthenticatedUser, isGuestUser } from '../../../store/authStore/authSelectors';
import {
  getShowNSFWPosts,
  getVotePercent,
  getVotingPower,
} from '../../../store/settingsStore/settingsSelectors';
import { voteAppends } from '../../../store/appendStore/appendActions';
import { getObjectFieldName } from '../../../common/helpers/wObjectHelper';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getMinRejectVote } from '../../../waivioApi/ApiClient';

import '../../components/Story/Story.less';
import '../../components/StoryFooter/StoryFooter.less';
import '../../components/StoryFooter/Buttons.less';

const AppendCard = props => {
  const [visibleSlider, showSlider] = useState(false);
  const [reactionsModalVisible, showReactionModal] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const [voteWorth, setVoteWorth] = useState(100);
  const match = useRouteMatch();

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

  const handleLikeClick = (post, weight = 10000) => {
    const { sliderMode } = props;

    if (isLiked) {
      props.voteAppends(props.post.author, props.post.permlink, 0, '', false, match.params[0]);
    } else if (sliderMode && !isLiked) {
      showSlider(true);
    } else {
      props.voteAppends(props.post.author, props.post.permlink, weight, '', false, match.params[0]);
    }
  };

  const handleSliderChange = async value => {
    const { user, post, isGuest } = props;
    const voteWorthCalc = isGuest
      ? 0
      : await calculateVotePowerForSlider(user.name, value, post.author, post.permlink);

    setVoteWorth(voteWorthCalc);
    setSliderValue(value);
  };

  const handleReportClick = async post => {
    const { user } = props;
    const downVotes = getAppendDownvotes(post.active_votes);
    const isReject = post.isReject || some(downVotes, { voter: user.name });
    let voteWeight;

    if (isReject) voteWeight = 0;
    else {
      voteWeight =
        isEmpty(upVotes) || (isLiked && upVotes?.length === 1)
          ? 1
          : (await getMinRejectVote(user.name, post.author, post.permlink, match.params.name))
              ?.result;
    }

    props.voteAppends(post.author, post.permlink, voteWeight, '', false, match.params[0]);
  };

  const handleCommentsClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentsVisible && props.post.children) {
      setCommentsVisible(true);
    } else {
      setCommentsVisible(false);
    }
  };

  const handleLikeConfirm = () => {
    showSlider(false);
    props.voteAppends(
      props.post.author,
      props.post.permlink,
      sliderValue * 100,
      '',
      false,
      match.params[0],
      null,
      false,
      true,
    );
  };

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
                    <FormattedDate value={props.post.createdAt} />{' '}
                    <FormattedTime value={props.post.createdAt} />
                  </span>
                }
              >
                <span className="Story__date">
                  <FormattedRelative value={props.post.createdAt} />
                </span>
              </BTooltip>
            </span>
          </div>
        </div>
      </div>
      <div className="Story__content">
        <a
          href={`/@${props.post.author}/${props.post.permlink}`}
          rel="noopener noreferrer"
          className="Story__content__title"
        >
          <h2>{getObjectFieldName(props.post.name, props.wobj, props.intl)}</h2>
        </a>
        <a
          href={`/@${props.post.author}/${props.post.permlink}`}
          rel="noopener noreferrer"
          target="_blank"
          className="Story__content__preview"
        >
          <StoryPreview post={props.post} isUpdates />
        </a>
        <ApprovingCard post={props.post} />
      </div>
      <div className="Story__footer">
        <div className="StoryFooter__actions">
          <Payout post={props.post} isUpdates />
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
        <Comments show={commentsVisible} isQuickComments post={props.post} isUpdating />
      </div>
    </div>
  );
};

AppendCard.propTypes = {
  post: PropTypes.shape().isRequired,
  wobj: PropTypes.shape().isRequired,
  defaultVotePercent: PropTypes.number.isRequired,
  voteAppends: PropTypes.func.isRequired,
  user: PropTypes.shape().isRequired,
  sliderMode: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  defaultVotePercent: getVotePercent(state),
  sliderMode: getVotingPower(state),
  showNSFWPosts: getShowNSFWPosts(state),
  user: getAuthenticatedUser(state),
  isGuest: isGuestUser(state),
  wobj: getObject(state),
});

export default connect(mapStateToProps, {
  voteAppends,
})(injectIntl(AppendCard));
