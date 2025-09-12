import { Modal } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
import { getObject, getJudgesPostLinks } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';
import EmptyCampaign from '../../statics/EmptyCampaign';

const limit = 10;

const JudgePosts = props => {
  const [parent, setParent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLinks, setHasLinks] = useState(false);
  const [links, setLinks] = useState([]);
  const parentLink = `/rewards/judges/`;
  const { requiredObject } = useParams();

  useEffect(() => {
    if (props.authenticatedUserName) {
      props.getFeedContent({
        sortBy: 'judgesPosts',
        category: props.authenticatedUserName,
        limit,
        isJudges: true,
        authorPermlink: requiredObject,
      });
    }
    getObject(requiredObject).then(res => setParent(res));
    getJudgesPostLinks(props.authenticatedUserName, requiredObject, 0).then(r => {
      setLinks(r.posts);
      setHasLinks(r.hasMore);
    });
  }, [props.authenticatedUserName, requiredObject]);

  const loadMoreLinks = () => {
    setLoading(true);
    getJudgesPostLinks(props.authenticatedUserName, requiredObject, links.length).then(r => {
      setLinks([...links, ...r.posts]);
      setHasLinks(r.hasMore);
      setLoading(false);
    });
  };
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

  const renderContent = () => {
    if (isEmpty(content) && !isFetching) {
      return <EmptyCampaign emptyMessage="There are no posts available for this campaign yet." />;
    }

    return isFetching ? (
      <Loading />
    ) : (
      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadMoreContent={loadMoreContentAction}
        showPostModal={props.showPostModal}
        isGuest={false}
      />
    );
  };

  return (
    <div className="PropositionList">
      <div className="PropositionList__feed">
        <div className="PropositionList__breadcrumbs">
          <Link className="PropositionList__page" to={parentLink}>
            Judges
          </Link>
          {requiredObject && (
            <a
              className="PropositionList__parent pointer"
              href={`/rewards/judges/eligible/${requiredObject}`}
            >
              <span className="PropositionList__icon">&#62;</span>{' '}
              <span>{getObjectName(parent)}</span>
            </a>
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
        {/* eslint-disable-next-line no-nested-ternary */}
        {renderContent()}
        <PostModal userName={props.authenticatedUserName} />
      </div>

      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <div>
          <ol className={'ordered-list'}>
            {' '}
            {links?.map(i => (
              <li key={i}>
                {' '}
                <a key={i} href={`/@${i.author}/${i.permlink}`} target={'_blank'} rel="noreferrer">
                  {`${i.author}/${i.permlink}`}
                </a>
              </li>
            ))}
          </ol>{' '}
          {hasLinks && (
            <div>
              <div
                className=" mt2 flex justify-center pointer"
                role="presentation"
                onClick={loadMoreLinks}
              >
                {loading ? (
                  <Loading />
                ) : (
                  <FormattedMessage id="show_more" defaultMessage="show more" />
                )}
              </div>
            </div>
          )}
        </div>
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
