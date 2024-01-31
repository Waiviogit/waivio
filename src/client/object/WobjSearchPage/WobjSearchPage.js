import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { searchObjects } from '../../../waivioApi/ApiClient';
import ObjectCardView from '../../objectCard/ObjectCardView';
import Loading from '../../components/Icon/Loading';
import { getLocale } from '../../../store/settingsStore/settingsSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const limit = 10;

const WobjSearchPage = () => {
  const [wobjects, setWobjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const match = useRouteMatch();
  const locale = useSelector(getLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const objType = 'product';
  const searchStr = match.params.searchStr;

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    searchObjects(searchStr, objType, false, limit, locale, { userName }, null, 0).then(res => {
      setHasMore(res.hasMore);
      setWobjects(res.wobjects);
    });
  }, [searchStr]);

  const loadMoreObjects = () => {
    searchObjects(
      searchStr,
      objType,
      false,
      limit,
      locale,
      { userName },
      null,
      wobjects.length,
    ).then(res => {
      setHasMore(res.hasMore);
      setWobjects([...wobjects, ...res.wobjects]);
    });
  };

  return (
    <>
      <div className="ObjectCardView__prefix">
        <div className="ObjectCardView__prefix-content">
          <FormattedMessage id="search" defaultMessage="Search" />: {searchStr}
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
          <ObjectCardView key={wObj._id} wObject={wObj} passedParent={wObj.parent} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default WobjSearchPage;
