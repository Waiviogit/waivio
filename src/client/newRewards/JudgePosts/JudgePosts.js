import { Modal } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { showPostModal } from '../../../store/appStore/appActions';
import { getFeedContent, getMoreFeedContent } from '../../../store/feedStore/feedActions';
import {
  setRequiredObject,
  setActivationPermlink,
} from '../../../store/newRewards/newRewardsActions';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../../../common/helpers/stateHelpers';
import {
  getRequiredObject,
  getActivationPermlink,
} from '../../../store/newRewards/newRewardsSelectors';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import {
  getObject,
  getJudgesPostLinks,
  getJudgeRewardsByObject,
} from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Feed from '../../feed/Feed';
import PostModal from '../../post/PostModalContainer';
import EmptyCampaign from '../../statics/EmptyCampaign';

const limit = 10;

const JudgePosts = props => {
  const [parent, setParent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasLinks, setHasLinks] = useState(false);
  const [links, setLinks] = useState([]);
  const parentLink = `/rewards/judges/`;
  const { requiredObject } = useParams();
  const history = useHistory();
  const { reduxActivationPermlink } = props;

  useEffect(() => {
    if (requiredObject) {
      props.setRequiredObject(requiredObject);
    }

    const query = new URLSearchParams(history.location.search);
    const urlActivationPermlink = query.get('activationPermlink');

    if (urlActivationPermlink && urlActivationPermlink !== reduxActivationPermlink) {
      props.setActivationPermlink(urlActivationPermlink);
    }

    if (props.authenticatedUserName && requiredObject && !reduxActivationPermlink) {
      getJudgeRewardsByObject(requiredObject, props.authenticatedUserName, 0)
        .then(res => {
          if (res?.rewards && res.rewards.length > 0) {
            const firstProposition = res.rewards[0];

            if (firstProposition?.activationPermlink) {
              props.setActivationPermlink(firstProposition.activationPermlink);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching proposition data:', error);
        });
    }

    if (props.authenticatedUserName) {
      props.getFeedContent({
        sortBy: 'judgesPosts',
        category: props.authenticatedUserName,
        limit,
        isJudges: true,
        authorPermlink: requiredObject,
        activationPermlink: urlActivationPermlink || reduxActivationPermlink,
      });
    }
    getObject(requiredObject).then(res => setParent(res));
    getJudgesPostLinks(
      props.authenticatedUserName,
      requiredObject,
      urlActivationPermlink || reduxActivationPermlink,
      0,
    ).then(r => {
      setLinks(r.posts);
      setHasLinks(r.hasMore);
    });
  }, [props.authenticatedUserName, requiredObject, reduxActivationPermlink]);

  // Update URL when activationPermlink changes
  useEffect(() => {
    if (reduxActivationPermlink) {
      const query = new URLSearchParams(history.location.search);
      const currentUrlActivationPermlink = query.get('activationPermlink');

      if (currentUrlActivationPermlink !== reduxActivationPermlink) {
        query.set('activationPermlink', reduxActivationPermlink);
        history.replace(`?${query.toString()}`);
      }
    }
  }, []);

  const loadMoreLinks = () => {
    getJudgesPostLinks(
      props.authenticatedUserName,
      requiredObject,
      reduxActivationPermlink,
      links.length,
    ).then(r => {
      setLinks([...links, ...r.posts]);
      setHasLinks(r.hasMore);
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
      activationPermlink: reduxActivationPermlink,
    });

  const renderContent = () => {
    if (isEmpty(content) && !isFetching) {
      return <EmptyCampaign emptyMessage="There are no posts available for this campaign yet." />;
    }

    return isFetching && content?.length < limit ? (
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
                <FormattedMessage id="show_more" defaultMessage="show more" />
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
  setRequiredObject: PropTypes.func,
  setActivationPermlink: PropTypes.func,
  getMoreFeedContent: PropTypes.func,
  showPostModal: PropTypes.bool,
  reduxActivationPermlink: PropTypes.string,
  authenticatedUserName: PropTypes.string,
  feed: PropTypes.shape(),
};

const mapStateToProps = state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  feed: getFeed(state),
  posts: getPosts(state),
  reduxRequiredObject: getRequiredObject(state),
  reduxActivationPermlink: getActivationPermlink(state),
});

const mapDispatchToProps = {
  getFeedContent,
  getMoreFeedContent,
  showPostModal,
  setRequiredObject,
  setActivationPermlink,
};

export default connect(mapStateToProps, mapDispatchToProps)(JudgePosts);
