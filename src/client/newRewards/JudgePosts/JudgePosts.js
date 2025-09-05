import { Modal } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
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
import { getJudgeRewardsFiltersBySponsor } from '../../../waivioApi/ApiClient';

import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';
import RewardsFilters from '../Filters/Filters';
import FiltersForMobile from '../Filters/FiltersForMobile';

const filterConfig = [{ title: 'Sponsors', type: 'sponsors' }];

const JudgePosts = props => {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { requiredObject } = useParams();

  const onClose = () => setVisible(false);

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
  }, [props.authenticatedUserName, requiredObject]);

  const getFilters = () => getJudgeRewardsFiltersBySponsor(props.authenticatedUserName);

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
        <FiltersForMobile setVisible={setVisible} />
        <div className="PropositionList__breadcrumbs">
          <div className="PropositionList__page">Judge Posts</div>
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

      <div className="PropositionList__left">
        <RewardsFilters
          title="Filter rewards"
          getFilters={getFilters}
          config={filterConfig}
          visible={visible}
          onClose={onClose}
        />
      </div>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {content?.map(i => (
          <div key={i}>
            {' '}
            <Link key={i} to={`/@${i}`}>
              {i}
            </Link>
          </div>
        ))}{' '}
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
