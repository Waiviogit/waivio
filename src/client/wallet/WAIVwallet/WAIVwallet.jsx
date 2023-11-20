import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import WAIVWalletSummaryInfo from './WAIVWalletSummaryInfo';
import WAIVWalletTransferList from './WAIVWalletTransferList/WAIVWalletTransferList';
import ShowRewardsButton from './ShowRewardsButton';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import './WAIVwallet.less';

const WAIVwallet = props => {
  const isGuest = guestUserRegex.test(props.match.params.name);
  const userName = props.match.params.name;

  return (
    <div className="WAIVwallet">
      <WAIVWalletSummaryInfo name={userName} isGuest={isGuest} />
      {!isGuest && (
        <Link
          className="UserWallet__view-btn"
          to={`/@${props.match.params.name}/transfers/waiv-table`}
        >
          <FormattedMessage id="table_view" defaultMessage="Advanced reports" />
        </Link>
      )}
      {!isGuest && <ShowRewardsButton />}
      <WAIVWalletTransferList name={props.match.params.name} withoutMargin={!isGuest} />
    </div>
  );
};

WAIVwallet.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default withRouter(WAIVwallet);
