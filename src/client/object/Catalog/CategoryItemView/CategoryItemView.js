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
      {wObject.avatar && (
        <div
          className="CategoryItemView__avatar"
          style={{
            backgroundImage: `url(${wObject.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="CategoryItemView__name-truncated" title={wObject.name}>
        {wObject.name}
      </div>
    </div>
    <Icon type="right" />
  </Link>
);

CategoryItemView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  pathNameAvatar: PropTypes.string,
};

CategoryItemView.defaultProps = {
  pathNameAvatar: '',
};

export default injectIntl(CategoryItemView);
