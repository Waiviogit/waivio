import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { isEmpty, takeRight } from 'lodash';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { createNewHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getShopBreadCrumbs } from '../../../store/wObjectStore/wObjectSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import { setAllBreadcrumbsForChecklist } from '../../../store/wObjectStore/wobjActions';
import useQuery from '../../../hooks/useQuery';

import './Breadcrumbs.less';

const Breadcrumbs = ({ inProduct }) => {
  const breadcrumbs = useSelector(getShopBreadCrumbs);
  const locale = useSelector(getUsedLocale);
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useQuery();
  const permlinks = location.hash.replace('#', '').split('/');
  let linkList = location.hash ? [match.params.name, ...permlinks] : [match.params.name];

  if (inProduct) {
    const breadbrumbsFromQuery = query.get('breadbrumbs');

    linkList = breadbrumbsFromQuery ? breadbrumbsFromQuery.split('/') : null;
  }

  const getTruncatedTitle = title =>
    title.length < 30
      ? title
      : `${title
          .split(' ')
          .slice(0, 3)
          .join(' ')}...`;

  useEffect(() => {
    if (linkList)
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
          breadcrumbs.filter(item => linkList?.includes(item.author_permlink)),
        ),
      );
    }
  }, [location.hash, match.params.name]);

  if (!linkList) return null;

  return (
    <div className="Breadcrumbs">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb.author_permlink}>
          {inProduct && match.params.name === crumb.author_permlink ? (
            <span> {getTruncatedTitle(getObjectName(crumb))}</span>
          ) : (
            <Link
              to={{
                hash:
                  match.params.name === crumb.author_permlink ||
                  (inProduct && breadcrumbs[0].author_permlink === crumb.author_permlink)
                    ? ''
                    : createNewHash(
                        crumb.author_permlink,
                        inProduct
                          ? takeRight(linkList, linkList.length - 1).join('/')
                          : location.hash,
                      ),
                pathname: inProduct
                  ? `/checklist/${breadcrumbs[0].author_permlink}`
                  : location.pathname,
              }}
            >
              {getTruncatedTitle(getObjectName(crumb))}
            </Link>
          )}
          {breadcrumbs.length > 1 && index !== breadcrumbs.length - 1 ? <Icon type="right" /> : ''}
        </React.Fragment>
      ))}
    </div>
  );
};

Breadcrumbs.propTypes = {
  inProduct: PropTypes.bool,
};

export default Breadcrumbs;
