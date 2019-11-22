import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Action from '../../components/Button/Action';
import Avatar from '../../components/Avatar';
import { openTransfer } from '../../wallet/walletActions';
import './PaymentCard.less';

// eslint-disable-next-line no-shadow
const PaymentCard = ({ intl, payable, name, alias, history, path, openTransfer, match }) => {
  const handleSetUser = () => {
    history.push(path);
  };

  let renderTransferButton = (
    <Action
      className="WalletSidebar__transfer"
      primary={payable >= 0}
      onClick={() => openTransfer(name, payable, 'SBD')}
      disabled={payable <= 0}
    >
      {intl.formatMessage({
        id: 'pay',
        defaultMessage: 'Pay',
      })}
      {` ${payable && payable.toFixed(2)} SBD`}
    </Action>
  );

  if (match.path === '/rewards/receivables') {
    renderTransferButton = <span>{` ${payable && payable.toFixed(2)} SBD`}</span>;
  }

  return (
    <div className="PaymentCard">
      <div className="PaymentCard__content">
        <Avatar username={name} size={40} />
        <div className="PaymentCard__content-name-wrap">
          <div className="PaymentCard__content-name-wrap-alias"> {alias}</div>
          <div className="PaymentCard__content-name-wrap-row">
            <div className="PaymentCard__content-name-wrap-row-name">{`@${name}`}</div>
          </div>
        </div>
      </div>
      <div className="PaymentCard__end-wrap">
        <div className="PaymentCard__content-name-wrap-row-pay">
          {renderTransferButton}
          <div className="PaymentCard__end-wrap-icon">
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <img
              src="/images/icons/PaymentHistory.svg"
              alt="Payments history"
              onClick={handleSetUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentCard.propTypes = {
  intl: PropTypes.shape().isRequired,
  payable: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string,
  history: PropTypes.shape().isRequired,
  path: PropTypes.string.isRequired,
  openTransfer: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
};

PaymentCard.defaultProps = {
  alias: '',
};

export default withRouter(
  injectIntl(
    connect(
      null,
      { openTransfer },
    )(PaymentCard),
  ),
);
