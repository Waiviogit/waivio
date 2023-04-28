import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getReferenceObjectsListByType } from '../../../waivioApi/ApiClient';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const WobjReferencePage = () => {
  const [wobjects, setWobjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const wobject = useSelector(getObject);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const match = useRouteMatch();
  const type = match.params[0].slice(0, -1);

  useEffect(() => {
    getReferenceObjectsListByType({
      authorPermlink: wobject.author_permlink,
      type,
      skip: 0,
      userName,
      locale,
    }).then(res => {
      setHasMore(res.hasMore);
      setWobjects(res.wobjects);
    });
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    getReferenceObjectsListByType({
      authorPermlink: wobject.author_permlink,
      type,
      skip: wobjects.length,
      userName,
      locale,
    }).then(res => {
      setHasMore(res.hasMore);
      setWobjects([...wobjects, ...res.wobjects]);
    });
  };

  return (
    <>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreAddOnObjects}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {wobjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default WobjReferencePage;
