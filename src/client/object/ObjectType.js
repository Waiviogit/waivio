import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import './TagBadgeStyles.less';

const ObjectType = ({ type }) =>
  type && (
    <div className="ObjectType">
      <Tag>{type}</Tag>
    </div>
  );

ObjectType.propTypes = {
  type: PropTypes.string,
};

ObjectType.defaultProps = {
  type: '',
};

export default ObjectType;
