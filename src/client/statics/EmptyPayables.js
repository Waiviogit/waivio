import React from 'react';
import { FormattedMessage } from 'react-intl';

import './EmptyFeed.less';

const EmptyPaybles = () => (
  <div className="feed_empty">
    <h3>
      <FormattedMessage
        id="dont_have_any_payments_yet"
        defaultMessage="You don't have any payments yet"
      />
    </h3>
  </div>
);

export default EmptyPaybles;
