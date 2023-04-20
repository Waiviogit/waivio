import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectsByGroupId, getObjectsRewards } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import Campaing from '../../newRewards/reuseble/Campaing';

const GroupIdPage = () => {
  const [wobjects, setWobjects] = useState([]);
  const [reward, setReward] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const match = useRouteMatch();
  const groupId = match.params.id;
  const wobjPermlink = match.params.name;
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    window.scrollTo(0, 0);
    getObjectsRewards(wobjPermlink, userName).then(res => {
      setReward(res);
    });
    getObjectsByGroupId(userName, groupId, 0).then(res => {
      setWobjects(res.wobjects);
      setHasMore(res.hasMore);
    });
  }, [groupId]);

  const loadMoreObjects = () => {
    getObjectsByGroupId(userName, groupId, wobjects.length).then(res => {
      setWobjects([...wobjects, ...res.wobjects]);
      setHasMore(res.hasMore);
    });
  };

  return (
    <>
      <div className="ObjectCardView__prefix">
        <div className="ObjectCardView__prefix-content">
          <FormattedMessage id="object_field_groupId" defaultMessage="Group Id" />: {groupId}
        </div>
      </div>
      {!isEmpty(reward?.main) && <Campaing campain={reward?.main} />}
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {wobjects?.map(wObj => (
          <ObjectCardView key={wObj._id} wObject={wObj} passedParent={wObj.parent} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default GroupIdPage;
