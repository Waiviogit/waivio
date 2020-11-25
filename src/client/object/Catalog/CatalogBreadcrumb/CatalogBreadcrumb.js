import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, map, size, get } from 'lodash';
import {
  compareBreadcrumb,
  createNewHash,
  getPermlinksFromHash,
  hasType,
  sortWobjectsByHash,
} from '../../../helpers/wObjectHelper';
import { setCatalogBreadCrumbs } from '../../wobjActions';
import { getBreadCrumbs, getSuitableLanguage, getWobjectNested } from '../../../reducers';
import { getObjectsByIds } from '../../../../waivioApi/ApiClient';
import './CatalogBreadcrumb.less';

const CatalogBreadcrumb = ({
  setBreadCrumbs,
  wobject,
  location: { hash },
  intl,
  locale,
  nestedWobject,
  breadcrumb,
}) => {
  const breadCrumbSize = size(breadcrumb);
  const currentTitle = get(breadcrumb[breadCrumbSize - 1], 'title', '');
  const permlinks = getPermlinksFromHash(location.hash);
  let currentBreadCrumbs = breadcrumb.filter(el => permlinks.includes(el.id));

  const handleChangeBreadCrumbs = wObject => {
    if (isEmpty(wObject)) return;

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

  const createBreadCrumbs = crumbs => {
    currentBreadCrumbs = [compareBreadcrumb(wobject), ...crumbs];
  };

  useEffect(() => {
    const currentObjIsList = hasType(wobject, 'list');
    if (currentObjIsList) createBreadCrumbs(currentBreadCrumbs);

    if (size(permlinks) > 1) {
      getObjectsByIds({ authorPermlinks: permlinks, locale }).then(response => {
        const wobjectRes = sortWobjectsByHash(
          response.wobjects.map(wobj => compareBreadcrumb(wobj)),
          permlinks,
        );
        const currBredcrumb =
          !permlinks.includes(wobject.author_permlink) && currentObjIsList
            ? currentBreadCrumbs
            : wobjectRes;

        createBreadCrumbs(wobjectRes);
        setBreadCrumbs(currBredcrumb);
      });
    } else {
      const usedObj = hash ? nestedWobject : wobject;
      handleChangeBreadCrumbs(usedObj);
    }
  }, [location.hash, wobject]);

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
                    pathname: location.pathname,
                    hash: createNewHash(crumb.id, permlinks),
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
  nestedWobject: PropTypes.shape({}).isRequired,
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
