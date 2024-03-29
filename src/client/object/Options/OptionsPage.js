import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { useRouteMatch } from 'react-router';
import { getObject, getObjectOptions } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectCardSwitcher from '../../objectCard/ObjectCardSwitcher';

const OptionsPage = () => {
  const limit = 30;
  const [hasMore, setHasMore] = useState(false);
  const [wobject, setWobject] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const { category } = match.params;

  useEffect(() => {
    setFilteredOptions([]);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    getObject(match.params.name).then(res => {
      setWobject(res);
      getObjectOptions(authUser, res?.author_permlink, category, 0, limit).then(r => {
        setHasMore(r.hasMore);
        setFilteredOptions(r.wobjects);
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    !isEmpty(wobject) &&
      getObjectOptions(authUser, wobject?.author_permlink, category, 0, limit).then(r => {
        setHasMore(r.hasMore);
        setFilteredOptions(r.wobjects);
      });
  }, [category]);

  const loadMoreOptions = () => {
    getObjectOptions(
      authUser,
      wobject.author_permlink,
      category,
      filteredOptions.length,
      limit,
    ).then(r => {
      setHasMore(r.hasMore);
      setFilteredOptions([...filteredOptions, ...r.wobjects]);
    });
  };

  return (
    <>
      <div className="ObjectCardView__prefix">
        <div className="ObjectCardView__prefix-content">
          <FormattedMessage
            id="all_available_options"
            defaultMessage={`All available {category} options`}
            values={{ category }}
          />
        </div>
      </div>
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreOptions}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {filteredOptions?.map(wObj => (
          <ObjectCardSwitcher key={wObj._id} wObj={wObj} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default OptionsPage;
