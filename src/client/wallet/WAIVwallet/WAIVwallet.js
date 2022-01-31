import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import WAIVWalletSummaryInfo from './WAIVWalletSummaryInfo';
import WAIVWalletTransferList from './WAIVWalletTransferList/WAIVWalletTransferList';
import ShowRewardsButton from './ShowRewardsButton';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';

import './WAIVwallet.less';

const WAIVwallet = props => {
  const isGuest = guestUserRegex.test(props.match.params.name);

  return (
    <div className="WAIVwallet">
      <WAIVWalletSummaryInfo name={props.match.params.name} />
      {!isGuest && <ShowRewardsButton />}
      <WAIVWalletTransferList name={props.match.params.name} withoutMargin={!isGuest} />
    </div>
  );
};

WAIVwallet.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default withRouter(WAIVwallet);
