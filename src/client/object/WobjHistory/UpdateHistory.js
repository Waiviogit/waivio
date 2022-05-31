import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getMoreUpdates, getUpdates } from '../../../store/appendStore/appendActions';
import {
  getAppendHasMore,
  getAppendList,
  getIsAppendLoading,
} from '../../../store/appendStore/appendSelectors';
import Loading from '../../components/Icon/Loading';
import AppendCard from '../AppendCard/AppendCard';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import WobjHistory from './WobjHistory';

const UpdateHistory = () => {
  const dispatch = useDispatch();
  const updatesList = useSelector(getAppendList);
  const appendLoading = useSelector(getIsAppendLoading);
  const appendHasMore = useSelector(getAppendHasMore);
  const { name, 0: field } = useParams();
  const [sort, setSort] = useState('createdAt');
  const [locale, setLocale] = useState('en-US');

  useEffect(() => {
    dispatch(getUpdates(name, field, sort, locale));
  }, [name, field, sort, locale]);

  const handleLoadMore = () => {
    dispatch(getMoreUpdates(name, updatesList?.length, field, sort, locale));
  };

  if (appendLoading && !updatesList?.length) return <Loading />;

  return (
    <React.Fragment>
      <WobjHistory setSort={setSort} sort={sort} locale={locale} setLocale={setLocale} />
      {updatesList?.length ? (
        <ReduxInfiniteScroll
          loadMore={handleLoadMore}
          loader={<Loading />}
          loadingMore={appendLoading}
          hasMore={appendHasMore}
          elementIsScrollable={false}
          threshold={500}
        >
          {updatesList?.map(post => (
            <AppendCard key={post.permlink} post={post} />
          ))}
        </ReduxInfiniteScroll>
      ) : (
        <div className="object-feed__row justify-center">
          <FormattedMessage
            id="empty_object_profile"
            defaultMessage="Be the first to write a review"
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateHistory;
