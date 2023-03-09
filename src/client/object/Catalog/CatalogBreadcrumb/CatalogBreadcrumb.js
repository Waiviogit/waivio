import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, map, size, get } from 'lodash';
import {
  compareBreadcrumb,
  createNewHash,
  createNewPath,
  getPermlinksFromHash,
  hasType,
  sortWobjectsByHash,
} from '../../../../common/helpers/wObjectHelper';
import { setCatalogBreadCrumbs } from '../../../../store/wObjectStore/wobjActions';
import { getSuitableLanguage } from '../../../../store/reducers';
import { getObjectsByIds } from '../../../../waivioApi/ApiClient';
import { getBreadCrumbs, getWobjectNested } from '../../../../store/wObjectStore/wObjectSelectors';

import './CatalogBreadcrumb.less';

const CatalogBreadcrumb = ({
  setBreadCrumbs,
  wobject,
  location,
  intl,
  locale,
  nestedWobject,
  breadcrumb,
}) => {
  if (!breadcrumb) return null;

  const breadCrumbSize = size(breadcrumb);
  const currentTitle = get(breadcrumb[breadCrumbSize - 1], 'title', '');
  const permlinks = getPermlinksFromHash(location.hash);
  const currentObjIsListOrPage = hasType(wobject, 'list') || hasType(wobject, 'page');

  const addParentToBreadCrumbs = crumbs => [compareBreadcrumb(wobject), ...crumbs];

  const handleChangeBreadCrumbs = wObject => {
    if (isEmpty(wObject)) return;
    let currentBreadCrumbs = breadcrumb.filter(el => permlinks.includes(el.id));

    if (currentObjIsListOrPage) currentBreadCrumbs = addParentToBreadCrumbs(currentBreadCrumbs);

    const findWobj = crumb => crumb.id === wObject.author_permlink;
    const findBreadCrumbs = currentBreadCrumbs.some(findWobj);

    if (findBreadCrumbs) {
      const findIndex = currentBreadCrumbs.findIndex(findWobj);

      currentBreadCrumbs.splice(findIndex + 1);
    } else {
      currentBreadCrumbs = [...currentBreadCrumbs, compareBreadcrumb(wObject)];
    }

    setBreadCrumbs(currentBreadCrumbs);
  };

  useEffect(() => {
    if (size(permlinks) > 1) {
      getObjectsByIds({ authorPermlinks: permlinks, locale }).then(response => {
        const wobjectRes = sortWobjectsByHash(
          response.wobjects.map(wobj => compareBreadcrumb(wobj)),
          permlinks,
        );
        const currBc = currentObjIsListOrPage ? addParentToBreadCrumbs(wobjectRes) : wobjectRes;

        setBreadCrumbs(currBc);
      });
    } else {
      const usedObj = location.hash ? nestedWobject : wobject;

      handleChangeBreadCrumbs(usedObj);
    }
  }, [wobject.author_permlink, nestedWobject.author_permlink, location.hash]);

  return (
    <div className="CustomBreadCrumbs">
      <Breadcrumb separator={'>'}>
        {map(breadcrumb, (crumb, index) => (
          <Breadcrumb.Item key={`crumb-${crumb.id}`}>
            {index === breadCrumbSize - 1 ? (
              <React.Fragment>
                <span className="CustomBreadCrumbs__link">{crumb.name}</span>
                <Link
                  className="CustomBreadCrumbs__obj-page-link"
                  to={crumb.path}
                  target={'_blank'}
                >
                  <i className="iconfont icon-send PostModal__icon" />
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link
                  className="CustomBreadCrumbs__link"
                  to={{
                    pathname: createNewPath(wobject, crumb.type),
                    hash: createNewHash(crumb.id, location.hash, wobject),
                  }}
                  title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                    crumb.name
                  }`}
                >
                  {crumb.name}
                </Link>
                {breadCrumbSize === 1 && (
                  <Link
                    to={crumb.path}
                    className="CustomBreadCrumbs__obj-page-link"
                    target={'_blank'}
                  >
                    <i className="iconfont icon-send PostModal__icon" />
                  </Link>
                )}
              </React.Fragment>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <div className="CustomBreadCrumbs__title">{currentTitle}</div>
    </div>
  );
};

CatalogBreadcrumb.propTypes = {
  location: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  locale: PropTypes.string.isRequired,
  nestedWobject: PropTypes.shape({
    author_permlink: PropTypes.string,
  }).isRequired,
  breadcrumb: PropTypes.shape([]).isRequired,
  setBreadCrumbs: PropTypes.func.isRequired,
};

CatalogBreadcrumb.defaultProps = {
  location: '',
  wobject: {},
  breadcrumb: [],
};

export default connect(
  state => ({
    locale: getSuitableLanguage(state),
    nestedWobject: getWobjectNested(state),
    breadcrumb: getBreadCrumbs(state),
  }),
  {
    setBreadCrumbs: setCatalogBreadCrumbs,
  },
)(withRouter(CatalogBreadcrumb));
