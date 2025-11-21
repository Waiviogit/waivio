import React from 'react';
import PropTypes from 'prop-types';
import ListDescription from '../../ListDescription/ListDescription';

const ClassicChecklistView = ({ wobject, listType, loading }) => {
  if (loading || !listType) return null;

  return <ListDescription wobject={wobject} />;
};

ClassicChecklistView.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    description: PropTypes.string,
  }),
  listType: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ClassicChecklistView;
