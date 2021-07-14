import { some } from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import take from 'lodash/take';
import { Link } from 'react-router-dom';
import { sortVotes } from '../../helpers/sortHelpers';
import { getAppendUpvotes, getAppendDownvotes } from '../../helpers/voteHelpers';
import BTooltip from '../BTooltip';
import ReactionsModal from '../Reactions/ReactionsModal';
import USDDisplay from '../Utils/USDDisplay';
import withAuthActions from '../../auth/withAuthActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './Buttons.less';

const AppendObjButtons = ({
  post,
  intl,
  handleLikeClick,
  handleCommentsClick,
  handleShowReactions,
  onFlagClick,
  userName,
  reactionsModalVisible,
  handleCloseReactions,
  defaultVotePercent,
  onActionInitiated,
}) => {
  const [key, setKey] = useState('1');
  const upVotes = getAppendUpvotes(post.active_votes).sort(sortVotes);
  const downVotes = getAppendDownvotes(post.active_votes)
    .sort(sortVotes)
    .reverse();
  const isLiked = post.isLiked || some(upVotes, { voter: userName });
  const isReject = post.isReject || some(downVotes, { voter: userName });
  const handleApprove = () => onActionInitiated(() => handleLikeClick(post, 10000, 'approve'));
  const handleReject = () => onActionInitiated(() => onFlagClick(post, 9999, 'reject'));

  const totalPayout =
    parseFloat(post.pending_payout_value) +
    parseFloat(post.total_payout_value) +
    parseFloat(post.curator_payout_value);
  const voteRshares = post.active_votes.reduce(
    (a, b) => a + parseFloat(b.rshares_weight || b.rshares),
    0,
  );
  const ratio = voteRshares > 0 ? totalPayout / voteRshares : 0;
  const openReactionModal = tab => {
    handleShowReactions();
    setKey(tab);
  };
  const upVotesPreview = votes =>
    take(votes, 10).map(vote => (
      <p key={vote.voter}>
        <Link to={`/@${vote.voter}`}>{vote.voter}&nbsp;</Link>
        {(vote.rshares_weight || vote.rshares) * ratio > 0.01 && (
          <span style={{ opacity: '0.5' }}>
            <USDDisplay value={(vote.rshares_weight || vote.rshares) * ratio} />
          </span>
        )}
      </p>
    ));

  const upVotesDiff = upVotes.length - upVotesPreview(upVotes).length;
  const upVotesMore = upVotesDiff > 0 && (
    <p>
      <a role="presentation" onClick={handleShowReactions}>
        <FormattedMessage
          id="and_more_amount"
          defaultMessage="and {amount} more"
          values={{ amount: upVotesDiff }}
        />
      </a>
    </p>
  );
  const messageLiked = { id: 'like', defaultMessage: 'Like' };
  const messageUnLiked = { id: 'unlike', defaultMessage: 'Unlike' };
  let likeTooltip = <span>{intl.formatMessage(messageLiked)}</span>;

  if (isLiked) {
    likeTooltip = <span>{intl.formatMessage(messageUnLiked)}</span>;
  } else if (defaultVotePercent !== 10000) {
    likeTooltip = (
      <span>
        {intl.formatMessage({ id: 'like' })}{' '}
        <span style={{ opacity: 0.5 }}>
          <FormattedNumber
            style="percent" // eslint-disable-line
            value={defaultVotePercent / 10000}
          />
        </span>
      </span>
    );
  }

  return (
    <div className="Buttons">
      <React.Fragment>
        {post.loading ? (
          <Icon type="loading" />
        ) : (
          <React.Fragment>
            <BTooltip title={likeTooltip}>
              <a
                role="presentation"
                className={classNames({
                  active: isLiked,
                  Buttons__link: true,
                })}
                onClick={handleApprove}
              >
                <FormattedMessage id="approve" defaultMessage="Approve" />
              </a>
            </BTooltip>
            {upVotes.length > 0 && (
              <span
                className="Buttons__number Buttons__reactions-count"
                role="presentation"
                onClick={() => openReactionModal('1')}
              >
                <BTooltip
                  title={
                    <div>
                      {upVotes.length > 0 ? (
                        upVotesPreview(upVotes)
                      ) : (
                        <FormattedMessage id="no_approves" defaultMessage="No approves yet" />
                      )}
                      {upVotesMore}
                    </div>
                  }
                >
                  <FormattedNumber value={upVotes.length} />
                  <span />
                </BTooltip>
              </span>
            )}
            <React.Fragment>
              <BTooltip
                title={
                  <span>
                    {intl.formatMessage(
                      isReject
                        ? { id: 'unvote', defaultMessage: 'Unvote' }
                        : { id: 'vote', defaultMessage: 'Vote' },
                    )}
                  </span>
                }
              >
                <a
                  role="presentation"
                  className={classNames({
                    active: isReject,
                    Buttons__link: true,
                  })}
                  onClick={handleReject}
                >
                  <FormattedMessage id="reject" defaultMessage="Reject" />
                </a>
              </BTooltip>
              {downVotes.length > 0 && (
                <span
                  className="Buttons__number Buttons__reactions-count"
                  role="presentation"
                  onClick={() => openReactionModal('2')}
                >
                  <BTooltip
                    title={
                      <div>
                        {downVotes.length > 0 ? (
                          upVotesPreview(downVotes)
                        ) : (
                          <FormattedMessage id="no_approves" defaultMessage="No approves yet" />
                        )}
                        {upVotesMore}
                      </div>
                    }
                  >
                    <FormattedNumber value={downVotes.length} />
                    <span />
                  </BTooltip>
                </span>
              )}
            </React.Fragment>
          </React.Fragment>
        )}
      </React.Fragment>
      <BTooltip title={intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })}>
        <a className="Buttons__link" role="presentation" onClick={handleCommentsClick}>
          <i className="iconfont icon-message_fill" />
        </a>
      </BTooltip>
      <span className="Buttons__number">
        {post.children > 0 && <FormattedNumber value={post.children} />}
      </span>
      <ReactionsModal
        visible={reactionsModalVisible}
        upVotes={upVotes}
        ratio={ratio}
        downVotes={downVotes}
        onClose={handleCloseReactions}
        tab={key}
        append
        post={post}
        user={userName}
        setTabs={setKey}
      />
    </div>
  );
};

AppendObjButtons.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  reactionsModalVisible: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  handleCommentsClick: PropTypes.func.isRequired,
  handleCloseReactions: PropTypes.func.isRequired,
  onFlagClick: PropTypes.func.isRequired,
  handleShowReactions: PropTypes.func.isRequired,
  onActionInitiated: PropTypes.func.isRequired,
  defaultVotePercent: PropTypes.number.isRequired,
};

AppendObjButtons.defaultProps = { userName: '' };

export default connect(state => ({
  userName: getAuthenticatedUserName(state),
}))(injectIntl(withAuthActions(AppendObjButtons)));
