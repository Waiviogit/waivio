import React from 'react';
import PropsType from 'prop-types';

import './EmptyFeed.less';

const EmptyCampaing = ({ emptyMessage }) => (
  <div className="feed_empty">
    <h3>{emptyMessage || "We don't have any rewards yet"}</h3>
  </div>
);

EmptyCampaing.propTypes = {
  emptyMessage: PropsType.string,
};

export default EmptyCampaing;
