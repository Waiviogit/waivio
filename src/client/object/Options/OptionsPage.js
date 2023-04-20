import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { useRouteMatch } from 'react-router';
import { getObject, getObjectOptions, getObjectsRewards } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Campaing from '../../newRewards/reuseble/Campaing';

const OptionsPage = () => {
  const limit = 30;
  const [hasMore, setHasMore] = useState(false);
  const [reward, setReward] = useState([]);
  const [wobject, setWobject] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const match = useRouteMatch();
  const authUser = useSelector(getAuthenticatedUserName);
  const wobjPermlink = match.params.name;
  const { category } = match.params;

  useEffect(() => {
    setFilteredOptions([]);
    window.scrollTo(0, 0);
    getObjectsRewards(wobjPermlink, authUser).then(res => {
      setReward(res);
    });

    getObject(wobjPermlink).then(res => {
      setWobject(res);
      getObjectOptions(authUser, res?.author_permlink, category, 0, limit).then(r => {
        setHasMore(r.hasMore);
        setFilteredOptions(r.wobjects);
      });
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

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
      {!isEmpty(reward?.main) && <Campaing campain={reward?.main} />}
      <InfiniteScroll
        className="Feed"
        loadMore={loadMoreOptions}
        loader={<Loading />}
        initialLoad={false}
        hasMore={hasMore}
      >
        {filteredOptions?.map(wObj => (
          <ObjectCardView key={wObj._id} wObject={wObj} passedParent={wObj.parent} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default OptionsPage;
