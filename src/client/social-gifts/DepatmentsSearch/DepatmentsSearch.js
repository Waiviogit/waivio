import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import InfiniteSroll from 'react-infinite-scroller';
import { Tag } from 'antd';
import Helmet from 'react-helmet';
import Loading from '../../components/Icon/Loading';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import { getAppHost, getHelmetIcon } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectsByDepartment } from '../../../waivioApi/ApiClient';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import './DepartmentsSearch.less';
import useQuery from '../../../hooks/useQuery';

const wobjects_count = 20;

const DepatmentsSearch = () => {
  const { name, department } = useParams();
  const siteName = location.hostname;
  const favicon = useSelector(getHelmetIcon);
  const userName = useSelector(getAuthenticatedUserName);
  const host = useSelector(getAppHost);
  const history = useHistory();
  const query = useQuery();
  const isRecipe = query.get('isRecipe') || false;
  const schema = isRecipe ? 'recipe' : undefined;
  const [objects, setObjects] = useState([]);
  const [hasMoreObjects, setHasMoreObjects] = useState();
  const [loading, setLoading] = useState(true);

  const desc = 'All objects are located here. Discover new objects!';
  const image =
    'https://images.hive.blog/p/DogN7fF3oJDSFnVMQK19qE7K3somrX2dTE7F3viyR7zVngPPv827QvEAy1h8dJVrY1Pa5KJWZrwXeHPHqzW6dL9AG9fWHRaRVeY8B4YZh4QrcaPRHtAtYLGebHH7zUL9jyKqZ6NyLgCk3FRecMX7daQ96Zpjc86N6DUQrX18jSRqjSKZgaj2wVpnJ82x7nSGm5mmjSih5Xf71?format=match&mode=fit&width=800&height=600';
  const { canonicalUrl } = useSeoInfo();
  const title = `Discover - ${siteName}`;

  useEffect(() => {
    const ac = new AbortController();

    setLoading(true);

    getObjectsByDepartment(userName, [department], schema, host, 0, wobjects_count).then(res => {
      setObjects(res.wobjects);
      setHasMoreObjects(res.hasMore);
      setLoading(false);
    });

    return () => ac.abort();
  }, [department]);

  const loadMore = () => {
    getObjectsByDepartment(
      userName,
      [department],
      schema,
      host,
      objects.length,
      wobjects_count,
    ).then(res => {
      setObjects([...objects, ...res.wobjects]);
      setHasMoreObjects(res?.hasMore);
    });
  };

  const handleDeleteTag = () => {
    history.push(`/object/${name}`);
    setObjects([]);
    setHasMoreObjects(false);
    setLoading(true);
  };

  return (
    <div className="DepartmentSearch">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={siteName} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="DepartmentSearch__wrap">
        <h3 className="DepartmentSearch__type">Department</h3>
        {department && (
          <Tag closable onClose={handleDeleteTag}>
            {department}
          </Tag>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <InfiniteSroll hasMore={hasMoreObjects} loader={<Loading />} loadMore={loadMore}>
          <div className="DepartmentSearch__list" key={'list'}>
            {objects?.map(obj => (
              <ShopObjectCard key={obj?.author_permlink} wObject={obj} />
            ))}{' '}
          </div>
        </InfiniteSroll>
      )}
    </div>
  );
};

export default DepatmentsSearch;
