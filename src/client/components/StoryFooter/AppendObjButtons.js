import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { sortVotes } from '../../helpers/sortHelpers';
import { getAppendUpvotes, getAppendDownvotes } from '../../helpers/voteHelpers';
import BTooltip from '../BTooltip';
import './Buttons.less';
import { getAuthenticatedUserName } from '../../reducers';
import ReactionsModal from '../Reactions/ReactionsModal';

const AppendObjButtons = ({
  post,
  postState,
  intl,
  likeTooltip,
  handleLikeClick,
  pendingLike,
  upVotesPreview,
  upVotesMore,
  handleCommentsClick,
  handleShowReactions,
  onFlagClick,
  userName,
  reactionsModalVisible,
  ratio,
  handleCloseReactions
}) => {
  const upVotes = getAppendUpvotes(post.active_votes).sort(sortVotes);
  const downVotes = getAppendDownvotes(post.active_votes)
    .sort(sortVotes)
    .reverse();

  return (
    <div className="Buttons">
      <React.Fragment>
        {pendingLike ? (
          <Icon type="loading" />
        ) : (
          <React.Fragment>
            <BTooltip title={likeTooltip}>
              <a
                role="presentation"
                className={classNames({
                  active: postState.isLiked && _.some(upVotes, { voter: userName }),
                  Buttons__link: true
                })}
                onClick={handleLikeClick}
              >
                <FormattedMessage id="approve" defaultMessage="Approve" />
              </a>
            </BTooltip>
            {upVotes.length > 0 && (
              <span
                className="Buttons__number Buttons__reactions-count"
                role="presentation"
                onClick={handleShowReactions}
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
                      postState.isReported
                        ? { id: 'unvote', defaultMessage: 'Unvote' }
                        : { id: 'vote', defaultMessage: 'Vote' }
                    )}
                  </span>
                }
              >
                <a
                  role="presentation"
                  className={classNames({
                    active: postState.isReported && _.some(downVotes, { voter: userName }),
                    Buttons__link: true
                  })}
                  onClick={onFlagClick}
                >
                  <FormattedMessage id="reject" defaultMessage="Reject" />
                </a>
              </BTooltip>
              {downVotes.length > 0 && (
                <span
                  className="Buttons__number Buttons__reactions-count"
                  role="presentation"
                  onClick={handleShowReactions}
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
      />
    </div>
  );
};

AppendObjButtons.propTypes = {
  intl: PropTypes.shape().isRequired,
  likeTooltip: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
  postState: PropTypes.shape().isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  pendingLike: PropTypes.bool.isRequired,
  reactionsModalVisible: PropTypes.bool.isRequired,
  upVotesPreview: PropTypes.func.isRequired,
  upVotesMore: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  ratio: PropTypes.number.isRequired,
  handleCommentsClick: PropTypes.func.isRequired,
  handleCloseReactions: PropTypes.func.isRequired,
  onFlagClick: PropTypes.func.isRequired,
  handleShowReactions: PropTypes.func.isRequired
};

AppendObjButtons.defaultProps = { userName: '' };

export default connect(state => ({
  userName: getAuthenticatedUserName(state)
}))(injectIntl(AppendObjButtons));
