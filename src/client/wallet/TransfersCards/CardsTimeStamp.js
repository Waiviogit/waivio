import React from 'react';
import { FormattedDate, FormattedRelative } from 'react-intl';
import PropTypes from 'prop-types';

import BTooltip from '../../components/BTooltip';
import { epochToUTC } from '../../helpers/formatter';

const CardsTimeStamp = ({ timestamp }) => (
  <span className="UserWalletTransactions__timestamp">
    <BTooltip
      title={
        <span>
          <FormattedDate value={epochToUTC(timestamp)} />
        </span>
      }
    >
      <span>
        <FormattedRelative value={epochToUTC(timestamp)} />
      </span>
    </BTooltip>
  </span>
);

CardsTimeStamp.propTypes = {
  timestamp: PropTypes.number.isRequired,
};

export default CardsTimeStamp;
