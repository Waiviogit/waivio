import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsTrendingTopicsLoading } from '../../reducers';

import ObjectsFields from '../../components/ObjectsFields';

const LeftObjectProfileSidebar = ({ trendingTopicsLoading, fields }) => (
  <div>
    <ObjectsFields fields={fields} trendingTopicsLoading={trendingTopicsLoading} />
  </div>
);

LeftObjectProfileSidebar.propTypes = {
  trendingTopicsLoading: PropTypes.bool.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(state => ({
  trendingTopicsLoading: getIsTrendingTopicsLoading(state),
}))(LeftObjectProfileSidebar);
