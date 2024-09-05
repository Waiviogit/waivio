import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getAddOnObjectsFromDepartments } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { sortByFieldPermlinksList } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const limit = 10;

const AddOnPage = () => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const wobject = useSelector(getObject);
  const locale = useSelector(getUsedLocale);
  const authUserName = useSelector(getAuthenticatedUserName);
  const addOnPermlinks = wobject?.addOn?.map(obj => obj.body);
  const sortedAddOnObjects = sortByFieldPermlinksList(addOnPermlinks, addOnObjects);

  useEffect(() => {
    getAddOnObjectsFromDepartments(wobject.author_permlink, authUserName, locale, 0, limit).then(
      res => {
        setAddOnObjects(res.wobjects);
        setHasMore(res.hasMore);
      },
    );
  }, [wobject.author_permlink]);

  const loadMoreAddOnObjects = () => {
    getAddOnObjectsFromDepartments(
      wobject.author_permlink,
      authUserName,
      locale,
      addOnObjects.length,
      limit,
    ).then(res => {
      setAddOnObjects([...addOnObjects, ...res.wobjects]);
      setHasMore(res.hasMore);
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
        {sortedAddOnObjects?.map(obj => (
          <ObjectCardSwitcher key={obj._id} wObj={obj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default AddOnPage;
