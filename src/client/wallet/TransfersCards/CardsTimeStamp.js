import React from 'react';
import { FormattedDate, FormattedRelative, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import BTooltip from '../../components/BTooltip';
import { epochToUTC } from '../../../common/helpers/formatter';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';

const CardsTimeStamp = ({ timestamp, match }) => {
  const isGuest = guestUserRegex.test(match.params.name);
  const validTimeStamp = isGuest ? timestamp : epochToUTC(timestamp);

  return (
    <span className="UserWalletTransactions__timestamp">
      <BTooltip
        title={
          <span>
            <FormattedDate value={validTimeStamp} />{' '}
            <FormattedTime value={validTimeStamp} format="24hour" />
          </span>
        }
      >
        <span>
          <FormattedRelative value={validTimeStamp} />
        </span>
      </BTooltip>
    </span>
  );
};

CardsTimeStamp.propTypes = {
  timestamp: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(CardsTimeStamp);
