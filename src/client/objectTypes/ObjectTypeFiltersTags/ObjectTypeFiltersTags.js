import { Tag } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const ObjectTypeFiltersTags = ({ activefilters, setFilterValue }) => (
  <div className="ObjectTypeFiltersTags">
    {_.map(activefilters, (filter, key) =>
      _.map(filter, item => (
        <Tag key={item} closable onClose={() => setFilterValue(item, key)}>
          {item}
        </Tag>
      )),
    )}
  </div>
);

ObjectTypeFiltersTags.propTypes = {
  activefilters: PropTypes.shape(),
  setFilterValue: PropTypes.func.isRequired,
};

ObjectTypeFiltersTags.defaultProps = {
  activefilters: { map: true },
};

export default ObjectTypeFiltersTags;
