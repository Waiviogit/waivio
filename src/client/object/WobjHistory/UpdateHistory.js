import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { isNil } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  getMoreUpdates,
  getUpdates,
  resetUpdateList,
} from '../../../store/appendStore/appendActions';
import {
  getAppendHasMore,
  getAppendList,
  getIsAppendLoading,
  getIsAddingAppendLoading,
  getAbortController,
} from '../../../store/appendStore/appendSelectors';
import Loading from '../../components/Icon/Loading';
import StoryLoading from '../../components/Story/StoryLoading';
import AppendCard from '../AppendCard/AppendCard';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import WobjHistory from './WobjHistory';
import { getUpdateFieldName } from '../../../common/helpers/wObjectHelper';

const UpdateHistory = () => {
  const dispatch = useDispatch();
  const updatesList = useSelector(getAppendList);
  const appendLoading = useSelector(getIsAppendLoading);
  const appendHasMore = useSelector(getAppendHasMore);
  const abortController = useSelector(getAbortController);
  const isAddingAppendLoading = useSelector(getIsAddingAppendLoading);
  const { name, 0: field } = useParams();
  const [sort, setSort] = useState('createdAt');
  const [locale, setLocale] = useState();
  const history = useHistory();
  const query = new URLSearchParams(history.location.search).get('search');
  const pinorRemoveUpdate = updatesList?.filter(post => post.body === query);
  const isPinnedOrRemovedPost = ['pin', 'remove'].includes(field) && !isNil(query);
  const updates = isPinnedOrRemovedPost ? pinorRemoveUpdate : updatesList;
  const updateFieldName = getUpdateFieldName(field);

  useEffect(() => {
    dispatch(resetUpdateList());
  }, [name]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isPinnedOrRemovedPost) window.scrollTo(0, 0);
  }, [field]);

  useEffect(() => {
    if (abortController) abortController.abort();
    dispatch(getUpdates(name, updateFieldName, sort, locale));
  }, [name, field, sort, locale]);

  const handleLoadMore = () => {
    dispatch(getMoreUpdates(name, updatesList?.length, updateFieldName, sort, locale));
  };

  if (appendLoading && !updatesList?.length) return <Loading />;

  return (
    <React.Fragment>
      <WobjHistory setSort={setSort} sort={sort} locale={locale} setLocale={setLocale} />
      {updatesList?.length || isAddingAppendLoading ? (
        <ReduxInfiniteScroll
          loadMore={handleLoadMore}
          loader={<Loading />}
          loadingMore={appendLoading}
          hasMore={appendHasMore}
          elementIsScrollable={false}
          threshold={500}
        >
          {isAddingAppendLoading && <StoryLoading />}
          {updates?.map(post => (
            <AppendCard key={post.permlink} post={post} abortController={abortController} />
          ))}
        </ReduxInfiniteScroll>
      ) : (
        <div className=" object-feed__row--grey justify-center ">
          <FormattedMessage id="empty_updates" defaultMessage="No updates found" />
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateHistory;
