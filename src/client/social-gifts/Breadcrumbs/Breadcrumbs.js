import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';

import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getShopBreadCrumbs } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { setAllBreadcrumbsForChecklist } from '../../../store/wObjectStore/wobjActions';

const Breadcrumbs = () => {
  const breadcrumbs = useSelector(getShopBreadCrumbs);
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useLocation();
  const linkList = location.hash
    ? [match.params.name, location.hash.replace('#', '')]
    : [match.params.name];

  useEffect(() => {
    getObjectInfo(linkList).then(res => {
      dispatch(
        setAllBreadcrumbsForChecklist(
          linkList.reduce((acc, curr) => {
            const j = res.wobjects.find(o => o.author_permlink === curr);

            return [...acc, j];
          }, []),
        ),
      );
    });

    return () => setAllBreadcrumbsForChecklist([]);
  }, []);

  return <div>{breadcrumbs?.map(crumb => getObjectName(crumb)).join(' > ')}</div>;
};

export default Breadcrumbs;
