import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const EmptyFeed = ({ intl }) => {
  const message = (
    <React.Fragment>
      <div className="text-center">
        {intl.formatMessage({
          id: 'empty_my_feed',
          defaultMessage: 'Your feed is empty because you are not following any user or topic',
        })}
      </div>
      <div className="text-center">
        <Link to="/discover-objects/show_all">
          {intl.formatMessage({
            id: 'objects_title',
            defaultMessage: 'Discover topics',
          })}
        </Link>
      </div>
    </React.Fragment>
  );
  return message;
};

export default injectIntl(EmptyFeed);
