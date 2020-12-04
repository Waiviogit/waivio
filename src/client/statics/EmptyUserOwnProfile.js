import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import './EmptyFeed.less';

const EmptyUserProfile = () => (
  <div className="feed_empty">
    <h3>
      <FormattedMessage
        id="empty_user_own_profile"
        defaultMessage="You didn't publish any stories yet."
      />
      {` `}
      <Link to="/editor">
        <FormattedMessage id="@statics/start_now" defaultMessage="Start now" />
      </Link>
    </h3>
  </div>
);

export default EmptyUserProfile;
