import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import Avatar from '../../../components/Avatar';
import './PayableCard.less';

const PayableCard = ({ intl, payable, name, alias, history }) => {
  const handleSetUser = () => {
    history.push(`/rewards/payables/@${name}`);
  };
  return (
    <div className="UserPayableCard">
      <div className="UserPayableCard__content">
        <Avatar username={name} size={40} />
        <div className="UserPayableCard__content-name-wrap">
          <div className="UserPayableCard__content-name-wrap-alias"> {alias}</div>
          <div className="UserPayableCard__content-name-wrap-row">
            <div className="UserPayableCard__content-name-wrap-row-name">{`@${name}`}</div>
            <div className="UserPayableCard__content-name-wrap-row-pay">
              <Link to={'/rewards/pay-now'}>
                {intl.formatMessage({
                  id: 'payables_page_pay_now',
                  defaultMessage: 'Pay now',
                })}
                (mock)
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="UserPayableCard__end-wrap">
        <div className="UserPayableCard__end-wrap-payable">
          {' '}
          {`${payable && payable.toFixed(2)} SBD`}
        </div>
        <div className="UserPayableCard__end-wrap-icon">
          <Icon type="right" onClick={handleSetUser} />
        </div>
      </div>
    </div>
  );
};

PayableCard.propTypes = {
  intl: PropTypes.shape().isRequired,
  payable: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(injectIntl(PayableCard));
