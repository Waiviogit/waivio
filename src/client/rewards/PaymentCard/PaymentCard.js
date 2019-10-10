import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import Avatar from '../../components/Avatar';
import './PaymentCard.less';

const PaymentCard = ({ intl, payable, name, alias, history, path }) => {
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
            <div className="PaymentCard__content-name-wrap-row-pay">
              <Link to={'/rewards/pay-now'}>
                {intl.formatMessage({
                  id: 'debts_pay_now',
                  defaultMessage: 'Pay now',
                })}
                (mock)
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="PaymentCard__end-wrap">
        <div className="PaymentCard__end-wrap-payable">
          {' '}
          {`${payable && payable.toFixed(2)} SBD`}
        </div>
        <div className="PaymentCard__end-wrap-icon">
          <Icon type="right" onClick={handleSetUser} />
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
};

PaymentCard.defaultProps = {
  alias: '',
};

export default withRouter(injectIntl(PaymentCard));
