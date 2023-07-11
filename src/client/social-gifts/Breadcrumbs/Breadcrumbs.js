import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { createNewHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getShopBreadCrumbs } from '../../../store/wObjectStore/wObjectSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { setAllBreadcrumbsForChecklist } from '../../../store/wObjectStore/wobjActions';

import './Breadcrumbs.less';

const Breadcrumbs = () => {
  const breadcrumbs = useSelector(getShopBreadCrumbs);
  const locale = useSelector(getUsedLocale);
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const linkList = location.hash
    ? [match.params.name, ...location.hash.replace('#', '').split('/')]
    : [match.params.name];

  const getTruncatedTitle = title =>
    title.length < 30
      ? title
      : `${title
          .split(' ')
          .slice(0, 3)
          .join(' ')}...`;

  useEffect(() => {
    getObjectInfo(linkList, locale).then(res => {
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

  useEffect(() => {
    if (!isEmpty(breadcrumbs)) {
      dispatch(
        setAllBreadcrumbsForChecklist(
          breadcrumbs.filter(item => linkList.includes(item.author_permlink)),
        ),
      );
    }
  }, [location.hash, match.params.name]);

  return (
    <div className="Breadcrumbs">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb.author_permlink}>
          <Link
            to={{
              hash:
                match.params.name === crumb.author_permlink
                  ? ''
                  : createNewHash(crumb.author_permlink, location.hash),
              pathname: location.pathname,
            }}
          >
            {getTruncatedTitle(getObjectName(crumb))}
          </Link>
          {breadcrumbs.length > 1 && index !== breadcrumbs.length - 1 ? <Icon type="right" /> : ''}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
