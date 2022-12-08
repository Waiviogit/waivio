import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { round } from 'lodash';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../../store/walletStore/walletActions';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';

const TransferButton = ({ match, intl, payable, name, openTransf, currency }) => {
  const isReceiverGuest = guestUserRegex.test(name);
  const app = WAIVIO_PARENT_PERMLINK;
  const pathRecivables = match.path.includes('receivable');
  const pathPaybles = match.path.includes('payable');
  const memo = isReceiverGuest ? 'guestCampaignReward' : 'campaignReward';

  return (
    <React.Fragment>
      {pathRecivables && <span>{` ${round(payable, 3)} ${currency}`}</span>}
      {pathPaybles && (
        <Action
          className="WalletSidebar__transfer"
          primary={payable > 0}
          onClick={() => openTransf(name, payable, currency, { id: memo }, app)}
          disabled={payable <= 0}
        >
          {intl.formatMessage({
            id: 'pay',
            defaultMessage: 'Pay',
          })}
          {` ${round(payable, 3)} ${currency}`}
        </Action>
      )}
    </React.Fragment>
  );
};

TransferButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  payable: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  openTransf: PropTypes.func,
};

TransferButton.defaultProps = {
  openTransf: () => {},
};

export default connect(null, {
  openTransf: openTransfer,
})(injectIntl(TransferButton));
