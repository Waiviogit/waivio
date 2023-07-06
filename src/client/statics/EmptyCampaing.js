import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './EmptyFeed.less';

const EmptyCampaing = ({ emptyMessage, intl }) => (
  <div className="feed_empty">
    <h3>
      {emptyMessage ||
        intl.formatMessage({ id: 'empty_rewards_message', defaultMessage: 'There are no rewards' })}
    </h3>
  </div>
);

EmptyCampaing.propTypes = {
  emptyMessage: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(EmptyCampaing);
