import React from 'react';
import PropTypes from 'prop-types';

const CleanChecklistView = ({ cleanListSummary, listType, loading }) => {
  if (loading || !listType) return null;
  if (!cleanListSummary) return null;

  return (
    <section className="Checklist__cleanSummary">
      {cleanListSummary.label && (
        <span className="Checklist__cleanSummaryLabel">{cleanListSummary.label}</span>
      )}
      {cleanListSummary.title && (
        <h2 className="Checklist__cleanSummaryTitle">{cleanListSummary.title}</h2>
      )}
      {cleanListSummary.description && (
        <p className="Checklist__cleanSummaryText">{cleanListSummary.description}</p>
      )}
    </section>
  );
};

CleanChecklistView.propTypes = {
  cleanListSummary: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  listType: PropTypes.bool,
  loading: PropTypes.bool,
};

export default CleanChecklistView;
