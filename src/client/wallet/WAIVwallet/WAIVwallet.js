import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import WAIVWalletSummaryInfo from './WAIVWalletSummaryInfo';
import WAIVWalletTransferList from './WAIVWalletTransferList/WAIVWalletTransferList';
import ShowRewardsButton from './ShowRewardsButton';

import './WAIVwallet.less';

const WAIVwallet = props => (
  <div className="WAIVwallet">
    <WAIVWalletSummaryInfo />
    <ShowRewardsButton />
    <WAIVWalletTransferList name={props.match.params.name} withoutMargin />
  </div>
);

WAIVwallet.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default withRouter(WAIVwallet);
