import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import './TagBadgeStyles.less';

const ObjectType = ({ type, intl }) =>
  type && (
    <div className="ObjectType">
      <Tag>{intl.formatMessage({ id: `object_type_${type}`, defaultMessage: type })}</Tag>
    </div>
  );

ObjectType.propTypes = {
  type: PropTypes.string,
  intl: PropTypes.shape(),
};

ObjectType.defaultProps = {
  type: '',
};

export default injectIntl(ObjectType);
