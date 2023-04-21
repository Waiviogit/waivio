import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectsByGroupId } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

const GroupIdPage = () => {
  const [wobjects, setWobjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const match = useRouteMatch();
  const groupId = match.params.id;
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {wobjects?.map(wObj => (
          <ObjectCardSwitcher key={wObj._id} wObj={wObj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default GroupIdPage;
