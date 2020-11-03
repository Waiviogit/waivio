import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { isEmpty, map, size, get } from 'lodash';
import {
  getObjectName,
  getObjectTitle,
  getPermlinksFromHash,
  hasType,
} from '../../../helpers/wObjectHelper';
import { setCatalogBreadCrumbs } from '../../wobjActions';
import { getBreadCrumbs, getSuitableLanguage, getWobjectNested } from '../../../reducers';
import { getObjectsByIds } from '../../../../waivioApi/ApiClient';
import './CatalogBreadcrumb.less';

const CatalogBreadcrumb = props => {
  const {
    wobject,
    location: { hash },
  } = props;

  const dispatch = useDispatch();
  const locale = useSelector(getSuitableLanguage);
  const nestedWobject = useSelector(getWobjectNested);
  const breadcrumb = useSelector(getBreadCrumbs);

  const BreadCrumbSize = size(breadcrumb);
  const currentTitle = get(breadcrumb[BreadCrumbSize - 1], 'title', '');
  const permlinks = getPermlinksFromHash(props.location.hash);
  let currentBreadCrumbs = breadcrumb.filter(el => permlinks.includes(el.id));
  /**
   * @param wObject : {}
   * Will be set breadcrumbs
   */
  const handleChangeBreadCrumbs = wObject => {
    if (isEmpty(wObject)) return;

    const findWobj = crumb => crumb.id === wObject.author_permlink;
    const findBreadCrumbs = currentBreadCrumbs.some(findWobj);

    if (findBreadCrumbs) {
      const findIndex = currentBreadCrumbs.findIndex(findWobj);
      currentBreadCrumbs.splice(findIndex + 1);
    } else {
      currentBreadCrumbs = [
        ...currentBreadCrumbs,
        {
          id: wObject.author_permlink,
          name: getObjectName(wObject),
          title: getObjectTitle(wObject),
          path: wObject.defaultShowLink,
        },
      ];
    }
    dispatch(setCatalogBreadCrumbs(currentBreadCrumbs));
  };

  // Delete next breadCrumbs when click to back
  // eslint-disable-next-line no-shadow
  const createNewHash = (hash, permlink) => {
    const findIndex = permlinks.findIndex(el => el === permlink);
    const hashPermlinks = [...permlinks];
    hashPermlinks.splice(findIndex + 1);
    return hashPermlinks.join('/');
  };

  const createBreadCrumbs = crumbs => {
    currentBreadCrumbs = [
      {
        id: wobject.author_permlink,
        name: getObjectName(wobject),
        title: getObjectTitle(wobject),
        path: wobject.defaultShowLink,
      },
      ...crumbs,
    ];
  };

  useEffect(() => {
    if (hasType(wobject, 'list')) {
      createBreadCrumbs(currentBreadCrumbs);
    }
    if (size(permlinks) > 1) {
      getObjectsByIds({ authorPermlinks: permlinks, locale }).then(response => {
        const wobjectRes = response.wobjects.map(wobj => ({
          id: wobj.author_permlink,
          name: getObjectName(wobj),
          title: getObjectTitle(wobj),
          path: wobj.defaultShowLink,
        }));

        if (!permlinks.includes(wobject.author_permlink) && hasType(wobject, 'list')) {
          createBreadCrumbs(wobjectRes);
          dispatch(setCatalogBreadCrumbs(currentBreadCrumbs));
        } else {
          dispatch(setCatalogBreadCrumbs(wobjectRes));
        }
      });
    } else {
      const usedObj = hash ? nestedWobject : wobject;
      handleChangeBreadCrumbs(usedObj);
    }
  }, [props.location.hash, props.wobject]);

  return (
    <div className="CustomBreadCrumbs">
      <Breadcrumb separator={'>'}>
        {map(breadcrumb, (crumb, index) => (
          <Breadcrumb.Item key={`crumb-${crumb.id}`}>
            {index === BreadCrumbSize - 1 ? (
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
                    pathname: props.location.pathname,
                    hash: createNewHash(props.location.hash, crumb.id),
                  }}
                  title={`${props.intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                    crumb.name
                  }`}
                >
                  {crumb.name}
                </Link>

                {BreadCrumbSize === 1 && (
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
};

CatalogBreadcrumb.defaultProps = {
  location: '',
  wobject: {},
  breadcrumb: [],
};

export default compose(withRouter)(CatalogBreadcrumb);
