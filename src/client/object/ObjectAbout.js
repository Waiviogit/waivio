import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, uniq } from 'lodash';
import { Link } from 'react-router-dom';

import { showPostModal } from '../../store/appStore/appActions';
import ObjectInfo from '../app/Sidebar/ObjectInfo/ObjectInfo';
import { getObjectsRewards } from '../../waivioApi/ApiClient';
import PostModal from '../post/PostModalContainer';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import Campaing from '../newRewards/reuseble/Campaing';
import Proposition from '../newRewards/reuseble/Proposition/Proposition';
import { getPropositionsKey } from '../../common/helpers/newRewardsHelper';
import { getObjectPosts } from '../../store/feedStore/feedActions';
import { getFeed } from '../../store/feedStore/feedSelectors';
import { getFeedFromState } from '../../common/helpers/stateHelpers';
import StoryContainer from '../feed/StoryContainer';

import './ObjectAbout.less';

const ObjectAbout = ({ isEditMode, wobject, userName }) => {
  const [reward, setReward] = useState();
  const match = useRouteMatch();
  const authName = useSelector(getAuthenticatedUserName);
  const feed = useSelector(getFeed);
  const dispatch = useDispatch();
  const objectFeed = getFeedFromState('objectPosts', match.params.name, feed);
  const content = uniq(objectFeed);

  useEffect(() => {
    getObjectsRewards(match.params.name, authName).then(res => setReward(res));
    dispatch(getObjectPosts({ object: match.params.name, username: match.params.name, limit: 5 }));
  }, [match.params.name]);

  return (
    <React.Fragment>
      <div className="object-about">
        <ObjectInfo isEditMode={isEditMode} wobject={wobject} userName={userName}>
          {!isEmpty(reward?.main) && (
            <Campaing campain={reward.main} secondary={reward?.secondary} />
          )}
          {!isEmpty(reward?.secondary) &&
            reward?.secondary?.map((proposition, i) => (
              <Proposition
                key={getPropositionsKey(proposition, i)}
                proposition={{
                  ...proposition,
                  requiredObject: wobject.parent,
                }}
              />
            ))}
          <div className="object-about__content">
            {content.map(id => (
              <StoryContainer
                key={id}
                id={id}
                showPostModal={post => dispatch(showPostModal(post))}
                singlePostVew={false}
              />
            ))}
          </div>
          {content?.length >= 5 && (
            <div className="object-about__showMore">
              <Link to={`/object/${match.params.name}`}>Read more</Link>
            </div>
          )}
        </ObjectInfo>
      </div>
      <PostModal />
    </React.Fragment>
  );
};

ObjectAbout.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
};

ObjectAbout.defaultProps = {
  isEditMode: false,
};

export default ObjectAbout;
