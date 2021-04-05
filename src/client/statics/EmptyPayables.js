import React from 'react';
import { FormattedMessage } from 'react-intl';

import './EmptyFeed.less';

const EmptyPaybles = () => (
  <div className="feed_empty">
    <h3>
      <FormattedMessage id="payables_empty" defaultMessage="Payables is empty" />
    </h3>
  </div>
);

export default EmptyPaybles;
