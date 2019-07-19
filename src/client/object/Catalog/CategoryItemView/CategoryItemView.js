import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import './CategoryItemView.less';

const CategoryItemView = ({ wObject, pathNameAvatar, intl }) => (
  <Link
    to={pathNameAvatar}
    title={`${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wObject.name}`}
    className="CategoryItemView"
  >
    <div className="CategoryItemView__content">
      <div className="CategoryItemView__name-truncated" title={wObject.name}>
        <span>{wObject.name}</span>
        {!isNaN(wObject.listItemsCount) ? (
          <span className="items-count">&nbsp;({wObject.listItemsCount})</span>
        ) : null}
      </div>
    </div>
    <Icon type="right" />
  </Link>
);

CategoryItemView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
};

CategoryItemView.defaultProps = {
  pathNameAvatar: '',
};

export default injectIntl(CategoryItemView);
