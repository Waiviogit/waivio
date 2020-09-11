import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { map } from 'lodash';

const CatalogBreadcrumb = ({ location, breadcrumb, intl }) => (
  <Breadcrumb separator={'>'}>
    {map(breadcrumb, (crumb, index, crumbsArr) => (
      <Breadcrumb.Item key={`crumb-${crumb.name}`}>
        {index && index === crumbsArr.length - 1 ? (
          <React.Fragment>
            <span className="CatalogWrap__breadcrumb__link">{crumb.name}</span>
            <Link
              className="CatalogWrap__breadcrumb__obj-page-link"
              to={`/object/${crumb.id}/list`}
            >
              <i className="iconfont icon-send PostModal__icon" />
            </Link>
          </React.Fragment>
        ) : (
          <Link
            className="CatalogWrap__breadcrumb__link"
            to={{ pathname: location.pathname, hash: crumb.path }}
            title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${crumb.name}`}
          >
            {crumb.name}
          </Link>
        )}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);

CatalogBreadcrumb.propTypes = {
  location: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  breadcrumb: PropTypes.arrayOf(PropTypes.shape({})),
};

CatalogBreadcrumb.defaultProps = {
  location: '',
  wobject: {},
  breadcrumb: [],
};

export default CatalogBreadcrumb;
