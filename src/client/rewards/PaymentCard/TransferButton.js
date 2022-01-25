import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { round } from 'lodash';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { HIVE } from '../../../common/constants/cryptos';
import { getMemo } from '../rewardsHelper';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../../store/walletStore/walletActions';
import { openLinkHiveAccountModal } from '../../../store/settingsStore/settingsActions';
import { guestUserRegex } from '../../helpers/regexHelpers';
import { PATH_NAME_RECEIVABLES, PATH_NAME_PAYABLES } from '../../../common/constants/rewards';
import { isGuestUser } from '../../../store/authStore/authSelectors';
import { getHiveBeneficiaryAccount } from '../../../store/settingsStore/settingsSelectors';

const TransferButton = ({
  match,
  intl,
  payable,
  name,
  isGuest,
  hiveBeneficiaryAccount,
  openLinkModal,
  openTransf,
}) => {
  const isReceiverGuest = guestUserRegex.test(name);
  const app = WAIVIO_PARENT_PERMLINK;
  const currency = HIVE.symbol;
  const payableForRender = Math.abs(payable);
  const pathRecivables = match.path === PATH_NAME_RECEIVABLES;
  const isOverpayment = payable < 0;
  const memo = getMemo(isReceiverGuest, pathRecivables, isOverpayment);
  const handleClick = () => {
    if (!hiveBeneficiaryAccount && isGuest) {
      openLinkModal(true);
    }
    openTransf(name, payableForRender, currency, { id: memo }, app);
  };

  return (
    <React.Fragment>
      {pathRecivables && payable < 0 && (
        <Action
          className="WalletSidebar__transfer"
          primary={payable < 0}
          onClick={handleClick}
          disabled={payable >= 0}
        >
          {intl.formatMessage({
            id: 'pay',
            defaultMessage: 'Pay',
          })}
          {` ${round(payableForRender, 3)} HIVE`}
        </Action>
      )}
      {pathRecivables && payable >= 0 && <span>{` ${round(payable, 3)} HIVE`}</span>}
      {match.path === PATH_NAME_PAYABLES && (
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
          {` ${round(payable, 3)} HIVE`}
        </Action>
      )}
    </React.Fragment>
  );
};

TransferButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  payable: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  isGuest: PropTypes.bool,
  hiveBeneficiaryAccount: PropTypes.string,
  openLinkModal: PropTypes.func,
  openTransf: PropTypes.func,
};

TransferButton.defaultProps = {
  isGuest: false,
  hiveBeneficiaryAccount: '',
  openLinkModal: () => {},
  openTransf: () => {},
};

export default connect(
  state => ({
    isGuest: isGuestUser(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
  }),
  {
    openLinkModal: openLinkHiveAccountModal,
    openTransf: openTransfer,
  },
)(injectIntl(TransferButton));
