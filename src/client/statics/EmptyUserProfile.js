import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const EmptyUserProfile = ({ text }) => (
  <div className="feed_empty">
    <h3>
      {text || (
        <FormattedMessage
          id="empty_user_profile"
          defaultMessage="This user doesn't have any story published yet."
        />
      )}
    </h3>
  </div>
);

EmptyUserProfile.propTypes = {
  text: PropTypes.string,
};
export default EmptyUserProfile;
