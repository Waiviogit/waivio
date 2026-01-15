import React from 'react';
import PropTypes from 'prop-types';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';

const CleanChecklistView = ({ cleanListSummary, listType, loading, breadcrumbs }) => {
  if (loading || !listType) return null;
  if (!cleanListSummary) return null;

  return (
    <section className="Checklist__cleanSummary">
      {breadcrumbs && <div className="Checklist__cleanSummaryBreadcrumbs">{breadcrumbs}</div>}
      <h1 className="Checklist__cleanSummaryTitle">{getObjectName(cleanListSummary)}</h1>
      {cleanListSummary.title && (
        <p className="Checklist__cleanSummaryText">{cleanListSummary.title}</p>
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
  breadcrumbs: PropTypes.node,
};

export default CleanChecklistView;
