import React from 'react';
import { FormattedMessage } from 'react-intl';

import './EmptyFeed.less';

const EmptyFeed = () => (
  <div className="feed_empty">
    <h3>
      <FormattedMessage id="feed_empty" defaultMessage="Oops! This feed empty." />
    </h3>
  </div>
);

export default EmptyFeed;
