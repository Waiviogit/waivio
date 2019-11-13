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
const PaymentCard = ({ intl, payable, name, alias, history, path, openTransfer }) => {
  const handleSetUser = () => {
    history.push(path);
  };
  return (
    <div className="PaymentCard">
      <div className="PaymentCard__content">
        <Avatar username={name} size={40} />
        <div className="PaymentCard__content-name-wrap">
          <div className="PaymentCard__content-name-wrap-alias"> {alias}</div>
          <div className="PaymentCard__content-name-wrap-row">
            <div className="PaymentCard__content-name-wrap-row-name">{`@${name}`}</div>
            <div className="PaymentCard__end-wrap-icon">
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src="https://waivio.nyc3.digitaloceanspaces.com/1573555009_0175b2a0-1737-4fdb-b983-7185174cb405"
                alt="Payments history"
                onClick={handleSetUser}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="PaymentCard__end-wrap">
        <div className="PaymentCard__end-wrap-payable"> </div>
        <div className="PaymentCard__content-name-wrap-row-pay">
          <Action
            className="WalletSidebar__transfer"
            primary
            onClick={() => openTransfer(name, payable, 'SBD')}
          >
            {intl.formatMessage({
              id: 'pay',
              defaultMessage: 'Pay',
            })}
            {` ${payable && payable.toFixed(2)} SBD`}
          </Action>
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
