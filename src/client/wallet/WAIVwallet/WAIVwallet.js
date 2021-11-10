import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import WAIVWalletSummaryInfo from './components/WAIVWalletSummaryInfo';
import WAIVWalletTransferList from './components/WAIVWalletTransferList/WAIVWalletTransferList';

import './WAIVwallet.less';

const WAIVwallet = props => (
  <div className="WAIVwallet">
    <WAIVWalletSummaryInfo name={props.match.params.name} />
    <WAIVWalletTransferList name={props.match.params.name} />
  </div>
);

WAIVwallet.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default withRouter(WAIVwallet);
