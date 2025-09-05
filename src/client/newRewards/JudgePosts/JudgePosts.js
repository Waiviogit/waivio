import { Modal } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { showPostModal } from '../../../store/appStore/appActions';
import { getFeedContent, getMoreFeedContent } from '../../../store/feedStore/feedActions';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../../../common/helpers/stateHelpers';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import { getObject } from '../../../waivioApi/ApiClient';

import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';

const JudgePosts = props => {
  const [parent, setParent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const parentLink = `/rewards/judges/`;
  const { requiredObject } = useParams();

  useEffect(() => {
    if (props.authenticatedUserName) {
      props.getFeedContent({
        sortBy: 'judgesPosts',
        category: props.authenticatedUserName,
        limit: 10,
        isJudges: true,
        authorPermlink: requiredObject,
      });
    }
    getObject(requiredObject).then(res => setParent(res));
  }, [props.authenticatedUserName, requiredObject]);

  const content = getFeedFromState('judgesPosts', props.authenticatedUserName, props.feed);
  const isFetching = getFeedLoadingFromState(
    'judgesPosts',
    props.authenticatedUserName,
    props.feed,
  );
  const hasMore = getFeedHasMoreFromState('judgesPosts', props.authenticatedUserName, props.feed);

  const loadMoreContentAction = () =>
    props.getMoreFeedContent({
      sortBy: 'judgesPosts',
      category: props.authenticatedUserName,
      limit: 10,
      isJudges: true,
      authorPermlink: requiredObject,
    });

  if (!props.authenticatedUserName) {
    return (
      <div className="judge-posts">
        <div>Please log in to view judge posts.</div>
      </div>
    );
  }

  return (
    <div className="PropositionList">
      <div className="PropositionList__feed">
        <div className="PropositionList__breadcrumbs">
          <Link className="PropositionList__page" to={parentLink}>
            Judges
          </Link>
          {requiredObject && (
            <div className="PropositionList__parent">
              <span className="PropositionList__icon">&#62;</span>{' '}
              <span>{getObjectName(parent)}</span>
            </div>
          )}
          <div className="PropositionList__parent">
            <span className="PropositionList__icon">&#62;</span> <span>Posts</span>
          </div>
        </div>
        {!isEmpty(content) && (
          <p
            className={'flex justify-end mb2 main-color-button'}
            onClick={() => setModalVisible(true)}
          >
            View all
          </p>
        )}

        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContentAction}
          showPostModal={props.showPostModal}
          isGuest={false}
        />

        <PostModal userName={props.authenticatedUserName} />
      </div>

      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <ol className={'ordered-list'}>
          {' '}
          {content?.map(i => (
            <li key={i}>
              {' '}
              <a key={i} href={`/@${i}`} target={'_blank'} rel="noreferrer">
                {i}
              </a>
            </li>
          ))}
        </ol>{' '}
      </Modal>
    </div>
  );
};

JudgePosts.propTypes = {
  getFeedContent: PropTypes.func,
  getMoreFeedContent: PropTypes.func,
  showPostModal: PropTypes.bool,
  authenticatedUserName: PropTypes.string,
  feed: PropTypes.shape(),
};

const mapStateToProps = state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  feed: getFeed(state),
  posts: getPosts(state),
});

const mapDispatchToProps = {
  getFeedContent,
  getMoreFeedContent,
  showPostModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(JudgePosts);
