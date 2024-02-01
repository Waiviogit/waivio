import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { isEmpty, isNil, takeRight } from 'lodash';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  accessTypesArr,
  createNewHash,
  getObjectName,
  haveAccess,
} from '../../../common/helpers/wObjectHelper';
import {
  getIsEditMode,
  getObject,
  getShopBreadCrumbs,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getUsedLocale, getUserAdministrator } from '../../../store/appStore/appSelectors';
import { getObjectInfo } from '../../../waivioApi/ApiClient';
import {
  setAllBreadcrumbsForChecklist,
  setEditMode,
} from '../../../store/wObjectStore/wobjActions';
import useQuery from '../../../hooks/useQuery';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';

import './Breadcrumbs.less';

const Breadcrumbs = ({ inProduct, intl }) => {
  const breadcrumbs = useSelector(getShopBreadCrumbs);
  const locale = useSelector(getUsedLocale);
  const isEditMode = useSelector(getIsEditMode);
  const authenticated = useSelector(getIsAuthenticated);
  const wobject = useSelector(getObject);
  const username = useSelector(getAuthenticatedUserName);
  const isAdministrator = getUserAdministrator;
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useQuery();
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const permlinks = location.hash?.replace('#', '').split('/');
  const listObjType = wobject?.object_type === 'list';
  let linkList = location.hash ? [match.params.name, ...permlinks] : [match.params.name];
  const viewUrl = query.get('viewUrl');

  if (inProduct) {
    const breadbrumbsFromQuery = query.get('breadbrumbs');

    linkList = breadbrumbsFromQuery ? breadbrumbsFromQuery.split('/') : null;
  }
  if (isNil(linkList[0]) && linkList.length === 1) {
    linkList = [breadcrumbs[0]?.author_permlink];
  }
  const getTruncatedTitle = title =>
    title.length < 30
      ? title
      : `${title
          .split(' ')
          .slice(0, 3)
          .join(' ')}...`;

  const editListClick = () => {
    const lastItemPermlink = breadcrumbs[breadcrumbs?.length - 1]?.author_permlink;
    const backUrl = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`);

    dispatch(setEditMode(true));

    history.push(`/object/${lastItemPermlink}/list?viewUrl=${backUrl}`);
  };

  useEffect(() => {
    if (viewUrl) history.push(viewUrl);
  }, [isEditMode]);

  useEffect(() => {
    if (linkList && !(isNil(linkList[0]) && linkList.length === 1))
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
      if (isNil(linkList[0]) && linkList.length === 1) {
        linkList = breadcrumbs[0].author_permlink;
      }
      dispatch(
        setAllBreadcrumbsForChecklist(
          breadcrumbs.filter(item => linkList?.includes(item.author_permlink)),
        ),
      );
    }
  }, [location.hash, match.params.name]);

  if (!linkList) return null;

  return (
    <div className={'flex '}>
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
                  ...(inProduct
                    ? {}
                    : {
                        search:
                          match.params.name === crumb.author_permlink
                            ? ''
                            : `currObj=${crumb.author_permlink}`,
                      }),
                }}
              >
                {getTruncatedTitle(getObjectName(crumb))}
              </Link>
            )}
            {breadcrumbs.length > 1 && index !== breadcrumbs.length - 1 ? (
              <Icon type="right" />
            ) : (
              ''
            )}
          </React.Fragment>
        ))}
      </div>
      {accessExtend && authenticated && isAdministrator && listObjType && (
        <div className="Breadcrumbs__edit-container">
          <Button onClick={editListClick}>
            {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
          </Button>
        </div>
      )}
    </div>
  );
};

Breadcrumbs.propTypes = {
  inProduct: PropTypes.bool,
  intl: PropTypes.shape(),
};
Breadcrumbs.defaultProps = {
  inProduct: false,
};

export default injectIntl(Breadcrumbs);
